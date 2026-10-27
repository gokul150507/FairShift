import { SectorConfig, WorkerProfile, ShiftRecord, SafetyReport, AnonymousFeedback, FatigueAlert } from '../types/fairshift';

export const SECTOR_CONFIGS: Record<string, SectorConfig> = {
  construction: {
    id: 'construction',
    name: 'Metro Line 6 Expansion Site (Package 4B)',
    tagline: 'Heavy Civil Infrastructure & Metro Rail Project',
    icon: 'HardHat',
    supervisorTitle: 'Site Supervisor & Safety Engineer',
    workerTerm: 'Site Worker / Artisan',
    departmentTerm: 'Work Zone',
    departments: ['Zone A - Pillar Piering', 'Zone B - Elevated Viaduct', 'Zone C - Underground Station Box', 'Zone D - Casting Yard'],
    roles: [
      { title: 'Scaffolding Rigger', defaultHourlyRate: 150, riskTier: 'High' },
      { title: 'Rebar Steel Smith', defaultHourlyRate: 140, riskTier: 'High' },
      { title: 'Excavation & Shoring Tech', defaultHourlyRate: 160, riskTier: 'High' },
      { title: 'Mason & Concrete Finisher', defaultHourlyRate: 130, riskTier: 'Medium' },
      { title: 'Site Helper & Material Handler', defaultHourlyRate: 110, riskTier: 'Medium' }
    ],
    overtimeRules: {
      standardHoursPerDay: 8,
      overtimeMultiplier: 2.0, // 2x statutory overtime rate
      nightShiftBonusRate: 0.15,
      maxDailySafeHours: 12,
      mandatoryRestHours: 11,
      maxConsecutiveDays: 6
    },
    hazardCategories: [
      'Scaffolding & Fall Risk',
      'Uncovered Trench / Shoring Defect',
      'Live Electrical Cable / Water Hazard',
      'Heavy Equipment & Crane Blindspot',
      'Defective Safety Harness / Missing Helmet',
      'Extreme Heat / Lack of Drinking Water'
    ],
    defaultLocation: {
      name: 'Pier 142 Safety Gate, Metro Rail Corridor',
      lat: 19.0760,
      lng: 72.8777,
      geofenceRadiusMeters: 250
    }
  },

  campus: {
    id: 'campus',
    name: 'Metropolitan University & Allied College Campus',
    tagline: 'Higher Education & Institutional Facilities Management',
    icon: 'School',
    supervisorTitle: 'Department Head & Facilities Officer',
    workerTerm: 'Support Staff / Assistant',
    departmentTerm: 'Campus Division',
    departments: ['Division 1 - Science & Research Labs', 'Division 2 - Central Library & Auditorium', 'Division 3 - Student Hostels & Dining Hall', 'Division 4 - Grounds & Sports Complex'],
    roles: [
      { title: 'Sanitation & Housekeeping Attendant', defaultHourlyRate: 105, riskTier: 'Medium' },
      { title: 'Chemical Lab Technical Assistant', defaultHourlyRate: 145, riskTier: 'High' },
      { title: 'Campus Security & Gate Patrol', defaultHourlyRate: 115, riskTier: 'Low' },
      { title: 'Facilities Electrician & HVAC', defaultHourlyRate: 135, riskTier: 'High' },
      { title: 'Dining Hall Cook & Kitchen Helper', defaultHourlyRate: 110, riskTier: 'Medium' }
    ],
    overtimeRules: {
      standardHoursPerDay: 8,
      overtimeMultiplier: 1.5, // 1.5x overtime rate
      nightShiftBonusRate: 0.10,
      maxDailySafeHours: 11,
      mandatoryRestHours: 10,
      maxConsecutiveDays: 6
    },
    hazardCategories: [
      'Chemical / Acid Spill in Lab',
      'Wet Slippery Floor Without Caution Cone',
      'Overloaded Switchboard / Generator Fault',
      'Blocked Emergency Fire Exit',
      'Sanitation / Unsealed Biohazard Bin',
      'Broken Overhead Glass / Railing Defect'
    ],
    defaultLocation: {
      name: 'North Gate Administration Complex',
      lat: 13.0827,
      lng: 80.2707,
      geofenceRadiusMeters: 350
    }
  }
};

