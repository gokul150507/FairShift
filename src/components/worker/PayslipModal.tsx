import React, { useState, useEffect } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  Volume2,
  VolumeX,
  Download,
  ShieldCheck,
  Coins,
  Clock,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Receipt,
  FileCheck
} from 'lucide-react';
import { PayslipBreakdown } from '../../types/fairshift';
import { speakText, stopSpeaking } from '../../utils/i18n';

interface PayslipModalProps {
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ onClose }) => {
  const { currentWorker, currentSector, currentLang, t } = useFairShift();
  const [payslip, setPayslip] = useState<PayslipBreakdown | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchPayslip = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/payslips/${currentWorker.id}`);
        const data = await res.json();
        setPayslip(data.payslip);
      } catch (err) {
        console.error('Error fetching payslip:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayslip();

    return () => {
      stopSpeaking();
    };
  }, [currentWorker.id]);

  // Read aloud payslip in worker's selected language
  const handleReadAloud = () => {
    if (!payslip) return;

    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);

    let speechText = '';
    if (currentLang === 'hi') {
      speechText = `नमस्ते ${payslip.workerName}। आपकी वेतन पर्ची तैयार है। आपके कुल काम के घंटे ${payslip.regularHours} घंटे हैं। आपका मूल वेतन ${payslip.basePay} रुपये है। आपका ओवरटाइम वेतन ${payslip.overtimePay} रुपये है, जो 8 घंटे से अधिक काम के लिए दोगुनी दर से दिया गया है। कुल कटौती ${payslip.deductions.totalDeductions} रुपये है। आपका कुल शुद्ध वेतन ${payslip.netPay} रुपये है। फेयरशिफ्ट गारंटी देता है कि आपका एक भी मिनट बिना गिने नहीं छोड़ा गया।`;
    } else if (currentLang === 'ta') {
      speechText = `வணக்கம் ${payslip.workerName}। உங்கள் சம்பளச் சீட்டு விவரம்: உங்கள் அடிப்படை வேலை நேரம் ${payslip.regularHours} மணிநேரம். அடிப்படை ஊதியம் ${payslip.basePay} ரூபாய். உங்கள் கூடுதல் நேர ஊதியம் ${payslip.overtimePay} ரூபாய், இது இரட்டிப்பு வீதத்தில் கணக்கிடப்பட்டுள்ளது. மொத்த பிடித்தம் ${payslip.deductions.totalDeductions} ரூபாய். கைக்கு வரும் நிகர ஊதியம் ${payslip.netPay} ரூபாய். எந்த கூடுதல் நேரமும் விடுபடாமல் முழுமையாக பதிவு செய்யப்பட்டுள்ளது.`;
    } else if (currentLang === 'te') {
      speechText = `నమస్కారం ${payslip.workerName}. మీ వేతన వివరాలు: ప్రాథమిక పని గంటలు ${payslip.regularHours} గంటలు. ప్రాథమిక వేతనం ${payslip.basePay} రూపాయలు. ఓవర్‌టైమ్ వేతనం ${payslip.overtimePay} రూపాయలు. మొత్తం మినహాయింపులు ${payslip.deductions.totalDeductions} రూపాయలు. మీ చేతికి వచ్చే నికర వేతనం ${payslip.netPay} రూపాయలు. మీ శ్రమకు ప్రతి పైసా లెక్కించబడింది.`;
    } else {
      speechText = `Hello ${payslip.workerName}. Here is your clear payslip breakdown. Total standard hours: ${payslip.regularHours} hours, earning ${payslip.basePay} rupees. Overtime hours: ${payslip.overtimeHours} hours at accelerated rate, earning ${payslip.overtimePay} rupees. Total deductions: ${payslip.deductions.totalDeductions} rupees. Your net take-home pay is ${payslip.netPay} rupees. Zero uncounted overtime. Verified for UN SDG 8 Decent Work.`;
    }

    speakText(speechText, currentLang);

    // Stop animation when utterance finishes
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 16000);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 border border-slate-200 shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {t.payslipTitle}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {currentWorker.name} • {currentWorker.role}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {loading || !payslip ? (
          <div className="py-12 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">{t.loading}</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Audio Read-Aloud Banner */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce text-amber-300' : 'text-emerald-200'}`} />
                <div>
                  <p className="text-xs font-bold leading-tight">
                    {isPlayingAudio ? 'Reading out in your language...' : t.listenToPayslip}
                  </p>
                  <p className="text-[10px] text-emerald-100 font-medium">
                    Speech synthesis for regional accessibility
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReadAloud}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isPlayingAudio
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                {isPlayingAudio ? t.stopListening : 'PLAY AUDIO'}
              </button>
            </div>

            {/* NET TAKE HOME - Giant Display */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white rounded-2xl text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-10">
                <Coins className="w-24 h-24" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {t.takeHomePay}
              </p>
              <div className="text-4xl sm:text-5xl font-black text-white my-1 tracking-tight">
                ₹{payslip.netPay.toLocaleString('en-IN')}
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Direct to Account / Cashier</span>
              </div>
            </div>

            {/* VISUAL BREAKDOWN GRID */}
            <div className="space-y-2.5">
              
              {/* Regular Base Pay */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{t.regularPay}</p>
                    <p className="text-[11px] text-slate-500">
                      {payslip.regularHours} {t.hours} @ ₹{payslip.hourlyRate}/hr
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">₹{payslip.basePay}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Standard Shift</p>
                </div>
              </div>

              {/* Overtime Pay with Overtime Rule Badge */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-amber-900">{t.overtimePay}</p>
                      <span className="px-1.5 py-0.2 rounded-sm bg-amber-200 text-amber-900 text-[10px] font-extrabold">
                        {currentSector.overtimeRules.overtimeMultiplier}x RATE
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800/80">
                      {payslip.overtimeHours} {t.hours} beyond 8h statutory limit
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-amber-900">₹{payslip.overtimePay}</p>
                  <p className="text-[10px] text-amber-700 font-bold">Full 2x applied</p>
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div className="p-3 bg-red-50/40 rounded-xl border border-red-200/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-red-900">{t.deductions}</p>
                  <p className="text-[10px] text-slate-500">
                    Welfare/ESI: ₹{payslip.deductions.providentWelfare} • Meal: ₹{payslip.deductions.mealAdvance} • PPE: FREE
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-red-700">
                    -₹{payslip.deductions.totalDeductions}
                  </p>
                  <p className="text-[10px] text-slate-400">itemized</p>
                </div>
              </div>

            </div>

            {/* UN SDG 8 Guarantee seal */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="font-semibold text-[11px] leading-tight">
                {t.transparentProof}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                {downloadSuccess ? (
                  <>
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Statement Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{t.downloadSlip}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                {t.close}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
