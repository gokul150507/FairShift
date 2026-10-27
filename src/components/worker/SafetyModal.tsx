import React, { useState, useEffect } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  Mic,
  MicOff,
  Camera,
  AlertOctagon,
  Sparkles,
  CheckCircle2,
  Clock,
  Shield,
  Send,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { SafetyReport, LanguageCode } from '../../types/fairshift';

interface SafetyModalProps {
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ onClose }) => {
  const {
    currentSector,
    currentLang,
    submitSafetyReport,
    safetyReports,
    currentWorker,
    t
  } = useFairShift();

  const [rawText, setRawText] = useState<string>('');
  const [locationDescription, setLocationDescription] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'new' | 'status'>('new');
  const [submittedReport, setSubmittedReport] = useState<SafetyReport | null>(null);

  // Preset quick voice phrases for low-literacy demo testing
  const sampleVoicePhrases: Record<LanguageCode, { text: string; label: string }[]> = {
    hi: [
      { label: 'मचान की लकड़ी ढीली है', text: 'पिलर 14 के पास मचान की लकड़ी ढीली है और लोहे की क्लैंप टूटी हुई है। नीचे लोग काम कर रहे हैं।' },
      { label: 'बिजली का तार खुला है', text: 'पानी के गड्ढे के पास 440 वोल्ट का बिजली का तार खुला पड़ा है, करंट लग सकता है।' },
      { label: 'पीने का पानी खत्म हो गया', text: 'दोपहर की तेज धूप में पीने का पानी खत्म हो गया है, कामगारों को चक्कर आ रहे हैं।' }
    ],
    ta: [
      { label: 'மசான் பலகை உடைந்துள்ளது', text: 'தூண் 14 அருகில் உள்ள சாரக்கட்டு பலகை தளர்வாக உள்ளது, இரும்பு கிளிப் உடைந்துள்ளது.' },
      { label: 'மின்சார கம்பி நீரில் மூழ்கியுள்ளது', text: 'மழை நீரில் ஜெனரேட்டர் கேபிள் மூழ்கியுள்ளது, மின் கசிவு அபாயம் உள்ளது.' },
      { label: 'குடிநீர் இல்லை', text: 'கடுமையான வெயிலில் குடிநீர் தொட்டி காலியாக உள்ளது, தொழிலாளர்கள் சோர்வடைந்துள்ளனர்.' }
    ],
    te: [
      { label: 'స్కాఫోల్డింగ్ వదులుగా ఉంది', text: 'పిల్లర్ 14 వద్ద స్కాఫోల్డింగ్ చెక్క పలక వదులుగా ఉంది, కింద పనివారు ఉన్నారు.' },
      { label: 'కరెంట్ వైరు తెగిపడింది', text: 'నీటి గుంటలో విద్యుత్ కేబుల్ పడి ఉంది, షాక్ కొట్టే ప్రమాదం ఉంది.' },
      { label: 'మంచినీటి ట్యాంక్ ఖాళీ', text: 'ఎండ తీవ్రత వల్ల మంచినీరు లేక కూలీలు కళ్ళు తిరిగి పడిపోయే పరిస్థితి ఉంది.' }
    ],
    en: [
      { label: 'Loose scaffolding clamp', text: 'Scaffolding plank is loose and missing lock pins above the active pedestrian walkway.' },
      { label: 'Submerged 440V cable', text: 'Heavy generator electrical cable is exposed in standing puddle near Zone B gate.' },
      { label: 'Empty drinking water barrel', text: 'Potable water barrels are completely dry during peak noon sun shift.' }
    ]
  };

  // Preset hazard photos for quick realistic demonstration
  const sampleHazardPhotos = [
    {
      title: 'Scaffolding Defect',
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Live Electrical Wire',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Chemical/Lab Hazard',
      url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // Web Speech API Voice Recognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use the quick voice buttons or text input.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langMap: Record<LanguageCode, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN'
      };
      recognition.lang = langMap[currentLang] || 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setRawText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition failed to start:', err);
      setIsListening(false);
    }
  };

  // Submit Safety Report
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setIsSubmitting(true);
    const result = await submitSafetyReport({
      rawText,
      originalLanguage: currentLang,
      locationDescription: locationDescription || currentSector.defaultLocation.name,
      photoUrl: selectedPhoto || undefined
    });

    setIsSubmitting(false);
    if (result.success && result.report) {
      setSubmittedReport(result.report);
      setRawText('');
      setLocationDescription('');
      setSelectedPhoto(null);
    }
  };

  const getStatusBadge = (status: SafetyReport['status']) => {
    switch (status) {
      case 'Reported':
        return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300">Reported</span>;
      case 'Acknowledged':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">Acknowledged</span>;
      case 'In Progress':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">In Progress</span>;
      case 'Resolved':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">Resolved</span>;
    }
  };

  const getSeverityBadge = (severity: SafetyReport['severity']) => {
    switch (severity) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase">Critical Severity</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded-md bg-orange-500 text-white text-[10px] font-bold uppercase">High Severity</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold uppercase">Medium Severity</span>;
      case 'Low':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold uppercase">Low Severity</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 border border-slate-200 shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {t.safetyTitle}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Multilingual Voice Hazard Reporter powered by Gemini AI
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

        {/* Tab Switcher: New Report vs Status Tracker */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => { setActiveTab('new'); setSubmittedReport(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'new' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            + {t.speakToReport}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'status' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t.myPastReports}</span>
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
              {safetyReports.length}
            </span>
          </button>
        </div>

        {/* TAB 1: NEW HAZARD REPORT */}
        {activeTab === 'new' && (
          <div className="space-y-4">
            
            {/* Success Card after Gemini AI analysis */}
            {submittedReport && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{t.reportSubmittedSuccess}</span>
                </div>
                
                <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{submittedReport.hazardCategory}</span>
                    {getSeverityBadge(submittedReport.severity)}
                  </div>
                  <p className="text-slate-600 font-medium italic">
                    "{submittedReport.translatedEnglish}"
                  </p>
                  <div className="pt-1 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Gemini Recommended Action:
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {submittedReport.suggestedAction}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('status')}
                  className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700"
                >
                  View Status in Hazard Tracking
                </button>
              </div>
            )}

            {/* Giant Microphone Button */}
            <div className="text-center py-2">
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all transform active:scale-95 shadow-xl ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-red-500/40 ring-8 ring-red-200'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30 hover:scale-105'
                }`}
              >
                {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
              </button>
              <p className="text-xs font-bold text-slate-700 mt-2.5">
                {isListening ? t.listening : t.tapToSpeak}
              </p>
              <p className="text-[11px] text-slate-400">
                Speak naturally in {currentLang.toUpperCase()} (Hindi / Tamil / Telugu / English)
              </p>
            </div>

            {/* Quick Demo Voice Presets for Testing */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Quick Sample Hazard Prompts (Tap to test voice):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                {(sampleVoicePhrases[currentLang] || sampleVoicePhrases.en).map((phrase, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRawText(phrase.text)}
                    className="p-2 text-left bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-medium text-slate-700 transition-colors"
                  >
                    "{phrase.label}"
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Worker Hazard Statement (Voice / Text):
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={t.typeOrSpeakPlaceholder}
                  rows={3}
                  className="w-full p-3 text-xs border border-slate-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Location on Site:
                </label>
                <input
                  type="text"
                  value={locationDescription}
                  onChange={(e) => setLocationDescription(e.target.value)}
                  placeholder="e.g., Near Pier 14 mixer or Science Block Room 204"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Photo Attachment (Presets or Upload) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.addPhotoOptional}</span>
                  </label>
                  {selectedPhoto && (
                    <button
                      type="button"
                      onClick={() => setSelectedPhoto(null)}
                      className="text-[10px] text-red-600 font-bold hover:underline"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {sampleHazardPhotos.map((photo, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedPhoto(photo.url)}
                      className={`relative rounded-xl overflow-hidden border-2 aspect-video group transition-all ${
                        selectedPhoto === photo.url ? 'border-emerald-600 ring-2 ring-emerald-400' : 'border-slate-200'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-slate-900/70 text-white text-[9px] font-bold p-0.5 truncate text-center">
                        {photo.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !rawText.trim()}
                className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>{t.aiAnalyzing}</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t.submitSafetyReport}</span>
                  </>
                )}
              </button>
            </form>

          </div>
        )}

        {/* TAB 2: HAZARD TRACKING STATUS */}
        {activeTab === 'status' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-medium">
              Transparent tracking of logged site hazards. Updates reflect real-time safety team actions.
            </p>

            {safetyReports.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">
                No active hazards reported for this sector yet.
              </p>
            ) : (
              <div className="space-y-3">
                {safetyReports.map(report => (
                  <div
                    key={report.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-900">
                          {report.hazardCategory}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {report.locationDescription} • {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {getSeverityBadge(report.severity)}
                        {getStatusBadge(report.status)}
                      </div>
                    </div>

                    {/* Original regional snippet */}
                    <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
                      <p className="text-slate-500 font-serif italic text-[11px]">
                        "{report.rawText}"
                      </p>
                      <p className="text-slate-800 font-semibold border-t border-slate-200/60 pt-1 text-[11px]">
                        <span className="text-emerald-700 font-bold">English: </span>
                        {report.translatedEnglish}
                      </p>
                    </div>

                    {/* Gemini AI Action */}
                    <div className="p-2 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px]">
                      <span className="font-bold text-amber-900 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Remedy:
                      </span>
                      <span className="text-amber-900">{report.suggestedAction}</span>
                    </div>

                    {/* Admin notes if present */}
                    {report.adminNotes && (
                      <div className="text-[10px] text-slate-600 bg-slate-100 p-2 rounded-lg font-mono">
                        <span className="font-bold">Supervisor Note: </span>
                        {report.adminNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
