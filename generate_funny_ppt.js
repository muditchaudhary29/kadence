import pptxgen from 'pptxgenjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

// Vibrant Modern Dark Palette with Funny Punchy Colors
const BG_DARK = '0F172A';        // Deep slate/navy
const CARD_BG = '1E293B';        // Card backdrop
const CARD_BORDER = '334155';    // Border slate
const TEXT_WHITE = 'FFFFFF';
const TEXT_MUTED = '94A3B8';
const NEON_CYAN = '06B6D4';      // Electric Cyan
const NEON_PINK = 'EC4899';      // Hot Pink
const NEON_YELLOW = 'FACC15';    // Bright Yellow
const NEON_GREEN = '10B981';     // Electric Emerald
const NEON_PURPLE = 'A855F7';    // Electric Purple

// -------------------------------------------------------------
// SLIDE 1: Title Slide (Hilarious Hook)
// -------------------------------------------------------------
const slide1 = pres.addSlide();
slide1.background = { color: BG_DARK };

slide1.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 0.8, w: 11.7, h: 5.6,
  fill: { color: CARD_BG },
  line: { color: NEON_PINK, width: 3 }
});

slide1.addText('🗣️ VOICE CRAFT (KADENCE AI)', {
  x: 1.2, y: 1.2, w: 10.9, h: 0.5,
  fontSize: 16, bold: true, color: NEON_CYAN, fontFace: 'Helvetica'
});

