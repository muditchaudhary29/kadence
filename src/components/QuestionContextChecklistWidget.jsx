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
              <p className="text-xs font-semibold opacity-90 mt-0.5">Did your response cover key STAR points for this interview prompt?</p>
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

        {/* Required Details Checklist Grid (Red tiles get red text, Green tiles get green text) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
          {detailsChecklist.map((item, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border-3 flex items-start gap-3.5 text-xs transition-all shadow-[3px_3px_0px_#0F172A] ${
                item.isPresent 
                  ? '!bg-[#DCFCE7] dark:!bg-[#064E3B] !border-slate-900' 
                  : '!bg-[#FFE4E6] dark:!bg-[#881337] !border-slate-900'
              }`}
            >
              {item.isPresent ? (
                <CheckCircle className="w-5 h-5 !text-[#047857] dark:!text-[#DCFCE7] mt-0.5 shrink-0 stroke-[2.5]" />
              ) : (
                <XCircle className="w-5 h-5 !text-[#BE123C] dark:!text-[#FFE4E6] mt-0.5 shrink-0 stroke-[2.5]" />
              )}
              <div>
                <span className={`font-black font-heading text-sm block leading-snug ${
                  item.isPresent
                    ? '!text-[#064E3B] dark:!text-[#DCFCE7]'
                    : '!text-[#991B1B] dark:!text-[#FFE4E6]'
                }`}>
                  {item.label}
                </span>
                <span className={`text-xs font-extrabold block mt-1 leading-relaxed ${
                  item.isPresent
                    ? '!text-[#047857] dark:!text-[#A7F3D0]'
                    : '!text-[#9F1239] dark:!text-[#FECDD3]'
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
