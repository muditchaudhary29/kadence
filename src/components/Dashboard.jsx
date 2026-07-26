import React, { useRef, useCallback } from 'react';
import {
  Mic, BarChart2, MessageSquare, BookOpen,
  ArrowRight, Sparkles, Star, TrendingUp, Zap
} from 'lucide-react';

/* ── 3D card component ─────────────────────────────────────── */
function Card3D({ children, className = '', onClick, accentColor = '#7C3AED' }) {
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;   // 0..1
    const y = (e.clientY - r.top)  / r.height;  // 0..1
    const rotY =  (x - 0.5) * 18;  // –9..+9 deg
    const rotX = -(y - 0.5) * 14;  // –7..+7 deg
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.style.boxShadow = `
      0 ${16 + rotX}px 48px rgba(0,0,0,0.55),
      0 0 40px ${accentColor}22,
      0 0 0 1px ${accentColor}30,
      inset 0 1px 0 rgba(255,255,255,0.07)
    `;
  }, [accentColor]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
    el.style.boxShadow = '';
  }, []);

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`card-3d glass-card gradient-border relative overflow-hidden rounded-2xl text-left focus:outline-none ${className}`}
      style={{ transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s ease' }}
    >
      {children}
    </button>
  );
}

/* ── Feature card data ─────────────────────────────────────── */
const FEATURES = [
  {
    id: 'practice',
    Icon: Mic,
    accent: '#7C3AED',
    accentLite: '#A78BFA',
    grad: 'from-violet-600 to-purple-700',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    ring: 'rgba(124,58,237,0.5)',
    title: 'Interview Practice',
    sub: 'Live AI coaching',
    desc: 'Record your answers to 12 curated questions. Get real-time WPM, STAR structure, filler analysis, and completeness scoring.',
    badge: '12 Questions',
    badgeCls: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    cta: 'Start Practicing',
  },
  {
    id: 'progress',
    Icon: BarChart2,
    accent: '#059669',
    accentLite: '#34D399',
    grad: 'from-emerald-600 to-teal-700',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    ring: 'rgba(5,150,105,0.5)',
    title: 'My Progress',
    sub: 'Track your growth',
    desc: 'Confidence score trends, WPM improvement, filler rate history, and category-level breakdowns — all visualised over time.',
    badge: 'Analytics',
    badgeCls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    cta: 'View Progress',
  },
  {
    id: 'feedback',
    Icon: MessageSquare,
    accent: '#9333EA',
    accentLite: '#C084FC',
    grad: 'from-purple-600 to-pink-700',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    ring: 'rgba(147,51,234,0.5)',
    title: 'Feedback & Profile',
    sub: 'Deep-dive reviews',
    desc: 'Browse complete session history with full AI feedback, strength highlights, improvement areas, and your overall performance profile.',
    badge: 'History',
    badgeCls: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    cta: 'See Feedback',
  },
  {
    id: 'notes',
    Icon: BookOpen,
    accent: '#D97706',
    accentLite: '#FCD34D',
    grad: 'from-amber-600 to-orange-700',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    ring: 'rgba(217,119,6,0.5)',
    title: 'Study from Notes',
    sub: 'Upload & practice',
    desc: 'Upload PDFs, text notes, or describe a topic — VoiceCraft extracts keywords and generates 8 targeted interview questions instantly.',
    badge: 'PDF · TXT · IMG',
    badgeCls: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    cta: 'Upload Notes',
  },
];

/* ── Floating stat chip ────────────────────────────────────── */
function StatChip({ label, value, color, delay = '' }) {
  return (
    <div className={`animate-fade-up ${delay} opacity-0 flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10`}>
      <span className={`text-sm font-bold font-mono ${color}`}>{value}</span>
      <span className="text-xs text-zinc-400">{label}</span>
    </div>
  );
}

