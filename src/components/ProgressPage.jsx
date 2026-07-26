import React, { useState } from 'react';
import {
  BarChart2, TrendingUp, TrendingDown, Mic, Clock, Award,
  Zap, Flame, Target, ChevronDown, ChevronUp, Trash2
} from 'lucide-react';
import { deleteSession } from '../utils/storage';

function StatBar({ label, value, max, color, unit = '' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="font-semibold text-zinc-200">{value}{unit}</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
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
    <div className="border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-zinc-900/50 transition-colors"
      >
        <div className="p-2 bg-zinc-800 rounded-lg shrink-0">
          <Mic className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-zinc-200 truncate">{session.questionTitle}</div>
          <div className="text-xs text-zinc-500 mt-0.5">{session.category} · {dateStr} {timeStr}</div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className={`text-sm font-bold font-mono ${confColor}`}>{session.confidenceScore}%</span>
          <span className="text-xs text-zinc-500">{session.wpm ? `${session.wpm} WPM` : '—'}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-zinc-800/60 pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Confidence', value: `${session.confidenceScore}%`, color: confColor },
              { label: 'Completeness', value: `${session.completenessScore}%`, color: compColor },
              { label: 'WPM', value: session.wpm ? `${session.wpm}` : '—', color: 'text-cyan-400' },
              { label: 'Fillers', value: `${session.fillerRate ?? '0'}%`, color: session.fillerRate <= 3 ? 'text-emerald-400' : 'text-amber-400' },
            ].map(m => (
              <div key={m.label} className="bg-zinc-900 rounded-xl p-3 text-center">
                <div className={`text-lg font-bold font-mono ${m.color}`}>{m.value}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
          {session.transcript && (
            <div className="bg-zinc-900/60 rounded-xl p-3 text-xs text-zinc-400 leading-relaxed border border-zinc-800">
              <span className="text-zinc-500 font-semibold block mb-1">Transcript excerpt</span>
              {session.transcript.slice(0, 200)}{session.transcript.length > 200 ? '...' : ''}
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => onDelete(session.id)}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
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

  // Category breakdown
  const catCounts = {};
  sessions.forEach(s => { catCounts[s.category] = (catCounts[s.category] || 0) + 1; });
  const catMax = Math.max(...Object.values(catCounts), 1);

  // Trend
  const trend = sessions.length >= 2
    ? (sessions[0]?.confidenceScore || 0) - (sessions[sessions.length - 1]?.confidenceScore || 0)
    : null;

  if (sessions.length === 0) {
    return (
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800">
          <BarChart2 className="w-10 h-10 text-zinc-600 mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-zinc-200">No sessions yet</h2>
        <p className="text-sm text-zinc-400 max-w-xs">
          Complete your first practice session in <strong className="text-zinc-200">Interview Practice</strong> and your progress will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-100">My Progress</h2>
        <p className="text-sm text-zinc-400 mt-1">{sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded</p>
      </div>

      {/* Metric Summary Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avg Confidence', value: `${avgConf}%`, icon: Award, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Avg WPM',        value: avgWpm || '—', icon: Zap,   color: 'text-cyan-400',   bg: 'bg-cyan-500/10' },
          { label: 'Filler Rate',    value: `${avgFill}%`, icon: Flame, color: avgFill <= 3 ? 'text-emerald-400' : 'text-amber-400', bg: avgFill <= 3 ? 'bg-emerald-500/10' : 'bg-amber-500/10' },
          { label: 'Avg Completeness', value: `${avgComp}%`, icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map(m => (
          <div key={m.label} className="glass-card rounded-2xl p-5 border border-zinc-800 flex flex-col gap-3">
            <div className={`p-2 w-fit rounded-lg ${m.bg}`}>
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <div>
              <div className={`text-2xl font-extrabold font-mono ${m.color}`}>{m.value}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{m.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Trend & Category Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score trend over last 7 sessions */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-zinc-200">Confidence Trend</h3>
            </div>
            {trend !== null && (
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {trend >= 0 ? '+' : ''}{trend}% vs start
              </span>
            )}
          </div>
          <div className="space-y-2.5">
            {recent.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-500 w-6 shrink-0">#{sessions.length - i}</span>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                    style={{ width: `${s.confidenceScore || 0}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-zinc-300 w-10 text-right">{s.confidenceScore || 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Practice by Category</h3>
          </div>
          <div className="space-y-3">
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

      {/* Per-metric bars for last 7 sessions */}
      <section className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Last {recent.length} Session Metrics</h3>
        </div>
        <div className="space-y-3">
          <StatBar label="Answer Completeness" value={avgComp} max={100} color="bg-gradient-to-r from-purple-500 to-pink-500" unit="%" />
          <StatBar label="Vocal Confidence"     value={avgConf} max={100} color="bg-gradient-to-r from-indigo-500 to-blue-500" unit="%" />
          <StatBar label="Speaking Pace (WPM)"  value={avgWpm}  max={200} color="bg-gradient-to-r from-cyan-500 to-teal-500"   unit=" wpm" />
        </div>
      </section>

      {/* Session History */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-300">Session History</h3>
        <div className="space-y-2">
          {sessions.map(s => (
            <SessionRow key={s.id} session={s} onDelete={handleDelete} />
          ))}
        </div>
      </section>
    </div>
  );
}
