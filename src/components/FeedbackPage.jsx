import React, { useState } from 'react';
import {
  MessageSquare, Award, TrendingUp, TrendingDown, Mic,
  CheckCircle2, AlertCircle, Star, User, Target, Zap, Flame
} from 'lucide-react';

const CAT_COLORS = {
  'General / Intro':            'text-indigo-400  bg-indigo-500/10  border-indigo-500/30',
  'Behavioral':                 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'Leadership & Communication': 'text-purple-400  bg-purple-500/10  border-purple-500/30',
  'System Design':              'text-amber-400   bg-amber-500/10   border-amber-500/30',
};

function ProfileCard({ profile, sessions }) {
  if (!profile || sessions.length === 0) return null;

  const trend = sessions.length >= 2
    ? (sessions[0]?.confidenceScore || 0) - (sessions[sessions.length - 1]?.confidenceScore || 0)
    : null;

  const bestSession = [...sessions].sort((a, b) => (b.confidenceScore || 0) - (a.confidenceScore || 0))[0];
  const catCounts = {};
  sessions.forEach(s => { catCounts[s.category] = (catCounts[s.category] || 0) + 1; });
  const favCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="glass-card rounded-2xl p-6 border border-zinc-800 space-y-5">
      {/* Avatar row */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
            <User className="w-7 h-7 text-indigo-400" />
          </div>
        </div>
        <div>
          <div className="text-lg font-extrabold text-zinc-100">Interview Practitioner</div>
          <div className="text-xs text-zinc-400">{profile.totalSessions} sessions completed</div>
        </div>
        {trend !== null && (
          <div className={`ml-auto flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full ${trend >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Avg Confidence', value: `${profile.avgConfidence}%`, icon: Award, color: 'text-indigo-400' },
          { label: 'Avg WPM',        value: profile.avgWpm || '—',       icon: Zap,   color: 'text-cyan-400' },
          { label: 'Avg Fillers',    value: `${profile.avgFiller}%`,     icon: Flame, color: profile.avgFiller <= 3 ? 'text-emerald-400' : 'text-amber-400' },
          { label: 'Best Score',     value: `${bestSession?.confidenceScore || 0}%`, icon: Star, color: 'text-yellow-400' },
        ].map(m => (
          <div key={m.label} className="bg-zinc-900/60 rounded-xl p-3 border border-zinc-800 text-center">
            <m.icon className={`w-4 h-4 ${m.color} mx-auto mb-1.5`} />
            <div className={`text-xl font-extrabold font-mono ${m.color}`}>{m.value}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Favourite category */}
      {favCat && (
        <div className="flex items-center justify-between text-xs px-3 py-2 bg-zinc-900/60 rounded-xl border border-zinc-800">
          <span className="text-zinc-400">Most practiced category</span>
          <span className={`font-semibold px-2 py-0.5 rounded-full border text-[10px] ${CAT_COLORS[favCat] || 'text-zinc-400 bg-zinc-800 border-zinc-700'}`}>
            {favCat}
          </span>
        </div>
      )}
    </div>
  );
}

function FeedbackCard({ session }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(session.date);
  const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const catClass = CAT_COLORS[session.category] || 'text-zinc-400 bg-zinc-800 border-zinc-700';
  const confColor = session.confidenceScore >= 75 ? 'text-emerald-400' : session.confidenceScore >= 55 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="glass-card rounded-2xl border border-zinc-800 hover:border-zinc-700 overflow-hidden transition-all">
      {/* Header row */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <div className={`p-2.5 rounded-xl border ${catClass} shrink-0`}>
          <Mic className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-zinc-200 truncate">{session.questionTitle}</div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catClass}`}>{session.category}</span>
            <span className="text-xs text-zinc-500">{dateStr}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className={`text-2xl font-extrabold font-mono ${confColor}`}>{session.confidenceScore}%</div>
          <div className="text-[10px] text-zinc-500">confidence</div>
        </div>
      </button>

      {/* Expanded feedback */}
      {expanded && (
        <div className="border-t border-zinc-800/80 px-5 pb-5 pt-4 space-y-5">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Completeness', value: `${session.completenessScore}%`, color: session.completenessScore >= 75 ? 'text-emerald-400' : 'text-amber-400' },
              { label: 'WPM', value: session.wpm ? `${session.wpm}` : '—', color: 'text-cyan-400' },
              { label: 'Fillers', value: `${session.fillerRate ?? 0}%`, color: session.fillerRate <= 3 ? 'text-emerald-400' : 'text-amber-400' },
            ].map(m => (
              <div key={m.label} className="bg-zinc-900 rounded-xl p-3 text-center border border-zinc-800">
                <div className={`text-lg font-bold font-mono ${m.color}`}>{m.value}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Strengths */}
          {session.strengths?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
              </h4>
              <div className="space-y-2">
                {session.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl text-xs text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Areas for improvement */}
          {session.areasForImprovement?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Areas for Improvement
              </h4>
              <div className="space-y-2">
                {session.areasForImprovement.map((a, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl text-xs text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transcript excerpt */}
          {session.transcript && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-zinc-500">Your response</h4>
              <div className="bg-zinc-900/60 rounded-xl p-3 text-xs text-zinc-400 leading-relaxed border border-zinc-800 italic">
                "{session.transcript.slice(0, 300)}{session.transcript.length > 300 ? '…' : ''}"
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FeedbackPage({ sessions, profile }) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800">
          <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-zinc-200">No feedback yet</h2>
        <p className="text-sm text-zinc-400 max-w-xs">
          Complete a practice session and your detailed AI feedback will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-100">Profile & Feedback</h2>
        <p className="text-sm text-zinc-400 mt-1">Your progress snapshot and session-by-session AI coaching.</p>
      </div>

      {/* Profile summary card */}
      <ProfileCard profile={profile} sessions={sessions} />

      {/* Session feedback cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-400" />
          Session Feedback History
        </h3>
        {sessions.map(s => (
          <FeedbackCard key={s.id} session={s} />
        ))}
      </div>
    </div>
  );
}
