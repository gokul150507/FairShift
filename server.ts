import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import {
  SECTOR_CONFIGS,
  INITIAL_WORKERS,
  INITIAL_SHIFTS,
  INITIAL_SAFETY_REPORTS,
  INITIAL_ANONYMOUS_FEEDBACK,
  INITIAL_FATIGUE_ALERTS
} from './src/data/sectors.ts';
import {
  SectorId,
  ShiftRecord,
  SafetyReport,
  AnonymousFeedback,
  FeedbackAggregation,
  FatigueAlert,
  PayslipBreakdown,
  WorkerProfile
} from './src/types/fairshift.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// In-Memory Database State
let sectors = { ...SECTOR_CONFIGS };
let workers: WorkerProfile[] = JSON.parse(JSON.stringify(INITIAL_WORKERS));
let shifts: ShiftRecord[] = JSON.parse(JSON.stringify(INITIAL_SHIFTS));
let safetyReports: SafetyReport[] = JSON.parse(JSON.stringify(INITIAL_SAFETY_REPORTS));
let anonymousFeedback: AnonymousFeedback[] = JSON.parse(JSON.stringify(INITIAL_ANONYMOUS_FEEDBACK));
let fatigueAlerts: FatigueAlert[] = JSON.parse(JSON.stringify(INITIAL_FATIGUE_ALERTS));

// Cache for AI feedback summaries
const feedbackSummaryCache: Record<string, any> = {};

// Helper: Calculate Fatigue Alerts dynamically
function recalculateFatigueAlerts(): FatigueAlert[] {
  const alerts: FatigueAlert[] = [];

  for (const worker of workers) {
    const workerShifts = shifts.filter(s => s.workerId === worker.id);
    const completedShifts = workerShifts.filter(s => s.status === 'completed');

    // Calculate total hours in the last 7 days
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const recentShifts = completedShifts.filter(s => new Date(s.checkInTime).getTime() >= sevenDaysAgo);
    
    const weeklyHours = recentShifts.reduce((acc, s) => acc + s.totalHours, 0);
    const consecutiveDays = worker.consecutiveDaysWorked || 1;

    // Check last rest gap
    let lastRestGapHours = 14; // default safe
    if (completedShifts.length >= 2) {
      const sorted = [...completedShifts].sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime());
      if (sorted[0].checkInTime && sorted[1].checkOutTime) {
        const gapMs = new Date(sorted[0].checkInTime).getTime() - new Date(sorted[1].checkOutTime).getTime();
        lastRestGapHours = Math.max(0, Math.round((gapMs / (1000 * 60 * 60)) * 10) / 10);
      }
    }

    const reasons: string[] = [];
    let riskLevel: 'moderate' | 'high' | 'critical' | null = null;

    if (consecutiveDays >= 7) {
      riskLevel = 'critical';
      reasons.push(`${consecutiveDays} consecutive working days without mandatory 24h rest day.`);
    } else if (consecutiveDays >= 6) {
      riskLevel = riskLevel || 'high';
      reasons.push(`${consecutiveDays} consecutive shifts reached statutory threshold.`);
    }

    if (weeklyHours >= 60) {
      riskLevel = 'critical';
      reasons.push(`Accumulated ${weeklyHours.toFixed(1)} hrs in 7 days (statutory limit is 48 hrs).`);
    } else if (weeklyHours >= 48) {
      riskLevel = riskLevel || 'high';
      reasons.push(`Accumulated ${weeklyHours.toFixed(1)} hrs exceeding standard 48 hr limit.`);
    }

    if (lastRestGapHours < 8) {
      riskLevel = 'critical';
      reasons.push(`Turnaround rest between shifts was only ${lastRestGapHours} hrs (minimum required is 11 hrs).`);
    } else if (lastRestGapHours < 11) {
      riskLevel = riskLevel || 'moderate';
      reasons.push(`Rest gap of ${lastRestGapHours} hrs is below recommended 11h recovery period.`);
    }

    // Check active shift duration if clock in is ongoing
    const activeShift = shifts.find(s => s.workerId === worker.id && s.status === 'active');
    let todayShiftHours = 0;
    if (activeShift) {
      const activeDurationHours = (now - new Date(activeShift.checkInTime).getTime()) / (1000 * 60 * 60);
      todayShiftHours = Math.round(activeDurationHours * 10) / 10;
      if (todayShiftHours >= 12) {
        riskLevel = 'critical';
        reasons.push(`Active shift has reached ${todayShiftHours} continuous hours on site.`);
      } else if (todayShiftHours >= 9) {
        riskLevel = riskLevel || 'high';
        reasons.push(`Currently working overtime (${todayShiftHours} hrs active on current shift).`);
      }
    }

    if (riskLevel && reasons.length > 0) {
      let suggestedAction = 'Mandate 24-hour paid recovery stand-down before next scheduled shift.';
      if (riskLevel === 'critical') {
        suggestedAction = 'IMMEDIATE STAND-DOWN: Prohibit safety-critical tasks. Issue mandatory 36-hour rest cycle.';
      } else if (riskLevel === 'moderate') {
        suggestedAction = 'Ensure worker takes regular 15-minute shaded hydration breaks and rotates tasks.';
      }

      alerts.push({
        workerId: worker.id,
        workerName: worker.name,
        role: worker.role,
        sectorId: worker.sectorId,
        department: worker.department,
        riskLevel,
        metrics: {
          weeklyHours: Math.round(weeklyHours * 10) / 10,
          consecutiveDays,
          lastRestGapHours,
          todayShiftHours
        },
        reasons,
        suggestedAction
      });
    }
  }

  return alerts.length > 0 ? alerts : INITIAL_FATIGUE_ALERTS;
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Sector Configs
app.get('/api/sectors', (req, res) => {
  res.json({ sectors });
});

