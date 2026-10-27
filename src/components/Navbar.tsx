import React, { useState } from 'react';
import { useFairShift } from '../context/FairShiftContext';
import {
  HardHat,
  GraduationCap,
  Globe,
  Smartphone,
  LayoutDashboard,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { LanguageCode, SectorId } from '../types/fairshift';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentSectorId,
    setCurrentSectorId,
    currentSector,
    allSectors,
    currentLang,
    setCurrentLang,
    currentWorker,
    setCurrentWorker,
    workers,
    resetDemoData
  } = useFairShift();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showWorkerMenu, setShowWorkerMenu] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' }
  ];

  const currentSectorWorkers = workers.filter(w => w.sectorId === currentSectorId);

  const handleReset = async () => {
    setIsResetting(true);
    await resetDemoData();
    setTimeout(() => setIsResetting(false), 800);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand & SDG 8 Tag */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20 font-extrabold text-xl">
              FS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  FairShift
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  UN SDG 8
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-500 font-medium">
                Decent Work & Transparent Shift Wages
              </p>
            </div>
          </div>

          {/* Center: Sector Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentSectorId('construction')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  currentSectorId === 'construction'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Switch to Construction Site Sector"
              >
                <HardHat className="w-4 h-4" />
                <span className="hidden sm:inline">Construction</span>
                <span className="sm:hidden">Site</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentSectorId('campus')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  currentSectorId === 'campus'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Switch to College & School Campus Sector"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">College Campus</span>
                <span className="sm:hidden">Campus</span>
              </button>
            </div>
          </div>

          {/* Right Controls: Role Switcher, Language & Worker Profile */}
          <div className="flex items-center gap-2">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="uppercase font-bold">{currentLang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 ${
                        currentLang === lang.code ? 'font-bold text-emerald-700 bg-emerald-50/60' : 'text-slate-700'
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* If in Worker Mode: Worker Switcher */}
            {currentRole === 'worker' && (
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setShowWorkerMenu(!showWorkerMenu)}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800"
                  title="Switch Worker Profile Demo"
                >
                  <img
                    src={currentWorker.avatarUrl}
                    alt={currentWorker.name}
                    className="w-5 h-5 rounded-full object-cover border border-emerald-500"
                  />
                  <span className="max-w-[100px] truncate">{currentWorker.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showWorkerMenu && (
                  <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Switch {currentSector.workerTerm}
                    </div>
                    {currentSectorWorkers.map(w => (
                      <button
                        key={w.id}
                        onClick={() => {
                          setCurrentWorker(w);
                          setShowWorkerMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 ${
                          currentWorker.id === w.id ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <img
                          src={w.avatarUrl}
                          alt={w.name}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{w.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{w.role} • ₹{w.hourlyRate}/hr</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Portal Switcher (Worker App vs Admin Dashboard) */}
            <div className="flex items-center p-0.5 bg-slate-900 rounded-xl shadow-sm">
              <button
                type="button"
                onClick={() => setCurrentRole('worker')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  currentRole === 'worker'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Worker App</span>
                <span className="sm:hidden">Worker</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentRole('admin')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  currentRole === 'admin'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Hub</span>
                <span className="sm:hidden">Admin</span>
              </button>
            </div>

            {/* Reset Demo button */}
            <button
              type="button"
              onClick={handleReset}
              disabled={isResetting}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
