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
        <p className="text-zinc-500 italic text-sm">
          No speech transcript recorded yet. Click "Start Recording" or paste a transcript below.
        </p>
      );
    }

    // First scan multi-word phrases
    let processed = transcript;
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
    const tokens = [];
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

    // Filter out spaces to compute context prev/next
    const nonSpaceWords = wordTokens.filter(t => !t.isSpace);

    return (
      <div className="leading-relaxed text-zinc-200 text-sm font-sans tracking-wide">
        {wordTokens.map((token, index) => {
          if (token.isSpace) {
            return <span key={index}>{token.text}</span>;
          }

          // Check if token overlaps with a multi-phrase match
          const inMultiPhrase = multiMatches.some(m => token.start >= m.start && token.end <= m.end);

          // Find prev and next word tokens for context check
          const nonSpaceIndex = nonSpaceWords.indexOf(token);
          const prevWord = nonSpaceIndex > 0 ? nonSpaceWords[nonSpaceIndex - 1].text : "";
          const nextWord = nonSpaceIndex < nonSpaceWords.length - 1 ? nonSpaceWords[nonSpaceIndex + 1].text : "";

          const isSingleFiller = isFillerWithContext(token.text, prevWord, nextWord);

          if (inMultiPhrase || isSingleFiller) {
            return (
              <span
                key={index}
                className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium text-xs group relative cursor-help"
              >
                {token.text}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-950 text-amber-400 text-[10px] px-2 py-0.5 rounded border border-amber-500/30 whitespace-nowrap shadow-xl pointer-events-none z-20">
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
    <div className="glass-card rounded-2xl p-5 border border-zinc-800 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">Spoken Transcript & Filler Word Highlights</h4>
            <p className="text-xs text-zinc-400">Highlighted terms indicate vocal hesitation or filler crutches</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {fillerCount > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
              {fillerCount} Filler {fillerCount === 1 ? 'Word' : 'Words'}
            </span>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
            title={isEditing ? "View Highlights" : "Edit / Paste Text"}
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Copy Transcript"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Transcript Text Content */}
      <div className="my-4 min-h-[120px] max-h-[220px] overflow-y-auto pr-2">
        {isEditing ? (
          <textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder="Paste your spoken speech or answer transcript here..."
            className="w-full h-28 bg-zinc-950/80 text-zinc-100 border border-indigo-500/40 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 font-mono resize-none"
          />
        ) : (
          renderHighlightedTranscript()
        )}
      </div>

      {/* Filler word breakdown pills footer */}
      {Object.keys(fillerBreakdown).length > 0 && (
        <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-zinc-400 font-medium">Detected:</span>
          {Object.entries(fillerBreakdown).map(([word, count]) => (
            <span key={word} className="px-2 py-0.5 bg-zinc-900 border border-amber-500/30 text-amber-300 rounded-md font-mono">
              "{word}": <strong className="text-white">{count}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