slide1.addText('How to Stop Sounding Like a Nervous Potato in Technical Interviews 🥔✨', {
  x: 1.2, y: 1.8, w: 10.9, h: 1.4,
  fontSize: 36, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide1.addText('The AI-Powered Vocal Telemetry Engine That Banishes "Um", "Like", & Awkward Panic Silences Forever.', {
  x: 1.2, y: 3.3, w: 10.9, h: 0.6,
  fontSize: 16, color: NEON_YELLOW, fontFace: 'Helvetica'
});

const pills = [
  { text: '🚨 47 Filler Words / Min', x: 1.2, color: NEON_PINK },
  { text: '🏎️ 220 WPM Panic Velocity', x: 4.1, color: NEON_YELLOW },
  { text: '👻 The Ghost Result Syndrome', x: 7.0, color: NEON_PURPLE },
  { text: '🪄 1-Click Executive Magic', x: 9.9, w: 2.2, color: NEON_GREEN }
];
pills.forEach(p => {
  slide1.addShape(pres.ShapeType.roundRect, {
    x: p.x, y: 4.2, w: p.w || 2.7, h: 0.7, rectRadius: 0.15,
    fill: { color: '0F172A' }, line: { color: p.color, width: 2 }
  });
  slide1.addText(p.text, {
    x: p.x, y: 4.2, w: p.w || 2.7, h: 0.7,
    fontSize: 12, bold: true, color: TEXT_WHITE, align: 'center', fontFace: 'Helvetica'
  });
});

slide1.addText('Prepared for humans who want to get hired without sweating through their shirt  |  July 2026', {
  x: 1.2, y: 5.4, w: 10.9, h: 0.4,
  fontSize: 11, color: TEXT_MUTED, fontFace: 'Helvetica'
});

slide1.addNotes('Welcome everyone! Let us talk about interview coaching—not the boring textbook stuff, but how to actually stop freezing up and rambling when a hiring manager asks you a tough question.');

// -------------------------------------------------------------
// SLIDE 2: The Anatomy of an Interview Meltdown
// -------------------------------------------------------------
const slide2 = pres.addSlide();
slide2.background = { color: BG_DARK };

slide2.addText('EXPECTATION VS REALITY 🤡', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.4,
  fontSize: 14, bold: true, color: NEON_PINK, fontFace: 'Helvetica'
});

slide2.addText('The Anatomy of an Interview Meltdown', {
  x: 0.8, y: 0.9, w: 11.7, h: 0.6,
  fontSize: 28, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

// Left Card: Expectations
slide2.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 1.8, w: 5.6, h: 4.8,
  fill: { color: CARD_BG }, line: { color: NEON_GREEN, width: 2 }
});

slide2.addText('😎 Me Practicing in Front of the Mirror', {
  x: 1.1, y: 2.1, w: 5.0, h: 0.4,
  fontSize: 18, bold: true, color: NEON_GREEN, fontFace: 'Helvetica'
});

slide2.addText('• Smooth, confident posture 🗿\n\n• Flawless STAR framework execution ✨\n\n• Speaking at a crisp 130 WPM executive velocity 👔\n\n• Zero hesitation, zero sweat, pure charisma 🔥', {
  x: 1.1, y: 2.7, w: 5.0, h: 3.6,
  fontSize: 14, color: TEXT_WHITE, fontFace: 'Helvetica'
});

// Right Card: Reality
slide2.addShape(pres.ShapeType.rect, {
  x: 6.7, y: 1.8, w: 5.8, h: 4.8,
  fill: { color: CARD_BG }, line: { color: NEON_PINK, width: 2 }
});

slide2.addText('🫠 Me 30 Seconds into the Live Interview', {
  x: 7.0, y: 2.1, w: 5.2, h: 0.4,
  fontSize: 18, bold: true, color: NEON_PINK, fontFace: 'Helvetica'
});

slide2.addText('• "Um, so... basically... like... you know..." 🔁\n\n• Brain reboots like Windows 95 mid-sentence 💻\n\n• Speaking at 210 WPM like Eminem speed-rapping 🎤\n\n• Forgot the Result entirely and ended with "...and yeah" 💀', {
  x: 7.0, y: 2.7, w: 5.2, h: 3.6,
  fontSize: 14, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide2.addNotes('We have all been there. In front of the mirror, we sound like Steve Jobs. In front of the interviewer, we sound like a glitching chatbot.');

// -------------------------------------------------------------
// SLIDE 3: The 4 Villains of Bad Interviewing
// -------------------------------------------------------------
const slide3 = pres.addSlide();
slide3.background = { color: BG_DARK };

slide3.addText('THE HALL OF SHAME 🏆', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.4,
  fontSize: 14, bold: true, color: NEON_YELLOW, fontFace: 'Helvetica'
});

slide3.addText('Meet the 4 Villains Ruining Your Interviews', {
  x: 0.8, y: 0.9, w: 11.7, h: 0.6,
  fontSize: 28, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

const villains = [
  { icon: '🧟', name: 'The Filler Fiend', desc: 'Averages 18 "um"s and 24 "like"s per minute. Dilutes authority by 90%.', border: NEON_PINK },
  { icon: '🏎️', name: 'The Speed Demon', desc: 'Speaks at 220 WPM without taking a single breath. Listener needs CPR.', border: NEON_YELLOW },
  { icon: '🦥', name: 'The Sloth Pauser', desc: '4-second awkward silences between sentences while brain reboots.', border: NEON_CYAN },
  { icon: '👻', name: 'The Ghost Result', desc: 'Tells a 5-minute story... forgets to mention what actually happened.', border: NEON_PURPLE }
];

villains.forEach((v, idx) => {
  const x = 0.8 + idx * 2.95;
  const y = 1.8;

  slide3.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 2.75, h: 4.8,
    fill: { color: CARD_BG }, line: { color: v.border, width: 2 }
  });

  slide3.addText(v.icon, {
    x: x, y: y + 0.4, w: 2.75, h: 0.8,
    fontSize: 40, align: 'center'
  });

  slide3.addText(v.name, {
    x: x + 0.15, y: y + 1.3, w: 2.45, h: 0.6,
    fontSize: 17, bold: true, color: TEXT_WHITE, align: 'center', fontFace: 'Helvetica'
  });

  slide3.addText(v.desc, {
    x: x + 0.2, y: y + 2.0, w: 2.35, h: 2.4,
    fontSize: 13, color: TEXT_MUTED, align: 'center', fontFace: 'Helvetica'
  });
});

slide3.addNotes('These 4 villains attack every candidate under stress. VoiceCraft was created to exterminate them.');

// -------------------------------------------------------------
// SLIDE 4: Enter VoiceCraft (Kadence AI)
// -------------------------------------------------------------
const slide4 = pres.addSlide();
slide4.background = { color: BG_DARK };

slide4.addText('THE SUPERHERO ARRIVES 🦸‍♂️', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.4,
  fontSize: 14, bold: true, color: NEON_CYAN, fontFace: 'Helvetica'
});

slide4.addText('VoiceCraft (Kadence AI): Your Real-Time Vocal Telemetry Shield', {
  x: 0.8, y: 0.9, w: 11.7, h: 0.6,
  fontSize: 28, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

const features = [
  { title: '🎙️ Live Audio Waveform', desc: 'Real-time Web Audio canvas visualizer so you can see your voice energy live.' },
  { title: '⚡ WPM Speed Arc Gauge', desc: 'Keeps you right in the 120–160 WPM sweet spot. Green light = Exec speed, Red light = Chill out!' },
  { title: '🎯 Filler Word Exterminator', desc: 'Detects "um", "like", "basically" instantly. Highlights them in red pill badges for public shame!' },
  { title: '📊 STAR Radar Analysis', desc: 'Visual multi-axis radar chart checking if you gave a real Result or just handed out vibes.' }
];

features.forEach((f, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 5.9;
  const y = 1.8 + row * 2.5;

  slide4.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 5.6, h: 2.2,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
  });

  slide4.addText(f.title, {
    x: x + 0.3, y: y + 0.2, w: 5.0, h: 0.4,
    fontSize: 18, bold: true, color: NEON_CYAN, fontFace: 'Helvetica'
  });

  slide4.addText(f.desc, {
    x: x + 0.3, y: y + 0.7, w: 5.0, h: 1.3,
    fontSize: 14, color: TEXT_MUTED, fontFace: 'Helvetica'
  });
});

slide4.addNotes('VoiceCraft replaces awkward human feedback with objective, zero-judgment browser audio telemetry.');

// -------------------------------------------------------------
// SLIDE 5: The "Notes-to-Questions" Lazy Genius Engine
// -------------------------------------------------------------
const slide5 = pres.addSlide();
slide5.background = { color: BG_DARK };

slide5.addText('LAZY GENIUS FEATURE 🧠⚡', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.4,
  fontSize: 14, bold: true, color: NEON_YELLOW, fontFace: 'Helvetica'
});

