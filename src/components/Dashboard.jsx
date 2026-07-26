import React from 'react';
import {
  Mic, BarChart2, MessageSquare, BookOpen,
  ArrowRight, Sparkles, Star, TrendingUp, Zap, Target
} from 'lucide-react';

/* ── Bento Card Data with Neo-Brutalism Colors ──────────────── */
const FEATURES = [
  {
    id: 'practice',
    Icon: Mic,
    colorClass: 'brutal-block-violet',
    accentText: 'text-indigo-400',
    title: 'Interview Practice',
    sub: 'LIVE STT & SPEECH ENGINE',
    desc: 'Practice 12 curated questions with real-time WPM pacing, STAR structure breakdown, and vocal hesitation tracking.',
    badge: '12 QUESTIONS',
    badgeBg: 'bg-indigo-500 text-white',
    cta: 'Start Practicing',
  },
  {
    id: 'progress',
    Icon: BarChart2,
    colorClass: 'brutal-block-emerald',
    accentText: 'text-emerald-400',
    title: 'My Progress',
    sub: 'ANALYTICS & SCORE TRENDS',
    desc: 'Visualise confidence trends, WPM pacing history, filler rate breakdown, and performance metrics across categories.',
    badge: 'ANALYTICS',
    badgeBg: 'bg-emerald-500 text-white',
    cta: 'View Progress',
  },
  {
    id: 'feedback',
    Icon: MessageSquare,
    colorClass: 'brutal-block-amber',
    accentText: 'text-amber-400',
    title: 'Feedback & Reviews',
    sub: 'USER EXPERIENCE & RATING',
    desc: 'Share your feedback, rate your practice runs, and view reviews submitted by fellow interview practitioners.',
    badge: 'COMMUNITY',
    badgeBg: 'bg-amber-500 text-black',
    cta: 'Submit Review',
  },
  {
    id: 'notes',
    Icon: BookOpen,
    colorClass: 'brutal-block-rose',
    accentText: 'text-rose-400',
    title: 'Study from Notes',
    sub: 'PDF & FILE QUESTION GENERATOR',
    desc: 'Upload study notes, PDFs, or text files — Kadence AI automatically extracts key topics and builds 8 custom questions.',
    badge: 'PDF / TXT / IMG',
    badgeBg: 'bg-rose-500 text-white',
    cta: 'Upload Notes',
  },
];

export default function Dashboard({ onNavigate, profile, recentSessions = [] }) {
  const total = profile?.totalSessions || 0;
  const avgConf = profile?.avgConfidence || 0;
  const avgWpm  = profile?.avgWpm || null;
  const avgFill = profile?.avgFiller ?? null;

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">

      {/* ── HERO BENTO HEADER ────────────────────────────────────── */}
      <section className="brutal-card p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-amber-500/10">
        
        <div className="space-y-4 max-w-2xl text-left">
          {/* Sticker Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg brutal-badge bg-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] -rotate-1">
            <Sparkles className="w-3.5 h-3.5" />
            AI SPEECH COACHING PLATFORM
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-tight">
            Master Your Next <br className="hidden sm:inline" />
            <span className="inline-block px-3 py-1 bg-amber-400 text-black border-2 border-slate-900 shadow-[4px_4px_0px_#000] rotate-1 mt-1">
              Interview Game
            </span>
          </h1>

          <p className="text-sm sm:text-base leading-relaxed max-w-xl text-zinc-300">
            Real-time speech transcription, STAR method scoring, WPM pacing gauge, filler detection, and custom notes question generation.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              onClick={() => onNavigate('practice')}
              className="btn-primary text-sm shadow-[4px_4px_0px_#000]"
            >
              <Mic className="w-4 h-4" />
              Start Practicing Now
            </button>
            <button
              onClick={() => onNavigate('notes')}
              className="px-5 py-2.5 rounded-xl font-heading font-bold text-sm bg-zinc-900 border-2 border-slate-900 shadow-[3px_3px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Study Notes
            </button>
          </div>
        </div>

        {/* Hero Metric Box */}
        <div className="w-full md:w-72 brutal-card p-6 bg-amber-400 text-slate-900 border-3 border-slate-900 shadow-[6px_6px_0px_#000] rotate-2 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded">
              PRACTICE STATS
            </span>
            <Target className="w-5 h-5 text-slate-900" />
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-4xl font-black font-mono tracking-tight">{total}</div>
              <div className="text-xs font-bold uppercase">Sessions Completed</div>
            </div>

            <div className="pt-2 border-t-2 border-slate-900 flex justify-between text-xs font-bold">
              <span>Avg Confidence:</span>
              <span className="font-mono">{avgConf}%</span>
            </div>
            {avgWpm && (
              <div className="flex justify-between text-xs font-bold">
                <span>Avg Speaking Pace:</span>
                <span className="font-mono">{avgWpm} WPM</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── BENTO CARDS GRID ───────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURES.map((f, idx) => {
          const Icon = f.Icon;
          const rotateClass = idx % 2 === 0 ? '-rotate-1' : 'rotate-1';
          return (
            <div
              key={f.id}
              onClick={() => onNavigate(f.id)}
              className={`brutal-card p-7 cursor-pointer group ${f.colorClass} relative overflow-hidden transition-all duration-150`}
            >
              {/* Badge Top */}
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_#000]">
                  <Icon className="w-6 h-6" />
                </div>

                <span className={`text-[10px] font-bold font-mono px-3 py-1 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_#000] uppercase tracking-wider ${f.badgeBg} ${rotateClass}`}>
                  {f.badge}
                </span>
              </div>

              {/* Card Body */}
              <div className="space-y-2 mb-6">
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase opacity-80 block">
                  {f.sub}
                </span>
                <h2 className="text-2xl font-bold font-heading">{f.title}</h2>
                <p className="text-xs sm:text-sm leading-relaxed opacity-90">{f.desc}</p>
              </div>

              {/* Footer CTA */}
              <div className="flex items-center gap-2 text-xs font-extrabold font-heading group-hover:gap-3 transition-all">
                <span>{f.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
}