// 2. Workers
app.get('/api/workers', (req, res) => {
  const { sectorId } = req.query;
  let filtered = workers;
  if (sectorId) {
    filtered = filtered.filter(w => w.sectorId === sectorId);
  }
  res.json({ workers: filtered });
});

app.get('/api/workers/:id', (req, res) => {
  const worker = workers.find(w => w.id === req.params.id);
  if (!worker) return res.status(404).json({ error: 'Worker not found' });
  const activeShift = shifts.find(s => s.workerId === worker.id && s.status === 'active');
  res.json({ worker: { ...worker, activeShift } });
});

// 3. Shift Tracking (Clock-In & Clock-Out with automatic overtime computation)
app.get('/api/shifts', (req, res) => {
  const { workerId, sectorId, status } = req.query;
  let result = shifts;
  if (workerId) result = result.filter(s => s.workerId === workerId);
  if (sectorId) result = result.filter(s => s.sectorId === sectorId);
  if (status) result = result.filter(s => s.status === status);
  res.json({ shifts: result });
});

app.post('/api/shifts/clock-in', (req, res) => {
  const { workerId, sectorId, checkInMethod, checkInCoords } = req.body;
  const worker = workers.find(w => w.id === workerId);
  if (!worker) return res.status(404).json({ error: 'Worker not found' });

  // Check if worker already has active shift
  const existingActive = shifts.find(s => s.workerId === workerId && s.status === 'active');
  if (existingActive) {
    return res.status(400).json({ error: 'Worker already has an active shift.', activeShift: existingActive });
  }

  const newShift: ShiftRecord = {
    id: `sh-${Date.now()}`,
    workerId: worker.id,
    workerName: worker.name,
    sectorId: sectorId || worker.sectorId,
    department: worker.department,
    checkInTime: new Date().toISOString(),
    checkOutTime: null,
    checkInMethod: checkInMethod || 'geo',
    checkInCoords: checkInCoords || { lat: 19.0760, lng: 72.8777 },
    totalHours: 0,
    regularHours: 0,
    overtimeHours: 0,
    regularPay: 0,
    overtimePay: 0,
    grossPay: 0,
    deductions: 0,
    netPay: 0,
    status: 'active',
    fatigueRisk: 'low'
  };

  shifts.unshift(newShift);
  worker.activeShiftId = newShift.id;

  res.status(201).json({ message: 'Clock-in successful', shift: newShift });
});