export const INITIAL_WORKERS: WorkerProfile[] = [
  // Construction Workers
  {
    id: 'w-c1',
    name: 'Ramesh Kumar (రమేష్ కుమార్)',
    sectorId: 'construction',
    role: 'Scaffolding Rigger',
    department: 'Zone B - Elevated Viaduct',
    preferredLanguage: 'hi',
    hourlyRate: 150,
    phone: '+91 98401 23451',
    badgeNumber: 'METRO-SC-401',
    consecutiveDaysWorked: 6, // nearing fatigue alert!
    avatarUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=150&auto=format&fit=crop&q=80',
    activeShiftId: null
  },
  {
    id: 'w-c2',
    name: 'Muthu Vel (முத்துவேல்)',
    sectorId: 'construction',
    role: 'Rebar Steel Smith',
    department: 'Zone A - Pillar Piering',
    preferredLanguage: 'ta',
    hourlyRate: 140,
    phone: '+91 97890 56782',
    badgeNumber: 'METRO-RB-209',
    consecutiveDaysWorked: 4,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    activeShiftId: null
  },
  {
    id: 'w-c3',
    name: 'Suresh Naik (సురేష్ నాయక్)',
    sectorId: 'construction',
    role: 'Excavation & Shoring Tech',
    department: 'Zone C - Underground Station Box',
    preferredLanguage: 'te',
    hourlyRate: 160,
    phone: '+91 94441 87654',
    badgeNumber: 'METRO-EX-112',
    consecutiveDaysWorked: 7, // CRITICAL fatigue alert!
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    activeShiftId: null
  },
  {
    id: 'w-c4',
    name: 'Priya Lakshmi (பிரியா லட்சுமி)',
    sectorId: 'construction',
    role: 'Mason & Concrete Finisher',
    department: 'Zone D - Casting Yard',
    preferredLanguage: 'ta',
    hourlyRate: 130,
    phone: '+91 98840 43210',
    badgeNumber: 'METRO-MS-088',
    consecutiveDaysWorked: 3,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    activeShiftId: null
  },

  // Campus Workers
  {
    id: 'w-u1',
    name: 'Anita Sharma (अनीता शर्मा)',
    sectorId: 'campus',
    role: 'Sanitation & Housekeeping Attendant',
    department: 'Division 1 - Science & Research Labs',
    preferredLanguage: 'hi',
    hourlyRate: 105,
    phone: '+91 98210 11223',
    badgeNumber: 'UNIV-SN-304',
    consecutiveDaysWorked: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    activeShiftId: null
  },
  {
    id: 'w-u2',
    name: 'Karthik Subramanian (கார்த்திக்)',
    sectorId: 'campus',
    role: 'Chemical Lab Technical Assistant',
    department: 'Division 1 - Science & Research Labs',
    preferredLanguage: 'ta',
    hourlyRate: 145,
    phone: '+91 97100 44556',
    badgeNumber: 'UNIV-LT-102',
    consecutiveDaysWorked: 6, // Fatigue warning!
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    activeShiftId: null
  },
  {
    id: 'w-u3',
    name: 'Venkat Rao (వెంకట్ రావు)',
    sectorId: 'campus',
    role: 'Campus Security & Gate Patrol',
    department: 'Division 2 - Central Library & Auditorium',
    preferredLanguage: 'te',
    hourlyRate: 115,
    phone: '+91 99400 77889',
    badgeNumber: 'UNIV-SEC-501',
    consecutiveDaysWorked: 7, // CRITICAL: 7 days straight!
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    activeShiftId: null
  }
];

