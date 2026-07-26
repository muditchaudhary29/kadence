import pptxgen from 'pptxgenjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pres = new pptxgen();

pres.layout = 'LAYOUT_16x9';

// Define Color Palette
const BG_DARK = '09090B';
const CARD_BG = '18181B';
const CARD_BORDER = '27272A';
const TEXT_WHITE = 'FFFFFF';
const TEXT_MUTED = '94A3B8';
const ACCENT_BLUE = '38BDF8';
const ACCENT_INDIGO = '818CF8';
const ACCENT_EMERALD = '34D399';
const ACCENT_AMBER = 'FBBF24';

// -------------------------------------------------------------
// SLIDE 1: Title Slide
// -------------------------------------------------------------
const slide1 = pres.addSlide();
slide1.background = { color: BG_DARK };

slide1.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 1.2, w: 11.7, h: 4.8,
  fill: { color: CARD_BG },
  line: { color: ACCENT_BLUE, width: 2 }
});

slide1.addText('VoiceCraft / Kadence AI', {
  x: 1.2, y: 1.6, w: 10.9, h: 1.0,
  fontSize: 44, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide1.addText('Next-Generation AI Speech & Interview Coach', {
  x: 1.2, y: 2.6, w: 10.9, h: 0.6,
  fontSize: 24, bold: true, color: ACCENT_BLUE, fontFace: 'Helvetica'
});

slide1.addText('Real-Time Vocal Telemetry  •  STAR Method Radar  •  Notes-to-Questions Engine  •  AI Executive Rewrite', {
  x: 1.2, y: 3.4, w: 10.9, h: 0.5,
  fontSize: 15, color: TEXT_MUTED, fontFace: 'Helvetica'
});

const pills = [
  { text: '🎙️ Live Audio Canvas', x: 1.2 },
  { text: '⚡ WPM Speed Arc', x: 3.8 },
  { text: '🎯 Filler Word Engine', x: 6.4 },
  { text: '📝 PDF / Notes Generator', x: 9.0 }
];
pills.forEach(p => {
  slide1.addShape(pres.ShapeType.roundRect, {
    x: p.x, y: 4.4, w: 2.4, h: 0.6, rectRadius: 0.1,
    fill: { color: '27272A' }, line: { color: ACCENT_INDIGO, width: 1 }
  });
  slide1.addText(p.text, {
    x: p.x, y: 4.4, w: 2.4, h: 0.6,
    fontSize: 12, bold: true, color: TEXT_WHITE, align: 'center', fontFace: 'Helvetica'
  });
});

slide1.addText('Presented by Product & Engineering Team  |  July 2026', {
  x: 1.2, y: 5.3, w: 10.9, h: 0.4,
  fontSize: 12, color: TEXT_MUTED, fontFace: 'Helvetica'
});

slide1.addNotes('Welcome everyone. Today we present VoiceCraft (also known as Kadence AI), an end-to-end AI platform designed to transform how candidates practice and master interview communication.');

// -------------------------------------------------------------
// SLIDE 2: The Core Problem
// -------------------------------------------------------------
const slide2 = pres.addSlide();
slide2.background = { color: BG_DARK };

slide2.addText('THE CORE PROBLEM', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.4,
  fontSize: 14, bold: true, color: ACCENT_BLUE, fontFace: 'Helvetica'
});

slide2.addText('Why Job Seekers & Speakers Struggle in High-Stakes Interviews', {
  x: 0.8, y: 0.9, w: 11.7, h: 0.6,
  fontSize: 28, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

const problems = [
  { title: 'Uncontrolled Pacing & Velocity', desc: 'Nerves cause candidates to speak too fast (>170 WPM) or pause unnaturally, making points hard to follow.', color: 'EF4444' },
  { title: 'Excessive Filler Word Dilution', desc: 'Frequent hesitation terms ("um", "like", "basically", "you know") erode perceived authority and confidence.', color: 'F59E0B' },
  { title: 'Unstructured Response Framework', desc: 'Candidates fail to structure stories around Situation, Task, Action, and Result (STAR), missing key impact metrics.', color: '3B82F6' },
  { title: 'Generic & Unfocused Practice', desc: 'Generic question banks do not prepare candidates for specific resume projects, technical notes, or job specs.', color: '10B981' }
];

problems.forEach((p, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 5.9;
  const y = 1.8 + row * 2.5;

  slide2.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 5.6, h: 2.2,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
  });

  slide2.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 0.15, h: 2.2,
    fill: { color: p.color }
  });

  slide2.addText(p.title, {
    x: x + 0.3, y: y + 0.2, w: 5.1, h: 0.4,
    fontSize: 18, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
  });

  slide2.addText(p.desc, {
    x: x + 0.3, y: y + 0.7, w: 5.1, h: 1.3,
    fontSize: 14, color: TEXT_MUTED, fontFace: 'Helvetica'
  });
});

