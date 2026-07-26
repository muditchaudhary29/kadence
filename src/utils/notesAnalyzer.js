// ---- Notes Analyzer: Text Extraction + Question Generation ----

/** Extract plain text from a File object (.txt, .md, .pdf) */
export async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'txt' || ext === 'md') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result || '');
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsText(file, 'utf-8');
    });
  }

  if (ext === 'pdf') {
    return extractTextFromPDF(file);
  }

  // Images or unknown: return empty so caller shows topic-input fallback
  return '';
}

/**
 * Simple PDF text extractor — works on most text-based PDFs.
 * Looks for text operator streams (BT...ET blocks with Tj/TJ operators).
 * No external library required.
 */
async function extractTextFromPDF(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  // Decode as latin-1 to handle arbitrary byte values
  const raw = new TextDecoder('latin1').decode(bytes);

  const results = [];
  let pos = 0;

  while (pos < raw.length) {
    const btPos = raw.indexOf('BT', pos);
    if (btPos === -1) break;
    const etPos = raw.indexOf('ET', btPos + 2);
    if (etPos === -1) break;

    const block = raw.slice(btPos, etPos + 2);

    // Match single-string Tj operator: (text) Tj
    const tjRx = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*Tj/g;
    let m;
    while ((m = tjRx.exec(block)) !== null) {
      results.push(decodePdfString(m[1]));
    }

    // Match array-form TJ operator: [(str)...] TJ
    const tjArrRx = /\[([^\]]*)\]\s*TJ/g;
    while ((m = tjArrRx.exec(block)) !== null) {
      const inner = m[1];
      const strRx = /\(([^)\\]*(?:\\.[^)\\]*)*)\)/g;
      let sm;
      while ((sm = strRx.exec(inner)) !== null) {
        results.push(decodePdfString(sm[1]));
      }
    }

    pos = etPos + 2;
  }

  return results.join(' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/[^\x20-\x7E\s]/g, '') // strip non-printable
    .trim();
}

/** Decode common PDF string escape sequences */
function decodePdfString(s) {
  return s
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\')
    .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}

// ---- Keyword Extraction ----

const TECH_TERMS = new Set([
  'react', 'node', 'python', 'java', 'javascript', 'typescript', 'golang', 'rust',
  'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'devops',
  'sql', 'postgres', 'mysql', 'mongodb', 'redis', 'kafka', 'rabbitmq',
  'api', 'rest', 'graphql', 'grpc', 'microservices', 'serverless',
  'machine learning', 'deep learning', 'nlp', 'llm', 'ai',
  'agile', 'scrum', 'kanban', 'sprint', 'jira', 'git', 'github',
  'testing', 'jest', 'cypress', 'selenium', 'tdd', 'bdd',
  'frontend', 'backend', 'fullstack', 'devops', 'sre', 'cloud',
  'algorithm', 'data structure', 'system design', 'architecture',
]);

const STOP_WORDS = new Set([
  'the','a','an','is','was','are','were','be','been','being','i','my','we','our',
  'you','your','it','this','that','and','or','but','so','to','of','in','on','at',
  'by','for','with','from','have','has','had','do','does','did','will','would',
  'can','could','should','not','no','up','out','about','also','very','just','then',
]);

/** Extract meaningful keyword phrases from raw text */
export function extractKeywords(text) {
  if (!text) return [];

  const lower = text.toLowerCase();
  const found = new Set();

  // Check for known tech terms
  TECH_TERMS.forEach(term => {
    if (lower.includes(term)) found.add(term);
  });

  // Extract capitalised proper nouns (likely tools, companies, technologies)
  const properNouns = text.match(/\b[A-Z][a-zA-Z]{2,}\b/g) || [];
  properNouns
    .filter(w => !STOP_WORDS.has(w.toLowerCase()) && w.length > 3)
    .forEach(w => found.add(w));

  // Extract consecutive noun phrases (simple heuristic: 2-3 lowercase content words)
  const words = lower.split(/\s+/);
  for (let i = 0; i < words.length - 1; i++) {
    const w = words[i].replace(/[^a-z]/g, '');
    const next = words[i + 1].replace(/[^a-z]/g, '');
    if (w.length > 3 && next.length > 3 && !STOP_WORDS.has(w) && !STOP_WORDS.has(next)) {
      found.add(`${w} ${next}`);
    }
  }

  return [...found].slice(0, 30); // cap at 30 keywords
}

// ---- Question Generator ----

const QUESTION_TEMPLATES = [
  (kw) => `Tell me about a time you worked extensively with ${kw}. What was the outcome?`,
  (kw) => `Describe a challenge you faced while using ${kw} and how you resolved it.`,
  (kw) => `How would you explain ${kw} to a non-technical stakeholder?`,
  (kw) => `What trade-offs did you encounter when applying ${kw} in a real project?`,
  (kw) => `Give me an example where ${kw} significantly impacted the team's productivity.`,
  (kw) => `How do you stay up to date with changes or best practices in ${kw}?`,
  (kw) => `Walk me through how you would design a system using ${kw} at scale.`,
  (kw) => `What are the key strengths and limitations of ${kw} that you've observed?`,
  (kw) => `Describe a project where ${kw} was a core component. What would you do differently?`,
  (kw) => `How have you mentored or helped teammates adopt ${kw}?`,
];

const GENERIC_TEMPLATES = [
  'Tell me about yourself and the most important skills described in this material.',
  'Based on the topics covered, describe the most complex technical challenge you faced.',
  'How would you prioritise competing requirements if multiple areas in this material conflicted?',
  'Walk me through a system or project most closely related to what you\'ve studied here.',
  'What is the most valuable lesson from this material that you would apply in a team setting?',
  'How have you communicated these technical concepts to non-technical stakeholders?',
];

/**
 * Generate practice questions from extracted keywords.
 * Returns an array of {id, question, type, keyword} objects.
 */
export function generateQuestionsFromKeywords(keywords, rawText = '') {
  const questions = [];

  // Pick up to 5 keywords and generate 1-2 questions each
  const selectedKw = keywords
    .filter(k => k.split(' ').every(w => !STOP_WORDS.has(w))) // no stopword-only phrases
    .slice(0, 5);

  selectedKw.forEach((kw, idx) => {
    // Alternate between two templates per keyword
    const t1 = QUESTION_TEMPLATES[idx % QUESTION_TEMPLATES.length];
    const t2 = QUESTION_TEMPLATES[(idx + 5) % QUESTION_TEMPLATES.length];
    questions.push({ id: `notes_${idx * 2}`, question: t1(kw), type: 'behavioral', keyword: kw });
    if (questions.length < 8) {
      questions.push({ id: `notes_${idx * 2 + 1}`, question: t2(kw), type: 'technical', keyword: kw });
    }
  });

  // Always add generic questions at the end
  GENERIC_TEMPLATES.slice(0, Math.max(0, 8 - questions.length)).forEach((q, i) => {
    questions.push({ id: `notes_gen_${i}`, question: q, type: 'general', keyword: null });
  });

  return questions.slice(0, 8);
}