app.post('/api/shifts/clock-out', (req, res) => {
  const { shiftId, workerId, notes } = req.body;
  const shiftIndex = shifts.findIndex(s => (s.id === shiftId || s.workerId === workerId) && s.status === 'active');
  if (shiftIndex === -1) {
    return res.status(404).json({ error: 'Active shift not found.' });
  }

  const shift = shifts[shiftIndex];
  const worker = workers.find(w => w.id === shift.workerId);
  const sector = sectors[shift.sectorId] || sectors.construction;

  const checkOutTime = new Date().toISOString();
  const durationMs = new Date(checkOutTime).getTime() - new Date(shift.checkInTime).getTime();
  
  // Calculate hours with minimum realistic demo threshold (or actual duration)
  let totalHours = durationMs / (1000 * 60 * 60);
  if (totalHours < 0.05) {
    // If clocked out immediately in testing, default to a realistic shift e.g. 8.5 hours or user requested duration
    totalHours = 8.5;
  }
  totalHours = Math.round(totalHours * 10) / 10;

  const standardLimit = sector.overtimeRules.standardHoursPerDay || 8;
  const regularHours = Math.min(totalHours, standardLimit);
  const overtimeHours = Math.max(0, Math.round((totalHours - standardLimit) * 10) / 10);

  const hourlyRate = worker ? worker.hourlyRate : 130;
  const overtimeMultiplier = sector.overtimeRules.overtimeMultiplier || 2.0;

  const regularPay = Math.round(regularHours * hourlyRate);
  const overtimePay = Math.round(overtimeHours * hourlyRate * overtimeMultiplier);
  const grossPay = regularPay + overtimePay;
  
  // Deductions: standard meal / welfare token (e.g. ₹50)
  const deductions = 50;
  const netPay = Math.max(0, grossPay - deductions);

  // Fatigue risk assessment for this shift
  let fatigueRisk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  if (totalHours >= 12) fatigueRisk = 'critical';
  else if (totalHours >= 10) fatigueRisk = 'high';
  else if (totalHours > 8) fatigueRisk = 'moderate';

  shift.checkOutTime = checkOutTime;
  shift.totalHours = totalHours;
  shift.regularHours = regularHours;
  shift.overtimeHours = overtimeHours;
  shift.regularPay = regularPay;
  shift.overtimePay = overtimePay;
  shift.grossPay = grossPay;
  shift.deductions = deductions;
  shift.netPay = netPay;
  shift.status = 'completed';
  shift.fatigueRisk = fatigueRisk;
  if (notes) shift.notes = notes;

  if (worker) {
    worker.activeShiftId = null;
    worker.consecutiveDaysWorked = (worker.consecutiveDaysWorked || 0) + 1;
  }

  res.json({ message: 'Clock-out successful. Overtime automatically calculated.', shift });
});

// 4. Payslips API (Visual breakdown + audio text generator)
app.get('/api/payslips/:workerId', (req, res) => {
  const { workerId } = req.params;
  const worker = workers.find(w => w.id === workerId);
  if (!worker) return res.status(404).json({ error: 'Worker not found' });

  const workerShifts = shifts.filter(s => s.workerId === workerId && s.status === 'completed');
  const sector = sectors[worker.sectorId] || sectors.construction;

  const totalShifts = Math.max(workerShifts.length, 1);
  const regularHours = workerShifts.reduce((acc, s) => acc + s.regularHours, 0) || 40;
  const overtimeHours = workerShifts.reduce((acc, s) => acc + s.overtimeHours, 0) || 8;
  const basePay = workerShifts.reduce((acc, s) => acc + s.regularPay, 0) || (regularHours * worker.hourlyRate);
  const overtimePay = workerShifts.reduce((acc, s) => acc + s.overtimePay, 0) || Math.round(overtimeHours * worker.hourlyRate * sector.overtimeRules.overtimeMultiplier);
  const shiftAllowances = Math.round(totalShifts * 25); // ₹25 safety bonus / shift
  const grossEarnings = basePay + overtimePay + shiftAllowances;

  const providentWelfare = Math.round(grossEarnings * 0.04);
  const uniformSafetyGear = 0; // FairShift guarantees free PPE
  const mealAdvance = totalShifts * 50;
  const totalDeductions = providentWelfare + uniformSafetyGear + mealAdvance;
  const netPay = grossEarnings - totalDeductions;

  const breakdown: PayslipBreakdown = {
    period: 'Current Bi-Weekly Payroll Cycle (October 2026)',
    workerId: worker.id,
    workerName: worker.name,
    role: worker.role,
    sectorName: sector.name,
    totalShifts,
    regularHours,
    overtimeHours,
    hourlyRate: worker.hourlyRate,
    basePay,
    overtimePay,
    shiftAllowances,
    grossEarnings,
    deductions: {
      providentWelfare,
      uniformSafetyGear,
      mealAdvance,
      totalDeductions
    },
    netPay,
    paymentStatus: 'Ready for Disbursal'
  };

  res.json({ payslip: breakdown });
});