slide5.addText('Notes-to-Questions: Drop Messy Docs -> Get FAANG Questions', {
  x: 0.8, y: 0.9, w: 11.7, h: 0.6,
  fontSize: 28, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

const steps = [
  { num: '📁 Step 1', title: 'Dump Your Messy Notes', desc: 'Drag & drop your 3-year-old resume draft, PDF, or messy .txt project notes.' },
  { num: '🤖 Step 2', title: 'AI Concept Sniffer', desc: 'Extracts technical buzzwords, architecture terms, & hidden achievements.' },
  { num: '🔥 Step 3', title: 'Grill Generator', desc: 'Spits out 5-8 hyper-specific STAR & technical questions tailored to YOUR project.' },
  { num: '🚀 Step 4', title: '1-Click Practice', desc: 'Click any card & start recording your answer immediately before panic sets in.' }
];

steps.forEach((s, idx) => {
  const x = 0.8 + idx * 2.95;
  const y = 1.8;

  slide5.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 2.75, h: 4.8,
    fill: { color: CARD_BG }, line: { color: NEON_YELLOW, width: 2 }
  });

  slide5.addText(s.num, {
    x: x + 0.2, y: y + 0.3, w: 2.35, h: 0.5,
    fontSize: 18, bold: true, color: NEON_YELLOW, fontFace: 'Helvetica'
  });

  slide5.addText(s.title, {
    x: x + 0.2, y: y + 0.9, w: 2.35, h: 0.7,
    fontSize: 17, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
  });

  slide5.addText(s.desc, {
    x: x + 0.2, y: y + 1.7, w: 2.35, h: 2.7,
    fontSize: 13, color: TEXT_MUTED, fontFace: 'Helvetica'
  });
});

slide5.addNotes('No more guessing what interviewers will ask. Drop your actual project docs and get custom questions tailored to your exact experience.');

// -------------------------------------------------------------
// SLIDE 6: The AI "Executive Polish" Magic Trick
// -------------------------------------------------------------
const slide6 = pres.addSlide();
slide6.background = { color: BG_DARK };

slide6.addText('THE MAGIC TRICK 🪄✨', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.4,
  fontSize: 14, bold: true, color: NEON_PURPLE, fontFace: 'Helvetica'
});

slide6.addText('The "How to Say It Better" Executive STAR Transformer', {
  x: 0.8, y: 0.9, w: 11.7, h: 0.6,
  fontSize: 28, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

// Left Card: What You Said
slide6.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 1.8, w: 5.6, h: 4.8,
  fill: { color: CARD_BG }, line: { color: NEON_PINK, width: 2 }
});

