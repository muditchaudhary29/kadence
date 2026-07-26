import React, { useState } from 'react';
import {
  BarChart2, TrendingUp, Mic, Clock, Award,
  Zap, Flame, Target, ChevronDown, ChevronUp, Trash2
} from 'lucide-react';
import { deleteSession } from '../utils/storage';

function StatBar({ label, value, max, color, unit = '' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-bold font-mono">
        <span className="opacity-80">{label}</span>
        <span className="font-extrabold">{value}{unit}</span>
      </div>
      <div className="h-3 neu-inset rounded-lg overflow-hidden p-0.5">
        <div
          className={`h-full rounded-md transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function SessionRow({ session, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(session.date);
  const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const confColor = session.confidenceScore >= 75 ? 'text-emerald-400' : session.confidenceScore >= 55 ? 'text-amber-400' : 'text-rose-400';
  const compColor = session.completenessScore >= 75 ? 'text-emerald-400' : session.completenessScore >= 50 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="brutal-card overflow-hidden transition-all">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 p-4 text-left font-sans hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <div className="p-2.5 bg-indigo-500 text-white rounded-xl border-2 border-slate-900 shrink-0 shadow-[2px_2px_0px_#000]">
          <Mic className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold font-heading truncate">{session.questionTitle}</div>
          <div className="text-xs opacity-75 font-mono mt-0.5">{session.category} · {dateStr} {timeStr}</div>
        </div>
        <div className="flex items-center gap-4 shrink-0 font-mono">
          <span className={`text-sm font-black ${confColor}`}>{session.confidenceScore}%</span>
          <span className="text-xs font-bold opacity-75">{session.wpm ? `${session.wpm} WPM` : '—'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t-2 border-slate-700 pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Confidence', value: `${session.confidenceScore}%`, color: confColor },
              { label: 'Completeness', value: `${session.completenessScore}%`, color: compColor },
              { label: 'WPM Pace', value: session.wpm ? `${session.wpm}` : '—', color: 'text-cyan-400' },
              { label: 'Filler Rate', value: `${session.fillerRate ?? '0'}%`, color: session.fillerRate <= 3 ? 'text-emerald-400' : 'text-amber-400' },
            ].map(m => (
              <div key={m.label} className="neu-inset p-3 text-center rounded-xl">
                <div className={`text-lg font-black font-mono ${m.color}`}>{m.value}</div>
                <div className="text-[10px] font-bold uppercase opacity-75 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
          {session.transcript && (
            <div className="neu-inset p-3 text-xs font-mono leading-relaxed border-2 border-slate-900 rounded-xl">
              <span className="font-bold uppercase block mb-1 opacity-75">Transcript Excerpt:</span>
              "{session.transcript.slice(0, 220)}{session.transcript.length > 220 ? '...' : ''}"
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => onDelete(session.id)}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProgressPage({ sessions: initialSessions, profile }) {
  const [sessions, setSessions] = useState(initialSessions);

  const handleDelete = (id) => {
    deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const recent = sessions.slice(0, 7);
  const avgConf = recent.length ? Math.round(recent.reduce((a, s) => a + (s.confidenceScore || 0), 0) / recent.length) : 0;
  const avgWpm  = recent.filter(s => s.wpm).length
    ? Math.round(recent.filter(s => s.wpm).reduce((a, s) => a + s.wpm, 0) / recent.filter(s => s.wpm).length)
    : 0;
  const avgFill = recent.length
    ? parseFloat((recent.reduce((a, s) => a + (s.fillerRate || 0), 0) / recent.length).toFixed(1))
    : 0;
  const avgComp = recent.length
    ? Math.round(recent.reduce((a, s) => a + (s.completenessScore || 0), 0) / recent.length)
    : 0;

  const catCounts = {};
  sessions.forEach(s => { catCounts[s.category] = (catCounts[s.category] || 0) + 1; });
  const catMax = Math.max(...Object.values(catCounts), 1);

  const trend = sessions.length >= 2
    ? (sessions[0]?.confidenceScore || 0) - (sessions[sessions.length - 1]?.confidenceScore || 0)
    : null;

  if (sessions.length === 0) {
    return (
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center text-center space-y-4">
        <div className="brutal-card p-6 rounded-2xl bg-amber-400 text-slate-900">
          <BarChart2 className="w-12 h-12 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold font-heading">No sessions recorded yet</h2>
        <p className="text-sm max-w-xs opacity-80">
          Complete your first practice session in <strong>Interview Practice</strong> and your progress analytics will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h2 className="text-3xl font-black font-heading">My Progress Analytics</h2>
        <p className="text-sm font-mono mt-1 opacity-80">{sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded in history</p>
      </div>

      {/* Metric Summary Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avg Confidence',   value: `${avgConf}%`, icon: Award, colorClass: 'bg-indigo-500 text-white' },
          { label: 'Avg WPM Speed',    value: avgWpm || '—', icon: Zap,   colorClass: 'bg-cyan-500 text-slate-900' },
          { label: 'Filler Rate',      value: `${avgFill}%`, icon: Flame, colorClass: 'bg-rose-500 text-white' },
          { label: 'Avg Completeness', value: `${avgComp}%`, icon: Target, colorClass: 'bg-emerald-500 text-slate-900' },
        ].map(m => (
          <div key={m.label} className="brutal-card p-5 flex flex-col gap-3">
            <div className={`p-2.5 w-fit rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#000] ${m.colorClass}`}>
              <m.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl font-black font-mono tracking-tight">{m.value}</div>
              <div className="text-xs font-bold uppercase opacity-80 mt-0.5">{m.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Trend & Category Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score trend over last 7 sessions */}
        <div className="brutal-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-bold font-heading">Confidence Score Trend</h3>
            </div>
            {trend !== null && (
              <span className={`brutal-badge text-xs font-mono font-bold ${trend >= 0 ? 'bg-emerald-500 text-slate-900' : 'bg-rose-500 text-white'}`}>
                {trend >= 0 ? '+' : ''}{trend}% vs start
              </span>
            )}
          </div>
          <div className="space-y-3">
            {recent.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold opacity-75 w-6 shrink-0">#{sessions.length - i}</span>
                <div className="flex-1 h-3 neu-inset rounded-lg overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md transition-all"
                    style={{ width: `${s.confidenceScore || 0}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-black w-10 text-right">{s.confidenceScore || 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="brutal-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold font-heading">Practice by Category</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(catCounts).map(([cat, count]) => (
              <StatBar
                key={cat}
                label={cat}
                value={count}
                max={catMax}
                color="bg-gradient-to-r from-emerald-500 to-teal-500"
                unit=" sessions"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Per-metric bars */}
      <section className="brutal-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-500" />
          <h3 className="text-base font-bold font-heading">Aggregate Performance Metrics</h3>
        </div>
        <div className="space-y-4">
          <StatBar label="Answer Completeness" value={avgComp} max={100} color="bg-gradient-to-r from-purple-500 to-pink-500" unit="%" />
          <StatBar label="Vocal Confidence"     value={avgConf} max={100} color="bg-gradient-to-r from-indigo-500 to-blue-500" unit="%" />
          <StatBar label="Speaking Speed (WPM)" value={avgWpm}  max={200} color="bg-gradient-to-r from-cyan-500 to-teal-500"   unit=" WPM" />
        </div>
      </section>

      {/* Session History */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold font-heading">Session History Timeline</h3>
        <div className="space-y-3">
          {sessions.map(s => (
            <SessionRow key={s.id} session={s} onDelete={handleDelete} />
          ))}
        </div>
      </section>
    </div>
  );
}