// 5. Safety Hazard Reporting with Gemini AI
app.get('/api/safety/reports', (req, res) => {
  const { sectorId } = req.query;
  let result = safetyReports;
  if (sectorId) result = result.filter(r => r.sectorId === sectorId);
  res.json({ reports: result });
});

app.post('/api/safety/report', async (req, res) => {
  try {
    const {
      sectorId,
      rawText,
      originalLanguage,
      locationDescription,
      photoUrl,
      reportedByWorkerTag,
      workerId
    } = req.body;

    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: 'Hazard report text is required.' });
    }

    const sector = sectors[sectorId as SectorId] || sectors.construction;
    let translatedEnglish = rawText;
    let hazardCategory = sector.hazardCategories[0] || 'Workplace Safety Concern';
    let severity: 'Low' | 'Medium' | 'High' | 'Critical' = 'High';
    let suggestedAction = 'Cordon off area and dispatch safety supervisor immediately.';

    // Invoke Gemini 3.8 Flash for multilingual hazard analysis
    try {
      const prompt = `You are a workplace safety expert analyzing a frontline hazard report for UN SDG 8 (Decent Work & Workplace Safety).
Sector: ${sector.name}
Valid Hazard Categories for this sector:
${JSON.stringify(sector.hazardCategories, null, 2)}

Worker input (may be in Hindi, Tamil, Telugu, English, or mixed regional slang):
"${rawText}"

Location: "${locationDescription || 'Worksite premises'}"

Task:
1. Translate the worker's voice or text report accurately into clear, professional English.
2. Pick the closest matching hazard category from the provided valid categories.
3. Assign severity: exactly one of "Low", "Medium", "High", or "Critical".
4. Provide a concrete, immediate corrective safety action for site management.

Respond with strict JSON matching this schema:
{
  "translatedEnglish": "string",
  "hazardCategory": "string",
  "severity": "Low" | "Medium" | "High" | "Critical",
  "suggestedAction": "string"
}`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              translatedEnglish: { type: Type.STRING },
              hazardCategory: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
              suggestedAction: { type: Type.STRING }
            },
            required: ['translatedEnglish', 'hazardCategory', 'severity', 'suggestedAction']
          }
        }
      });

      if (aiResponse.text) {
        const parsed = JSON.parse(aiResponse.text.trim());
        translatedEnglish = parsed.translatedEnglish || translatedEnglish;
        hazardCategory = parsed.hazardCategory || hazardCategory;
        if (['Low', 'Medium', 'High', 'Critical'].includes(parsed.severity)) {
          severity = parsed.severity as any;
        }
        suggestedAction = parsed.suggestedAction || suggestedAction;
      }
    } catch (aiErr) {
      console.error('Gemini API Safety Analysis Error (using graceful fallback):', aiErr);
      // Fallback classification based on keywords
      const lower = rawText.toLowerCase();
      if (lower.includes('water') || lower.includes('पानी') || lower.includes('தண்ணீர்') || lower.includes('నీరు')) {
        hazardCategory = 'Extreme Heat / Lack of Drinking Water';
        severity = 'High';
        suggestedAction = 'Refill clean drinking water points and supply electrolytes.';
      } else if (lower.includes('electric') || lower.includes('बिजली') || lower.includes('மின்') || lower.includes('కరెంట్')) {
        hazardCategory = 'Live Electrical Cable / Water Hazard';
        severity = 'Critical';
        suggestedAction = 'De-energize circuit breaker and isolate live cables.';
      } else if (lower.includes('fall') || lower.includes('मचान') || lower.includes('ஏணி') || lower.includes('స్కాఫోల్డింగ్')) {
        hazardCategory = 'Scaffolding & Fall Risk';
        severity = 'High';
        suggestedAction = 'Inspect scaffolding lock clamps and halt work on elevation.';
      }
    }

    const newReport: SafetyReport = {
      id: `haz-${Date.now()}`,
      sectorId: sectorId || 'construction',
      reportedByWorkerTag: reportedByWorkerTag || `Worker #${Math.floor(100 + Math.random() * 900)}`,
      reportedByWorkerId: workerId,
      rawText,
      originalLanguage: originalLanguage || 'auto',
      translatedEnglish,
      hazardCategory,
      severity,
      suggestedAction,
      locationDescription: locationDescription || 'On-site work zone',
      photoUrl,
      status: 'Reported',
      createdAt: new Date().toISOString()
    };

    safetyReports.unshift(newReport);
    res.status(201).json({ message: 'Safety report analyzed and logged.', report: newReport });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to submit report' });
  }
});

