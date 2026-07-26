import React from 'react';
import { CheckCircle, XCircle, Award, Target, RefreshCw } from 'lucide-react';

export default function QuestionContextChecklistWidget({ contextEvaluation, selectedQuestion, onSwapQuestion }) {
  const { completenessScore, detailsChecklist, feedbackMessage } = contextEvaluation;

  return (
    <div className="glass-card rounded-2xl p-5 border border-zinc-800 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-200">Question Context & Required Details</h4>
              <p className="text-xs text-zinc-400">Did your answer include all necessary context for this prompt?</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSwapQuestion && (
              <button
                onClick={onSwapQuestion}
                className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="Swap to another random question in this category"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Swap Question</span>
              </button>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full">
              <Award className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-300">{completenessScore}% Completeness</span>
            </div>
          </div>
        </div>

        {/* Question Title Bar (Full width, fully displayed with category tag) */}
        <div className="my-3.5 p-3.5 bg-zinc-950/90 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-zinc-400">Target Question:</span>
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-md">
              {selectedQuestion.category}
            </span>
          </div>
          <div className="text-sm font-semibold text-indigo-100 leading-snug sm:text-right flex-1">
            {selectedQuestion.title}
          </div>
        </div>

        {/* Required Details Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
          {detailsChecklist.map((item, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs transition-all ${
                item.isPresent 
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-zinc-200' 
                  : 'bg-rose-500/5 border-rose-500/20 text-zinc-300'
              }`}
            >
              {item.isPresent ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="font-semibold block text-zinc-100">{item.label}</span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">{item.tip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Footer */}
      <div className="pt-3 border-t border-zinc-800/80 text-xs text-zinc-300 font-sans flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
        <p className="leading-snug text-zinc-300">{feedbackMessage}</p>
      </div>
    </div>
  );
}
