import React, { useState } from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import {
  Lock,
  ShieldCheck,
  Star,
  CheckCircle2,
  HeartHandshake,
  Send,
  Info
} from 'lucide-react';

interface FeedbackModalProps {
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
  const { currentSector, currentWorker, submitFeedback, t } = useFairShift();

  const [ratingManager, setRatingManager] = useState<number>(4);
  const [ratingSafety, setRatingSafety] = useState<number>(4);
  const [ratingFairness, setRatingFairness] = useState<number>(5);
  const [ratingRestBreaks, setRatingRestBreaks] = useState<number>(3);
  const [comments, setComments] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await submitFeedback({
      department: currentWorker.department,
      ratingManager,
      ratingSafety,
      ratingFairness,
      ratingRestBreaks,
      comments
    });

    setIsSubmitting(false);
    if (res.success) {
      setSubmitted(true);
    }
  };

  const renderStars = (value: number, setter: (val: number) => void) => {
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setter(star)}
            className="p-1 text-slate-300 hover:text-amber-400 focus:outline-hidden transition-colors"
          >
            <Star
              className={`w-6 h-6 sm:w-7 sm:h-7 ${
                star <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-slate-700 ml-2">
          {value === 5 ? 'Excellent' : value === 4 ? 'Good' : value === 3 ? 'Fair' : value === 2 ? 'Poor' : 'Critical Issue'}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 border border-slate-200 shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {t.feedbackTitle}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Retaliation-Proof Worker Voice
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

        {/* Privacy Shield Active Banner */}
        <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-950 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-indigo-900">
              Zero User ID Privacy Shield
            </p>
            <p className="text-[11px] text-indigo-800/90 mt-0.5 leading-relaxed">
              {t.privacyShieldNotice}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Feedback Safely Logged
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              {t.feedbackSubmittedNotice} Your evaluation is blended into the collective aggregate without identifying metadata.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
            >
              {t.done}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Criteria 1: Manager Fairness */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                1. {t.ratingManagerLabel}
              </label>
              <p className="text-[11px] text-slate-500">
                Does your supervisor treat workers with dignity and respect?
              </p>
              {renderStars(ratingManager, setRatingManager)}
            </div>

            {/* Criteria 2: Safety & Hygiene */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                2. {t.ratingSafetyLabel}
              </label>
              <p className="text-[11px] text-slate-500">
                Are boots, helmets, gloves, and hygienic facilities provided?
              </p>
              {renderStars(ratingSafety, setRatingSafety)}
            </div>

            {/* Criteria 3: Fair Overtime Distribution */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                3. {t.ratingFairnessLabel}
              </label>
              <p className="text-[11px] text-slate-500">
                Are shifts and overtime distributed equally without favoritism?
              </p>
              {renderStars(ratingFairness, setRatingFairness)}
            </div>

            {/* Criteria 4: Rest Breaks & Clean Water */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                4. {t.ratingRestLabel}
              </label>
              <p className="text-[11px] text-slate-500">
                Are rest breaks honored with cold drinking water in the shade?
              </p>
              {renderStars(ratingRestBreaks, setRatingRestBreaks)}
            </div>

            {/* Optional Comments */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.additionalCommentsOptional}
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share any details for upper management without fear of identification..."
                rows={3}
                className="w-full p-3 text-xs border border-slate-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{t.submitFeedback}</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
