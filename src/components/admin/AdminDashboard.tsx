import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  Clock,
  AlertOctagon,
  HeartPulse,
  Lock,
  Building2,
  HardHat,
  GraduationCap,
  ShieldCheck,
  Zap,
  TrendingUp,
  Settings,
  Users
} from 'lucide-react';
import { LiveShiftsView } from './LiveShiftsView';
import { SafetyKanbanView } from './SafetyKanbanView';
import { FatigueRadarView } from './FatigueRadarView';
import { FeedbackAnalyticsView } from './FeedbackAnalyticsView';

export const AdminDashboard: React.FC = () => {
  const {
    currentSector,
    shifts,
    safetyReports,
    fatigueAlerts,
    feedbackAggregation,
    workers
  } = useFairShift();

  const [activeTab, setActiveTab] = useState<'shifts' | 'safety' | 'fatigue' | 'feedback'>('shifts');
  const [showSectorRules, setShowSectorRules] = useState<boolean>(false);

  // KPIs
  const activeWorkers = shifts.filter(s => s.status === 'active').length;
  const totalOvertimeHours = shifts.reduce((acc, s) => acc + (s.overtimeHours || 0), 0);
  const openHazards = safetyReports.filter(r => r.status !== 'Resolved').length;
  const criticalHazards = safetyReports.filter(r => r.severity === 'Critical' && r.status !== 'Resolved').length;
  const criticalFatigueCount = fatigueAlerts.filter(a => a.riskLevel === 'critical').length;
  const feedbackCount = feedbackAggregation?.totalResponses || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Sector Control Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
              {currentSector.id === 'construction' ? 'Heavy Industry / Site' : 'Institutional / Campus'}
            </span>
            <span className="text-xs text-slate-300 font-mono">
              Lead: {currentSector.supervisorTitle}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {currentSector.name}
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            {currentSector.tagline} • Overtime Rule: Standard {currentSector.overtimeRules.standardHoursPerDay}h/day, {currentSector.overtimeRules.overtimeMultiplier}x statutory multiplier thereafter.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSectorRules(!showSectorRules)}
          className="z-10 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4 text-emerald-400" />
          <span>{showSectorRules ? 'Hide Sector Rules' : 'Inspect Sector Rules'}</span>
        </button>
      </div>

      {/* Sector Rule Details drawer if open */}
      {showSectorRules && (
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3 animate-fade-in text-xs">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            Sector Parameters & Statutory Thresholds ({currentSector.name})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-bold text-[10px]">Standard Shift Cap</p>
              <p className="font-black text-sm text-slate-900">{currentSector.overtimeRules.standardHoursPerDay} hrs / day</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <p className="text-amber-800 font-bold text-[10px]">Overtime Multiplier</p>
              <p className="font-black text-sm text-amber-900">{currentSector.overtimeRules.overtimeMultiplier}x Base Rate</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-bold text-[10px]">Mandatory Rest Gap</p>
              <p className="font-black text-sm text-slate-900">{currentSector.overtimeRules.mandatoryRestHours} hrs between shifts</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-bold text-[10px]">Max Consecutive Days</p>
              <p className="font-black text-sm text-slate-900">{currentSector.overtimeRules.maxConsecutiveDays} Days max</p>
            </div>
          </div>
        </div>
      )}

      {/* High-Level Operations Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Active Staff */}
        <div
          onClick={() => setActiveTab('shifts')}
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-xs cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Active On Site</p>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{activeWorkers}</p>
          <p className="text-[10px] text-emerald-600 font-bold">
            {totalOvertimeHours.toFixed(1)}h overtime logged
          </p>
        </div>

        {/* Card 2: Open Safety Hazards */}
        <div
          onClick={() => setActiveTab('safety')}
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-xs cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Open Hazards</p>
            <AlertOctagon className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{openHazards}</p>
            {criticalHazards > 0 && (
              <span className="text-xs font-black text-red-600 animate-pulse">
                ({criticalHazards} Critical)
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-bold">
            Gemini Multilingual Analysis
          </p>
        </div>

        {/* Card 3: Fatigue / Overwork Alerts */}
        <div
          onClick={() => setActiveTab('fatigue')}
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-xs cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Fatigue Stand-Downs</p>
            <HeartPulse className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600">{criticalFatigueCount}</p>
          <p className="text-[10px] text-slate-500 font-bold">
            {fatigueAlerts.length} total staff flagged
          </p>
        </div>

        {/* Card 4: Anonymous Feedback Shield */}
        <div
          onClick={() => setActiveTab('feedback')}
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-xs cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Anonymous Voice</p>
            <Lock className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{feedbackCount}</p>
          <p className="text-[10px] text-indigo-600 font-bold">
            {feedbackAggregation?.isPrivacyThresholdMet ? 'Shield Unlocked (≥5)' : 'Locked (<5 threshold)'}
          </p>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('shifts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'shifts'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>Live Shifts & Overtime Audit</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('safety')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'safety'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertOctagon className="w-4 h-4 text-red-400" />
          <span>Safety Kanban (Gemini AI)</span>
          {openHazards > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
              {openHazards}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fatigue')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'fatigue'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HeartPulse className="w-4 h-4 text-rose-400" />
          <span>Fatigue Radar</span>
          {criticalFatigueCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] flex items-center justify-center font-bold">
              !
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'feedback'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4 text-indigo-400" />
          <span>Anonymous Voice & Privacy Shield</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="pt-2">
        {activeTab === 'shifts' && <LiveShiftsView />}
        {activeTab === 'safety' && <SafetyKanbanView />}
        {activeTab === 'fatigue' && <FatigueRadarView />}
        {activeTab === 'feedback' && <FeedbackAnalyticsView />}
      </div>

    </div>
  );
};
