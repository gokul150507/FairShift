import React from 'react';
import { useFairShift } from '../context/FairShiftContext';
import {
  Smartphone,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Mic,
  Lock,
  HardHat,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Volume2
} from 'lucide-react';

interface LandingHeroProps {
  onSelectRole: (role: 'worker' | 'admin') => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onSelectRole }) => {
  const { currentSectorId, setCurrentSectorId, currentSector, t } = useFairShift();

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-5xl mx-auto text-center space-y-8">
      
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>UN SDG 8 • Decent Work & Economic Growth</span>
      </div>

      {/* Main Title */}
      <div className="space-y-3 max-w-2xl">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          FairShift: Decent Work Platform
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
          Replacing paper registers and WhatsApp groups with transparent wages, speech-assisted shift tracking, multilingual Gemini hazard analysis, and retaliation-proof anonymous feedback.
        </p>
      </div>

      {/* Sector Quick Switcher on Landing */}
      <div className="p-1.5 bg-slate-100 rounded-2xl border border-slate-200 inline-flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 pl-3">Sector Target:</span>
        <button
          type="button"
          onClick={() => setCurrentSectorId('construction')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentSectorId === 'construction'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-200/70'
          }`}
        >
          <HardHat className="w-3.5 h-3.5" />
          <span>Construction Site</span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentSectorId('campus')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            currentSectorId === 'campus'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-200/70'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>College / School Campus</span>
        </button>
      </div>

      {/* Portal Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl text-left">
        
        {/* Portal 1: Worker App */}
        <div
          onClick={() => onSelectRole('worker')}
          className="group relative bg-white hover:bg-emerald-50/30 p-6 sm:p-8 rounded-3xl border-2 border-slate-200 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
              <Smartphone className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                Frontline Interface
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Worker Mobile App
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Mobile-first with minimal text, giant tap buttons, regional speech synthesis in Hindi, Tamil, Telugu, and English, and verified automated overtime pay.
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-1.5 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Simulated GPS & QR shift check-in (2x overtime)</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audio payslip read-aloud in regional languages</span>
              </div>
              <div className="flex items-center gap-2">
                <Mic className="w-3.5 h-3.5 text-red-500" />
                <span>Voice safety hazard reporting (Gemini translated)</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Zero user ID anonymous ratings</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between font-extrabold text-xs text-emerald-700 group-hover:translate-x-1 transition-transform">
            <span>Enter Worker App</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Portal 2: Admin Dashboard */}
        <div
          onClick={() => onSelectRole('admin')}
          className="group relative bg-white hover:bg-slate-50 p-6 sm:p-8 rounded-3xl border-2 border-slate-200 hover:border-slate-800 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Operations & Management
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Employer / Admin Hub
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Desktop-first control center with live shifts, overtime statutory audits, safety Kanban with Gemini action prescriptions, and fatigue alerts.
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-1.5 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Transparent ledger audits (prevents wage shaving)</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Gemini multilingual hazard prioritization & Kanban</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                <span>Fatigue radar (sub-11h turnaround & 48h limits)</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span>5-worker privacy shield with AI theme synthesis</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between font-extrabold text-xs text-slate-900 group-hover:translate-x-1 transition-transform">
            <span>Enter Admin Hub</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

      </div>

    </div>
  );
};
