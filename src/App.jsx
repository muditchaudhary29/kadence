import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Sparkles, Award, ShieldCheck, AlertCircle, RefreshCw, 
  HelpCircle, ChevronRight, Zap, ArrowUpRight, MessageSquare, 
  CheckCircle2, Flame, Cpu, FileText, BarChart2, BookOpen,
  LayoutDashboard, ArrowLeft, Home, Sun, Moon, Activity
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
  // ---- Theme State ----
  const [theme, setTheme] = useState(() => localStorage.getItem('kadence_theme') || 'dark');

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('kadence_theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

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
    <header className="sticky top-0 z-40 glass-panel px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Clean Redone Logo (Only Mic) */}
          <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-3 shrink-0 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 border-2.5 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_#0F172A] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[5px_5px_0px_#0F172A] transition-all">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black font-heading tracking-tight leading-none">KADENCE</span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#A3E635] text-slate-950 font-mono font-black text-[10px] border border-slate-900 shadow-[1px_1px_0px_#000]">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-widest block mt-0.5">
                AI SPEECH COACH
              </span>
            </div>
          </button>

          {/* Nav tabs */}
          <nav className="flex items-center gap-1.5">
            {NAV_ITEMS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading transition-all ${
                  currentPage === id ? 'nav-active' : 'nav-inactive'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl theme-toggle-btn flex items-center justify-center transition-all"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {sessions.length > 0 && (
              <button
                onClick={() => setCurrentPage('progress')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono brutal-badge bg-emerald-500/10 text-emerald-400 border-emerald-500/30 flex items-center gap-1.5"
              >
                <BarChart2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:block">{sessions.length} SESSIONS</span>
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
      <section className="brutal-card rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#0F172A] shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-extrabold uppercase tracking-wider opacity-80 block">Category Practice</span>
            <h2 className="text-lg font-black font-heading leading-tight">{selectedQuestion.category}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          {CATEGORIES.map(cat => {
            const isSelected = selectedQuestion.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black font-heading transition-all ${
                  isSelected
                    ? 'bg-indigo-600 !text-white border-2 border-slate-900 shadow-[3px_3px_0px_#0F172A]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-2 border-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-[2px_2px_0px_#0F172A]'
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
        <div className="brutal-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#0F172A] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black font-heading leading-tight">Vocal Confidence</h4>
                <p className="text-xs font-semibold opacity-80 mt-0.5">Assertive tone score</p>
              </div>
            </div>
            <span className="brutal-badge bg-emerald-600 !text-white text-[10px] font-black border border-slate-900">
              {analysis.confidenceScore >= 80 ? 'High Assurance' : analysis.confidenceScore >= 60 ? 'Moderate' : 'Low'}
            </span>
          </div>

          <div className="my-2 text-center">
            <div className="text-4xl font-black font-mono tracking-tight">
              {analysis.confidenceScore}%
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full mt-3 overflow-hidden p-0.5 border-2 border-slate-900">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700" 
                style={{ width: `${analysis.confidenceScore}%` }}
              />
            </div>
          </div>

          <div className="pt-3 border-t-2 border-slate-700 flex items-center justify-between text-xs font-bold">
            <span className="opacity-80">Minimal hesitation</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">+14% vs avg</span>
          </div>
        </div>

        {/* Filler Word Summary */}
        <div className="brutal-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#0F172A] shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black font-heading leading-tight">Filler Words</h4>
                <p className="text-xs font-semibold opacity-80 mt-0.5">Hesitation count</p>
              </div>
            </div>
            <span className="brutal-badge bg-amber-400 text-slate-950 text-[10px] font-black border border-slate-900">
              {analysis.fillerPercentage}% of text
            </span>
          </div>

          <div className="my-2 text-center">
            <div className="text-4xl font-black font-mono text-amber-600 dark:text-amber-400 tracking-tight">
              {analysis.fillerCount}
            </div>
            <p className="text-xs font-bold opacity-80 mt-1">
              {analysis.fillerCount === 0 
                ? "Flawless delivery! No crutch words." 
                : `Detected: ${Object.keys(analysis.fillerBreakdown).slice(0, 3).join(', ')}`}
            </p>
          </div>

          <div className="pt-3 border-t-2 border-slate-700 flex items-center justify-between text-xs font-bold">
            <span className="opacity-80">Target: &lt; 2 fillers per min</span>
            <span className="text-amber-600 dark:text-amber-400 font-extrabold">Pause intentionally</span>
          </div>
        </div>

        {/* Total Words & Speech Duration */}
        <div className="brutal-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#0F172A] shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black font-heading leading-tight">Speech Volume</h4>
                <p className="text-xs font-semibold opacity-80 mt-0.5">Total word count</p>
              </div>
            </div>
            <span className="brutal-badge bg-cyan-400 text-slate-950 text-[10px] font-black border border-slate-900">
              {durationSec || analysis.durationSeconds}s Total
            </span>
          </div>

          <div className="my-2 text-center">
            <div className="text-4xl font-black font-mono tracking-tight">
              {analysis.totalWords}
            </div>
            <p className="text-xs font-bold opacity-80 mt-1">
              {analysis.wpm !== null ? `Avg ~${analysis.wpm} WPM` : 'Record to measure WPM'}
            </p>
          </div>

          <div className="pt-3 border-t-2 border-slate-700 flex items-center justify-between text-xs font-bold">
            <span className="opacity-80">Ideal response length</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-extrabold">45-90 seconds</span>
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
        <div className="lg:col-span-7 brutal-card p-6 flex flex-col justify-between space-y-4">
          <div>
            {/* Tab Navigation Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#0F172A] shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading leading-tight">AI Speech Feedback & Executive Suggestions</h3>
                  <p className="text-xs font-semibold opacity-80 mt-0.5">Personalized coaching insights & answer optimization</p>
                </div>
              </div>

              <div className="flex !bg-slate-100 dark:!bg-slate-800 p-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0F172A]">
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black font-heading transition-all ${
                    activeTab === 'feedback'
                      ? '!bg-indigo-600 !text-white border border-slate-900 shadow-sm'
                      : '!text-slate-900 dark:!text-slate-200 font-extrabold hover:!bg-slate-200 dark:hover:!bg-slate-700'
                  }`}
                >
                  Feedback
                </button>
                <button
                  onClick={() => setActiveTab('rewrite')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black font-heading transition-all ${
                    activeTab === 'rewrite'
                      ? '!bg-purple-600 !text-white border border-slate-900 shadow-sm'
                      : '!text-slate-900 dark:!text-slate-200 font-extrabold hover:!bg-slate-200 dark:hover:!bg-slate-700'
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
                  <h4 className="text-xs font-black font-heading uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Key Strengths
                  </h4>
                  <div className="space-y-2.5">
                    {analysis.strengths.map((str, idx) => (
                      <div key={idx} className="feedback-strength-tile p-3.5 rounded-xl flex items-start gap-3 text-xs font-black">
                        <span className="dot w-2.5 h-2.5 rounded-full mt-1 shrink-0 border border-slate-900" />
                        <span className="font-extrabold">{str}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h4 className="text-xs font-black font-heading uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Areas for Improvement
                  </h4>
                  <div className="space-y-2.5">
                    {analysis.areasForImprovement.map((area, idx) => (
                      <div key={idx} className="feedback-improvement-tile p-3.5 rounded-xl flex items-start gap-3 text-xs font-black">
                        <span className="dot w-2.5 h-2.5 rounded-full mt-1 shrink-0 border border-slate-900" />
                        <span className="font-extrabold">{area}</span>
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
            <span className="text-zinc-400">Kadence AI Engine v2.7</span>
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
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme}`}>

      {/* ── ANIMATED NEUMORPHIC BACKGROUND ───────────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
        {/* Dot grid mesh */}
        <div className="absolute inset-0 dot-grid" />
        {/* Floating soft ambient light orbs */}
        <div className="animate-orb-1 absolute top-1/4 left-[15%] w-[500px] h-[500px] rounded-full" style={{ background: 'var(--orb-1)', filter: 'blur(100px)' }} />
        <div className="animate-orb-2 absolute bottom-1/4 right-[10%] w-[420px] h-[420px] rounded-full" style={{ background: 'var(--orb-2)', filter: 'blur(80px)' }} />
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
