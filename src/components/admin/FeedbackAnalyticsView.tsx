import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Lightbulb,
  HeartHandshake
} from 'lucide-react';

export const FeedbackAnalyticsView: React.FC = () => {
  const { feedbackAggregation, currentSector, submitFeedback, refreshData } = useFairShift();
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationNote, setSimulationNote] = useState<string | null>(null);

  // Helper to simulate an anonymous feedback submission to test the privacy threshold
  const handleSimulateResponse = async () => {
    setIsSimulating(true);
    const mockComments = [
      'Need cold drinking water stations near the elevated piers during peak hours.',
      'Supervisors are communicative, but night shift turnaround time is tight.',
      'Transparent shift tracking made our pay dispute with contractor disappear completely.',
      'Safety equipment provided is in good condition; request more heat shaded tents.'
    ];
    const pickedComment = mockComments[Math.floor(Math.random() * mockComments.length)];

    await submitFeedback({
      department: currentSector.departments[0] || 'Work Zone',
      ratingManager: 4,
      ratingSafety: 4,
      ratingFairness: 5,
      ratingRestBreaks: 3,
      comments: pickedComment
    });

    setIsSimulating(false);
    setSimulationNote('New anonymous worker feedback recorded! Privacy shield recalculating...');
    setTimeout(() => setSimulationNote(null), 3500);
  };

  const isUnlocked = feedbackAggregation?.isPrivacyThresholdMet;
  const count = feedbackAggregation?.totalResponses || 0;
  const threshold = feedbackAggregation?.minimumThreshold || 5;

  return (
    <div className="space-y-6">
      
      {/* Privacy Shield Policy Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${isUnlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
              {isUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Anonymous Worker Voice & Retaliation-Proof Shield
              </h2>
              <p className="text-xs text-slate-500">
                Zero identity footprint. Data is mathematically protected by k-anonymity (minimum {threshold} workers per group).
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Privacy Threshold Test Button */}
        <button
          type="button"
          onClick={handleSimulateResponse}
          disabled={isSimulating}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Simulate +1 Worker Feedback</span>
        </button>
      </div>

      {simulationNote && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{simulationNote}</span>
        </div>
      )}

      {/* PRIVACY SHIELD STATE: LOCKED (< 5 responses) */}
      {!isUnlocked ? (
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl border border-indigo-800 space-y-6 relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mx-auto border border-indigo-400/30 shadow-inner">
            <Lock className="w-10 h-10 animate-pulse" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 uppercase tracking-wider">
              Privacy Shield Active (Locked)
            </span>
            <h3 className="text-2xl font-black text-white">
              Worker Anonymity Guaranteed
            </h3>
            <p className="text-xs text-indigo-200/90 leading-relaxed">
              Only <span className="font-extrabold text-white">{count} of {threshold}</span> required responses gathered.
              To protect vulnerable frontline employees from employer retaliation or deduplication, satisfaction scores and Gemini AI theme synthesis will remain strictly hidden until at least 5 responses are submitted.
            </p>
          </div>

          {/* Progress to unlock bar */}
          <div className="max-w-xs mx-auto space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-indigo-300">
              <span>Current: {count} responses</span>
              <span>Threshold: {threshold}</span>
            </div>
            <div className="w-full h-3 bg-indigo-950 rounded-full overflow-hidden p-0.5 border border-indigo-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (count / threshold) * 100)}%` }}
              />
            </div>
          </div>

          <div className="pt-2">
            <p className="text-[11px] text-indigo-300 italic">
              Tip: Click "Simulate +1 Worker Feedback" above to unlock and inspect the Gemini AI synthesis!
            </p>
          </div>
        </div>
      ) : (
        /* PRIVACY SHIELD STATE: UNLOCKED (>= 5 responses) */
        <div className="space-y-6">
          
          {/* Threshold Met Header Pill */}
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-950 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Privacy Shield Met: {count} verified anonymous worker submissions aggregated.</span>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-200/70 text-emerald-900 rounded-lg font-black text-[10px] uppercase">
              100% Retaliation Proof
            </span>
          </div>

          {/* Rating Radar Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Supervisor Fairness</p>
              <p className="text-3xl font-black text-slate-900">
                {feedbackAggregation.averageScores?.manager.toFixed(1)} / 5
              </p>
              <div className="flex justify-center text-amber-400">
                {'★'.repeat(Math.round(feedbackAggregation.averageScores?.manager || 4))}
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Safety & PPE</p>
              <p className="text-3xl font-black text-slate-900">
                {feedbackAggregation.averageScores?.safety.toFixed(1)} / 5
              </p>
              <div className="flex justify-center text-amber-400">
                {'★'.repeat(Math.round(feedbackAggregation.averageScores?.safety || 4))}
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Fair Overtime Pay</p>
              <p className="text-3xl font-black text-emerald-600">
                {feedbackAggregation.averageScores?.fairness.toFixed(1)} / 5
              </p>
              <div className="flex justify-center text-amber-400">
                {'★'.repeat(Math.round(feedbackAggregation.averageScores?.fairness || 4))}
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Rest & Clean Water</p>
              <p className="text-3xl font-black text-amber-600">
                {feedbackAggregation.averageScores?.restBreaks.toFixed(1)} / 5
              </p>
              <div className="flex justify-center text-amber-400">
                {'★'.repeat(Math.round(feedbackAggregation.averageScores?.restBreaks || 3))}
              </div>
            </div>
          </div>

          {/* Gemini AI Synthesis Card */}
          {feedbackAggregation.aiSummary && (
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              
              <div className="flex items-start justify-between border-b border-indigo-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      Gemini Executive Sentiment & Workplace Themes
                    </h3>
                    <p className="text-xs text-indigo-300 font-medium">
                      Synthesized across {count} anonymous worker submissions
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-extrabold uppercase">
                  Risk: {feedbackAggregation.aiSummary.workerWellbeingRisk}
                </span>
              </div>

              {/* Sentiment Summary */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                  Overall Sentiment:
                </p>
                <p className="text-sm font-semibold text-white leading-relaxed">
                  "{feedbackAggregation.aiSummary.sentiment}"
                </p>
              </div>

              {/* Two Column Breakdown: Recurring Themes & Managerial Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Recurring Themes */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    Key Recurring Worker Themes
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-200">
                    {feedbackAggregation.aiSummary.keyThemes.map((theme, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-black">•</span>
                        <span>{theme}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Managerial Action Items */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" />
                    Management Action Items (SDG 8 Alignment)
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-200">
                    {feedbackAggregation.aiSummary.managerialActionItems.map((action, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-black">✓</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
