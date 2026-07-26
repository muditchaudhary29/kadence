import pptxgen from 'pptxgenjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

// Linear / Vercel Dark UI Palette
const BG_DARK = '09090B';
const CARD_BG = '18181B';
const CARD_BORDER = '27272A';
const TEXT_WHITE = 'FFFFFF';
const TEXT_MUTED = '94A3B8';
const NEON_CYAN = '06B6D4';
const NEON_PURPLE = 'A855F7';
const NEON_PINK = 'EC4899';
const NEON_YELLOW = 'FACC15';
const NEON_EMERALD = '10B981';

const imgHero = path.join(__dirname, 'public', 'kadence_hero.jpg');
const imgPanic = path.join(__dirname, 'public', 'interview_panic.jpg');
const imgNotes = path.join(__dirname, 'public', 'kadence_notes.jpg');
const imgTransform = path.join(__dirname, 'public', 'executive_transformation.jpg');

// -------------------------------------------------------------
// SLIDE 1: Title Slide (KADENCE AI Only)
// -------------------------------------------------------------
const slide1 = pres.addSlide();
slide1.background = { color: BG_DARK };

slide1.addShape(pres.ShapeType.rect, {
  x: 0.6, y: 0.6, w: 12.1, h: 6.0,
  fill: { color: CARD_BG },
  line: { color: NEON_CYAN, width: 2 }
});

slide1.addText('⚡ KADENCE AI', {
  x: 1.0, y: 1.0, w: 11.3, h: 0.6,
  fontSize: 20, bold: true, color: NEON_CYAN, fontFace: 'Helvetica'
});

