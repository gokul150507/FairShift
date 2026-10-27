/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FairShiftProvider, useFairShift } from './context/FairShiftContext';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { WorkerApp } from './components/worker/WorkerApp';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Smartphone, Monitor, ShieldCheck, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRole, setCurrentRole } = useFairShift();
  const [hasChosenPortal, setHasChosenPortal] = useState<boolean>(false);
  const [simulateMobileFrame, setSimulateMobileFrame] = useState<boolean>(true);

  const handleSelectRole = (role: 'worker' | 'admin') => {
    setCurrentRole(role);
    setHasChosenPortal(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {!hasChosenPortal ? (
          <LandingHero onSelectRole={handleSelectRole} />
        ) : currentRole === 'worker' ? (
          <div className="py-6 px-2 sm:px-4">
            
            {/* View Mode Bar for Worker App */}
            <div className="max-w-md mx-auto mb-4 flex items-center justify-between text-xs px-2 text-slate-500">
              <span className="font-bold flex items-center gap-1.5 text-slate-700">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                Worker Portal (Mobile-First)
              </span>

              <button
                type="button"
                onClick={() => setSimulateMobileFrame(!simulateMobileFrame)}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 font-semibold shadow-2xs"
              >
                {simulateMobileFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                <span>{simulateMobileFrame ? 'Full Width' : 'Phone Frame'}</span>
              </button>
            </div>

            {/* Worker View (Rendered in sleek smartphone simulator or fluid layout) */}
            {simulateMobileFrame ? (
              <div className="max-w-sm sm:max-w-md mx-auto bg-slate-50 rounded-[40px] shadow-2xl border-8 border-slate-900 overflow-hidden relative">
                {/* Speaker notch */}
                <div className="w-28 h-4 bg-slate-900 rounded-b-xl mx-auto mb-1 relative z-20" />
                <div className="max-h-[820px] overflow-y-auto pb-8">
                  <WorkerApp />
                </div>
              </div>
            ) : (
              <WorkerApp />
            )}
          </div>
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* Global UN SDG 8 Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>FairShift Platform • Supporting UN Sustainable Development Goal 8</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Decent Work & Economic Growth</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setHasChosenPortal(false)}
              className="text-slate-600 hover:text-emerald-600 font-semibold underline cursor-pointer"
            >
              Choose Portal Screen
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <FairShiftProvider>
      <AppContent />
    </FairShiftProvider>
  );
}
