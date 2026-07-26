import React, { useState, useRef, useCallback } from 'react';
import {
  BookOpen, Upload, FileText, CheckCircle2, AlertCircle,
  RefreshCw, Play, Sparkles, Image, X
} from 'lucide-react';
import { extractTextFromFile, extractKeywords, generateQuestionsFromKeywords } from '../utils/notesAnalyzer';

const ACCEPTED_FILE_TYPES = '.txt,.md,.pdf,.png,.jpg,.jpeg,.webp';

const TYPE_CONFIG = {
  behavioral: { label: 'Behavioral', color: 'bg-indigo-500 text-white' },
  technical:  { label: 'Technical',  color: 'bg-purple-500 text-white' },
  general:    { label: 'General',    color: 'bg-emerald-500 text-slate-900' },
};

function FilePreview({ file, onRemove }) {
  const isImg = file.type.startsWith('image/');
  const [imgUrl] = useState(() => isImg ? URL.createObjectURL(file) : null);

  return (
    <div className="flex items-center gap-3 p-3.5 neu-inset rounded-xl">
      {isImg ? (
        <img src={imgUrl} alt="" className="w-12 h-12 object-cover rounded-xl border-2 border-slate-900 shrink-0" />
      ) : (
        <div className="p-3 bg-indigo-500 text-white rounded-xl border-2 border-slate-900 shrink-0 shadow-[2px_2px_0px_#000]">
          <FileText className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold font-heading truncate">{file.name}</div>
        <div className="text-xs font-mono opacity-75">{(file.size / 1024).toFixed(1)} KB · {file.type || 'file'}</div>
      </div>
      <button onClick={onRemove} className="p-1.5 text-rose-500 hover:scale-110 transition-transform">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function NotesPage({ onStartPracticeWithQuestion }) {
  const [file, setFile]                   = useState(null);
  const [topicInput, setTopicInput]       = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [keywords, setKeywords]           = useState([]);
  const [questions, setQuestions]         = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [dragActive, setDragActive]       = useState(false);
  const [showText, setShowText]           = useState(false);

  const inputRef = useRef(null);

  const processFile = useCallback(async (f) => {
    setFile(f);
    setError('');
    setQuestions([]);
    setKeywords([]);
    setExtractedText('');
    setLoading(true);

    try {
      const isImg = f.type.startsWith('image/');
      let rawText = '';
      if (!isImg) {
        rawText = await extractTextFromFile(f);
      }

      if (rawText.trim().length < 30 && !isImg) {
        setError('Could not extract readable text from this file. Please paste your notes in the text box below.');
        setLoading(false);
        return;
      }

      if (!isImg) {
        const kw = extractKeywords(rawText);
        const q = generateQuestionsFromKeywords(kw, rawText);
        setExtractedText(rawText);
        setKeywords(kw.slice(0, 12));
        setQuestions(q);
      }
    } catch (err) {
      setError('Failed to read the file. Try a .txt or .md file, or paste your notes below.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  const handleGenerateFromTopic = () => {
    const combined = topicInput + (extractedText ? `\n${extractedText}` : '');
    if (!combined.trim()) return;
    const kw = extractKeywords(combined);
    const q = generateQuestionsFromKeywords(kw, combined);
    setKeywords(kw.slice(0, 12));
    setQuestions(q);
  };

  const handleReset = () => {
    setFile(null);
    setTopicInput('');
    setExtractedText('');
    setKeywords([]);
    setQuestions([]);
    setError('');
  };

  const isImage = file?.type.startsWith('image/');

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black font-heading flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-rose-500" />
            Study from Notes
          </h2>
          <p className="text-sm font-medium mt-1 opacity-80">
            Upload notes, PDFs, or enter a topic — Kadence AI generates targeted practice questions instantly.
          </p>
        </div>

        {questions.length > 0 && (
          <button onClick={handleReset} className="brutal-badge bg-amber-400 text-slate-900 px-4 py-2 font-bold text-xs">
            <RefreshCw className="w-4 h-4" />
            Start Over
          </button>
        )}
      </div>

      {/* Input Section */}
      {questions.length === 0 && (
        <section className="brutal-card p-6 md:p-8 space-y-6">
          {/* File Drag-and-Drop Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
                : 'border-slate-700 hover:border-indigo-500'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              onChange={(e) => e.target.files[0] && processFile(e.target.files[0])}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white border-2 border-slate-900 flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#000]">
              <Upload className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <p className="text-base font-bold font-heading">
                {loading ? 'Extracting text…' : file ? file.name : 'Drop your study file here or click to upload'}
              </p>
              <p className="text-xs font-mono opacity-75">
                Supports .txt, .md, .pdf · Images: JPG, PNG, WebP
              </p>
            </div>
          </div>

          {/* File preview */}
          {file && !loading && (
            <FilePreview file={file} onRemove={handleReset} />
          )}

          {isImage && !loading && (
            <div className="p-3.5 bg-amber-400/20 border-2 border-amber-500 rounded-xl text-xs font-bold flex items-start gap-2">
              <Image className="w-4 h-4 shrink-0 mt-0.5" />
              Image uploaded. Describe the topic covered in the image below, then click Generate.
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3.5 bg-rose-500/20 border-2 border-rose-500 rounded-xl text-xs font-bold text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs font-mono font-bold opacity-75">
            <div className="flex-1 h-0.5 bg-slate-700" />
            <span>OR DESCRIBE YOUR TOPIC</span>
            <div className="flex-1 h-0.5 bg-slate-700" />
          </div>

          {/* Topic input */}
          <div className="space-y-4">
            <textarea
              value={topicInput}
              onChange={e => setTopicInput(e.target.value)}
              placeholder="e.g. System design — scalable notification service using Kafka and Redis. I have 3 years of Node.js experience with microservices…"
              rows={4}
              className="w-full neu-inset rounded-2xl p-4 text-xs font-semibold focus:outline-none resize-none"
            />
            <button
              onClick={handleGenerateFromTopic}
              disabled={!topicInput.trim() && !file}
              className="w-full btn-primary text-sm justify-center py-3.5 disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4" />
              Generate 8 Custom Practice Questions
            </button>
          </div>
        </section>
      )}

      {/* Results Section */}
      {questions.length > 0 && (
        <section className="space-y-6">
          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="brutal-card p-5 space-y-3">
              <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider opacity-80">Detected Topics & Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw, i) => (
                  <span key={i} className="brutal-badge bg-rose-500/20 text-rose-400 border-rose-500/40 text-xs">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Questions Grid */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-heading">{questions.length} Practice Questions Generated</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.map((q) => {
                const cfg = TYPE_CONFIG[q.type] || TYPE_CONFIG.general;
                return (
                  <div key={q.id} className="brutal-card p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <span className={`brutal-badge text-[10px] font-bold ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <h4 className="text-base font-bold font-heading leading-snug">{q.question}</h4>
                    </div>

                    <button
                      onClick={() => onStartPracticeWithQuestion(q)}
                      className="btn-primary text-xs w-full justify-center py-2.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Practice This Question
                    </button>
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
