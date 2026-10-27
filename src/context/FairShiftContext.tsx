import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SectorId,
  SectorConfig,
  WorkerProfile,
  ShiftRecord,
  SafetyReport,
  FeedbackAggregation,
  FatigueAlert,
  LanguageCode
} from '../types/fairshift';
import { translations } from '../utils/i18n';

interface FairShiftContextType {
  // Current view & selection
  currentRole: 'worker' | 'admin';
  setCurrentRole: (role: 'worker' | 'admin') => void;
  currentSectorId: SectorId;
  setCurrentSectorId: (sectorId: SectorId) => void;
  currentSector: SectorConfig;
  allSectors: Record<string, SectorConfig>;
  
  // Worker profile
  currentWorker: WorkerProfile;
  setCurrentWorker: (worker: WorkerProfile) => void;
  workers: WorkerProfile[];
  
  // Language
  currentLang: LanguageCode;
  setCurrentLang: (lang: LanguageCode) => void;
  t: typeof translations['en'];

  // Live Backend Data
  shifts: ShiftRecord[];
  safetyReports: SafetyReport[];
  fatigueAlerts: FatigueAlert[];
  feedbackAggregation: FeedbackAggregation | null;
  loading: boolean;
  error: string | null;

  // Actions
  refreshData: () => Promise<void>;
  clockIn: (method: 'geo' | 'qr') => Promise<{ success: boolean; message?: string }>;
  clockOut: (notes?: string) => Promise<{ success: boolean; message?: string }>;
  submitSafetyReport: (data: {
    rawText: string;
    originalLanguage: LanguageCode;
    locationDescription: string;
    photoUrl?: string;
  }) => Promise<{ success: boolean; report?: SafetyReport; error?: string }>;
  updateSafetyReportStatus: (id: string, status: SafetyReport['status'], adminNotes?: string) => Promise<void>;
  submitFeedback: (data: {
    department: string;
    ratingManager: number;
    ratingSafety: number;
    ratingFairness: number;
    ratingRestBreaks: number;
    comments: string;
  }) => Promise<{ success: boolean; error?: string }>;
  resetDemoData: () => Promise<void>;
}

const FairShiftContext = createContext<FairShiftContextType | undefined>(undefined);

