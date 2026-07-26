import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Sparkles, Award, ShieldCheck, AlertCircle, RefreshCw, 
  HelpCircle, ChevronRight, Zap, ArrowUpRight, MessageSquare, 
  CheckCircle2, Flame, Cpu, FileText, BarChart2, BookOpen,
  LayoutDashboard, ArrowLeft, Home
} from 'lucide-react';
import AudioVisualizer from './components/AudioVisualizer';
import WpmGauge from './components/WpmGauge';
import StarBreakdown from './components/StarBreakdown';
import TranscriptViewer from './components/TranscriptViewer';
import PacingInconsistencyWidget from './components/PacingInconsistencyWidget';
import QuestionContextChecklistWidget from './components/QuestionContextChecklistWidget';
import Dashboard from './components/Dashboard';
import ProgressPage from './components/ProgressPage';
import FeedbackPage from './components/FeedbackPage';
import NotesPage from './components/NotesPage';
import { 
  analyzeSpeech, 
  SAMPLE_QUESTIONS, 
  CATEGORIES, 
  getRandomQuestion, 
  getQuestionsByCategory,
  normalizeSpeechPhonetics
} from './utils/speechAnalyzer';
import { saveSession, getSessions, getProfile, updateProfile } from './utils/storage';

// ---- Nav config ----
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home',     Icon: Home },
  { id: 'practice',  label: 'Practice', Icon: Mic },
  { id: 'progress',  label: 'Progress', Icon: BarChart2 },
  { id: 'feedback',  label: 'Feedback', Icon: MessageSquare },
  { id: 'notes',     label: 'Notes',    Icon: BookOpen },
];

