import React, { useState, useEffect } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  MapPin,
  QrCode,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  ShieldAlert,
  Compass,
  ArrowRight
} from 'lucide-react';
import { ShiftRecord } from '../../types/fairshift';

export const ShiftTracker: React.FC = () => {
  const { currentWorker, currentSector, shifts, clockIn, clockOut, t } = useFairShift();

  const [activeShift, setActiveShift] = useState<ShiftRecord | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [checkInMode, setCheckInMode] = useState<'geo' | 'qr'>('geo');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);
  const [isClockingOut, setIsClockingOut] = useState<boolean>(false);
  const [clockOutNotes, setClockOutNotes] = useState<string>('');

  // Find active shift
  useEffect(() => {
    const active = shifts.find(s => s.workerId === currentWorker.id && s.status === 'active');
    setActiveShift(active || null);

    if (active && active.checkInTime) {
      const startTime = new Date(active.checkInTime).getTime();
      const diffSecs = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
      setElapsedSeconds(diffSecs);
    } else {
      setElapsedSeconds(0);
    }
  }, [shifts, currentWorker.id]);

  // Timer interval
  useEffect(() => {
    if (!activeShift) return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeShift]);

  // Format elapsed time HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const elapsedHours = elapsedSeconds / 3600;
  const standardLimit = currentSector.overtimeRules.standardHoursPerDay || 8;
  const isOvertime = elapsedHours > standardLimit;
  const overtimeMultiplier = currentSector.overtimeRules.overtimeMultiplier || 2.0;

  // Earnings estimation
  const regularHoursAccrued = Math.min(elapsedHours, standardLimit);
  const overtimeHoursAccrued = Math.max(0, elapsedHours - standardLimit);
  const regularPayAccrued = regularHoursAccrued * currentWorker.hourlyRate;
  const overtimePayAccrued = overtimeHoursAccrued * currentWorker.hourlyRate * overtimeMultiplier;
  const totalAccruedEarnings = Math.round(regularPayAccrued + overtimePayAccrued);

  // Handle Clock In with realistic verification animation
  const handleClockIn = async () => {
    setIsVerifying(true);
    setVerificationFeedback(
      checkInMode === 'geo'
        ? `Connecting to GPS satellites... Checking perimeter for ${currentSector.defaultLocation.name}`
        : `Scanning gate QR code at ${currentSector.name}...`
    );

    setTimeout(async () => {
      const res = await clockIn(checkInMode);
      setIsVerifying(false);
      if (res.success) {
        setVerificationFeedback(
          checkInMode === 'geo' ? t.simulatedGeoSuccess : t.simulatedQrSuccess
        );
        setTimeout(() => setVerificationFeedback(null), 3500);
      } else {
        setVerificationFeedback(res.message || 'Verification failed');
      }
    }, 1200);
  };

  // Handle Clock Out
  const handleClockOut = async () => {
    const res = await clockOut(clockOutNotes);
    setIsClockingOut(false);
    setClockOutNotes('');
    if (!res.success) {
      alert(res.message || 'Error clocking out');
    }
  };

  // Filter recent shifts for current worker
  const workerPastShifts = shifts.filter(
    s => s.workerId === currentWorker.id && s.status === 'completed'
  );

  return (
    <div className="space-y-6">
      
      {/* Verification Notice Banner if active */}
      {verificationFeedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <p className="text-sm font-semibold">{verificationFeedback}</p>
        </div>
      )}

      {/* Main Shift Status Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-md">
        
        {/* Header Status Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${activeShift ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {activeShift ? t.currentlyOnShift : t.notOnShift}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {currentSector.name} • {currentWorker.role}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              ₹{currentWorker.hourlyRate}/hr base
            </span>
          </div>
        </div>

        {/* ACTIVE SHIFT VIEW */}
        {activeShift ? (
          <div className="py-6 space-y-6 text-center">
            
            {/* Live Clock Display */}
            <div>
              <p className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-1">
                {t.currentHours}
              </p>
              <div className="font-mono text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
                {formatTime(elapsedSeconds)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {t.shiftStartedAt}: {new Date(activeShift.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Overtime Alert Badge if > 8 hrs */}
            {isOvertime ? (
              <div className="p-3.5 bg-amber-50 border-2 border-amber-400 rounded-2xl flex items-center justify-center gap-2 text-amber-900 animate-bounce">
                <Zap className="w-5 h-5 text-amber-600 fill-amber-500" />
                <span className="font-extrabold text-sm sm:text-base">
                  {t.overtimeAccruing}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{standardLimit} hr standard shift limit • Overtime at {overtimeMultiplier}x rate thereafter</span>
              </div>
            )}

            {/* Live Earnings Meter */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-2 gap-3 text-left">
              <div>
                <p className="text-[11px] text-slate-500 font-medium">{t.earnedToday}</p>
                <p className="text-2xl font-black text-emerald-600">
                  ₹{totalAccruedEarnings}
                </p>
              </div>
              <div className="border-l border-slate-200 pl-3">
                <p className="text-[11px] text-slate-500 font-medium">{t.overtimeHours}</p>
                <p className="text-xl font-bold text-amber-600">
                  {overtimeHoursAccrued.toFixed(1)} hrs
                </p>
              </div>
            </div>

            {/* Clock Out Big Button */}
            <button
              type="button"
              onClick={() => setIsClockingOut(true)}
              className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-black text-lg sm:text-xl rounded-2xl shadow-lg shadow-red-600/30 transition-all transform active:scale-98 flex items-center justify-center gap-3 cursor-pointer"
            >
              <Clock className="w-6 h-6" />
              <span>{t.clockOutNow}</span>
            </button>
          </div>
        ) : (
          /* NOT ON SHIFT - CLOCK IN OPTIONS */
          <div className="py-6 space-y-5">
            
            {/* Method Toggle Buttons */}
            <div>
              <p className="text-xs font-bold text-slate-600 mb-2.5">
                {t.selectMethod}:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCheckInMode('geo')}
                  className={`p-3.5 rounded-2xl border-2 flex items-center gap-2.5 transition-all text-left ${
                    checkInMode === 'geo'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <MapPin className={`w-5 h-5 ${checkInMode === 'geo' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-sm">{t.geoCheckIn}</p>
                    <p className="text-[10px] text-slate-500">Auto Site GPS</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCheckInMode('qr')}
                  className={`p-3.5 rounded-2xl border-2 flex items-center gap-2.5 transition-all text-left ${
                    checkInMode === 'qr'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <QrCode className={`w-5 h-5 ${checkInMode === 'qr' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-sm">{t.qrCheckIn}</p>
                    <p className="text-[10px] text-slate-500">Gate Board Scan</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Geofence or QR Preview Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              {checkInMode === 'geo' ? (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl mt-0.5">
                    <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t.confirmLocation}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{currentSector.defaultLocation.name}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      ✓ Geofence Verified ({currentSector.defaultLocation.geofenceRadiusMeters}m radius active)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-200 text-slate-700 rounded-xl">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t.scanQrPrompt}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ready to authenticate token on gate scanner
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* BIG CLOCK IN BUTTON */}
            <button
              type="button"
              onClick={handleClockIn}
              disabled={isVerifying}
              className="w-full py-5 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xl sm:text-2xl rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
            >
              {isVerifying ? (
                <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-7 h-7" />
                  <span>{t.clockInNow}</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>

      {/* Clock Out Confirmation Modal */}
      {isClockingOut && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">
              Confirm End of Shift
            </h3>
            <p className="text-xs text-slate-600">
              Your shift duration ({elapsedHours.toFixed(1)} hrs) will be verified and stored in the transparent ledger.
              {isOvertime && ` Includes ${overtimeHoursAccrued.toFixed(1)} hrs calculated at ${overtimeMultiplier}x statutory overtime.`}
            </p>

            <textarea
              value={clockOutNotes}
              onChange={(e) => setClockOutNotes(e.target.value)}
              placeholder="Optional notes: completed work package, hand-off to next crew..."
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              rows={3}
            />

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsClockingOut(false)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClockOut}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md"
              >
                Confirm Check-Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Shifts Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            {t.recentShifts}
          </h3>
          <span className="text-xs text-slate-400 font-semibold">
            {workerPastShifts.length} Recorded
          </span>
        </div>

        {workerPastShifts.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">
            No completed shifts yet today.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {workerPastShifts.slice(0, 3).map(shift => (
              <div key={shift.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {shift.totalHours} hrs
                    </span>
                    {shift.overtimeHours > 0 && (
                      <span className="px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 text-[10px] font-bold">
                        +{shift.overtimeHours}h OT ({overtimeMultiplier}x)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {new Date(shift.checkInTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {shift.checkInMethod.toUpperCase()} verified
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">
                    ₹{shift.netPay}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-bold">
                    ✓ Full pay logged
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
