import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  HeartPulse,
  Coffee,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowRight
} from 'lucide-react';

export const FatigueRadarView: React.FC = () => {
  const { fatigueAlerts, currentSector, workers } = useFairShift();
  const [standDownSuccess, setStandDownSuccess] = useState<string | null>(null);

  const handleStandDown = (workerName: string) => {
    setStandDownSuccess(`Paid 36-hour recovery stand-down authorized for ${workerName}. Notification dispatched.`);
    setTimeout(() => setStandDownSuccess(null), 4000);
  };

  const criticalCount = fatigueAlerts.filter(a => a.riskLevel === 'critical').length;
  const highCount = fatigueAlerts.filter(a => a.riskLevel === 'high').length;

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-600" />
            Fatigue & Overwork Early Warning Radar (UN SDG 8 Health & Decent Work)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitors consecutive working days, sub-11h turnaround rest gaps, and weekly hours exceeding statutory limits to prevent catastrophic site accidents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-black rounded-xl border border-red-200 animate-pulse">
              {criticalCount} Critical Stand-Downs Required
            </span>
          )}
          {highCount > 0 && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-200">
              {highCount} High Fatigue Warnings
            </span>
          )}
        </div>
      </div>

      {standDownSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{standDownSuccess}</span>
        </div>
      )}

      {/* Grid of Overwork Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fatigueAlerts.map(alert => {
          const worker = workers.find(w => w.id === alert.workerId);
          const isCritical = alert.riskLevel === 'critical';

          return (
            <div
              key={alert.workerId}
              className={`rounded-3xl border-2 p-5 bg-white transition-all shadow-xs space-y-4 ${
                isCritical ? 'border-red-400 bg-red-50/20 shadow-red-500/10' : 'border-amber-300 bg-amber-50/20'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {worker ? (
                    <img
                      src={worker.avatarUrl}
                      alt={alert.workerName}
                      className="w-11 h-11 rounded-2xl object-cover border-2 border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-slate-200 text-slate-700 font-bold flex items-center justify-center">
                      {alert.workerName[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{alert.workerName}</h3>
                    <p className="text-xs text-slate-500">{alert.role}</p>
                    <p className="text-[10px] text-slate-400">{alert.department}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isCritical
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {alert.riskLevel}
                </span>
              </div>

              {/* Metric Radar Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-white/80 rounded-2xl border border-slate-200/80 text-center text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold">7-Day Hours</p>
                  <p className={`font-black text-sm ${alert.metrics.weeklyHours >= 55 ? 'text-red-600' : 'text-slate-800'}`}>
                    {alert.metrics.weeklyHours}h
                  </p>
                  <p className="text-[9px] text-slate-400">max 48h limit</p>
                </div>
                <div className="border-x border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold">Consecutive</p>
                  <p className={`font-black text-sm ${alert.metrics.consecutiveDays >= 7 ? 'text-red-600' : 'text-amber-600'}`}>
                    {alert.metrics.consecutiveDays} Days
                  </p>
                  <p className="text-[9px] text-slate-400">max 6 days</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold">Turnaround</p>
                  <p className={`font-black text-sm ${alert.metrics.lastRestGapHours < 8 ? 'text-red-600' : 'text-amber-600'}`}>
                    {alert.metrics.lastRestGapHours}h rest
                  </p>
                  <p className="text-[9px] text-slate-400">min 11h gap</p>
                </div>
              </div>

              {/* Risk Reasons */}
              <div className="space-y-1.5 text-xs">
                <p className="text-[11px] font-bold text-slate-700">Identified Risk Triggers:</p>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  {alert.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Corrective Action Prescription */}
              <div className="p-3 bg-slate-100 rounded-2xl text-[11px] space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5 text-amber-600" />
                  Management Remedy:
                </span>
                <p className="text-slate-600 leading-tight">
                  {alert.suggestedAction}
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleStandDown(alert.workerName)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
                  isCritical
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                Issue Mandatory Paid Recovery Rest
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
