import React from 'react';
import { CheckCircle, XCircle, Award, Target, RefreshCw } from 'lucide-react';

export default function QuestionContextChecklistWidget({ contextEvaluation, selectedQuestion, onSwapQuestion }) {
  const { completenessScore, detailsChecklist, feedbackMessage } = contextEvaluation;

  return (
    <div className="brutal-card p-6 flex flex-col justify-between space-y-4">
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_#0F172A] shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-black font-heading leading-tight">Question Context & Required Details</h4>
              <p className="text-xs font-semibold opacity-80 mt-0.5">Did your response cover key STAR points for this interview prompt?</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onSwapQuestion && (
              <button
                onClick={onSwapQuestion}
                className="px-4 py-2 bg-amber-400 text-slate-950 border-2 border-slate-900 rounded-xl text-xs font-black font-heading flex items-center gap-1.5 shadow-[3px_3px_0px_#0F172A] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                title="Swap to another random question in this category"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Swap Question</span>
              </button>
            )}
            <div className="brutal-badge bg-indigo-600 !text-white border-2 border-slate-900 px-3.5 py-1.5 text-xs font-black shadow-[3px_3px_0px_#0F172A]">
              <Award className="w-4 h-4 text-amber-300" />
              <span>{completenessScore}% Completeness</span>
            </div>
          </div>
        </div>

        {/* Target Question Banner */}
        <div className="my-4 p-4 brutal-block-violet rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-extrabold uppercase tracking-wider">TARGET QUESTION:</span>
            <span className="brutal-badge bg-indigo-600 !text-white text-[10px] font-black border border-slate-900">
              {selectedQuestion.category}
            </span>
          </div>
          <div className="text-base font-extrabold font-heading leading-snug sm:text-right flex-1">
            {selectedQuestion.title}
          </div>
        </div>

        {/* Required Details Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
          {detailsChecklist.map((item, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border-2 flex items-start gap-3.5 text-xs transition-all shadow-[2px_2px_0px_#0F172A] ${
                item.isPresent 
                  ? 'bg-emerald-500/15 dark:bg-emerald-500/20 border-emerald-600' 
                  : 'bg-rose-500/15 dark:bg-rose-500/20 border-rose-600'
              }`}
            >
              {item.isPresent ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
              )}
              <div>
                <span className={`font-black font-heading text-sm block leading-snug ${
                  item.isPresent
                    ? 'text-emerald-950 dark:text-emerald-200'
                    : 'text-rose-950 dark:text-rose-200'
                }`}>
                  {item.label}
                </span>
                <span className={`text-xs font-semibold block mt-1 leading-relaxed ${
                  item.isPresent
                    ? 'text-emerald-900/90 dark:text-emerald-300/90'
                    : 'text-rose-900/90 dark:text-rose-300/90'
                }`}>
                  {item.tip}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Footer */}
      <div className="pt-3.5 border-t-2 border-slate-700 text-xs font-bold flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-indigo-600 shrink-0 border border-slate-900" />
        <p className="leading-snug">{feedbackMessage}</p>
      </div>
    </div>
  );
}
