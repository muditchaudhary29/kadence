import React, { useState, useRef, useCallback } from 'react';
import {
  Upload, FileText, Image, X, Loader2, BookOpen,
  Mic, ChevronRight, AlertCircle, CheckCircle2, RefreshCw
} from 'lucide-react';
import { extractTextFromFile, extractKeywords, generateQuestionsFromKeywords } from '../utils/notesAnalyzer';

const ACCEPTED = '.txt,.md,.pdf,.png,.jpg,.jpeg,.webp';

const TYPE_LABELS = {
  behavioral: { label: 'Behavioral', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
  technical:  { label: 'Technical',  color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  general:    { label: 'General',    color: 'text-zinc-400 bg-zinc-800 border-zinc-700' },
};

function FilePreview({ file, onRemove }) {
  const isImage = file.type.startsWith('image/');
  const [imgSrc] = useState(() => isImage ? URL.createObjectURL(file) : null);

  return (
    <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
      {isImage
        ? <img src={imgSrc} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0" />
        : (
          <div className="p-2.5 bg-zinc-800 rounded-lg shrink-0">
            <FileText className="w-5 h-5 text-indigo-400" />
          </div>
        )
      }
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-zinc-200 truncate">{file.name}</div>
        <div className="text-xs text-zinc-500">{(file.size / 1024).toFixed(1)} KB · {file.type || 'file'}</div>
      </div>
      <button onClick={onRemove} className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors">
        <X className="w-4 h-4 text-zinc-400" />
      </button>
    </div>
  );
}

export default function NotesPage({ onStartPracticeWithQuestion }) {
  const [file, setFile]               = useState(null);
  const [topicInput, setTopicInput]   = useState('');
  const [extractedText, setExtracted] = useState('');
  const [keywords, setKeywords]       = useState([]);
  const [questions, setQuestions]     = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [dragOver, setDragOver]       = useState(false);
  const [showText, setShowText]       = useState(false);
  const fileInputRef = useRef(null);

  const processFile = useCallback(async (f) => {
    setFile(f);
    setError('');
    setQuestions([]);
    setKeywords([]);
    setExtracted('');
    setLoading(true);

    try {
      const isImage = f.type.startsWith('image/');
      let text = '';

      if (!isImage) {
        text = await extractTextFromFile(f);
      }

      if (text.trim().length < 30 && !isImage) {
        setError('Could not extract readable text from this file. Please paste your notes in the text box below.');
        setLoading(false);
        return;
      }

      if (!isImage) {
        const kw = extractKeywords(text);
        const qs = generateQuestionsFromKeywords(kw, text);
        setExtracted(text);
        setKeywords(kw.slice(0, 12));
        setQuestions(qs);
      }
      // If image, user fills in topicInput instead
    } catch (e) {
      setError('Failed to read the file. Try a .txt or .md file, or paste your notes below.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  const handleGenerateFromTopic = () => {
    const combined = topicInput + (extractedText ? '\n' + extractedText : '');
    if (!combined.trim()) { setError('Please describe a topic or upload a file first.'); return; }
    setError('');
    const kw = extractKeywords(combined);
    const qs = generateQuestionsFromKeywords(kw, combined);
    setKeywords(kw.slice(0, 12));
    setQuestions(qs);
  };

  const handleReset = () => {
    setFile(null); setExtracted(''); setKeywords([]);
    setQuestions([]); setError(''); setTopicInput(''); setShowText(false);
  };

  const isImage = file?.type?.startsWith('image/');

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-100">Study from Notes</h2>
        <p className="text-sm text-zinc-400 mt-1">Upload your notes or describe a topic — get tailored interview questions.</p>
      </div>

      {/* Upload Zone */}
      {!questions.length && (
        <section className="space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all
              ${dragOver ? 'border-indigo-500 bg-indigo-500/5' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/40'}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              className="hidden"
              onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]); }}
            />
            {loading ? (
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
            ) : file ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            ) : (
              <div className="p-4 bg-zinc-800 rounded-2xl">
                <Upload className="w-8 h-8 text-zinc-400" />
              </div>
            )}
            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-200">
                {loading ? 'Extracting text…' : file ? file.name : 'Drop your file here or click to upload'}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Supports .txt, .md, .pdf · Images: JPG, PNG, WebP
              </p>
            </div>
          </div>

          {/* File preview */}
          {file && !loading && (
            <FilePreview file={file} onRemove={handleReset} />
          )}

          {/* Image: needs topic text */}
          {isImage && !loading && (
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2">
              <Image className="w-4 h-4 shrink-0 mt-0.5" />
              Image uploaded. Describe the topic covered in the image below, then click Generate.
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs text-zinc-600">
            <div className="flex-1 h-px bg-zinc-800" /><span>OR describe your topic</span><div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Topic input */}
          <div className="space-y-3">
            <textarea
              value={topicInput}
              onChange={e => setTopicInput(e.target.value)}
              placeholder="e.g. System design — scalable notification service using Kafka and Redis. I have 3 years of Node.js experience with microservices…"
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 resize-none"
            />
            <button
              onClick={handleGenerateFromTopic}
              disabled={!topicInput.trim() && !file}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Generate Interview Questions
            </button>
          </div>
        </section>
      )}

      {/* Results */}
      {questions.length > 0 && (
        <section className="space-y-6">
          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Detected Topics & Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-full text-xs text-zinc-300">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Extracted text toggle */}
          {extractedText && (
            <div className="space-y-2">
              <button
                onClick={() => setShowText(v => !v)}
                className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                {showText ? 'Hide' : 'Show'} extracted text ({extractedText.split(' ').length} words)
              </button>
              {showText && (
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-400 leading-relaxed max-h-48 overflow-y-auto">
                  {extractedText.slice(0, 1500)}{extractedText.length > 1500 ? '…' : ''}
                </div>
              )}
            </div>
          )}

          {/* Questions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200">{questions.length} Practice Questions Generated</h3>
              <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                Start over
              </button>
            </div>
            <div className="space-y-3">
              {questions.map((q) => {
                const badge = TYPE_LABELS[q.type] || TYPE_LABELS.general;
                return (
                  <div
                    key={q.id}
                    className="glass-card rounded-xl border border-zinc-800 hover:border-zinc-600 p-4 space-y-3 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-zinc-200 leading-relaxed flex-1">{q.question}</p>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    {onStartPracticeWithQuestion && (
                      <button
                        onClick={() => onStartPracticeWithQuestion(q)}
                        className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors group-hover:gap-3"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Practice this question</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
