import React from 'react';
import { Gauge, CheckCircle2 } from 'lucide-react';

export default function WpmGauge({ wpm, status, statusColor }) {
  const hasWpm = wpm !== null && wpm !== undefined;
  const minWpm = 50, maxWpm = 220;
  const clampedWpm = hasWpm ? Math.min(Math.max(wpm, minWpm), maxWpm) : minWpm;
  const percentage = (clampedWpm - minWpm) / (maxWpm - minWpm);

  const statusStyle = 
    status === 'Optimal'       ? { bg: 'rgba(16,185,129,0.12)', color: '#34D399', border: 'rgba(16,185,129,0.35)' }
    : status === 'Too Fast'    ? { bg: 'rgba(244,63,94,0.12)',  color: '#FB7185', border: 'rgba(244,63,94,0.35)' }
    : status === 'Slightly Fast'?{ bg: 'rgba(234,179,8,0.12)',  color: '#FDE047', border: 'rgba(234,179,8,0.35)' }
    : status === 'N/A'         ? { bg: 'rgba(255,255,255,0.05)',color: '#71717A', border: 'rgba(255,255,255,0.1)' }
    :                            { bg: 'rgba(245,158,11,0.12)', color: '#FCD34D', border: 'rgba(245,158,11,0.35)' };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-full"
         style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
            <Gauge className="w-5 h-5" style={{ color: '#A78BFA' }} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-200">WPM Gauge</h4>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Words Per Minute</p>
          </div>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}
        >
          {status || 'N/A'}
        </span>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative flex flex-col items-center justify-center my-4">
        <svg className="w-48 h-24 overflow-visible" viewBox="0 0 200 100">
          {/* Track */}
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none"
                stroke="rgba(255,255,255,0.05)" strokeWidth="16" strokeLinecap="round" />
          {/* Sweet-spot 120–160 WPM */}
          <path d="M 101 21 A 80 80 0 0 1 143 35" fill="none"
                stroke="rgba(16,185,129,0.3)" strokeWidth="16" />
          {/* Value arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={hasWpm ? 'url(#wpmGrad)' : 'rgba(255,255,255,0.06)'}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={hasWpm ? 251.2 * (1 - percentage) : 251.2}
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="wpmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#7C3AED" />
              <stop offset="45%"  stopColor="#10B981" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute bottom-0 text-center translate-y-1">
          {hasWpm ? (
            <>
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">{wpm}</span>
              <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>WPM</span>
            </>
          ) : (
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Record first</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1.5 font-medium" style={{ color: '#34D399' }}>
          <CheckCircle2 className="w-3.5 h-3.5" /> 120–160 WPM Optimal
        </span>
        <span className="font-mono" style={{ color: 'var(--text-muted)' }}>50–220 scale</span>
      </div>
    </div>
  );
}