/* ── Main dashboard ────────────────────────────────────────── */
export default function Dashboard({ onNavigate, profile, recentSessions = [] }) {
  const total = profile?.totalSessions || 0;
  const avgConf = profile?.avgConfidence || 0;
  const avgWpm  = profile?.avgWpm || null;
  const avgFill = profile?.avgFiller ?? null;

  return (
    <div className="relative flex-1 flex flex-col">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 sm:px-8 pt-14 pb-16 text-center">
        {/* Hero glow blob */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
          <div
            className="w-[600px] h-[300px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(ellipse, #7C3AED 0%, #06B6D4 50%, transparent 70%)', filter: 'blur(80px)' }}
          />
        </div>

        {/* Badge */}
        <div className="animate-fade-up opacity-0 inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-bold text-violet-300 tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Interview Coach
        </div>

        {/* Heading */}
        <h1 className="animate-fade-up delay-100 opacity-0 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-5">
          <span className="block text-white">Master Your</span>
          <span className="block text-shimmer">Interview Game</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up delay-200 opacity-0 text-zinc-400 max-w-lg mx-auto text-base leading-relaxed mb-8">
          Real-time speech analysis, STAR coaching, filler detection, and AI-powered answer rewrites — all client-side, no backend needed.
        </p>

        {/* CTA row */}
        <div className="animate-fade-up delay-300 opacity-0 flex items-center justify-center gap-3 flex-wrap mb-10">
          <button
            onClick={() => onNavigate('practice')}
            className="btn-primary text-sm"
          >
            <Mic className="w-4 h-4" />
            Start Practicing
          </button>
          {total === 0 && (
            <button
              onClick={() => onNavigate('notes')}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-zinc-300 border border-zinc-700 rounded-xl hover:border-zinc-500 hover:text-white transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Upload Notes
            </button>
          )}
        </div>

        {/* Live stats (if sessions exist) */}
        {total > 0 && (
          <div className="animate-fade-up delay-400 opacity-0 flex items-center justify-center gap-3 flex-wrap">
            <StatChip label="Sessions" value={total} color="text-violet-400" />
            <StatChip label="Avg Confidence" value={`${avgConf}%`} color={avgConf >= 70 ? 'text-emerald-400' : 'text-amber-400'} delay="delay-100" />
            {avgWpm && <StatChip label="Avg WPM" value={avgWpm} color="text-cyan-400" delay="delay-200" />}
            {avgFill !== null && <StatChip label="Filler Rate" value={`${avgFill}%`} color={avgFill <= 3 ? 'text-emerald-400' : 'text-amber-400'} delay="delay-300" />}
          </div>
        )}
      </section>

      {/* ── FEATURE CARDS GRID ────────────────────────────── */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-8 pb-16 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {FEATURES.map((f, i) => {
          const Icon = f.Icon;
          const delay = `delay-${(i + 1) * 100}`;
          return (
            <div key={f.id} className={`animate-fade-up ${delay} opacity-0`}>
              <Card3D
                accentColor={f.accent}
                onClick={() => onNavigate(f.id)}
                className="w-full p-7 group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-6">
                  {/* Icon */}
                  <div
                    className="relative p-3.5 rounded-2xl"
                    style={{ background: `${f.accent}18`, border: `1px solid ${f.accent}30` }}
                  >
                    {/* Glow ring on hover */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ boxShadow: `0 0 20px ${f.accent}40` }}
                    />
                    <Icon className="w-6 h-6 relative z-10" style={{ color: f.accentLite }} />
                  </div>

                  {/* Badge */}
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-widest uppercase ${f.badgeCls}`}>
                    {f.badge}
                  </span>
                </div>

                {/* Text */}
                <h2 className="text-lg font-bold text-white mb-1 group-hover:text-gradient transition-all">{f.title}</h2>
                <p className="text-xs font-medium mb-3" style={{ color: f.accentLite }}>{f.sub}</p>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">{f.desc}</p>

                {/* CTA */}
                <div
                  className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-200"
                  style={{ color: f.accentLite }}
                >
                  {f.cta}
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)` }}
                />
              </Card3D>
            </div>
          );
        })}
      </section>

      {/* ── BOTTOM QUICK-TIPS (new users) ─────────────────── */}
      {total === 0 && (
        <section className="max-w-6xl w-full mx-auto px-4 sm:px-8 pb-12">
          <div className="animate-fade-up delay-600 opacity-0 glass-card rounded-2xl p-6 border border-violet-500/15 bg-violet-500/[0.04] flex flex-col sm:flex-row items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-500/15">
              <TrendingUp className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-200">Get started in 30 seconds</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Click <strong className="text-violet-300">Interview Practice</strong> above to record your first answer and unlock full AI coaching.
              </p>
            </div>
            <button
              onClick={() => onNavigate('practice')}
              className="btn-primary text-xs ml-auto shrink-0"
            >
              <Zap className="w-3.5 h-3.5" /> Let's Go
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