export default function App() {
  // ---- Navigation ----
  const [currentPage, setCurrentPage] = useState('dashboard');

  // ---- Practice state (all unchanged from original) ----
  const [selectedQuestion, setSelectedQuestion] = useState(SAMPLE_QUESTIONS[0]);
  const [transcript, setTranscript] = useState(SAMPLE_QUESTIONS[0].sampleTranscript);
  const [durationSec, setDurationSec] = useState(SAMPLE_QUESTIONS[0].sampleDurationSec);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState('feedback');

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const isRecordingRef = useRef(false);
  const startSessionRef = useRef(null);
  const healthCheckRef = useRef(null);

  // ---- Sessions / Profile ----
  const [sessions, setSessions]   = useState(() => getSessions());
  const [profile,  setProfile]    = useState(() => getProfile());

  const refreshStorageState = () => {
    setSessions(getSessions());
    setProfile(updateProfile());
  };

  // ---- Computed analysis ----
  const [analysis, setAnalysis] = useState(() => analyzeSpeech(transcript, durationSec, selectedQuestion, false));

  useEffect(() => {
    const res = analyzeSpeech(transcript, durationSec, selectedQuestion, isRecording);
    setAnalysis(res);
  }, [transcript, durationSec, selectedQuestion, isRecording]);

  // ---- Category / question handlers (unchanged) ----
  const handleSelectCategory = (catName) => {
    const nextQ = getRandomQuestion(catName, selectedQuestion.id);
    setSelectedQuestion(nextQ);
    setTranscript(nextQ.sampleTranscript);
    setDurationSec(nextQ.sampleDurationSec);
  };

  const handleSwapQuestion = () => {
    const nextQ = getRandomQuestion(selectedQuestion.category, selectedQuestion.id);
    setSelectedQuestion(nextQ);
    setTranscript(nextQ.sampleTranscript);
    setDurationSec(nextQ.sampleDurationSec);
  };

  // ---- Speech recognition factory (unchanged) ----
  startSessionRef.current = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || !isRecordingRef.current) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let newFinal = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) {
          newFinal += res[0].transcript + ' ';
        } else {
          interim += res[0].transcript;
        }
      }
      if (newFinal) finalTranscriptRef.current += newFinal;
      const combined = (finalTranscriptRef.current + interim).trim();
      setTranscript(normalizeSpeechPhonetics(combined));
    };

    recognition.onerror = (err) => {
      if (err.error === 'no-speech' || err.error === 'aborted') return;
      console.warn('Speech recognition error:', err.error);
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      if (!isRecordingRef.current) return;
      setTimeout(() => {
        if (isRecordingRef.current) startSessionRef.current?.();
      }, 100);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      recognitionRef.current = null;
      setTimeout(() => {
        if (isRecordingRef.current) startSessionRef.current?.();
      }, 400);
    }
  };

  // ---- Toggle recording (unchanged except session-save on stop) ----
  const handleToggleRecording = () => {
    if (isRecordingRef.current) {
      // --- STOP ---
      isRecordingRef.current = false;
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (healthCheckRef.current) clearInterval(healthCheckRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch(e){}
        recognitionRef.current = null;
      }

      // Save session after stopping (only if something was said)
      const currentTranscript = finalTranscriptRef.current.trim();
      if (currentTranscript.length > 10 && durationSec > 3) {
        const currentAnalysis = analyzeSpeech(currentTranscript, durationSec, selectedQuestion, false);
        const entry = saveSession({
          questionId:        selectedQuestion.id,
          questionTitle:     selectedQuestion.title,
          category:          selectedQuestion.category,
          duration:          durationSec,
          wpm:               currentAnalysis.wpm,
          fillerRate:        currentAnalysis.fillerRate,
          confidenceScore:   currentAnalysis.confidenceScore,
          completenessScore: currentAnalysis.contextEvaluation.completenessScore,
          transcript:        currentTranscript,
          strengths:         currentAnalysis.strengths,
          areasForImprovement: currentAnalysis.areasForImprovement,
        });
        refreshStorageState();
      }
    } else {
      // --- START ---
      isRecordingRef.current = true;
      setIsRecording(true);
      setDurationSec(0);
      setTranscript('');
      finalTranscriptRef.current = '';

      timerRef.current = setInterval(() => {
        setDurationSec(prev => prev + 1);
      }, 1000);

      const hasSR = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
      if (hasSR) {
        startSessionRef.current();

        healthCheckRef.current = setInterval(() => {
          if (isRecordingRef.current && !recognitionRef.current) {
            startSessionRef.current?.();
          }
        }, 2000);
      } else {
        let wordIndex = 0;
        const simulatedWords = selectedQuestion.sampleTranscript.split(' ');
        const simInterval = setInterval(() => {
          if (!isRecordingRef.current) { clearInterval(simInterval); return; }
          if (wordIndex < simulatedWords.length) {
            setTranscript(prev => (prev ? prev + ' ' : '') + simulatedWords[wordIndex]);
            wordIndex++;
          } else {
            clearInterval(simInterval);
          }
        }, 350);
      }
    }
  };

  // ---- Navigate to Practice with a custom notes question ----
  const handleNotesQuestion = (notesQ) => {
    // Construct a lightweight question object compatible with the practice page
    const pseudoQ = {
      id: notesQ.id,
      category: 'General / Intro',
      title: notesQ.question,
      requiredDetails: [
        { id: 'd1', label: 'Topic Coverage', keywords: notesQ.keyword ? [notesQ.keyword] : ['answer'], stems: notesQ.keyword ? [notesQ.keyword.slice(0, 5)] : ['answ'], tip: 'Address the core topic of the question.' },
        { id: 'd2', label: 'Personal Example', keywords: ['experience', 'worked', 'built', 'used', 'developed'], stems: ['exper', 'work', 'build', 'use', 'develop'], tip: 'Share a real personal experience.' },
        { id: 'd3', label: 'Outcome or Result', keywords: ['result', 'outcome', 'achieved', 'improved', 'learned'], stems: ['result', 'outcom', 'achiev', 'improv', 'learn'], isMetricSensitive: true, tip: 'State the result or what you learned.' },
      ],
      sampleTranscript: 'Describe your experience with this topic, including a specific project, what you did, and the outcome.',
      sampleDurationSec: 45,
      improvedVersion: `Give a structured STAR answer:\n• Situation: Set the context briefly\n• Task: What you needed to accomplish\n• Action: What specific steps you took\n• Result: The measurable outcome and what you learned`
    };
    setSelectedQuestion(pseudoQ);
    setTranscript(pseudoQ.sampleTranscript);
    setDurationSec(pseudoQ.sampleDurationSec);
    setCurrentPage('practice');
  };

  // ---- Render helpers ----
  const renderHeader = () => (
    <header className="sticky top-0 z-40 glass-panel border-b border-white/[0.06] px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-cyan-500 p-[1.5px] shadow-lg" style={{ boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
            <div className="w-full h-full bg-[#07070F] rounded-[10px] flex items-center justify-center">
              <Mic className="w-4 h-4 text-violet-400" />
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-black tracking-tight text-gradient">VoiceCraft</span>
            <span className="block text-[10px] text-zinc-500 -mt-0.5">AI Speech Coach</span>
          </div>
        </button>

        {/* Nav tabs */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                currentPage === id ? 'nav-active' : 'nav-inactive'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {sessions.length > 0 && (
            <button
              onClick={() => setCurrentPage('progress')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34D399', boxShadow: '0 0 16px rgba(16,185,129,0.12)' }}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:block">{sessions.length} sessions</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );

  // ---- Page: Practice (full original UI) ----
  const renderPractice = () => (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Category Selection Bar */}
      <section className="glass-card rounded-2xl p-4 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Category Practice</span>
            <h2 className="text-sm font-semibold text-zinc-100">{selectedQuestion.category}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {CATEGORIES.map(cat => {
            const isSelected = selectedQuestion.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Question Context & Required Details Checklist Bar */}
      <section>
        <QuestionContextChecklistWidget
          contextEvaluation={analysis.contextEvaluation}
          selectedQuestion={selectedQuestion}
          onSwapQuestion={handleSwapQuestion}
        />
      </section>

      {/* Spoken Transcript Viewer & Input */}
      <section>
        <TranscriptViewer
          transcript={transcript}
          onTranscriptChange={setTranscript}
          fillerCount={analysis.fillerCount}
          fillerBreakdown={analysis.fillerBreakdown}
        />
      </section>

      {/* Audio Waveform Capture Component */}
      <section>
        <AudioVisualizer
          isRecording={isRecording}
          onToggleRecording={handleToggleRecording}
          durationSec={durationSec}
        />
      </section>

      {/* Real-time Statistics Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* WPM Gauge */}
        <WpmGauge
          wpm={analysis.wpm}
          status={analysis.wpmStatus}
          statusColor={analysis.wpmColor}
        />

        {/* Confidence & Vocal Tone Meter */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-200">Vocal Confidence</h4>
                <p className="text-xs text-zinc-400">Assertive tone score</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
              {analysis.confidenceScore >= 80 ? 'High Assurance' : analysis.confidenceScore >= 60 ? 'Moderate' : 'Low'}
            </span>
          </div>

          <div className="my-4 text-center">
            <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
              {analysis.confidenceScore}%
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full mt-3 overflow-hidden p-0.5 border border-zinc-700">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700" 
                style={{ width: `${analysis.confidenceScore}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Minimal hesitation</span>
            <span className="text-emerald-400 font-medium">+14% vs avg</span>
          </div>
        </div>

        {/* Filler Word Summary */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-200">Filler Words</h4>
                <p className="text-xs text-zinc-400">Hesitation count</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
              {analysis.fillerPercentage}% of text
            </span>
          </div>

          <div className="my-4 text-center">
            <div className="text-4xl font-extrabold font-mono text-amber-400 tracking-tight">
              {analysis.fillerCount}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {analysis.fillerCount === 0 
                ? "Flawless delivery! No crutch words." 
                : `Detected: ${Object.keys(analysis.fillerBreakdown).slice(0, 3).join(', ')}`}
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Target: &lt; 2 fillers per min</span>
            <span className="text-amber-400 font-medium">Pause intentionally</span>
          </div>
        </div>

        {/* Total Words & Speech Duration */}
        <div className="glass-card rounded-2xl p-5 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-200">Speech Volume</h4>
                <p className="text-xs text-zinc-400">Total word count</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
              {durationSec || analysis.durationSeconds}s Total
            </span>
          </div>

          <div className="my-4 text-center">
            <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
              {analysis.totalWords}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {analysis.wpm !== null ? `Avg ~${analysis.wpm} WPM` : 'Record to measure WPM'}
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Ideal response length</span>
            <span className="text-cyan-400 font-medium">45-90 seconds</span>
          </div>
        </div>
      </section>

      {/* Detailed Analytics Grid (Pacing + STAR Breakdown + AI Feedback) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* STAR & Pacing Column (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <PacingInconsistencyWidget 
            pacingAnalysis={analysis.pacingAnalysis} 
            overallWpm={analysis.wpm} 
          />
          <StarBreakdown starAnalysis={analysis.starAnalysis} />
        </div>

        {/* AI Feedback & How To Say It Better Panel (7 cols on lg) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-zinc-800 flex flex-col justify-between">
          <div>
            {/* Tab Navigation Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-lg shadow-md shadow-indigo-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">AI Speech Feedback & Executive Suggestions</h3>
                  <p className="text-xs text-zinc-400">Personalized coaching insights & answer optimization</p>
                </div>
              </div>

              <div className="flex bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'feedback'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Feedback
                </button>
                <button
                  onClick={() => setActiveTab('rewrite')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'rewrite'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  How To Say It Better
                </button>
              </div>
            </div>

            {/* Tab 1: Feedback Bullets */}
            {activeTab === 'feedback' && (
              <div className="my-5 space-y-6">
                {/* Strengths */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Key Strengths
                  </h4>
                  <div className="space-y-2.5">
                    {analysis.strengths.map((str, idx) => (
                      <div key={idx} className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-3 text-xs text-zinc-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Areas for Improvement
                  </h4>
                  <div className="space-y-2.5">
                    {analysis.areasForImprovement.map((area, idx) => (
                      <div key={idx} className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-3 text-xs text-zinc-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: How To Say It Better Rewrite */}
            {activeTab === 'rewrite' && (
              <div className="my-5 space-y-4">
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" /> Executive STAR Formatted Rewrite
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-500/20 text-indigo-200 rounded font-mono uppercase">
                      {selectedQuestion.id} Tailored
                    </span>
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed font-sans whitespace-pre-line italic bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
                    {analysis.improvedVersion}
                  </p>
                </div>
                <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
                  <span>Structure: Concise Situation & Action + Measurable Metric Result</span>
                  <button 
                    onClick={handleSwapQuestion}
                    className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Practice Next Question
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action CTA */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-400">VoiceCraft AI Engine v2.7</span>
            <button
              onClick={handleSwapQuestion}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Swap Practice Question</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );

  // ---- Root render ----
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-violet-500/40 selection:text-white" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── ANIMATED BACKGROUND ───────────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
        {/* Dot grid mesh */}
        <div className="absolute inset-0 dot-grid opacity-40" />
        {/* Floating orbs */}
        <div className="animate-orb-1 absolute top-1/4 left-[15%] w-[500px] h-[500px] rounded-full" style={{ background: 'rgba(124,58,237,0.12)', filter: 'blur(100px)' }} />
        <div className="animate-orb-2 absolute bottom-1/4 right-[10%] w-[420px] h-[420px] rounded-full" style={{ background: 'rgba(6,182,212,0.08)', filter: 'blur(80px)' }} />
        <div className="animate-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full" style={{ background: 'rgba(168,85,247,0.07)', filter: 'blur(60px)' }} />
        {/* Edge vignette */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,6,15,0.6) 100%)' }} />
      </div>
      {/* Page content sits above the fixed background */}
      <div className="relative z-10 flex flex-col flex-1">
        {renderHeader()}

        {currentPage === 'dashboard' && (
          <Dashboard
            onNavigate={setCurrentPage}
            profile={profile}
            recentSessions={sessions.slice(0, 5)}
          />
        )}

        {currentPage === 'practice' && renderPractice()}

        {currentPage === 'progress' && (
          <ProgressPage sessions={sessions} profile={profile} />
        )}

        {currentPage === 'feedback' && (
          <FeedbackPage />
        )}

        {currentPage === 'notes' && (
          <NotesPage onStartPracticeWithQuestion={handleNotesQuestion} />
        )}
      </div>
    </div>
  );
}