export const INITIAL_SHIFTS: ShiftRecord[] = [
  // Completed recent shifts with overtime
  {
    id: 'sh-101',
    workerId: 'w-c1',
    workerName: 'Ramesh Kumar',
    sectorId: 'construction',
    department: 'Zone B - Elevated Viaduct',
    checkInTime: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    checkOutTime: new Date(Date.now() - 1000 * 60 * 60 * 17).toISOString(), // 11 hours! (3h overtime)
    checkInMethod: 'qr',
    totalHours: 11.0,
    regularHours: 8.0,
    overtimeHours: 3.0,
    regularPay: 1200, // 8 * 150
    overtimePay: 900,  // 3 * (150 * 2.0)
    grossPay: 2100,
    deductions: 60, // canteen token
    netPay: 2040,
    status: 'completed',
    fatigueRisk: 'high',
    notes: 'Extended shift for viaduct girder placement'
  },
  {
    id: 'sh-102',
    workerId: 'w-c1',
    workerName: 'Ramesh Kumar',
    sectorId: 'construction',
    department: 'Zone B - Elevated Viaduct',
    checkInTime: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    checkOutTime: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(), // 10 hours
    checkInMethod: 'geo',
    totalHours: 10.0,
    regularHours: 8.0,
    overtimeHours: 2.0,
    regularPay: 1200,
    overtimePay: 600,
    grossPay: 1800,
    deductions: 60,
    netPay: 1740,
    status: 'completed',
    fatigueRisk: 'moderate'
  },
  {
    id: 'sh-103',
    workerId: 'w-c2',
    workerName: 'Muthu Vel',
    sectorId: 'construction',
    department: 'Zone A - Pillar Piering',
    checkInTime: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    checkOutTime: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(), // 9 hours
    checkInMethod: 'qr',
    totalHours: 9.0,
    regularHours: 8.0,
    overtimeHours: 1.0,
    regularPay: 1120, // 8 * 140
    overtimePay: 280,  // 1 * (140 * 2)
    grossPay: 1400,
    deductions: 50,
    netPay: 1350,
    status: 'completed',
    fatigueRisk: 'low'
  },
  {
    id: 'sh-104',
    workerId: 'w-c3',
    workerName: 'Suresh Naik',
    sectorId: 'construction',
    department: 'Zone C - Underground Station Box',
    checkInTime: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    checkOutTime: new Date(Date.now() - 1000 * 60 * 60 * 13).toISOString(), // 13 hours! CRITICAL fatigue
    checkInMethod: 'geo',
    totalHours: 13.0,
    regularHours: 8.0,
    overtimeHours: 5.0,
    regularPay: 1280,
    overtimePay: 1600, // 5 * (160 * 2)
    grossPay: 2880,
    deductions: 70,
    netPay: 2810,
    status: 'completed',
    fatigueRisk: 'critical',
    notes: 'Station diaphragm wall urgent concrete pour'
  },
  {
    id: 'sh-201',
    workerId: 'w-u1',
    workerName: 'Anita Sharma',
    sectorId: 'campus',
    department: 'Division 1 - Science & Research Labs',
    checkInTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    checkOutTime: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(), // 9 hours
    checkInMethod: 'qr',
    totalHours: 9.0,
    regularHours: 8.0,
    overtimeHours: 1.0,
    regularPay: 840, // 8 * 105
    overtimePay: 157.5, // 1 * (105 * 1.5)
    grossPay: 997.5,
    deductions: 30,
    netPay: 967.5,
    status: 'completed',
    fatigueRisk: 'low'
  },
  {
    id: 'sh-202',
    workerId: 'w-u2',
    workerName: 'Karthik Subramanian',
    sectorId: 'campus',
    department: 'Division 1 - Science & Research Labs',
    checkInTime: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
    checkOutTime: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(), // 11 hours
    checkInMethod: 'geo',
    totalHours: 11.0,
    regularHours: 8.0,
    overtimeHours: 3.0,
    regularPay: 1160,
    overtimePay: 652.5, // 3 * (145 * 1.5)
    grossPay: 1812.5,
    deductions: 40,
    netPay: 1772.5,
    status: 'completed',
    fatigueRisk: 'high',
    notes: 'Annual NAAC accreditation chemistry store inventory'
  }
];