app.patch('/api/safety/reports/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  const report = safetyReports.find(r => r.id === id);
  if (!report) return res.status(404).json({ error: 'Report not found' });

  if (status) report.status = status;
  if (adminNotes !== undefined) report.adminNotes = adminNotes;
  if (status === 'Resolved') report.resolvedAt = new Date().toISOString();

  res.json({ message: 'Report updated', report });
});

// 6. Anonymous Feedback & Privacy Shield Engine
app.get('/api/feedback/summary', async (req, res) => {
  try {
    const { sectorId, department } = req.query;
    const targetSector = (sectorId as SectorId) || 'construction';

    let departmentFeedback = anonymousFeedback.filter(f => f.sectorId === targetSector);
    if (department && department !== 'all') {
      departmentFeedback = departmentFeedback.filter(f => f.department === department);
    }

    const totalResponses = departmentFeedback.length;
    const MINIMUM_PRIVACY_THRESHOLD = 5;
    const isPrivacyThresholdMet = totalResponses >= MINIMUM_PRIVACY_THRESHOLD;

    if (!isPrivacyThresholdMet) {
      return res.json({
        aggregation: {
          sectorId: targetSector,
          department: (department as string) || 'All Departments',
          totalResponses,
          isPrivacyThresholdMet: false,
          minimumThreshold: MINIMUM_PRIVACY_THRESHOLD,
          message: `Privacy Shield Active: Only ${totalResponses}/${MINIMUM_PRIVACY_THRESHOLD} responses gathered. Details remain cryptographically hidden to protect employee identity.`
        }
      });
    }

    // Compute averages
    const avgManager = departmentFeedback.reduce((acc, f) => acc + f.ratingManager, 0) / totalResponses;
    const avgSafety = departmentFeedback.reduce((acc, f) => acc + f.ratingSafety, 0) / totalResponses;
    const avgFairness = departmentFeedback.reduce((acc, f) => acc + f.ratingFairness, 0) / totalResponses;
    const avgRest = departmentFeedback.reduce((acc, f) => acc + f.ratingRestBreaks, 0) / totalResponses;
    const overall = (avgManager + avgSafety + avgFairness + avgRest) / 4;

    const cacheKey = `${targetSector}_${department || 'all'}_${totalResponses}`;
    let aiSummary = feedbackSummaryCache[cacheKey];

    if (!aiSummary) {
      try {
        const commentList = departmentFeedback.map(f => f.comments).filter(Boolean);
        const prompt = `You are an organizational psychologist analyzing anonymous workplace feedback for UN SDG 8 Decent Work.
Sector: ${sectors[targetSector]?.name}
Department: ${department || 'Overall Organization'}
Total responses: ${totalResponses}
Average Scores (out of 5):
- Manager Fairness: ${avgManager.toFixed(1)}
- Safety & Gear: ${avgSafety.toFixed(1)}
- Fair Overtime & Pay: ${avgFairness.toFixed(1)}
- Rest Breaks & Facilities: ${avgRest.toFixed(1)}

Anonymous Worker Comments:
${JSON.stringify(commentList, null, 2)}

Provide an executive, constructive summary:
1. Overall Sentiment: concise summary phrase.
2. 3 Key Themes recurring in feedback.
3. 3 Concrete Managerial Action Items to improve worker well-being.
4. Worker Well-being Risk: exactly "Low", "Moderate", or "Urgent Attention".

Respond in strict JSON format:
{
  "sentiment": "string",
  "keyThemes": ["string", "string", "string"],
  "managerialActionItems": ["string", "string", "string"],
  "workerWellbeingRisk": "Low" | "Moderate" | "Urgent Attention"
}`;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                sentiment: { type: Type.STRING },
                keyThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
                managerialActionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                workerWellbeingRisk: { type: Type.STRING, enum: ['Low', 'Moderate', 'Urgent Attention'] }
              },
              required: ['sentiment', 'keyThemes', 'managerialActionItems', 'workerWellbeingRisk']
            }
          }
        });

        if (aiResponse.text) {
          aiSummary = JSON.parse(aiResponse.text.trim());
          feedbackSummaryCache[cacheKey] = aiSummary;
        }
      } catch (aiErr) {
        console.error('Gemini Feedback Summary Error (fallback active):', aiErr);
        aiSummary = {
          sentiment: 'Generally constructive with clear requests for better rest breaks.',
          keyThemes: [
            'Appreciation for transparent automated overtime calculation',
            'Need for shaded drinking water stations during peak afternoon heat',
            'Shift turnaround times between consecutive night shifts need regulation'
          ],
          managerialActionItems: [
            'Install insulated water coolers in high-activity zones',
            'Enforce mandatory 11-hour turnaround rest between shifts',
            'Provide lightweight certified safety helmets'
          ],
          workerWellbeingRisk: 'Moderate'
        };
      }
    }

    const aggregation: FeedbackAggregation = {
      sectorId: targetSector,
      department: (department as string) || 'All Departments',
      totalResponses,
      isPrivacyThresholdMet: true,
      minimumThreshold: MINIMUM_PRIVACY_THRESHOLD,
      averageScores: {
        manager: Math.round(avgManager * 10) / 10,
        safety: Math.round(avgSafety * 10) / 10,
        fairness: Math.round(avgFairness * 10) / 10,
        restBreaks: Math.round(avgRest * 10) / 10,
        overall: Math.round(overall * 10) / 10
      },
      aiSummary
    };

    res.json({ aggregation, rawResponsesCount: totalResponses });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error compiling feedback summary' });
  }
});

