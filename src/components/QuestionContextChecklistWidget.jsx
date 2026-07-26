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
            <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold font-heading">Question Context & Required Details</h4>
              <p className="text-xs text-zinc-400">Did your response cover key STAR points for this interview prompt?</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onSwapQuestion && (
              <button
                onClick={onSwapQuestion}
                className="px-3.5 py-1.5 bg-amber-400 text-slate-900 border-2 border-slate-900 rounded-xl text-xs font-bold font-heading flex items-center gap-1.5 shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                title="Swap to another random question in this category"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Swap Question</span>
              </button>
            )}
            <div className="brutal-badge bg-indigo-500/20 text-indigo-300 border-indigo-500/40 px-3 py-1 text-xs">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>{completenessScore}% Completeness</span>
            </div>
          </div>
        </div>

        {/* Target Question Banner */}
        <div className="my-4 p-4 brutal-block-violet rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">TARGET QUESTION:</span>
            <span className="brutal-badge bg-indigo-500 text-white text-[10px]">
              {selectedQuestion.category}
            </span>
          </div>
          <div className="text-sm font-bold font-heading leading-snug sm:text-right flex-1">
            {selectedQuestion.title}
          </div>
        </div>

        {/* Required Details Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
          {detailsChecklist.map((item, idx) => (
            <div 
              key={idx} 
              className={`p-3.5 rounded-xl border-2 flex items-start gap-3 text-xs transition-all ${
                item.isPresent 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-zinc-100' 
                  : 'bg-rose-500/10 border-rose-500/30 text-zinc-200'
              }`}
            >
              {item.isPresent ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="font-bold font-heading text-sm block">{item.label}</span>
                <span className="text-xs text-zinc-400 block mt-0.5">{item.tip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Footer */}
      <div className="pt-3 border-t-2 border-slate-700/80 text-xs font-medium flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0" />
        <p className="leading-snug">{feedbackMessage}</p>
      </div>
    </div>
  );
}