export const INITIAL_SAFETY_REPORTS: SafetyReport[] = [
  {
    id: 'haz-101',
    sectorId: 'construction',
    reportedByWorkerTag: 'Frontline Worker #104',
    rawText: 'पिलर 14 के पास मचान की लकड़ी ढीली है और लोहे की क्लैंप टूटी हुई है। नीचे लोग काम कर रहे हैं।',
    originalLanguage: 'hi',
    translatedEnglish: 'Near Pillar 14, scaffolding wooden plank is loose and the steel clamp is broken. Workers are active directly below.',
    hazardCategory: 'Scaffolding & Fall Risk',
    severity: 'High',
    suggestedAction: 'Cordon off 10m drop radius with red warning tape immediately and dispatch scaffolding rigger crew to replace clamp.',
    locationDescription: 'Pier 14 viaduct base, near main mixer',
    photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    status: 'In Progress',
    adminNotes: 'Safety Officer Kumar notified. Riggers dispatched at 14:15.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    id: 'haz-102',
    sectorId: 'construction',
    reportedByWorkerTag: 'Anonymous Rebar Tech #88',
    rawText: 'மழை நீரில் ஜெனரேட்டர் கேபிள் மூழ்கியுள்ளது. மின் கசிவு அபாயம் உள்ளது.',
    originalLanguage: 'ta',
    translatedEnglish: 'Generator 440V distribution power cable is submerged in accumulated rainwater puddle. Severe electric shock risk.',
    hazardCategory: 'Live Electrical Cable / Water Hazard',
    severity: 'Critical',
    suggestedAction: 'Trip master circuit breaker immediately, elevate cables on wooden cable horses, and pump out stagnant water.',
    locationDescription: 'Zone C generator shed perimeter',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    status: 'Acknowledged',
    adminNotes: 'Station electrician briefed; master switch de-energized.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString()
  },
  {
    id: 'haz-103',
    sectorId: 'construction',
    reportedByWorkerTag: 'Excavation Helper #31',
    rawText: 'తాగునీటి ట్యాంక్ ఖాళీ అయింది. ఎండలో పనిచేస్తున్న కూలీలు డీహైడ్రేషన్ వల్ల కళ్ళు తిరిగి పడిపోయే ప్రమాదం ఉంది.',
    originalLanguage: 'te',
    translatedEnglish: 'Drinking water tank is empty in high 38°C heat. Heavy labourers are exhibiting acute signs of dehydration and fainting.',
    hazardCategory: 'Extreme Heat / Lack of Drinking Water',
    severity: 'High',
    suggestedAction: 'Summon water tanker vehicle immediately, issue electrolyte ORS sachets, and mandate 20-minute rest rotations.',
    locationDescription: 'Zone A batching plant resting shed',
    status: 'Resolved',
    adminNotes: 'Water tanker refilled at 11:30 AM. ORS packets provided.',
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 'haz-201',
    sectorId: 'campus',
    reportedByWorkerTag: 'Lab Staff #12',
    rawText: 'केमिस्ट्री लैब 3 के बेसिन के पास हाइड्रोक्लोरिक एसिड की बोतल से रिसाव हो रहा है और तेज गंध आ रही है।',
    originalLanguage: 'hi',
    translatedEnglish: 'Hydrochloric acid bottle in Chemistry Lab 3 wash area is leaking with pungent acidic fumes spreading to corridor.',
    hazardCategory: 'Chemical / Acid Spill in Lab',
    severity: 'Critical',
    suggestedAction: 'Evacuate laboratory wing immediately, activate exhaust fuming cupboards, and apply neutralizer sodium bicarbonate powder.',
    locationDescription: 'Science Block, 2nd Floor Room 204',
    photoUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    status: 'In Progress',
    adminNotes: 'Hazmat cleanup kit utilized. Neutralization in progress.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  },
  {
    id: 'haz-202',
    sectorId: 'campus',
    reportedByWorkerTag: 'Sanitation Attendant #4',
    rawText: 'நூலகத்தின் இரண்டாவது மாடி படிக்கட்டில் உள்ள தீயணைப்புக் கருவி காலாவதியாகிவிட்டது, படிக்கட்டு ஈரமாக உள்ளது.',
    originalLanguage: 'ta',
    translatedEnglish: 'Central library second floor staircase fire extinguisher is past expiry date and rainwater leak has made floor slick.',
    hazardCategory: 'Wet Slippery Floor Without Caution Cone',
    severity: 'Medium',
    suggestedAction: 'Place dual yellow wet-floor caution cones and order immediate refill inspection for fire extinguisher.',
    locationDescription: 'Central Library East Wing Stairs',
    status: 'Reported',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
  }
];

export const INITIAL_ANONYMOUS_FEEDBACK: AnonymousFeedback[] = [
  // Construction Feedback (Already 6 responses -> surpasses 5-worker privacy shield!)
  {
    id: 'fb-101',
    sectorId: 'construction',
    department: 'Zone B - Elevated Viaduct',
    ratingManager: 4,
    ratingSafety: 4,
    ratingFairness: 4,
    ratingRestBreaks: 3,
    comments: 'Supervisor Sharma treats workers with respect, but concrete pouring shifts often run past 9 PM without adequate snacks.',
    sentiment: 'neutral',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
  },
  {
    id: 'fb-102',
    sectorId: 'construction',
    department: 'Zone B - Elevated Viaduct',
    ratingManager: 5,
    ratingSafety: 5,
    ratingFairness: 5,
    ratingRestBreaks: 4,
    comments: 'FairShift automated overtime tracking changed everything. Previously contractor shaved 2 hours off our night registers.',
    sentiment: 'positive',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  },
  {
    id: 'fb-103',
    sectorId: 'construction',
    department: 'Zone B - Elevated Viaduct',
    ratingManager: 4,
    ratingSafety: 3,
    ratingFairness: 4,
    ratingRestBreaks: 2,
    comments: 'Drinking water drums get too hot in afternoon sun. Need thatched shade over water stations.',
    sentiment: 'neutral',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
  },
  {
    id: 'fb-104',
    sectorId: 'construction',
    department: 'Zone B - Elevated Viaduct',
    ratingManager: 4,
    ratingSafety: 4,
    ratingFairness: 5,
    ratingRestBreaks: 3,
    comments: 'Safety helmets provided this month are much lighter and fit better. App voice reporting helps non-literate friends.',
    sentiment: 'positive',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'fb-105',
    sectorId: 'construction',
    department: 'Zone B - Elevated Viaduct',
    ratingManager: 3,
    ratingSafety: 3,
    ratingFairness: 3,
    ratingRestBreaks: 2,
    comments: 'Tired of back-to-back 12 hour night shifts. We need 12 hours minimum rest between night and day shift.',
    sentiment: 'negative',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    id: 'fb-106',
    sectorId: 'construction',
    department: 'Zone B - Elevated Viaduct',
    ratingManager: 4,
    ratingSafety: 5,
    ratingFairness: 4,
    ratingRestBreaks: 4,
    comments: 'Good overall environment. The digital payslip audio readout gave my family full peace of mind about my wages.',
    sentiment: 'positive',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  },

  // Campus Division 2 Feedback (3 responses -> BELOW privacy threshold of 5! Shows how privacy shield protects worker identities)
  {
    id: 'fb-201',
    sectorId: 'campus',
    department: 'Division 2 - Central Library & Auditorium',
    ratingManager: 4,
    ratingSafety: 4,
    ratingFairness: 4,
    ratingRestBreaks: 4,
    comments: 'Library atmosphere is calm and supervisor gives proper tea breaks.',
    sentiment: 'positive',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString()
  },
  {
    id: 'fb-202',
    sectorId: 'campus',
    department: 'Division 2 - Central Library & Auditorium',
    ratingManager: 3,
    ratingSafety: 3,
    ratingFairness: 3,
    ratingRestBreaks: 3,
    comments: 'Need proper dust masks when organizing the old archives repository.',
    sentiment: 'neutral',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString()
  },
  {
    id: 'fb-203',
    sectorId: 'campus',
    department: 'Division 2 - Central Library & Auditorium',
    ratingManager: 4,
    ratingSafety: 4,
    ratingFairness: 3,
    ratingRestBreaks: 4,
    comments: 'Prompt overtime payments this semester.',
    sentiment: 'positive',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
  }
];

export const INITIAL_FATIGUE_ALERTS: FatigueAlert[] = [
  {
    workerId: 'w-c3',
    workerName: 'Suresh Naik',
    role: 'Excavation & Shoring Tech',
    sectorId: 'construction',
    department: 'Zone C - Underground Station Box',
    riskLevel: 'critical',
    metrics: {
      weeklyHours: 64.5,
      consecutiveDays: 7,
      lastRestGapHours: 6.5,
      todayShiftHours: 13.0
    },
    reasons: [
      'Exceeded weekly statutory limit of 48 hours (worked 64.5h)',
      'Worked 7 consecutive shifts without mandatory 24h rest day',
      'Rest gap between shifts dropped to 6.5 hours (mandatory 11 hours violated)',
      'High-risk excavation environment requires acute reflexes'
    ],
    suggestedAction: 'Immediate 36-hour mandatory paid recovery stand-down. Reassign excavation operations to rotation pool.'
  },
  {
    workerId: 'w-c1',
    workerName: 'Ramesh Kumar',
    role: 'Scaffolding Rigger',
    sectorId: 'construction',
    department: 'Zone B - Elevated Viaduct',
    riskLevel: 'high',
    metrics: {
      weeklyHours: 54.0,
      consecutiveDays: 6,
      lastRestGapHours: 9.0,
      todayShiftHours: 11.0
    },
    reasons: [
      'Worked 11-hour shift on elevated height viaduct with 3h overtime',
      'Approaching 6 consecutive working days',
      'Night shift rest turnaround was under 11 hours'
    ],
    suggestedAction: 'Schedule mandatory rest day tomorrow. Do not assign high-elevation rigging for the next shift.'
  },
  {
    workerId: 'w-u3',
    workerName: 'Venkat Rao',
    role: 'Campus Security & Gate Patrol',
    sectorId: 'campus',
    department: 'Division 2 - Central Library & Auditorium',
    riskLevel: 'critical',
    metrics: {
      weeklyHours: 61.0,
      consecutiveDays: 7,
      lastRestGapHours: 7.0,
      todayShiftHours: 10.0
    },
    reasons: [
      'Worked 7 consecutive night shifts due to campus events',
      'Less than 8 hours rest between patrol rotations',
      'High circadian sleep disruption'
    ],
    suggestedAction: 'Rotate to day shift duty after 24-hour full rest recovery cycle.'
  }
];