slide1.addText('How to Stop Sounding Like a Nervous Potato in Technical Interviews 🥔✨', {
  x: 1.0, y: 1.6, w: 11.3, h: 1.2,
  fontSize: 34, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide1.addText('The Real-Time Vocal Telemetry Shield that Banishes "Um", "Like", & Panic Silences Forever.', {
  x: 1.0, y: 2.9, w: 11.3, h: 0.5,
  fontSize: 16, color: NEON_YELLOW, fontFace: 'Helvetica'
});

const pills = [
  { text: '🚨 47 Filler Words / Min', x: 1.0, color: NEON_PINK },
  { text: '🏎️ 220 WPM Panic Speed', x: 3.9, color: NEON_YELLOW },
  { text: '👻 Ghost Result Syndrome', x: 6.8, color: NEON_PURPLE },
  { text: '🪄 1-Click Executive STAR', x: 9.7, w: 2.6, color: NEON_EMERALD }
];
pills.forEach(p => {
  slide1.addShape(pres.ShapeType.roundRect, {
    x: p.x, y: 3.6, w: p.w || 2.7, h: 0.6, rectRadius: 0.15,
    fill: { color: '09090B' }, line: { color: p.color, width: 1.5 }
  });
  slide1.addText(p.text, {
    x: p.x, y: 3.6, w: p.w || 2.7, h: 0.6,
    fontSize: 11, bold: true, color: TEXT_WHITE, align: 'center', fontFace: 'Helvetica'
  });
});

// Embedded Dashboard Hero Image
slide1.addImage({
  path: imgHero,
  x: 1.0, y: 4.4, w: 11.3, h: 2.0
});

slide1.addNotes('Welcome everyone! Today we present KADENCE AI, the ultimate voice telemetry engine.');

// -------------------------------------------------------------
// SLIDE 2: Expectation vs Reality (With Meme Image)
// -------------------------------------------------------------
const slide2 = pres.addSlide();
slide2.background = { color: BG_DARK };

slide2.addText('KADENCE AI  |  PROBLEM DIAGNOSIS', {
  x: 0.8, y: 0.4, w: 11.7, h: 0.3,
  fontSize: 11, bold: true, color: NEON_CYAN, fontFace: 'Helvetica'
});

slide2.addText('Expectation vs. Reality: The Interview Meltdown 🤡', {
  x: 0.8, y: 0.7, w: 11.7, h: 0.5,
  fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

// Left Column: Meme Image
slide2.addImage({
  path: imgPanic,
  x: 0.8, y: 1.4, w: 5.8, h: 5.2
});

// Right Column: Text Breakdown
slide2.addShape(pres.ShapeType.rect, {
  x: 6.8, y: 1.4, w: 5.7, h: 5.2,
  fill: { color: CARD_BG }, line: { color: NEON_PINK, width: 2 }
});

slide2.addText('🫠 What Happens 30 Seconds into Live Interview', {
  x: 7.1, y: 1.7, w: 5.1, h: 0.4,
  fontSize: 17, bold: true, color: NEON_PINK, fontFace: 'Helvetica'
});

slide2.addText('• "Um, so... basically... like... you know..." 🔁\n\n• Brain reboots like Windows 95 mid-sentence 💻\n\n• Speaking at 210 WPM like Eminem speed-rapping 🎤\n\n• Forgot the Result entirely & ended with "...and yeah" 💀\n\n• Panic sweating while interviewers stare blankly 😳', {
  x: 7.1, y: 2.3, w: 5.1, h: 4.0,
  fontSize: 13, color: TEXT_WHITE, fontFace: 'Helvetica'
});

// -------------------------------------------------------------
// SLIDE 3: The 4 Villains Ruining Your Interviews
// -------------------------------------------------------------
const slide3 = pres.addSlide();
slide3.background = { color: BG_DARK };

slide3.addText('KADENCE AI  |  THE HALL OF SHAME 🏆', {
  x: 0.8, y: 0.4, w: 11.7, h: 0.3,
  fontSize: 11, bold: true, color: NEON_YELLOW, fontFace: 'Helvetica'
});

slide3.addText('Meet the 4 Villains Exterminated by KADENCE AI', {
  x: 0.8, y: 0.7, w: 11.7, h: 0.5,
  fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

const villains = [
  { icon: '🧟', name: 'The Filler Fiend', desc: 'Averages 18 "um"s and 24 "like"s per minute. Dilutes authority by 90%.', border: NEON_PINK },
  { icon: '🏎️', name: 'The Speed Demon', desc: 'Speaks at 220 WPM without breathing. Listener needs CPR.', border: NEON_YELLOW },
  { icon: '🦥', name: 'The Sloth Pauser', desc: '4-second awkward silences between sentences while brain reboots.', border: NEON_CYAN },
  { icon: '👻', name: 'The Ghost Result', desc: 'Tells a 5-minute story... forgets to mention what actually happened.', border: NEON_PURPLE }
];

villains.forEach((v, idx) => {
  const x = 0.8 + idx * 2.95;
  const y = 1.4;

  slide3.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 2.75, h: 5.2,
    fill: { color: CARD_BG }, line: { color: v.border, width: 2 }
  });

  slide3.addText(v.icon, {
    x: x, y: y + 0.4, w: 2.75, h: 0.8,
    fontSize: 40, align: 'center'
  });

  slide3.addText(v.name, {
    x: x + 0.15, y: y + 1.4, w: 2.45, h: 0.6,
    fontSize: 17, bold: true, color: TEXT_WHITE, align: 'center', fontFace: 'Helvetica'
  });

  slide3.addText(v.desc, {
    x: x + 0.2, y: y + 2.2, w: 2.35, h: 2.6,
    fontSize: 13, color: TEXT_MUTED, align: 'center', fontFace: 'Helvetica'
  });
});

// -------------------------------------------------------------
// SLIDE 4: KADENCE AI Telemetry Engine & UI
// -------------------------------------------------------------
const slide4 = pres.addSlide();
slide4.background = { color: BG_DARK };

slide4.addText('KADENCE AI  |  CORE PLATFORM', {
  x: 0.8, y: 0.4, w: 11.7, h: 0.3,
  fontSize: 11, bold: true, color: NEON_CYAN, fontFace: 'Helvetica'
});

slide4.addText('KADENCE AI: Real-Time Vocal Telemetry & Visual Analytics', {
  x: 0.8, y: 0.7, w: 11.7, h: 0.5,
  fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

// Embedded Dashboard Visual
slide4.addImage({
  path: imgHero,
  x: 0.8, y: 1.4, w: 6.2, h: 5.2
});

// Right Column: Feature Cards
const features = [
  { title: '🎙️ Live Audio Waveform', desc: 'Real-time Web Audio API canvas visualizer to monitor voice energy.', color: NEON_CYAN },
  { title: '⚡ WPM Speed Arc Gauge', desc: 'Keeps pace in optimal 120–160 WPM green zone. Red = Slow down!', color: NEON_YELLOW },
  { title: '🎯 Filler Word Engine', desc: 'Detects "um", "like", "basically" with red transcript pill markers.', color: NEON_PINK },
  { title: '📊 STAR Radar Analysis', desc: 'Evaluates Situation, Task, Action, & Result completeness live.', color: NEON_EMERALD }
];

features.forEach((f, idx) => {
  const y = 1.4 + idx * 1.3;
  slide4.addShape(pres.ShapeType.rect, {
    x: 7.2, y: y, w: 5.3, h: 1.15,
    fill: { color: CARD_BG }, line: { color: f.color, width: 1.5 }
  });
  slide4.addText(f.title, {
    x: 7.4, y: y + 0.1, w: 4.9, h: 0.35,
    fontSize: 14, bold: true, color: f.color, fontFace: 'Helvetica'
  });
  slide4.addText(f.desc, {
    x: 7.4, y: y + 0.45, w: 4.9, h: 0.6,
    fontSize: 11, color: TEXT_MUTED, fontFace: 'Helvetica'
  });
});

// -------------------------------------------------------------
// SLIDE 5: Notes-to-Questions AI Engine
// -------------------------------------------------------------
const slide5 = pres.addSlide();
slide5.background = { color: BG_DARK };

slide5.addText('KADENCE AI  |  SMART QUESTION GENERATION 🧠⚡', {
  x: 0.8, y: 0.4, w: 11.7, h: 0.3,
  fontSize: 11, bold: true, color: NEON_YELLOW, fontFace: 'Helvetica'
});

slide5.addText('Notes-to-Questions: Drop Messy Docs -> Get FAANG Questions', {
  x: 0.8, y: 0.7, w: 11.7, h: 0.5,
  fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

// Embedded Notes AI Image
slide5.addImage({
  path: imgNotes,
  x: 0.8, y: 1.4, w: 6.2, h: 5.2
});

const steps = [
  { num: '📁 Step 1', title: 'Dump Messy Notes', desc: 'Drag & drop .txt, .md, or .pdf project notes.' },
  { num: '🤖 Step 2', title: 'Concept Sniffer', desc: 'Extracts technical buzzwords, terms, & milestones.' },
  { num: '🔥 Step 3', title: 'Grill Generator', desc: 'Spits out 5-8 hyper-specific STAR questions.' },
  { num: '🚀 Step 4', title: '1-Click Practice', desc: 'Click any card & start live vocal practice.' }
];

steps.forEach((s, idx) => {
  const y = 1.4 + idx * 1.3;
  slide5.addShape(pres.ShapeType.rect, {
    x: 7.2, y: y, w: 5.3, h: 1.15,
    fill: { color: CARD_BG }, line: { color: NEON_YELLOW, width: 1.5 }
  });
  slide5.addText(`${s.num}: ${s.title}`, {
    x: 7.4, y: y + 0.1, w: 4.9, h: 0.35,
    fontSize: 14, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
  });
  slide5.addText(s.desc, {
    x: 7.4, y: y + 0.45, w: 4.9, h: 0.6,
    fontSize: 11, color: TEXT_MUTED, fontFace: 'Helvetica'
  });
});

// -------------------------------------------------------------
// SLIDE 6: Executive STAR Transformer
// -------------------------------------------------------------
const slide6 = pres.addSlide();
slide6.background = { color: BG_DARK };

slide6.addText('KADENCE AI  |  AI REWRITE ENGINE 🪄✨', {
  x: 0.8, y: 0.4, w: 11.7, h: 0.3,
  fontSize: 11, bold: true, color: NEON_PURPLE, fontFace: 'Helvetica'
});

slide6.addText('The "How to Say It Better" Executive STAR Transformer', {
  x: 0.8, y: 0.7, w: 11.7, h: 0.5,
  fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

// Embedded Transformation Graphic Image
slide6.addImage({
  path: imgTransform,
  x: 0.8, y: 1.4, w: 11.7, h: 5.2
});

// -------------------------------------------------------------
// SLIDE 7: Stats & Impact
// -------------------------------------------------------------
const slide7 = pres.addSlide();
slide7.background = { color: BG_DARK };

slide7.addText('KADENCE AI  |  MEASURABLE IMPACT 📈', {
  x: 0.8, y: 0.4, w: 11.7, h: 0.3,
  fontSize: 11, bold: true, color: NEON_EMERALD, fontFace: 'Helvetica'
});

slide7.addText('Why KADENCE AI Will Make You Unstoppable', {
  x: 0.8, y: 0.7, w: 11.7, h: 0.5,
  fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

const stats = [
  { val: '0%', label: 'Awkward Silence', sub: 'No more blanking mid-interview' },
  { val: '-85%', label: 'Filler Word Count', sub: 'Say goodbye to "um" and "like"' },
  { val: '100%', label: 'Quantified Impact', sub: 'Every story has a real Result' },
  { val: '10x', label: 'Offer Rate Boost', sub: 'Confidence is 90% of the battle' }
];

stats.forEach((st, idx) => {
  const x = 0.8 + idx * 2.95;
  const y = 1.4;

  slide7.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 2.75, h: 5.2,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
  });

  slide7.addText(st.val, {
    x: x + 0.1, y: y + 0.8, w: 2.55, h: 1.0,
    fontSize: 44, bold: true, color: NEON_CYAN, align: 'center', fontFace: 'Helvetica'
  });

  slide7.addText(st.label, {
    x: x + 0.1, y: y + 2.0, w: 2.55, h: 0.6,
    fontSize: 18, bold: true, color: TEXT_WHITE, align: 'center', fontFace: 'Helvetica'
  });

  slide7.addText(st.sub, {
    x: x + 0.2, y: y + 2.8, w: 2.35, h: 1.8,
    fontSize: 13, color: TEXT_MUTED, align: 'center', fontFace: 'Helvetica'
  });
});

// -------------------------------------------------------------
// SLIDE 8: Conclusion & Call to Action (KADENCE AI Only)
// -------------------------------------------------------------
const slide8 = pres.addSlide();
slide8.background = { color: BG_DARK };

slide8.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 0.8, w: 11.7, h: 5.6,
  fill: { color: CARD_BG },
  line: { color: NEON_CYAN, width: 3 }
});

slide8.addText('🎉 GO FORTH & GET HIRED!', {
  x: 1.2, y: 1.4, w: 10.9, h: 0.8,
  fontSize: 40, bold: true, color: TEXT_WHITE, align: 'center', fontFace: 'Helvetica'
});

slide8.addText('KADENCE AI is ready to supercharge your vocal confidence.', {
  x: 1.2, y: 2.4, w: 10.9, h: 0.6,
  fontSize: 20, color: NEON_CYAN, align: 'center', fontFace: 'Helvetica'
});

slide8.addText('Any Questions?  (Or are you too busy counting your "ums" right now? 😉)', {
  x: 1.2, y: 3.4, w: 10.9, h: 0.8,
  fontSize: 18, color: NEON_YELLOW, align: 'center', fontFace: 'Helvetica'
});

slide8.addShape(pres.ShapeType.roundRect, {
  x: 4.2, y: 4.5, w: 4.8, h: 0.8, rectRadius: 0.2,
  fill: { color: NEON_CYAN }
});

slide8.addText('🚀 Try KADENCE AI Now', {
  x: 4.2, y: 4.5, w: 4.8, h: 0.8,
  fontSize: 18, bold: true, color: '09090B', align: 'center', fontFace: 'Helvetica'
});

// Output
const outputPath = path.join(__dirname, 'Kadence_AI_Presentation.pptx');
pres.writeFile({ fileName: outputPath }).then(() => {
  console.log(`Successfully generated Kadence AI PPTX at: ${outputPath}`);
}).catch(err => {
  console.error('Error generating PPTX:', err);
});