slide6.addText('💩 What You Spoke (Raw Panic Transcript)', {
  x: 1.1, y: 2.1, w: 5.0, h: 0.4,
  fontSize: 17, bold: true, color: NEON_PINK, fontFace: 'Helvetica'
});

slide6.addText('"Um... so, like, our database was getting super slow and crashing all the time... so I went in and, you know, added some cache stuff and fixed some index queries... and basically it stopped crashing so much, I think?"', {
  x: 1.1, y: 2.7, w: 5.0, h: 3.6,
  fontSize: 15, color: TEXT_MUTED, fontFace: 'Courier'
});

// Right Card: What VoiceCraft Makes It Sound Like
slide6.addShape(pres.ShapeType.rect, {
  x: 6.7, y: 1.8, w: 5.8, h: 4.8,
  fill: { color: CARD_BG }, line: { color: NEON_GREEN, width: 2 }
});

slide6.addText('💎 What VoiceCraft Turns It Into (Exec STAR)', {
  x: 7.0, y: 2.1, w: 5.2, h: 0.4,
  fontSize: 17, bold: true, color: NEON_GREEN, fontFace: 'Helvetica'
});

slide6.addText('"I spearheaded the database optimization initiative (Situation/Task) by implementing Redis query caching and restructuring database indexes (Action), which reduced API P99 latency by 45% and eliminated production outages (Result)."', {
  x: 7.0, y: 2.7, w: 5.2, h: 3.6,
  fontSize: 15, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide6.addNotes('Notice the difference? Same raw story, but transformed into a high-impact executive response that gets you hired.');

// -------------------------------------------------------------
// SLIDE 7: Why You Need This
// -------------------------------------------------------------
const slide7 = pres.addSlide();
slide7.background = { color: BG_DARK };

slide7.addText('THE BOTTOM LINE 📈', {
  x: 0.8, y: 0.5, w: 11.7, h: 0.4,
  fontSize: 14, bold: true, color: NEON_GREEN, fontFace: 'Helvetica'
});

slide7.addText('Why VoiceCraft Will Make You Unstoppable', {
  x: 0.8, y: 0.9, w: 11.7, h: 0.6,
  fontSize: 28, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

const stats = [
  { val: '0%', label: 'Awkward Silence', sub: 'No more blanking mid-interview' },
  { val: '-85%', label: 'Filler Word Count', sub: 'Say goodbye to "um" and "like"' },
  { val: '100%', label: 'Quantified Impact', sub: 'Every story has a real Result' },
  { val: '10x', label: 'Offer Rate Boost', sub: 'Confidence is 90% of the battle' }
];

stats.forEach((st, idx) => {
  const x = 0.8 + idx * 2.95;
  const y = 1.8;

  slide7.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 2.75, h: 4.8,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
  });

  slide7.addText(st.val, {
    x: x + 0.1, y: y + 0.6, w: 2.55, h: 1.0,
    fontSize: 44, bold: true, color: NEON_CYAN, align: 'center', fontFace: 'Helvetica'
  });

  slide7.addText(st.label, {
    x: x + 0.1, y: y + 1.8, w: 2.55, h: 0.6,
    fontSize: 18, bold: true, color: TEXT_WHITE, align: 'center', fontFace: 'Helvetica'
  });

  slide7.addText(st.sub, {
    x: x + 0.2, y: y + 2.5, w: 2.35, h: 1.8,
    fontSize: 13, color: TEXT_MUTED, align: 'center', fontFace: 'Helvetica'
  });
});

slide7.addNotes('With VoiceCraft, candidates turn interview anxiety into quantified confidence.');

// -------------------------------------------------------------
// SLIDE 8: Conclusion & Call to Action
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

slide8.addText('VoiceCraft / Kadence AI is ready to supercharge your vocal confidence.', {
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

slide8.addText('🚀 Try VoiceCraft Now', {
  x: 4.2, y: 4.5, w: 4.8, h: 0.8,
  fontSize: 18, bold: true, color: '0F172A', align: 'center', fontFace: 'Helvetica'
});

slide8.addNotes('Thank you everyone! Open for questions and live demos.');

// Output
const outputPath = path.join(__dirname, 'VoiceCraft_Funny_Presentation.pptx');
pres.writeFile({ fileName: outputPath }).then(() => {
  console.log(`Successfully generated Funny PPTX at: ${outputPath}`);
}).catch(err => {
  console.error('Error generating PPTX:', err);
});
