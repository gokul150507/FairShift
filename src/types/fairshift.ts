export type SectorId = 'construction' | 'campus';

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te';

export interface SectorConfig {
  id: SectorId;
  name: string;
  tagline: string;
  icon: string;
  supervisorTitle: string;
  workerTerm: string;
  departmentTerm: string;
  departments: string[];
  roles: { title: string; defaultHourlyRate: number; riskTier: 'Low' | 'Medium' | 'High' }[];
  overtimeRules: {
    standardHoursPerDay: number;
    overtimeMultiplier: number;
    nightShiftBonusRate: number; // multiplier or flat %
    maxDailySafeHours: number;
    mandatoryRestHours: number;
    maxConsecutiveDays: number;
  };
  hazardCategories: string[];
  defaultLocation: {
    name: string;
    lat: number;
    lng: number;
    geofenceRadiusMeters: number;
  };
}

export interface WorkerProfile {
  id: string;
  name: string;
  sectorId: SectorId;
  role: string;
  department: string;
  preferredLanguage: LanguageCode;
  hourlyRate: number;
  phone: string;
  badgeNumber: string;
  consecutiveDaysWorked: number;
  avatarUrl: string;
  activeShiftId?: string | null;
}

export interface ShiftRecord {
  id: string;
  workerId: string;
  workerName: string;
  sectorId: SectorId;
  department: string;
  checkInTime: string; // ISO string
  checkOutTime: string | null; // ISO string
  checkInMethod: 'qr' | 'geo';
  checkInCoords?: { lat: number; lng: number };
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  regularPay: number;
  overtimePay: number;
  grossPay: number;
  deductions: number; // e.g., food/welfare
  netPay: number;
  status: 'active' | 'completed';
  fatigueRisk: 'low' | 'moderate' | 'high' | 'critical';
  notes?: string;
}

export interface PayslipBreakdown {
  period: string;
  workerId: string;
  workerName: string;
  role: string;
  sectorName: string;
  totalShifts: number;
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  basePay: number;
  overtimePay: number;
  shiftAllowances: number;
  grossEarnings: number;
  deductions: {
    providentWelfare: number;
    uniformSafetyGear: number;
    mealAdvance: number;
    totalDeductions: number;
  };
  netPay: number;
  paymentStatus: 'Ready for Disbursal' | 'Verified On-Chain / Ledger';
}

export interface SafetyReport {
  id: string;
  sectorId: SectorId;
  reportedByWorkerTag: string; // Anonymous tag e.g. "Frontline Mason #4"
  reportedByWorkerId?: string;
  rawText: string;
  originalLanguage: LanguageCode | 'auto';
  translatedEnglish: string;
  hazardCategory: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  suggestedAction: string;
  locationDescription: string;
  photoUrl?: string;
  status: 'Reported' | 'Acknowledged' | 'In Progress' | 'Resolved';
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AnonymousFeedback {
  id: string;
  sectorId: SectorId;
  department: string;
  ratingManager: number; // 1-5
  ratingSafety: number; // 1-5
  ratingFairness: number; // 1-5
  ratingRestBreaks: number; // 1-5
  comments: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  createdAt: string;
}

export interface FeedbackAggregation {
  sectorId: SectorId;
  department: string;
  totalResponses: number;
  isPrivacyThresholdMet: boolean; // >= 5 responses required
  minimumThreshold: number;
  averageScores?: {
    manager: number;
    safety: number;
    fairness: number;
    restBreaks: number;
    overall: number;
  };
  aiSummary?: {
    sentiment: string;
    keyThemes: string[];
    managerialActionItems: string[];
    workerWellbeingRisk: 'Low' | 'Moderate' | 'Urgent Attention';
  };
}

export interface FatigueAlert {
  workerId: string;
  workerName: string;
  role: string;
  sectorId: SectorId;
  department: string;
  riskLevel: 'moderate' | 'high' | 'critical';
  metrics: {
    weeklyHours: number;
    consecutiveDays: number;
    lastRestGapHours: number;
    todayShiftHours: number;
  };
  reasons: string[];
  suggestedAction: string;
}
