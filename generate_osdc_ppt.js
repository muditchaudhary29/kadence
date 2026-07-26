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

const imgHero = path.join(__dirname, 'public', 'osdc_hero.jpg');
const imgJoin = path.join(__dirname, 'public', 'osdc_join.jpg');
const imgNoHire = path.join(__dirname, 'public', 'osdc_nothire.jpg');
const imgNotes = path.join(__dirname, 'public', 'kadence_notes.jpg');
const imgTransform = path.join(__dirname, 'public', 'executive_transformation.jpg');

// -------------------------------------------------------------
// SLIDE 1: Title Slide (OSDC Candidate Pitch)
// -------------------------------------------------------------
const slide1 = pres.addSlide();
slide1.background = { color: BG_DARK };

slide1.addShape(pres.ShapeType.rect, {
  x: 0.6, y: 0.6, w: 12.1, h: 6.0,
  fill: { color: CARD_BG },
  line: { color: NEON_CYAN, width: 2 }
});

slide1.addText('⚡ KADENCE AI  |  OSDC VOLUNTEER CANDIDATE PRESENTATION', {
  x: 1.0, y: 1.0, w: 11.3, h: 0.5,
  fontSize: 16, bold: true, color: NEON_CYAN, fontFace: 'Helvetica'
});

slide1.addText('How to Stop Sounding Like a Nervous Potato in Technical Interviews 🥔✨', {
  x: 1.0, y: 1.6, w: 11.3, h: 1.2,
  fontSize: 32, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide1.addText('Demonstrating KADENCE AI & My Passion for Open Source Developers Club (OSDC)', {
  x: 1.0, y: 2.9, w: 11.3, h: 0.5,
  fontSize: 15, color: NEON_YELLOW, fontFace: 'Helvetica'
});

slide1.addImage({
  path: imgHero,
  x: 1.0, y: 3.6, w: 11.3, h: 2.7
});

slide1.addNotes('Welcome OSDC Team! Today I present KADENCE AI and my pitch for the OSDC Volunteer Role.');

// -------------------------------------------------------------
// SLIDE 2: The Core Problem
// -------------------------------------------------------------
const slide2 = pres.addSlide();
slide2.background = { color: BG_DARK };

slide2.addText('OSDC INTERVIEW PITCH  |  PROBLEM DIAGNOSIS', {
  x: 0.8, y: 0.4, w: 11.7, h: 0.3,
  fontSize: 11, bold: true, color: NEON_CYAN, fontFace: 'Helvetica'
});

slide2.addText('The Anatomy of a Technical Presentation Meltdown 🤡', {
  x: 0.8, y: 0.7, w: 11.7, h: 0.5,
  fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

// Left Card: Mirror Prep
slide2.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 1.4, w: 5.6, h: 5.2,
  fill: { color: CARD_BG }, line: { color: NEON_EMERALD, width: 2 }
});

slide2.addText('😎 Mirror Prep (Expectation)', {
  x: 1.1, y: 1.7, w: 5.0, h: 0.4,
  fontSize: 17, bold: true, color: NEON_EMERALD, fontFace: 'Helvetica'
});

slide2.addText('• Smooth, confident posture 🗿\n\n• Flawless STAR framework execution ✨\n\n• Crisp 130 WPM executive velocity 👔\n\n• Zero hesitation, zero sweat, pure charisma 🔥', {
  x: 1.1, y: 2.3, w: 5.0, h: 4.0,
  fontSize: 13, color: TEXT_WHITE, fontFace: 'Helvetica'
});

// Right Card: Live Presentation
slide2.addShape(pres.ShapeType.rect, {
  x: 6.8, y: 1.4, w: 5.7, h: 5.2,
  fill: { color: CARD_BG }, line: { color: NEON_PINK, width: 2 }
});

slide2.addText('🫠 30 Seconds into Live Demo (Reality)', {
  x: 7.1, y: 1.7, w: 5.1, h: 0.4,
  fontSize: 17, bold: true, color: NEON_PINK, fontFace: 'Helvetica'
});

slide2.addText('• "Um, so... basically... like... you know..." 🔁\n\n• Brain reboots like Windows 95 mid-sentence 💻\n\n• Speaking at 210 WPM like Eminem speed-rapping 🎤\n\n• Forgot Result entirely & ended with "...and yeah" 💀', {
  x: 7.1, y: 2.3, w: 5.1, h: 4.0,
  fontSize: 13, color: TEXT_WHITE, fontFace: 'Helvetica'
});

// -------------------------------------------------------------
// SLIDE 3: The 4 Villains
// -------------------------------------------------------------
const slide3 = pres.addSlide();
slide3.background = { color: BG_DARK };

slide3.addText('OSDC INTERVIEW PITCH  |  THE HALL OF SHAME 🏆', {
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
// SLIDE 4: KADENCE AI Platform UI
// -------------------------------------------------------------
const slide4 = pres.addSlide();
slide4.background = { color: BG_DARK };

slide4.addText('OSDC INTERVIEW PITCH  |  FEATURE DEMO', {
  x: 0.8, y: 0.4, w: 11.7, h: 0.3,
  fontSize: 11, bold: true, color: NEON_CYAN, fontFace: 'Helvetica'
});

slide4.addText('KADENCE AI: Real-Time Vocal Telemetry & Visual Analytics', {
  x: 0.8, y: 0.7, w: 11.7, h: 0.5,
  fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide4.addImage({
  path: imgHero,
  x: 0.8, y: 1.4, w: 6.2, h: 5.2
});

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
// SLIDE 5: Notes-to-Questions Engine
// -------------------------------------------------------------
const slide5 = pres.addSlide();
slide5.background = { color: BG_DARK };

slide5.addText('OSDC INTERVIEW PITCH  |  DOCUMENT PROCESSING', {
  x: 0.8, y: 0.4, w: 11.7, h: 0.3,
  fontSize: 11, bold: true, color: NEON_YELLOW, fontFace: 'Helvetica'
});

slide5.addText('Notes-to-Questions: Drop Messy Docs -> Get FAANG Questions', {
  x: 0.8, y: 0.7, w: 11.7, h: 0.5,
  fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide5.addImage({
  path: imgNotes,
  x: 0.8, y: 1.4, w: 6.2, h: 5.2
});

const steps = [
  { num: '📁 Step 1', title: 'Dump Messy Notes', desc: 'Drag & drop .txt, .md, or .pdf project notes.' },
  { num: '🤖 Step 2', title: 'Concept Sniffer', desc: 'Extracts technical terms, frameworks, & milestones.' },
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

slide6.addText('OSDC INTERVIEW PITCH  |  AI REWRITE ENGINE 🪄✨', {
  x: 0.8, y: 0.4, w: 11.7, h: 0.3,
  fontSize: 11, bold: true, color: NEON_PURPLE, fontFace: 'Helvetica'
});

slide6.addText('The "How to Say It Better" Executive STAR Transformer', {
  x: 0.8, y: 0.7, w: 11.7, h: 0.5,
  fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide6.addImage({
  path: imgTransform,
  x: 0.8, y: 1.4, w: 11.7, h: 5.2
});

// -------------------------------------------------------------
// SLIDE 7: WHY I SHOULD JOIN OSDC (New Slide!)
// -------------------------------------------------------------
const slide7 = pres.addSlide();
slide7.background = { color: BG_DARK };

slide7.addText('OSDC VOLUNTEER PITCH  |  MY MOTIVATION 🤝🔥', {
  x: 0.8, y: 0.4, w: 11.7, h: 0.3,
  fontSize: 11, bold: true, color: NEON_CYAN, fontFace: 'Helvetica'
});

slide7.addText('Why I Want to Join OSDC as a Volunteer', {
  x: 0.8, y: 0.7, w: 11.7, h: 0.5,
  fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide7.addImage({
  path: imgJoin,
  x: 0.8, y: 1.4, w: 5.8, h: 5.2
});

const joinPoints = [
  { title: '🌐 Open Source Evangelist', desc: 'Building tools like KADENCE AI & advocating for open-source code sharing across campus.', color: NEON_CYAN },
  { title: '🎓 Empowering Peers', desc: 'Helping fellow students overcome presentation anxiety & master technical interviews.', color: NEON_EMERALD },
  { title: '⚡ Event & Workshop Driver', desc: 'Eager to organize hackathons, coding workshops, & manage OSDC community events.', color: NEON_YELLOW },
  { title: '🚀 Relentless Builder Mindset', desc: 'Constantly shipping real-world projects & bringing fresh energy to the club.', color: NEON_PINK }
];

joinPoints.forEach((p, idx) => {
  const y = 1.4 + idx * 1.3;
  slide7.addShape(pres.ShapeType.rect, {
    x: 6.8, y: y, w: 5.7, h: 1.15,
    fill: { color: CARD_BG }, line: { color: p.color, width: 1.5 }
  });
  slide7.addText(p.title, {
    x: 7.0, y: y + 0.1, w: 5.3, h: 0.35,
    fontSize: 14, bold: true, color: p.color, fontFace: 'Helvetica'
  });
  slide7.addText(p.desc, {
    x: 7.0, y: y + 0.45, w: 5.3, h: 0.6,
    fontSize: 11, color: TEXT_MUTED, fontFace: 'Helvetica'
  });
});

// -------------------------------------------------------------
// SLIDE 8: WHY YOU SHOULD NOT HIRE ME (New Humorous Reverse Pitch!)
// -------------------------------------------------------------
const slide8 = pres.addSlide();
slide8.background = { color: BG_DARK };

slide8.addText('OSDC VOLUNTEER PITCH  |  HUMOROUS WARNING ⚠️', {
  x: 0.8, y: 0.4, w: 11.7, h: 0.3,
  fontSize: 11, bold: true, color: NEON_PINK, fontFace: 'Helvetica'
});

slide8.addText('Why You Should NOT Include Me as an OSDC Volunteer 😉', {
  x: 0.8, y: 0.7, w: 11.7, h: 0.5,
  fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

slide8.addImage({
  path: imgNoHire,
  x: 0.8, y: 1.4, w: 5.8, h: 5.2
});

const noHirePoints = [
  { title: '☕ 3 AM Code Over-Engineer', desc: 'Might accidentally build a full AI web app for a simple club task overnight.', color: NEON_PINK },
  { title: '🚨 The Filler Word Cop', desc: 'Will subtly count how many "um"s speakers use during OSDC tech talks.', color: NEON_YELLOW },
  { title: '🎤 Excessive Demo Energy', desc: 'Will insist on live-demoing open source tools instead of static slides.', color: NEON_CYAN },
  { title: '🔥 Dangerously Addicted to Shipping', desc: 'Will pressure everyone to release open-source repos instead of sleeping!', color: NEON_PURPLE }
];

noHirePoints.forEach((p, idx) => {
  const y = 1.4 + idx * 1.3;
  slide8.addShape(pres.ShapeType.rect, {
    x: 6.8, y: y, w: 5.7, h: 1.15,
    fill: { color: CARD_BG }, line: { color: p.color, width: 1.5 }
  });
  slide8.addText(p.title, {
    x: 7.0, y: y + 0.1, w: 5.3, h: 0.35,
    fontSize: 14, bold: true, color: p.color, fontFace: 'Helvetica'
  });
  slide8.addText(p.desc, {
    x: 7.0, y: y + 0.45, w: 5.3, h: 0.6,
    fontSize: 11, color: TEXT_MUTED, fontFace: 'Helvetica'
  });
});

// -------------------------------------------------------------
// SLIDE 9: Measurable Impact & College Vision
// -------------------------------------------------------------
const slide9 = pres.addSlide();
slide9.background = { color: BG_DARK };

slide9.addText('OSDC INTERVIEW PITCH  |  MEASURABLE IMPACT 📈', {
  x: 0.8, y: 0.4, w: 11.7, h: 0.3,
  fontSize: 11, bold: true, color: NEON_EMERALD, fontFace: 'Helvetica'
});

slide9.addText('What I Bring to the OSDC Volunteer Team', {
  x: 0.8, y: 0.7, w: 11.7, h: 0.5,
  fontSize: 26, bold: true, color: TEXT_WHITE, fontFace: 'Helvetica'
});

const stats = [
  { val: '0%', label: 'Awkward Silence', sub: 'No more presentation panic' },
  { val: '100%', label: 'Open Source Drive', sub: 'Dedicated to OSDC community' },
  { val: '10x', label: 'Student Impact', sub: 'Elevating college tech culture' },
  { val: '∞', label: 'High Energy', sub: 'Ready for workshops & events' }
];

stats.forEach((st, idx) => {
  const x = 0.8 + idx * 2.95;
  const y = 1.4;

  slide9.addShape(pres.ShapeType.rect, {
    x: x, y: y, w: 2.75, h: 5.2,
    fill: { color: CARD_BG }, line: { color: CARD_BORDER, width: 1 }
  });

  slide9.addText(st.val, {
    x: x + 0.1, y: y + 0.8, w: 2.55, h: 1.0,
    fontSize: 44, bold: true, color: NEON_CYAN, align: 'center', fontFace: 'Helvetica'
  });

  slide9.addText(st.label, {
    x: x + 0.1, y: y + 2.0, w: 2.55, h: 0.6,
    fontSize: 17, bold: true, color: TEXT_WHITE, align: 'center', fontFace: 'Helvetica'
  });

  slide9.addText(st.sub, {
    x: x + 0.2, y: y + 2.8, w: 2.35, h: 1.8,
    fontSize: 13, color: TEXT_MUTED, align: 'center', fontFace: 'Helvetica'
  });
});

// -------------------------------------------------------------
// SLIDE 10: Conclusion & Q&A
// -------------------------------------------------------------
const slide10 = pres.addSlide();
slide10.background = { color: BG_DARK };

slide10.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 0.8, w: 11.7, h: 5.6,
  fill: { color: CARD_BG },
  line: { color: NEON_CYAN, width: 3 }
});

slide10.addText('🚀 LET\'S BUILD TOGETHER WITH OSDC!', {
  x: 1.2, y: 1.4, w: 10.9, h: 0.8,
  fontSize: 38, bold: true, color: TEXT_WHITE, align: 'center', fontFace: 'Helvetica'
});

slide10.addText('Ready to bring energy, open-source code, and AI tools to OSDC.', {
  x: 1.2, y: 2.4, w: 10.9, h: 0.6,
  fontSize: 20, color: NEON_CYAN, align: 'center', fontFace: 'Helvetica'
});

slide10.addText('Any Questions for Me?  (Or are you counting my "ums" right now? 😉)', {
  x: 1.2, y: 3.4, w: 10.9, h: 0.8,
  fontSize: 18, color: NEON_YELLOW, align: 'center', fontFace: 'Helvetica'
});

slide10.addShape(pres.ShapeType.roundRect, {
  x: 4.2, y: 4.5, w: 4.8, h: 0.8, rectRadius: 0.2,
  fill: { color: NEON_CYAN }
});

slide10.addText('🤝 Thank You OSDC Team!', {
  x: 4.2, y: 4.5, w: 4.8, h: 0.8,
  fontSize: 18, bold: true, color: '09090B', align: 'center', fontFace: 'Helvetica'
});

// Output
const outputPath = path.join(__dirname, 'OSDC_Volunteer_Presentation.pptx');
pres.writeFile({ fileName: outputPath }).then(() => {
  console.log(`Successfully generated OSDC Volunteer PPTX at: ${outputPath}`);
}).catch(err => {
  console.error('Error generating PPTX:', err);
});
