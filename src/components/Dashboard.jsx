import React, { useRef, useCallback } from 'react';
import {
  Mic, BarChart2, MessageSquare, BookOpen,
  ArrowRight, Sparkles, Target
} from 'lucide-react';

/* ── Interactive 3D Tilt Card Component ────────────────────── */
function Card3D({ children, className = '', onClick }) {
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;   // 0..1
    const y = (e.clientY - r.top)  / r.height;  // 0..1
    const rotY =  (x - 0.5) * 16;  // –8..+8 deg
    const rotX = -(y - 0.5) * 12;  // –6..+6 deg
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
    el.style.boxShadow = `
      ${6 + rotY / 2}px ${6 + rotX / 2}px 0px #0F172A,
      0 16px 36px rgba(0,0,0,0.2)
    `;
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
    el.style.boxShadow = '';
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`card-3d ${className}`}
      style={{ transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s ease' }}
    >
      {children}
    </div>
  );
}

/* ── Bento Card Data with Ultra High-Contrast Badges & Icons ── */
const FEATURES = [
  {
    id: 'practice',
    Icon: Mic,
    colorClass: 'brutal-block-violet',
    title: 'Interview Practice',
    sub: 'LIVE STT & SPEECH ENGINE',
    desc: 'Practice 12 curated questions with real-time WPM pacing, STAR structure breakdown, and vocal hesitation tracking.',
    badge: '12 QUESTIONS',
    badgeBg: '!bg-[#312E81] dark:!bg-[#312E81] !text-white',
    iconBg: '!bg-[#312E81] dark:!bg-[#312E81] !text-white',
    subColor: '!text-[#4338CA] dark:!text-[#C7D2FE]',
    titleColor: '!text-[#1E1B4B] dark:!text-white',
    descColor: '!text-[#312E81] dark:!text-slate-200',
    ctaColor: '!text-[#1E1B4B] dark:!text-white',
    cta: 'Start Practicing',
  },
  {
    id: 'progress',
    Icon: BarChart2,
    colorClass: 'brutal-block-emerald',
    title: 'My Progress',
    sub: 'ANALYTICS & SCORE TRENDS',
    desc: 'Visualise confidence trends, WPM pacing history, filler rate breakdown, and performance metrics across categories.',
    badge: 'ANALYTICS',
    badgeBg: '!bg-[#064E3B] dark:!bg-[#064E3B] !text-white',
    iconBg: '!bg-[#064E3B] dark:!bg-[#064E3B] !text-white',
    subColor: '!text-[#047857] dark:!text-[#A7F3D0]',
    titleColor: '!text-[#064E3B] dark:!text-white',
    descColor: '!text-[#065F46] dark:!text-slate-200',
    ctaColor: '!text-[#064E3B] dark:!text-white',
    cta: 'View Progress',
  },
  {
    id: 'feedback',
    Icon: MessageSquare,
    colorClass: 'brutal-block-amber',
    title: 'Feedback & Reviews',
    sub: 'USER EXPERIENCE & RATING',
    desc: 'Share your feedback, rate your practice runs, and view reviews submitted by fellow interview practitioners.',
    badge: 'COMMUNITY',
    badgeBg: '!bg-[#78350F] dark:!bg-[#78350F] !text-white',
    iconBg: '!bg-[#78350F] dark:!bg-[#78350F] !text-white',
    subColor: '!text-[#B45309] dark:!text-[#FDE68A]',
    titleColor: '!text-[#713F12] dark:!text-white',
    descColor: '!text-[#78350F] dark:!text-slate-200',
    ctaColor: '!text-[#713F12] dark:!text-white',
    cta: 'Submit Review',
  },
  {
    id: 'notes',
    Icon: BookOpen,
    colorClass: 'brutal-block-rose',
    title: 'Study from Notes',
    sub: 'PDF & FILE QUESTION GENERATOR',
    desc: 'Upload study notes, PDFs, or text files — Kadence AI automatically extracts key topics and builds 8 custom questions.',
    badge: 'PDF / TXT / IMG',
    badgeBg: '!bg-[#881337] dark:!bg-[#881337] !text-white',
    iconBg: '!bg-[#881337] dark:!bg-[#881337] !text-white',
    subColor: '!text-[#BE123C] dark:!text-[#FECDD3]',
    titleColor: '!text-[#881337] dark:!text-white',
    descColor: '!text-[#9F1239] dark:!text-slate-200',
    ctaColor: '!text-[#881337] dark:!text-white',
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
      <section className="brutal-card p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/10">
        
        <div className="space-y-4 max-w-2xl text-left">
          {/* Sticker Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl brutal-badge bg-indigo-600 !text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#0F172A] -rotate-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            AI SPEECH COACHING PLATFORM
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-tight">
            Master Your Next <br className="hidden sm:inline" />
            <span className="inline-block px-4 py-1.5 bg-[#A3E635] text-slate-950 border-3 border-slate-900 shadow-[4px_4px_0px_#0F172A] rotate-1 mt-1 font-bold">
              Interview Game 🔥
            </span>
          </h1>

          <p className="text-sm sm:text-base leading-relaxed max-w-xl font-medium" style={{ color: 'var(--text-sub)' }}>
            Real-time speech transcription, STAR method scoring, WPM pacing gauge, filler word detection, and custom notes question generator.
          </p>

          <div className="flex items-center gap-4 pt-2 flex-wrap">
            <button
              onClick={() => onNavigate('practice')}
              className="btn-primary text-sm shadow-[4px_4px_0px_#0F172A]"
            >
              <Mic className="w-4 h-4" />
              Start Practicing Now
            </button>
            <button
              onClick={() => onNavigate('notes')}
              className="px-5 py-2.5 rounded-xl font-heading font-bold text-sm bg-purple-600 !text-white border-3 border-slate-900 shadow-[4px_4px_0px_#0F172A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              Upload Study Notes
            </button>
          </div>
        </div>

        {/* Hero Interactive 3D Metric Box (Vivid Amber Gold) */}
        <Card3D className="w-full md:w-76 p-6 rounded-2xl !bg-[#F59E0B] !text-slate-950 dark:!bg-[#F59E0B] dark:!text-slate-950 border-3 border-slate-900 shadow-[6px_6px_0px_#0F172A] rotate-2 shrink-0 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-black uppercase tracking-wider !bg-slate-950 !text-white px-2.5 py-1 rounded-md border border-slate-900 shadow-[1.5px_1.5px_0px_#000]">
              PRACTICE METRICS
            </span>
            <Target className="w-6 h-6 !text-slate-950" />
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-4xl font-black font-mono tracking-tight !text-slate-950">{total}</div>
              <div className="text-xs font-black uppercase tracking-wider !text-slate-950">Total Practice Sessions</div>
            </div>

            <div className="pt-2.5 border-t-2 border-slate-950/40 flex justify-between text-xs font-black !text-slate-950">
              <span>Avg Confidence:</span>
              <span className="font-mono text-sm font-black">{avgConf}%</span>
            </div>
            {avgWpm && (
              <div className="flex justify-between text-xs font-black !text-slate-950">
                <span>Avg Speaking Speed:</span>
                <span className="font-mono text-sm font-black">{avgWpm} WPM</span>
              </div>
            )}
            {avgFill !== null && (
              <div className="flex justify-between text-xs font-black !text-slate-950">
                <span>Filler Hesitation:</span>
                <span className="font-mono text-sm font-black">{avgFill}%</span>
              </div>
            )}
          </div>
        </Card3D>
      </section>

      {/* ── BENTO CARDS GRID WITH 3D TILT ─────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURES.map((f) => {
          const Icon = f.Icon;
          return (
            <Card3D
              key={f.id}
              onClick={() => onNavigate(f.id)}
              className={`p-7 cursor-pointer group ${f.colorClass} relative overflow-hidden transition-all duration-150 space-y-4`}
            >
              {/* Badge Top */}
              <div className="flex items-start justify-between">
                {/* Pop High-Contrast Icon Container */}
                <div className={`w-13 h-13 p-3 rounded-2xl ${f.iconBg} border-2.5 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_#0F172A]`}>
                  <Icon className="w-6 h-6 stroke-[2.5] !text-white" />
                </div>

                <span className={`text-[11px] font-black font-mono px-3.5 py-1.5 rounded-xl border-2.5 border-slate-900 shadow-[3px_3px_0px_#0F172A] uppercase tracking-wider ${f.badgeBg}`}>
                  {f.badge}
                </span>
              </div>

              {/* Card Body */}
              <div className="space-y-1.5">
                <span className={`text-[11px] font-mono font-black tracking-widest uppercase block ${f.subColor}`}>
                  {f.sub}
                </span>
                <h2 className={`text-2xl font-black font-heading ${f.titleColor}`}>{f.title}</h2>
                <p className={`text-xs sm:text-sm leading-relaxed font-extrabold ${f.descColor}`}>{f.desc}</p>
              </div>

              {/* Footer CTA */}
              <div className={`flex items-center gap-2 text-xs font-black font-heading group-hover:gap-3 transition-all pt-2 ${f.ctaColor}`}>
                <span>{f.cta}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </div>
            </Card3D>
          );
        })}
      </section>

    </div>
  );
}