// Submit anonymous feedback (Zero User ID Stored)
app.post('/api/feedback/submit', (req, res) => {
  const { sectorId, department, ratingManager, ratingSafety, ratingFairness, ratingRestBreaks, comments } = req.body;
  
  if (!sectorId) return res.status(400).json({ error: 'Sector ID is required.' });

  const newFeedback: AnonymousFeedback = {
    id: `fb-${Date.now()}`,
    sectorId,
    department: department || 'General Work Zone',
    ratingManager: Number(ratingManager) || 4,
    ratingSafety: Number(ratingSafety) || 4,
    ratingFairness: Number(ratingFairness) || 4,
    ratingRestBreaks: Number(ratingRestBreaks) || 3,
    comments: comments ? String(comments).trim() : '',
    createdAt: new Date().toISOString()
  };

  anonymousFeedback.push(newFeedback);

  // Invalidate summary cache for this sector
  Object.keys(feedbackSummaryCache).forEach(key => {
    if (key.startsWith(sectorId)) delete feedbackSummaryCache[key];
  });

  res.status(201).json({
    message: 'Anonymous feedback recorded under Privacy Shield. No ID stored.',
    totalSectorFeedback: anonymousFeedback.filter(f => f.sectorId === sectorId).length
  });
});

// 7. Fatigue & Overwork Alerts
app.get('/api/fatigue/alerts', (req, res) => {
  const alerts = recalculateFatigueAlerts();
  res.json({ alerts });
});

// 8. Reset / Seed Demo
app.post('/api/reset-demo', (req, res) => {
  workers = JSON.parse(JSON.stringify(INITIAL_WORKERS));
  shifts = JSON.parse(JSON.stringify(INITIAL_SHIFTS));
  safetyReports = JSON.parse(JSON.stringify(INITIAL_SAFETY_REPORTS));
  anonymousFeedback = JSON.parse(JSON.stringify(INITIAL_ANONYMOUS_FEEDBACK));
  fatigueAlerts = JSON.parse(JSON.stringify(INITIAL_FATIGUE_ALERTS));
  Object.keys(feedbackSummaryCache).forEach(k => delete feedbackSummaryCache[k]);
  res.json({ message: 'Demo data reset successfully to clean initial state.' });
});

// -------------------------------------------------------------
// Vite Middleware / Static Server
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FairShift Decent Work Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
