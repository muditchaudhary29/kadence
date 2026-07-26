import React from 'react';
import { Gauge, CheckCircle2 } from 'lucide-react';

export default function WpmGauge({ wpm, status, statusColor }) {
  const hasWpm = wpm !== null && wpm !== undefined;
  const minWpm = 50, maxWpm = 220;
  const clampedWpm = hasWpm ? Math.min(Math.max(wpm, minWpm), maxWpm) : minWpm;
  const percentage = (clampedWpm - minWpm) / (maxWpm - minWpm);

  return (
    <div className="brutal-card p-6 flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold font-heading">WPM Pacing Gauge</h4>
            <p className="text-xs text-zinc-400">Words Per Minute</p>
          </div>
        </div>
        <span className="brutal-badge bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-xs font-bold">
          {status || 'N/A'}
        </span>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative flex flex-col items-center justify-center my-4">
        <svg className="w-48 h-24 overflow-visible" viewBox="0 0 200 100">
          {/* Track */}
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none"
                stroke="var(--border-brutal)" strokeWidth="18" strokeLinecap="round" />
          {/* Sweet-spot 120–160 WPM */}
          <path d="M 101 21 A 80 80 0 0 1 143 35" fill="none"
                stroke="#10B981" strokeWidth="18" opacity="0.4" />
          {/* Value arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={hasWpm ? 'url(#wpmGrad)' : 'var(--border-brutal)'}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={hasWpm ? 251.2 * (1 - percentage) : 251.2}
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="wpmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#6366F1" />
              <stop offset="45%"  stopColor="#10B981" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute bottom-0 text-center translate-y-1">
          {hasWpm ? (
            <div className="font-mono">
              <span className="text-3xl font-extrabold font-heading tracking-tight">{wpm}</span>
              <span className="text-xs ml-1 font-bold text-zinc-400">WPM</span>
            </div>
          ) : (
            <span className="text-xs font-bold text-zinc-400">Record to calculate</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t-2 border-slate-700 text-xs font-medium">
        <span className="flex items-center gap-1.5 font-bold text-emerald-400">
          <CheckCircle2 className="w-4 h-4" /> 120–160 WPM Optimal
        </span>
        <span className="font-mono text-zinc-400">50–220 scale</span>
      </div>
    </div>
  );
}