slide2.addNotes('High-stakes interviews fail not because candidates lack knowledge, but because verbal execution falters under pressure. VoiceCraft directly targets these 4 core friction points.');

// -------------------------------------------------------------
// SLIDE 3: The Solution — VoiceCraft AI
// -------------------------------------------------------------
const slide3 = pres.addSlide();
slide3.background = { color: BG_DARK };

slide3.addText('THE SOLUTION', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.4,
  fontSize: 14, bold: true, color: ACCENT_EMERALD, fontFace: 'Helvetica'
});

slide3.addText('VoiceCraft AI: Real-Time Vocal Telemetry & AI Coaching', {
  x: 0.8, y: 0.9, w: 11.7, h: 0.6,
  fontSize: 28, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

const solutionCards = [
  { icon: '🎙️', title: 'Live Voice Telemetry', desc: 'Web Audio API canvas visualizer & Web Speech API real-time microphone voice-to-text.' },
  { icon: '📊', title: 'Precision Metrics', desc: 'Instant calculation of WPM speed arc, filler word ratio, and vocal confidence scores.' },
  { icon: '🎯', title: 'STAR Radar Analysis', desc: 'Multi-dimensional radar evaluation scoring Situation, Task, Action, & Result completeness.' },
  { icon: '🪄', title: 'Executive AI Rewrite', desc: 'Automated strengths, growth tips, and an executive-level STAR response rewrite.' }
];

solutionCards.forEach((c, idx) => {
  const x = 0.8 + idx * 2.95;
  const y = 1.8;

  slide3.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 2.75, h: 4.8,
    fill: { color: CARD_BG }, line: { color: ACCENT_BLUE, width: 1 }
  });

  slide3.addText(c.icon, {
    x: x, y: y + 0.3, w: 2.75, h: 0.8,
    fontSize: 36, align: 'center'
  });

  slide3.addText(c.title, {
    x: x + 0.2, y: y + 1.2, w: 2.35, h: 0.6,
    fontSize: 18, bold: true, color: TEXT_WHITE, align: 'center', fontFace: 'Helvetica'
  });

  slide3.addText(c.desc, {
    x: x + 0.2, y: y + 1.9, w: 2.35, h: 2.6,
    fontSize: 14, color: TEXT_MUTED, align: 'center', fontFace: 'Helvetica'
  });
});

slide3.addNotes('VoiceCraft transforms subjective interview practice into an objective, data-driven feedback loop powered by live browser telemetry and AI.');

// -------------------------------------------------------------
// SLIDE 4: Feature Deep-Dive — Real-Time Speech Analytics
// -------------------------------------------------------------
const slide4 = pres.addSlide();
slide4.background = { color: BG_DARK };

slide4.addText('FEATURE DEEP-DIVE', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.4,
  fontSize: 14, bold: true, color: ACCENT_INDIGO, fontFace: 'Helvetica'
});

slide4.addText('Real-Time Vocal Telemetry & Visual Analytics', {
  x: 0.8, y: 0.9, w: 11.7, h: 0.6,
  fontSize: 28, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide4.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 1.8, w: 5.6, h: 4.8,
  fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
});

slide4.addText('⚡ Speed & Filler Telemetry', {
  x: 1.1, y: 2.1, w: 5.0, h: 0.4,
  fontSize: 20, bold: true, color: ACCENT_BLUE, fontFace: 'Helvetica'
});

