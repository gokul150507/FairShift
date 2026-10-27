import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  Clock,
  Receipt,
  AlertTriangle,
  Lock,
  Droplets,
  Heart,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ShiftTracker } from './ShiftTracker';
import { PayslipModal } from './PayslipModal';
import { SafetyModal } from './SafetyModal';
import { FeedbackModal } from './FeedbackModal';

export const WorkerApp: React.FC = () => {
  const { currentWorker, currentSector, currentLang, fatigueAlerts, t } = useFairShift();

  const [activeModal, setActiveModal] = useState<'payslip' | 'safety' | 'feedback' | null>(null);

  // Check if current worker has active fatigue alert
  const workerFatigueAlert = fatigueAlerts.find(a => a.workerId === currentWorker.id);

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      
      {/* Worker Profile Header Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
        
        <div className="flex items-center gap-3.5 relative z-10">
          <img
            src={currentWorker.avatarUrl}
            alt={currentWorker.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-md shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black truncate">{currentWorker.name}</h1>
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium truncate">
              {currentWorker.role} • {currentSector.name.split('(')[0]}
            </p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              ID: {currentWorker.badgeNumber} • Rate: ₹{currentWorker.hourlyRate}/hr
            </p>
          </div>
        </div>

        {/* Consecutive Days Status */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            Consecutive Days:
          </span>
          <span className={`font-bold ${currentWorker.consecutiveDaysWorked >= 6 ? 'text-amber-400' : 'text-slate-200'}`}>
            {currentWorker.consecutiveDaysWorked} of 6 Days max
          </span>
        </div>
      </div>

      {/* Fatigue / Heat Stress Warning Banner if flagged */}
      {workerFatigueAlert && (
        <div className="p-4 bg-amber-500/10 border-2 border-amber-400/80 rounded-3xl text-amber-950 space-y-2 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-900">
              {t.restAdvisory} ({workerFatigueAlert.riskLevel.toUpperCase()})
            </h3>
          </div>
          <p className="text-xs text-amber-900/90 font-medium leading-relaxed">
            {workerFatigueAlert.reasons[0] || t.restAdvisoryMessage}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="px-2.5 py-1 bg-amber-200/60 text-amber-950 rounded-xl text-[11px] font-bold flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-amber-700" />
              {t.hydrationReminder}
            </span>
            <span className="px-2.5 py-1 bg-amber-200/60 text-amber-950 rounded-xl text-[11px] font-bold">
              15 Min Shaded Break
            </span>
          </div>
        </div>
      )}

      {/* Primary Feature 1: Shift Tracking (Clock-in / Clock-out) */}
      <ShiftTracker />

      {/* Quick Action Grid (Big icon buttons designed for low-literacy clarity) */}
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Worker Empowerment Tools
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Action 1: View Payslip (with Voice synthesis) */}
          <button
            type="button"
            onClick={() => setActiveModal('payslip')}
            className="p-4 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-3xl text-left transition-all shadow-xs group flex sm:flex-col items-center sm:items-start justify-between gap-3 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {t.myPayslip}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Visual breakdown & Speech reader
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 sm:hidden shrink-0" />
          </button>

          {/* Action 2: Report Hazard (Voice & Photo with Gemini) */}
          <button
            type="button"
            onClick={() => setActiveModal('safety')}
            className="p-4 bg-white hover:bg-red-50/50 border border-slate-200 hover:border-red-300 rounded-3xl text-left transition-all shadow-xs group flex sm:flex-col items-center sm:items-start justify-between gap-3 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {t.reportHazard}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Voice reporting in your language
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 sm:hidden shrink-0" />
          </button>

          {/* Action 3: Anonymous Feedback (No user ID) */}
          <button
            type="button"
            onClick={() => setActiveModal('feedback')}
            className="p-4 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-3xl text-left transition-all shadow-xs group flex sm:flex-col items-center sm:items-start justify-between gap-3 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {t.rateWorkplace}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                100% Anonymous Privacy Shield
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 sm:hidden shrink-0" />
          </button>

        </div>
      </div>

      {/* UN SDG 8 Decent Work Commitment Footer */}
      <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200/80 text-center space-y-1">
        <p className="text-[11px] font-bold text-slate-700">
          FairShift is aligned with UN Sustainable Development Goal 8
        </p>
        <p className="text-[10px] text-slate-500">
          Decent Work & Economic Growth • Equal Pay • Zero Forced Overtime
        </p>
      </div>

      {/* MODALS */}
      {activeModal === 'payslip' && (
        <PayslipModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'safety' && (
        <SafetyModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'feedback' && (
        <FeedbackModal onClose={() => setActiveModal(null)} />
      )}

    </div>
  );
};
