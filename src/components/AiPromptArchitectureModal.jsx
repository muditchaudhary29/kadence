import React, { useState } from 'react';
import { Code, Copy, Check, X, Terminal, Cpu, Database } from 'lucide-react';

export default function AiPromptArchitectureModal({ isOpen, onClose }) {
  const [copiedSection, setCopiedSection] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const systemPrompt = `You are VoiceCraft AI, an expert Executive Speech & Interview Coach. 
Analyze the provided speech transcript and return a strictly validated JSON response matching the structure below.

Evaluate:
1. WPM (Words Per Minute based on duration).
2. Filler Words ("um", "uh", "like", "you know", etc.) with exact occurrences.
3. Vocal Confidence & Tone Score (0-100).
4. STAR Method Analysis (Situation, Task, Action, Result scores out of 100).
5. Actionable Strengths and Areas for Improvement.
6. Executive Rewrite ("How to Say It Better") adhering to high-impact STAR structure.`;

  const jsonSchema = `{
  "type": "object",
  "properties": {
    "metrics": {
      "type": "object",
      "properties": {
        "wpm": { "type": "integer", "description": "Words per minute speed" },
        "wpm_status": { "type": "string", "enum": ["Too Slow", "Optimal", "Too Fast"] },
        "confidence_score": { "type": "integer", "minimum": 0, "maximum": 100 },
        "filler_count": { "type": "integer" },
        "filler_percentage": { "type": "number" },
        "filler_breakdown": { "type": "object", "additionalProperties": { "type": "integer" } }
      },
      "required": ["wpm", "wpm_status", "confidence_score", "filler_count"]
    },
    "star_method": {
      "type": "object",
      "properties": {
        "overall_score": { "type": "integer" },
        "situation": { "type": "integer" },
        "task": { "type": "integer" },
        "action": { "type": "integer" },
        "result": { "type": "integer" }
      },
      "required": ["overall_score", "situation", "task", "action", "result"]
    },
    "strengths": { "type": "array", "items": { "type": "string" } },
    "areas_for_improvement": { "type": "array", "items": { "type": "string" } },
    "executive_rewrite": { "type": "string" }
  },
  "required": ["metrics", "star_method", "strengths", "areas_for_improvement", "executive_rewrite"]
}`;

  const pythonApiCode = `import openai

client = openai.OpenAI(api_key="YOUR_OPENAI_API_KEY")

def analyze_speech(transcript_text: str, duration_seconds: int = 45):
    response = client.chat.completions.create(
        model="gpt-4o",
        response_format={ "type": "json_object" },
        messages=[
            {
                "role": "system",
                "content": """You are an expert Executive Interview Coach. Analyze the transcript and output strict JSON according to the schema provided."""
            },
            {
                "role": "user",
                "content": f"Audio Duration: {duration_seconds}s. Transcript: {transcript_text}"
            }
        ],
        temperature=0.2
    )
    return response.choices[0].message.content`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-indigo-500/30 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">LLM API & Structured JSON Architecture</h3>
              <p className="text-xs text-zinc-400">OpenAI / Claude / Gemini System Prompt & Execution Code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-mono">
          {/* System Prompt Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-indigo-400 font-sans font-semibold flex items-center gap-1.5 text-sm">
                <Terminal className="w-4 h-4" /> System Prompt Definition
              </span>
              <button
                onClick={() => copyToClipboard(systemPrompt, 'prompt')}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700 flex items-center gap-1 font-sans"
              >
                {copiedSection === 'prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'prompt' ? 'Copied' : 'Copy Prompt'}
              </button>
            </div>
            <pre className="p-3 bg-zinc-950 text-zinc-300 rounded-xl border border-zinc-800 whitespace-pre-wrap">
              {systemPrompt}
            </pre>
          </div>

          {/* JSON Schema Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-400 font-sans font-semibold flex items-center gap-1.5 text-sm">
                <Database className="w-4 h-4" /> Structured JSON Output Schema
              </span>
              <button
                onClick={() => copyToClipboard(jsonSchema, 'schema')}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700 flex items-center gap-1 font-sans"
              >
                {copiedSection === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'schema' ? 'Copied' : 'Copy Schema'}
              </button>
            </div>
            <pre className="p-3 bg-zinc-950 text-purple-300/90 rounded-xl border border-zinc-800 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {jsonSchema}
            </pre>
          </div>

          {/* Python API Code Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-cyan-400 font-sans font-semibold flex items-center gap-1.5 text-sm">
                <Code className="w-4 h-4" /> OpenAI / Claude Integration Code
              </span>
              <button
                onClick={() => copyToClipboard(pythonApiCode, 'code')}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700 flex items-center gap-1 font-sans"
              >
                {copiedSection === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'code' ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <pre className="p-3 bg-zinc-950 text-cyan-300/90 rounded-xl border border-zinc-800 whitespace-pre-wrap">
              {pythonApiCode}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/80 flex justify-end font-sans">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
}
