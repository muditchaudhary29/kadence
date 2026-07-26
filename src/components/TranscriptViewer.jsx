import React, { useState } from 'react';
import { FileText, Edit3, Copy, Check } from 'lucide-react';
import { MULTI_FILLER_PHRASES, isFillerWithContext } from '../utils/speechAnalyzer';

export default function TranscriptViewer({ transcript, onTranscriptChange, fillerCount, fillerBreakdown }) {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render transcript with filler words highlighted accurately with context
  const renderHighlightedTranscript = () => {
    if (!transcript || transcript.trim().length === 0) {
      return (
        <p className="text-slate-600 dark:text-slate-300 italic font-semibold text-sm">
          No speech transcript recorded yet. Click "Start Practicing" or paste a transcript below.
        </p>
      );
    }

    // First scan multi-word phrases
    const multiMatches = [];
    MULTI_FILLER_PHRASES.forEach(phrase => {
      const reg = new RegExp(`\\b(${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
      let match;
      while ((match = reg.exec(transcript)) !== null) {
        multiMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0]
        });
      }
    });

    // Tokenize into words and whitespace
    const regex = /(\s+)/;
    const parts = transcript.split(regex);
    let charOffset = 0;

    const wordTokens = [];
    parts.forEach(part => {
      const start = charOffset;
      const end = charOffset + part.length;
      charOffset = end;

      const isSpace = /^\s+$/.test(part);
      wordTokens.push({ text: part, start, end, isSpace });
    });

    const nonSpaceWords = wordTokens.filter(t => !t.isSpace);

    return (
      <div className="leading-relaxed text-slate-950 dark:text-slate-100 text-sm font-medium font-sans tracking-wide">
        {wordTokens.map((token, index) => {
          if (token.isSpace) {
            return <span key={index}>{token.text}</span>;
          }

          const inMultiPhrase = multiMatches.some(m => token.start >= m.start && token.end <= m.end);

          const nonSpaceIndex = nonSpaceWords.indexOf(token);
          const prevWord = nonSpaceIndex > 0 ? nonSpaceWords[nonSpaceIndex - 1].text : "";
          const nextWord = nonSpaceIndex < nonSpaceWords.length - 1 ? nonSpaceWords[nonSpaceIndex + 1].text : "";

          const isSingleFiller = isFillerWithContext(token.text, prevWord, nextWord);

          if (inMultiPhrase || isSingleFiller) {
            return (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 mx-0.5 rounded-lg bg-amber-400 text-slate-950 border-2 border-slate-900 font-extrabold text-xs shadow-[1.5px_1.5px_0px_#0F172A] group relative cursor-help"
              >
                {token.text}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-950 text-amber-300 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-amber-400 whitespace-nowrap shadow-xl pointer-events-none z-20">
                  Filler / Hesitation
                </span>
              </span>
            );
          }

          return <span key={index}>{token.text}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="brutal-card p-6 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 border-2 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_#0F172A] shrink-0">
            <FileText className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h4 className="text-lg font-black font-heading leading-tight">Spoken Transcript & Filler Word Highlights</h4>
            <p className="text-xs font-semibold opacity-80 mt-0.5">Highlighted terms indicate vocal hesitation or filler crutches</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {fillerCount > 0 && (
            <span className="brutal-badge bg-amber-400 text-slate-950 border-2 border-slate-900 font-black text-xs px-3 py-1 shadow-[2px_2px_0px_#0F172A]">
              {fillerCount} Filler {fillerCount === 1 ? 'Word' : 'Words'}
            </span>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 border-2 border-slate-900 rounded-xl bg-slate-100 dark:bg-slate-800 hover:scale-105 transition-transform shadow-[2px_2px_0px_#0F172A]"
            title={isEditing ? "View Highlights" : "Edit / Paste Text"}
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 border-2 border-slate-900 rounded-xl bg-slate-100 dark:bg-slate-800 hover:scale-105 transition-transform shadow-[2px_2px_0px_#0F172A]"
            title="Copy Transcript"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Transcript Text Content */}
      <div className="my-3 neu-inset p-4 min-h-[130px] max-h-[240px] overflow-y-auto">
        {isEditing ? (
          <textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder="Paste your spoken speech or answer transcript here..."
            className="w-full h-32 bg-transparent text-slate-950 dark:text-slate-100 font-medium text-sm focus:outline-none font-mono resize-none"
          />
        ) : (
          renderHighlightedTranscript()
        )}
      </div>

      {/* Filler word breakdown pills footer */}
      {Object.keys(fillerBreakdown).length > 0 && (
        <div className="pt-3 border-t-2 border-slate-700 flex items-center gap-2 flex-wrap text-xs font-mono font-bold">
          <span className="opacity-80 uppercase tracking-wider">Detected Fillers:</span>
          {Object.entries(fillerBreakdown).map(([word, count]) => (
            <span key={word} className="px-2.5 py-1 bg-amber-400 text-slate-950 border-2 border-slate-900 rounded-lg shadow-[1.5px_1.5px_0px_#0F172A]">
              "{word}": <strong className="font-black text-slate-950">{count}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