export const FairShiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<'worker' | 'admin'>('worker');
  const [currentSectorId, setCurrentSectorId] = useState<SectorId>('construction');
  const [allSectors, setAllSectors] = useState<Record<string, SectorConfig>>({});
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [currentWorker, setCurrentWorkerState] = useState<WorkerProfile | null>(null);
  const [currentLang, setCurrentLangState] = useState<LanguageCode>('en');

  const [shifts, setShifts] = useState<ShiftRecord[]>([]);
  const [safetyReports, setSafetyReports] = useState<SafetyReport[]>([]);
  const [fatigueAlerts, setFatigueAlerts] = useState<FatigueAlert[]>([]);
  const [feedbackAggregation, setFeedbackAggregation] = useState<FeedbackAggregation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const t = translations[currentLang] || translations.en;

  // Fetch all sectors and workers on load
  const loadInitial = useCallback(async () => {
    try {
      setLoading(true);
      const [secRes, workRes] = await Promise.all([
        fetch('/api/sectors'),
        fetch('/api/workers')
      ]);
      const secData = await secRes.json();
      const workData = await workRes.json();

      setAllSectors(secData.sectors || {});
      setWorkers(workData.workers || []);

      // Set default worker for current sector
      const sectorWorkers = (workData.workers || []).filter((w: WorkerProfile) => w.sectorId === currentSectorId);
      if (sectorWorkers.length > 0) {
        setCurrentWorkerState(sectorWorkers[0]);
        setCurrentLangState(sectorWorkers[0].preferredLanguage || 'en');
      }
    } catch (err: any) {
      console.error('Failed to load initial metadata:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentSectorId]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // Refresh live data for current sector
  const refreshData = useCallback(async () => {
    try {
      const [shiftRes, safetyRes, fatigueRes, feedbackRes] = await Promise.all([
        fetch(`/api/shifts?sectorId=${currentSectorId}`),
        fetch(`/api/safety/reports?sectorId=${currentSectorId}`),
        fetch(`/api/fatigue/alerts`),
        fetch(`/api/feedback/summary?sectorId=${currentSectorId}`)
      ]);

      const shiftData = await shiftRes.json();
      const safetyData = await safetyRes.json();
      const fatigueData = await fatigueRes.json();
      const fbData = await feedbackRes.json();

      setShifts(shiftData.shifts || []);
      setSafetyReports(safetyData.reports || []);
      setFatigueAlerts(fatigueData.alerts || []);
      setFeedbackAggregation(fbData.aggregation || null);

      // Also refresh worker active shift status
      if (currentWorker) {
        const active = (shiftData.shifts || []).find((s: ShiftRecord) => s.workerId === currentWorker.id && s.status === 'active');
        setCurrentWorkerState(prev => prev ? { ...prev, activeShiftId: active ? active.id : null } : null);
      }
    } catch (err: any) {
      console.error('Failed to refresh data:', err);
    }
  }, [currentSectorId, currentWorker?.id]);

  useEffect(() => {
    refreshData();
    // Poll every 12 seconds for live changes
    const interval = setInterval(refreshData, 12000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // When sector changes, switch worker accordingly
  const handleSetSector = (secId: SectorId) => {
    setCurrentSectorId(secId);
    const sectorWorkers = workers.filter(w => w.sectorId === secId);
    if (sectorWorkers.length > 0) {
      setCurrentWorkerState(sectorWorkers[0]);
      setCurrentLangState(sectorWorkers[0].preferredLanguage || 'en');
    }
  };

  const handleSetWorker = (w: WorkerProfile) => {
    setCurrentWorkerState(w);
    setCurrentLangState(w.preferredLanguage || 'en');
  };

  // Clock in action
  const clockIn = async (method: 'geo' | 'qr') => {
    if (!currentWorker) return { success: false, message: 'No worker selected' };
    try {
      const res = await fetch('/api/shifts/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerId: currentWorker.id,
          sectorId: currentSectorId,
          checkInMethod: method,
          checkInCoords: { lat: 19.0760, lng: 72.8777 }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Clock-in failed');
      await refreshData();
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  // Clock out action
  const clockOut = async (notes?: string) => {
    if (!currentWorker) return { success: false, message: 'No worker selected' };
    try {
      const res = await fetch('/api/shifts/clock-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerId: currentWorker.id,
          notes: notes || 'Regular shift completed'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Clock-out failed');
      await refreshData();
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  // Safety report submission
  const submitSafetyReport = async (data: {
    rawText: string;
    originalLanguage: LanguageCode;
    locationDescription: string;
    photoUrl?: string;
  }) => {
    try {
      const res = await fetch('/api/safety/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectorId: currentSectorId,
          reportedByWorkerTag: currentWorker ? `Worker ${currentWorker.badgeNumber}` : 'Anonymous Frontline Worker',
          workerId: currentWorker?.id,
          ...data
        })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to submit report');
      await refreshData();
      return { success: true, report: resData.report };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Admin status update
  const updateSafetyReportStatus = async (id: string, status: SafetyReport['status'], adminNotes?: string) => {
    try {
      await fetch(`/api/safety/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes })
      });
      await refreshData();
    } catch (err) {
      console.error('Failed to update safety report status:', err);
    }
  };

  // Submit anonymous feedback
  const submitFeedback = async (data: {
    department: string;
    ratingManager: number;
    ratingSafety: number;
    ratingFairness: number;
    ratingRestBreaks: number;
    comments: string;
  }) => {
    try {
      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectorId: currentSectorId,
          ...data
        })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to submit feedback');
      await refreshData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Reset demo
  const resetDemoData = async () => {
    try {
      await fetch('/api/reset-demo', { method: 'POST' });
      await loadInitial();
      await refreshData();
    } catch (err) {
      console.error('Failed to reset demo data:', err);
    }
  };

  const currentSector = allSectors[currentSectorId] || (Object.values(allSectors)[0] as SectorConfig) || {
    id: 'construction',
    name: 'Construction Site',
    tagline: 'Civil Infrastructure',
    icon: 'HardHat',
    supervisorTitle: 'Site Supervisor',
    workerTerm: 'Worker',
    departmentTerm: 'Zone',
    departments: ['Zone A', 'Zone B'],
    roles: [],
    overtimeRules: { standardHoursPerDay: 8, overtimeMultiplier: 2.0, nightShiftBonusRate: 0.15, maxDailySafeHours: 12, mandatoryRestHours: 11, maxConsecutiveDays: 6 },
    hazardCategories: ['Fall Risk', 'Electrical Hazard'],
    defaultLocation: { name: 'Gate 1', lat: 19.0760, lng: 72.8777, geofenceRadiusMeters: 200 }
  };

  const safeCurrentWorker: WorkerProfile = currentWorker || {
    id: 'w-c1',
    name: 'Ramesh Kumar',
    sectorId: 'construction',
    role: 'Scaffolding Rigger',
    department: 'Zone B - Elevated Viaduct',
    preferredLanguage: 'hi',
    hourlyRate: 150,
    phone: '+91 98401 23451',
    badgeNumber: 'METRO-SC-401',
    consecutiveDaysWorked: 6,
    avatarUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=150&auto=format&fit=crop&q=80',
    activeShiftId: null
  };

  return (
    <FairShiftContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentSectorId,
        setCurrentSectorId: handleSetSector,
        currentSector,
        allSectors,
        currentWorker: safeCurrentWorker,
        setCurrentWorker: handleSetWorker,
        workers,
        currentLang,
        setCurrentLang: setCurrentLangState,
        t,
        shifts,
        safetyReports,
        fatigueAlerts,
        feedbackAggregation,
        loading,
        error,
        refreshData,
        clockIn,
        clockOut,
        submitSafetyReport,
        updateSafetyReportStatus,
        submitFeedback,
        resetDemoData
      }}
    >
      {children}
    </FairShiftContext.Provider>
  );
};

export const useFairShift = () => {
  const context = useContext(FairShiftContext);
  if (!context) {
    throw new Error('useFairShift must be used within FairShiftProvider');
  }
  return context;
};