slide4.addText('• WPM Arc Gauge: Tracks speaking rate against optimal 120–160 WPM sweet spot.\n\n• Filler Word Engine: Detects "um", "like", "basically", "you know" with count & ratio.\n\n• Live Transcript Pills: Highlight filler occurrences dynamically inside transcript viewer.\n\n• Confidence Index: Multi-factor vocal stability score calculated continuously.', {
  x: 1.1, y: 2.7, w: 5.0, h: 3.6,
  fontSize: 14, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide4.addShape(pres.ShapeType.rect, {
  x: 6.7, y: 1.8, w: 5.8, h: 4.8,
  fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
});

slide4.addText('🎯 STAR Framework Radar', {
  x: 7.0, y: 2.1, w: 5.2, h: 0.4,
  fontSize: 20, bold: true, color: ACCENT_EMERALD, fontFace: 'Helvetica'
});

slide4.addText('• Situation (25%): Verifies background context and team setup.\n\n• Task (25%): Validates clear responsibility & target objective.\n\n• Action (25%): Evaluates specific personal execution steps & technical details.\n\n• Result (25%): Checks for quantitative impact metrics (% revenue, latency, speedup).', {
  x: 7.0, y: 2.7, w: 5.2, h: 3.6,
  fontSize: 14, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide4.addNotes('This slide highlights our telemetry engine: WPM tracking, filler word detection, and the STAR framework radar breakdown.');

// -------------------------------------------------------------
// SLIDE 5: Feature Deep-Dive — Notes-to-Questions Engine
// -------------------------------------------------------------
const slide5 = pres.addSlide();
slide5.background = { color: BG_DARK };

slide5.addText('SMART QUESTION GENERATION', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.4,
  fontSize: 14, bold: true, color: ACCENT_AMBER, fontFace: 'Helvetica'
});

slide5.addText('Notes-to-Questions AI Engine', {
  x: 0.8, y: 0.9, w: 11.7, h: 0.6,
  fontSize: 28, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

const steps = [
  { num: '01', title: 'Upload Material', desc: 'Drag & drop .txt, .md, or .pdf files. Powered by client-side PDF.js parsing.' },
  { num: '02', title: 'Concept Extraction', desc: 'Extracts technical terms, frameworks, project milestones, & action verbs.' },
  { num: '03', title: 'Question Generation', desc: 'Maps concepts into 5-8 custom STAR, technical, and behavioral questions.' },
  { num: '04', title: '1-Click Practice', desc: 'Click any generated question card to immediately launch a live vocal practice session.' }
];

steps.forEach((s, idx) => {
  const x = 0.8 + idx * 2.95;
  const y = 2.0;

  slide5.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 2.75, h: 4.4,
    fill: { color: CARD_BG }, line: { color: ACCENT_AMBER, width: 1 }
  });

  slide5.addText(s.num, {
    x: x + 0.2, y: y + 0.3, w: 2.35, h: 0.6,
    fontSize: 28, bold: true, color: ACCENT_AMBER, fontFace: 'Helvetica'
  });

  slide5.addText(s.title, {
    x: x + 0.2, y: y + 1.0, w: 2.35, h: 0.6,
    fontSize: 18, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
  });

  slide5.addText(s.desc, {
    x: x + 0.2, y: y + 1.7, w: 2.35, h: 2.3,
    fontSize: 14, color: TEXT_MUTED, fontFace: 'Helvetica'
  });
});

slide5.addNotes('Candidates can upload their own resume notes, project documentation, or study guides to generate hyper-relevant interview questions in seconds.');

// -------------------------------------------------------------
// SLIDE 6: AI Feedback & Executive Rewrite Engine
// -------------------------------------------------------------
const slide6 = pres.addSlide();
slide6.background = { color: BG_DARK };

slide6.addText('AI COACHING ENGINE', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.4,
  fontSize: 14, bold: true, color: ACCENT_BLUE, fontFace: 'Helvetica'
});

slide6.addText('Automated AI Feedback & Executive STAR Rewrite', {
  x: 0.8, y: 0.9, w: 11.7, h: 0.6,
  fontSize: 28, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide6.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 1.8, w: 5.6, h: 4.8,
  fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
});

slide6.addText('💡 Automated Feedback Insights', {
  x: 1.1, y: 2.1, w: 5.0, h: 0.4,
  fontSize: 18, bold: true, color: ACCENT_EMERALD, fontFace: 'Helvetica'
});

slide6.addText('✔ Identified Strengths:\n  • Clear action verbs and logical sequencing.\n  • Effective articulation of technical complexity.\n\n⚠️ Areas for Improvement:\n  • Pacing dropped during technical explanation.\n  • Missing quantifiable metrics in Result section.\n  • Reduced filler word reliance during transitions.', {
  x: 1.1, y: 2.6, w: 5.0, h: 3.7,
  fontSize: 14, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide6.addShape(pres.ShapeType.rect, {
  x: 6.7, y: 1.8, w: 5.8, h: 4.8,
  fill: { color: CARD_BG }, line: { color: ACCENT_INDIGO, width: 1 }
});

slide6.addText('✨ "How to Say It Better" Executive Rewrite', {
  x: 7.0, y: 2.1, w: 5.2, h: 0.4,
  fontSize: 18, bold: true, color: ACCENT_INDIGO, fontFace: 'Helvetica'
});

slide6.addText('Raw Transcript vs. Executive Rewrite:\n\n"Um, so we had this issue with slow database queries..." \n\n⬇️ Executive STAR Rewrite:\n"I led the database optimization initiative (Situation/Task) by implementing Redis query caching and index restructuring (Action), which reduced API P99 latency by 45% (Result)."', {
  x: 7.0, y: 2.6, w: 5.2, h: 3.7,
  fontSize: 14, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide6.addNotes('Our AI rewrite engine transforms casual spoken responses into crisp, executive STAR stories that impress hiring managers.');

// -------------------------------------------------------------
// SLIDE 7: Technical Architecture & Security
// -------------------------------------------------------------
const slide7 = pres.addSlide();
slide7.background = { color: BG_DARK };

slide7.addText('TECHNICAL ARCHITECTURE', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.4,
  fontSize: 14, bold: true, color: ACCENT_INDIGO, fontFace: 'Helvetica'
});

slide7.addText('System Stack, Data Flow & LLM Schema', {
  x: 0.8, y: 0.9, w: 11.7, h: 0.6,
  fontSize: 28, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

const techBoxes = [
  { title: 'Frontend UI & Visuals', items: ['React 18 & Vite', 'Tailwind CSS Dark Theme', 'Recharts Radar & Arc Charts', 'Lucide Icons'] },
  { title: 'Audio & Speech Telemetry', items: ['Web Audio API (AudioContext)', 'AnalyserNode Canvas Wave', 'Web Speech API STT', 'Real-Time WPM Calculator'] },
  { title: 'Document & State Engine', items: ['FileReader API (.txt/.md)', 'PDF.js Client-Side Parser', 'localStorage Session Vault', 'Keyword Extractor'] },
  { title: 'LLM Orchestration', items: ['Validated JSON Output Schema', 'Modular System Prompt', 'Multi-Provider (GPT-4o/Gemini/Claude)', 'Offline-First Fallback'] }
];

techBoxes.forEach((tb, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 5.9;
  const y = 1.8 + row * 2.5;

  slide7.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 5.6, h: 2.2,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
  });

  slide7.addText(tb.title, {
    x: x + 0.3, y: y + 0.2, w: 5.0, h: 0.4,
    fontSize: 18, bold: true, color: ACCENT_BLUE, fontFace: 'Helvetica'
  });

  const listText = tb.items.map(i => `• ${i}`).join('\n');
  slide7.addText(listText, {
    x: x + 0.3, y: y + 0.7, w: 5.0, h: 1.3,
    fontSize: 14, color: TEXT_WHITE, fontFace: 'Helvetica'
  });
});

slide7.addNotes('VoiceCraft is engineered cleanly with client-side speech telemetry, zero latency audio visualization, and modular LLM orchestration.');

// -------------------------------------------------------------
// SLIDE 8: Product Roadmap & Future Vision
// -------------------------------------------------------------
const slide8 = pres.addSlide();
slide8.background = { color: BG_DARK };

slide8.addText('PRODUCT ROADMAP', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.4,
  fontSize: 14, bold: true, color: ACCENT_EMERALD, fontFace: 'Helvetica'
});

slide8.addText('Roadmap to Next-Gen Voice Coaching', {
  x: 0.8, y: 0.9, w: 11.7, h: 0.6,
  fontSize: 28, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

const roadmap = [
  { phase: 'Phase 1 (Current)', status: 'COMPLETED', title: 'Web Voice Telemetry & Notes Engine', desc: 'Real-time WPM, filler word detection, STAR radar chart, document parser, local session history.' },
  { phase: 'Phase 2 (Q3 2026)', status: 'IN DEVELOPMENT', title: 'Multimodal Video & Gesture Analysis', desc: 'Webcam eye-contact tracking, body posture score, micro-expression confidence feedback.' },
  { phase: 'Phase 3 (Q4 2026)', status: 'PLANNED', title: 'Adaptive AI Conversational Interviewer', desc: 'Real-time voice avatar asking adaptive follow-up questions with enterprise team dashboards.' }
];

roadmap.forEach((r, idx) => {
  const y = 1.8 + idx * 1.6;

  slide8.addShape(pres.ShapeType.rect, {
    x: 0.8, y: y, w: 11.7, h: 1.4,
    fill: { color: CARD_BG }, line: { color: idx === 0 ? ACCENT_EMERALD : CARD_BORDER, width: 1 }
  });

  slide8.addText(`${r.phase}  |  ${r.status}`, {
    x: 1.1, y: y + 0.15, w: 11.1, h: 0.35,
    fontSize: 12, bold: true, color: idx === 0 ? ACCENT_EMERALD : ACCENT_BLUE, fontFace: 'Helvetica'
  });

  slide8.addText(r.title, {
    x: 1.1, y: y + 0.45, w: 11.1, h: 0.4,
    fontSize: 18, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
  });

  slide8.addText(r.desc, {
    x: 1.1, y: y + 0.85, w: 11.1, h: 0.45,
    fontSize: 14, color: TEXT_MUTED, fontFace: 'Helvetica'
  });
});

slide8.addNotes('Thank you! VoiceCraft is ready to empower millions of candidates with AI-powered verbal confidence.');

// Save presentation
const outputPath = path.join(__dirname, 'VoiceCraft_Presentation.pptx');
pres.writeFile({ fileName: outputPath }).then(() => {
  console.log(`Successfully generated PPTX at: ${outputPath}`);
}).catch(err => {
  console.error('Error generating PPTX:', err);
});
