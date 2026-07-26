// ============================================================
// Kadence AI - Speech Analysis Engine (Refined, Multi-Question, Phonetic & Stem-Enhanced)
// ============================================================

// ----- SPEECH PHONETIC NORMALIZER -----

export function normalizeSpeechPhonetics(text) {
  if (!text) return "";
  let norm = text;

  const phoneticReplacements = [
    [/\bre act\b/gi, "React"],
    [/\bnode js\b|\bno js\b/gi, "Node.js"],
    [/\bsequel\b|\bs q l\b/gi, "SQL"],
    [/\bpost gres\b|\bpostgress\b/gi, "PostgreSQL"],
    [/\ba w s\b/gi, "AWS"],
    [/\bg c p\b/gi, "GCP"],
    [/\bdock er\b/gi, "Docker"],
    [/\bkuber netes\b|\bk8s\b/gi, "Kubernetes"],
    [/\bmongo d b\b|\bmongo\b/gi, "MongoDB"],
    [/\bmicro services\b|\bmicro service\b/gi, "microservices"],
    [/\bteck lead\b|\btech lead\b/gi, "tech lead"],
    [/\blate in see\b|\blatency\b/gi, "latency"],
    [/\bper cent\b/gi, "%"],
    [/\bstar method\b/gi, "STAR"],
    [/\bw p m\b/gi, "WPM"]
  ];

  phoneticReplacements.forEach(([pattern, replacement]) => {
    norm = norm.replace(pattern, replacement);
  });

  return norm;
}

// ----- FILLER WORD DEFINITIONS & CONTEXT LOGIC -----

export const HESITATION_WORDS = new Set([
  "hmm", "hm", "hmmm", "hmmmm",
  "oh", "ohh", "ohhh", "ooh", "oohh",
  "um", "umm", "ummm", "ummmm",
  "uh", "uhh", "uhhh", "uhhhh",
  "ah", "ahh", "ahhh",
  "er", "err", "errr",
  "eh", "ehh",
  "mhm", "mmhmm", "huh"
]);

export const ALWAYS_FILLER_WORDS = new Set([
  "basically", "literally", "seriously", "obviously",
  "frankly", "anyways", "essentially", "totally"
]);

export const CONTEXTUAL_FILLER_WORDS = new Set([
  "like", "so", "well", "right", "just", "actually"
]);

export const SINGLE_FILLER_WORDS = new Set([
  ...HESITATION_WORDS,
  ...ALWAYS_FILLER_WORDS,
  ...CONTEXTUAL_FILLER_WORDS
]);

export const MULTI_FILLER_PHRASES = [
  "you know", "y'know", "i mean", "sort of", "kind of",
  "to be honest", "at the end of the day", "know what i mean",
  "trust me", "believe me", "and stuff", "or something",
  "and everything"
];

const ELONGATED_HESITATION_REGEX = /^(h+m+|o+h+|o+o+h*|u+m+|u+h+|a+h+|e+r+|e+h+|m+h+m+|h+u+h+)$/i;

const LIKE_NOT_FILLER_PREV = new Set([
  "i", "we", "they", "you", "he", "she", "people", "users", "developers",
  "something", "anything", "nothing", "things", "stuff", "tools",
  "languages", "frameworks", "apps", "services", "features", "projects",
  "would", "should", "could", "feels", "sounds", "looks", "seems",
  "much", "more", "just", "quite", "unlikely"
]);

const LIKE_NOT_FILLER_NEXT = new Set([
  "react", "node", "python", "javascript", "typescript", "java", "golang",
  "aws", "docker", "kubernetes", "sql", "postgres", "redis", "kafka",
  "building", "creating", "working", "developing", "using", "learning",
  "this", "that", "these", "those", "a", "an", "the"
]);

export function cleanToken(word) {
  if (!word) return "";
  return word.toLowerCase().replace(/^[^a-z']+|[^a-z']+$/g, '');
}

export function isFillerWithContext(rawWord, prevWord = "", nextWord = "") {
  const clean = cleanToken(rawWord);
  if (!clean || clean.length < 1) return false;

  if (HESITATION_WORDS.has(clean) || ELONGATED_HESITATION_REGEX.test(clean)) {
    return true;
  }

  if (ALWAYS_FILLER_WORDS.has(clean)) {
    return true;
  }

  if (clean === "like") {
    const prevClean = cleanToken(prevWord);
    const nextClean = cleanToken(nextWord);
    const hasPunctuation = /[,.!?;:]/.test(rawWord);

    if (hasPunctuation) return true;

    if (LIKE_NOT_FILLER_PREV.has(prevClean) && (LIKE_NOT_FILLER_NEXT.has(nextClean) || nextClean.length > 2)) {
      if (["was", "were", "is", "am", "feel"].includes(prevClean) && HESITATION_WORDS.has(nextClean)) {
        return true;
      }
      return false;
    }
    return true;
  }

  if (clean === "so") {
    const nextClean = cleanToken(nextWord);
    if (["that", "we", "i", "they", "it", "far"].includes(nextClean) && !/[,.!?;:]/.test(rawWord)) {
      return false;
    }
    return /[,.!?;:]/.test(rawWord) || HESITATION_WORDS.has(nextClean);
  }

  if (clean === "well") {
    const prevClean = cleanToken(prevWord);
    if (["as", "performed", "very", "done", "worked", "pretty"].includes(prevClean)) {
      return false;
    }
    return /[,.!?;:]/.test(rawWord) || prevClean === "";
  }

  return false;
}

export function normalizeFiller(token) {
  if (/^h+m+$/i.test(token)) return "hmm";
  if (/^o+h+$/i.test(token) || /^o+o+h*$/i.test(token)) return "oh";
  if (/^u+m+$/i.test(token)) return "um";
  if (/^u+h+$/i.test(token)) return "uh";
  if (/^a+h+$/i.test(token)) return "ah";
  if (/^e+r+$/i.test(token)) return "er";
  if (/^m+h+m+$/i.test(token)) return "mhm";
  return token;
}

// ----- MULTI-QUESTION DATABASE (4 Categories, 12 Questions Total) -----

export const CATEGORIES = [
  "General / Intro",
  "Behavioral",
  "Leadership & Communication",
  "System Design"
];

export const SAMPLE_QUESTIONS = [
  // --- CATEGORY 1: General / Intro ---
  {
    id: "q1_1",
    category: "General / Intro",
    title: "Tell me about yourself and your background.",
    requiredDetails: [
      {
        id: "d1",
        label: "Current Role & Years of Experience",
        keywords: ["developer", "engineer", "architect", "programmer", "coder", "years", "experience", "role", "background"],
        stems: ["work", "develop", "engin", "architect", "program", "code", "role", "year", "exp", "position", "career"],
        tip: "Mention your current title and how many years you've been working."
      },
      {
        id: "d2",
        label: "Core Technical Stack & Domain",
        keywords: ["react", "node", "python", "javascript", "typescript", "java", "golang", "aws", "docker", "sql", "api", "backend", "frontend", "fullstack"],
        stems: ["react", "node", "pyth", "jav", "script", "aws", "dock", "kube", "sql", "postg", "mongo", "red", "kafk", "cloud", "api", "back", "front", "full", "tech"],
        tip: "Name at least one technology, framework, language, or domain you specialize in."
      },
      {
        id: "d3",
        label: "Key Career Achievement or Impact",
        keywords: ["built", "created", "launched", "reduced", "improved", "increased", "optimized", "migrated", "scaled", "project", "percent", "%", "latency"],
        stems: ["build", "creat", "launch", "ship", "deliv", "improv", "reduc", "decreas", "increas", "boost", "optimi", "scale", "migrat", "refact", "achiev"],
        isMetricSensitive: true,
        tip: "Share a concrete result you delivered — a project launched, metric improved, or system built."
      },
      {
        id: "d4",
        label: "Motivation & Collaborative Style",
        keywords: ["enjoy", "passionate", "excited", "collaborate", "teamwork", "team", "growth", "challenge", "solving"],
        stems: ["enjoy", "passion", "excit", "collab", "team", "grow", "challeng", "solv", "love", "drive"],
        tip: "Mention what you enjoy doing or how you work with others."
      }
    ],
    sampleTranscript: "I have worked as a software developer for 4 years specifically building web applications using React and Node.js. My work at my current company served over 200,000 users. Because I led a migration to microservices, we reduced latency by 35% and improved system reliability by 20%. I am passionate about collaborating with cross-functional teams of 5 to 10 engineers to ship impactful products.",
    sampleDurationSec: 42,
    improvedVersion: `"I'm a software engineer with 4 years of experience specializing in building scalable web applications with React and Node.js.

In my most recent role, I led the migration of our backend services to a microservice architecture — reducing p99 latency by 35% and improving system reliability during peak events.

I thrive on solving complex technical challenges and I'm looking for a role where I can drive architectural impact while collaborating closely with cross-functional teams."`
  },
  {
    id: "q1_2",
    category: "General / Intro",
    title: "Walk me through your resume and key technical highlights.",
    requiredDetails: [
      {
        id: "d1",
        label: "Career Progression Overview",
        keywords: ["started", "career", "promoted", "grew", "transitioned", "previous", "current", "company", "years"],
        stems: ["start", "caree", "promot", "grow", "transit", "prev", "curr", "compan", "year"],
        tip: "Summarize your career arc from early roles to your current position."
      },
      {
        id: "d2",
        label: "Primary Engineering Stack",
        keywords: ["react", "typescript", "python", "java", "node", "cloud", "aws", "gcp", "docker", "postgres", "redis"],
        stems: ["react", "node", "pyth", "jav", "script", "aws", "dock", "kube", "sql", "postg", "mongo", "red", "cloud", "stack"],
        tip: "Highlight the primary tech stack you use on a daily basis."
      },
      {
        id: "d3",
        label: "Major Project Highlight",
        keywords: ["built", "architected", "redesigned", "shipped", "deployed", "scaled", "pipeline", "service", "system"],
        stems: ["build", "architect", "redesign", "ship", "deploy", "scale", "pipelin", "servic", "system", "proj"],
        isMetricSensitive: true,
        tip: "Walk through the single most significant project you shipped."
      },
      {
        id: "d4",
        label: "Reason for Looking / Next Goal",
        keywords: ["looking", "next", "goal", "growth", "seeking", "opportunity", "scale", "challenge", "future"],
        stems: ["look", "next", "goal", "grow", "seek", "opportun", "scal", "challeng", "futur"],
        tip: "Conclude with why you are looking for your next career opportunity."
      }
    ],
    sampleTranscript: "I started my career as a junior engineer in Python and Django at a fintech startup serving 50,000 customers. Over 3 years I was promoted to Senior Full-Stack Engineer leading our API team. I architected a real-time event pipeline that processed 10 million daily events with 99.9% uptime because I optimized our message processing. I am now actively seeking a leadership role to grow into engineering management within 2 years.",
    sampleDurationSec: 40,
    improvedVersion: `"Starting my career in Python development, I progressively took on larger ownership, ultimately being promoted to Senior Engineer.

My biggest technical achievement was designing a distributed event processing pipeline in Node and AWS that handles over 10 million daily events with 99.9% reliability.

I'm now looking for my next opportunity to bring my system design skills to a high-growth platform engineering team."`
  },
  {
    id: "q1_3",
    category: "General / Intro",
    title: "Why are you interested in this role and what sets you apart?",
    requiredDetails: [
      {
        id: "d1",
        label: "Company Product / Mission Alignment",
        keywords: ["company", "product", "mission", "platform", "industry", "admire", "followed", "impact", "users"],
        stems: ["compan", "product", "mission", "platform", "industr", "admir", "follow", "impact", "user"],
        tip: "Show clear knowledge of the company's product and why it excites you."
      },
      {
        id: "d2",
        label: "Specific Skill Fit",
        keywords: ["skills", "experience", "fit", "expertise", "specialty", "match", "bring", "stack", "background"],
        stems: ["skill", "exp", "fit", "expert", "special", "match", "bring", "stack", "backg"],
        tip: "Connect your specific technical background to what the team needs."
      },
      {
        id: "d3",
        label: "Unique Differentiator / Superpower",
        keywords: ["sets me apart", "differentiator", "strength", "superpower", "unique", "combining", "bridge", "quality"],
        stems: ["apart", "differ", "strength", "superpow", "uniqu", "combin", "bridg", "qualit"],
        tip: "Highlight what makes your perspective or skill set unique."
      },
      {
        id: "d4",
        label: "Long-term Value Contribution",
        keywords: ["contribute", "value", "help", "scale", "build", "drive", "long-term", "grow", "deliver"],
        stems: ["contrib", "valu", "help", "scal", "build", "driv", "long", "grow", "deliv"],
        tip: "State how you will add immediate and long-term value to the team."
      }
    ],
    sampleTranscript: "I have followed your engineering blog for a while specifically because I admire how you handle high-concurrency real-time data. What sets me apart is my ability to bridge frontend user experience with deep backend database optimization since I have 4 years of experience. I can help scale your API layer by 50% in the first quarter which means higher reliability for your users.",
    sampleDurationSec: 38,
    improvedVersion: `"I've closely followed your company's engineering work in real-time data streaming, and your technical blog posts on query optimization deeply align with my expertise.

What sets me apart is my dual capability in building sleek React interfaces while maintaining sub-50ms API performance on the backend.

I can step into this role on day one to accelerate your platform scalability initiatives while mentoring team members in performance optimization."`
  },

  // --- CATEGORY 2: Behavioral ---
  {
    id: "q2_1",
    category: "Behavioral",
    title: "Describe a challenge you faced and how you handled it.",
    requiredDetails: [
      {
        id: "d1",
        label: "Specific Problem or Roadblock",
        keywords: ["challenge", "problem", "issue", "bug", "outage", "failure", "incident", "crisis", "bottleneck", "memory", "database"],
        stems: ["challeng", "problem", "issu", "bug", "outag", "fail", "incid", "crisi", "bottleneck", "limit", "down", "broke", "crash"],
        tip: "Clearly describe what the specific challenge or problem was."
      },
      {
        id: "d2",
        label: "Your Role & Objective",
        keywords: ["task", "goal", "objective", "responsible", "needed to", "had to", "aimed", "restore", "fix"],
        stems: ["task", "goal", "object", "respons", "need", "had", "aim", "restor", "fix"],
        tip: "Explain what you personally were responsible for solving."
      },
      {
        id: "d3",
        label: "Concrete Actions You Took",
        keywords: ["analyzed", "investigated", "implemented", "fixed", "resolved", "built", "refactored", "replicas", "caching"],
        stems: ["analyz", "investig", "implement", "fix", "resolv", "build", "refact", "replica", "cach"],
        tip: "Describe the specific steps you personally took to solve it."
      },
      {
        id: "d4",
        label: "Measurable Outcome or Result",
        keywords: ["result", "outcome", "recovered", "zero data loss", "saved", "reduced", "percent", "%", "transactions", "minutes"],
        stems: ["result", "outcom", "recover", "save", "reduc", "percent", "transact", "min"],
        isMetricSensitive: true,
        tip: "Share the end result — ideally with a number or metric to back it up."
      }
    ],
    sampleTranscript: "A major challenge occurred when our production database hit a memory limit during Black Friday because traffic spiked by 400%. My goal was to restore stability within 15 minutes. First I analyzed slow query logs, then implemented Redis caching for high-frequency lookups. As a result, we recovered in 8 minutes with zero data loss while successfully processing 1.2 million transactions.",
    sampleDurationSec: 48,
    improvedVersion: `"During Black Friday, our production database hit a memory ceiling due to a 400% traffic spike — causing order transaction failures.

My objective was to restore database stability within 15 minutes while preventing data loss.

I immediately analyzed slow query logs, provisioned read replicas to offload read traffic, and enabled Redis caching for high-frequency catalog lookups.

We fully recovered in 8 minutes with zero data loss and successfully processed over 1.2 million transactions during peak volume."`
  },
  {
    id: "q2_2",
    category: "Behavioral",
    title: "Tell me about a time a project failed or went off track and how you responded.",
    requiredDetails: [
      {
        id: "d1",
        label: "Project Context & What Went Wrong",
        keywords: ["failed", "off track", "delayed", "missed", "scope", "unexpected", "architecture", "flaw", "oversight", "bug", "migration", "slipped", "underestimated", "release", "limit", "integration", "went wrong"],
        stems: ["fail", "track", "delay", "miss", "scope", "unexpect", "architect", "flaw", "oversight", "bug", "migrat", "slip", "underestim", "releas", "limit", "integrat"],
        tip: "Explain the project goal and the root cause of why it slipped."
      },
      {
        id: "d2",
        label: "Ownership & Accountability",
        keywords: ["realized", "took ownership", "responsible", "identified", "admitted", "flagged", "communicated"],
        stems: ["realiz", "owner", "respons", "identif", "admit", "flag", "communicat"],
        tip: "Show accountability without blaming teammates or third parties."
      },
      {
        id: "d3",
        label: "Course Correction Strategy",
        keywords: ["pivot", "re-scoped", "simplified", "phased", "worked extra", "refactored", "solution", "mitigated"],
        stems: ["pivot", "scope", "simplif", "phas", "work", "refact", "solut", "mitig"],
        tip: "Detail the steps you took to salvage the release or adapt."
      },
      {
        id: "d4",
        label: "Key Takeaway & Post-Mortem Action",
        keywords: ["learned", "post-mortem", "process", "prevented", "future", "improved", "never happened again", "guideline"],
        stems: ["learn", "post-mortem", "process", "prevent", "futur", "improv", "never", "guidelin"],
        tip: "Share what process change you instituted to prevent recurrences."
      }
    ],
    sampleTranscript: "During a partner API integration, we uncovered undocumented rate limits and our launch date slipped by 2 weeks because we underestimated the third-party API constraints. I immediately took ownership and flagged the delay to all 3 stakeholders. I proposed implementing a cached fallback strategy to mitigate the risk. We launched phase one successfully, and since then we established a mandatory load testing guideline that prevented recurrence on all future migrations.",
    sampleDurationSec: 44,
    improvedVersion: `"During a major partner API integration, we uncovered undocumented rate limits two days before release — putting our launch timeline at risk.

I took ownership, immediately briefed stakeholders on the impact, and proposed a revised rollout plan that cached non-critical partner responses.

We launched the core feature on time with zero user disruption, and I authored a new pre-integration testing checklist that is now standard across our engineering org."`
  },
  {
    id: "q2_3",
    category: "Behavioral",
    title: "Give an example of how you prioritized competing tasks under tight deadlines.",
    requiredDetails: [
      {
        id: "d1",
        label: "Competing Demands & Deadline Pressure",
        keywords: ["multiple", "competing", "priorities", "tight", "deadline", "urgent", "feature", "hotfix", "bug", "simultaneous"],
        stems: ["multi", "compet", "priorit", "tight", "deadlin", "urgent", "featur", "hotfix", "bug", "simultan"],
        tip: "Describe the conflicting tasks and the time constraint you faced."
      },
      {
        id: "d2",
        label: "Prioritization Framework / Logic",
        keywords: ["evaluated", "business impact", "severity", "matrix", "triaged", "impact vs effort", "decided", "critical"],
        stems: ["evaluat", "impact", "severit", "matri", "triag", "decid", "critic"],
        tip: "Explain how you evaluated business impact vs technical severity."
      },
      {
        id: "d3",
        label: "Stakeholder Communication & Trade-offs",
        keywords: ["communicated", "aligned", "negotiated", "pushed back", "informed", "product manager", "stakeholders", "transparent"],
        stems: ["communicat", "align", "negotiat", "push", "inform", "product", "stakehold", "transpar"],
        tip: "Show how you communicated trade-offs clearly to product managers."
      },
      {
        id: "d4",
        label: "Successful Delivery Outcome",
        keywords: ["delivered", "shipped", "resolved", "met deadline", "on time", "no quality loss", "success", "zero regression"],
        stems: ["deliv", "ship", "resolv", "deadlin", "time", "success", "regress"],
        isMetricSensitive: true,
        tip: "Confirm both urgent priorities were resolved on time."
      }
    ],
    sampleTranscript: "When a critical security patch hit during our end-of-quarter release, I had two competing priorities. I triaged the workload by business impact because the security vulnerability was a critical threat. I communicated with product leads to pause UI work, then patched the security bug within 4 hours. As a result, we delivered both the patch and the core feature on schedule with zero regressions.",
    sampleDurationSec: 40,
    improvedVersion: `"When a critical security patch coincided with our end-of-quarter release deadline, I immediately triaged both streams based on business risk.

I aligned with Product to defer low-impact UI polish, focused 100% of engineering bandwidth on patching the vulnerability within 4 hours, and then resumed feature validation.

Both the security patch and core release shipped on schedule with zero regressions, earning praise from our security and product leads."`
  },

  // --- CATEGORY 3: Leadership & Communication ---
  {
    id: "q3_1",
    category: "Leadership & Communication",
    title: "How do you handle disagreement with a technical lead?",
    requiredDetails: [
      {
        id: "d1",
        label: "Conflicting Technical Perspective",
        keywords: ["disagreement", "differed", "proposed", "rewrite", "framework", "concern", "risk", "tech lead", "perspective"],
        stems: ["disagr", "differ", "propos", "rewrit", "framework", "concern", "risk", "lead", "perspect"],
        tip: "Explain the technical divergence respectfully without blaming."
      },
      {
        id: "d2",
        label: "Data-Driven Communication Strategy",
        keywords: ["private sync", "meeting", "benchmarks", "presented", "data", "metrics", "evidence", "discussed", "1-on-1"],
        stems: ["privat", "meet", "benchmark", "present", "data", "metric", "evidenc", "discuss", "sync"],
        tip: "Mention holding a 1-on-1 sync using benchmarks and data to discuss."
      },
      {
        id: "d3",
        label: "Constructive Compromise Plan",
        keywords: ["proposed", "phased", "adoption", "compromise", "middle ground", "alternative", "solution", "agree"],
        stems: ["propos", "phas", "adopt", "compromis", "middle", "alternat", "solut", "agr"],
        tip: "Show how you proposed a middle-ground or phased rollout."
      },
      {
        id: "d4",
        label: "Successful Project Outcome & Rapport",
        keywords: ["schedule", "on time", "adopted", "relationship", "maintained", "aligned", "success", "launched"],
        stems: ["schedul", "time", "adopt", "relat", "maintain", "align", "success", "launch"],
        tip: "Confirm the project launched on schedule and team rapport was preserved."
      }
    ],
    sampleTranscript: "When my tech lead proposed a framework rewrite before launch, I expressed concern because it posed a high delivery risk. I scheduled a private 1-on-1 sync, then presented benchmarks showing that migration would take 6 weeks. I proposed a phased adoption plan which resulted in a successful launch on time. Since I used evidence, we maintained a positive relationship and launched the update in Q3.",
    sampleDurationSec: 45,
    improvedVersion: `"When my tech lead proposed a full framework rewrite two weeks before a major release deadline, I had delivery risk concerns.

I requested a private 1-on-1 sync where I presented benchmarking data showing the rewrite would require 6+ weeks of testing. I proposed a phased strategy: launch the current release as scheduled, then migrate incrementally in Q3.

My lead appreciated the data-driven approach. We launched on time and completed the migration three months later with zero downtime."`
  },
  {
    id: "q3_2",
    category: "Leadership & Communication",
    title: "How do you mentor junior developers or communicate architecture to non-technical stakeholders?",
    requiredDetails: [
      {
        id: "d1",
        label: "Tailored Communication Approach",
        keywords: ["analogy", "simplified", "diagrams", "plain english", "tailored", "audience", "visual", "no jargon"],
        stems: ["analog", "simplif", "diagram", "plain", "tailor", "audienc", "visu", "jargon"],
        tip: "Explain how you translate complex tech concepts into clear analogies."
      },
      {
        id: "d2",
        label: "Mentoring & Pair Programming Practice",
        keywords: ["mentoring", "pair programming", "code reviews", "1-on-1", "guidance", "documentation", "empower", "growth"],
        stems: ["mentor", "pair", "review", "guid", "doc", "empow", "grow"],
        tip: "Share concrete habits like pair programming, code review feedback, or docs."
      },
      {
        id: "d3",
        label: "Fostering Psychological Safety",
        keywords: ["questions", "safe", "encouraged", "patience", "learning environment", "open", "constructive", "feedback", "simple", "clear", "approachable", "comfortable", "rather than", "without", "easy"],
        stems: ["quest", "safe", "encourag", "patient", "learn", "open", "construct", "feedb", "simpl", "clear", "approach", "comfort", "jargon", "rath", "easy", "complex"],
        tip: "Mention encouraging questions and creating a supportive learning environment."
      },
      {
        id: "d4",
        label: "Measurable Team Impact / Growth",
        keywords: ["promoted", "grew", "velocity", "independent", "onboarded", "reduced review time", "confidence"],
        stems: ["promot", "grow", "veloc", "independ", "onboard", "reduc", "confid"],
        isMetricSensitive: true,
        tip: "Highlight how your mentees grew or improved engineering velocity."
      }
    ],
    sampleTranscript: "I communicate architecture to stakeholders using analogies such as comparing message queues to airport baggage systems because it simplifies complex concepts. I mentor junior developers through weekly pair programming sessions of 2 hours each, plus I provide detailed written code review feedback. Since I encourage questions and create a safe environment for 3 junior engineers, they feel comfortable asking for help without fear of judgment. Consequently, 2 junior engineers I mentored shipped features independently within 90 days.",
    sampleDurationSec: 42,
    improvedVersion: `"When explaining complex backend architecture to non-technical partners, I use intuitive real-world analogies — comparing message queues to airport baggage systems.

For junior developers, I combine weekly pair-programming sessions with detailed, constructive code reviews that explain the 'why' behind architectural decisions.

Through this approach, two junior engineers I mentored accelerated their onboarding and successfully shipped major microservice features independently within 90 days."`
  },
  {
    id: "q3_3",
    category: "Leadership & Communication",
    title: "Tell me about a situation where you had to persuade your team to adopt a new tool or process.",
    requiredDetails: [
      {
        id: "d1",
        label: "Identified Inefficiency / Need",
        keywords: ["inefficiency", "slow", "manual", "flawed", "bottleneck", "linting", "ci/cd", "testing", "tool", "process"],
        stems: ["inefficien", "slow", "manual", "flaw", "bottleneck", "lint", "ci/cd", "test", "tool", "process"],
        tip: "State the problem with the existing workflow."
      },
      {
        id: "d2",
        label: "POC & Demonstration of Value",
        keywords: ["built poc", "prototype", "demo", "benchmarks", "measured", "time saved", "proof of concept", "showed"],
        stems: ["poc", "prototyp", "demo", "benchmark", "measur", "save", "proof", "show"],
        tip: "Explain how you built a working prototype to prove the benefits."
      },
      {
        id: "d3",
        label: "Addressing Resistance & Onboarding",
        keywords: ["addressed concerns", "documentation", "workshop", "gradual", "opt-in", "feedback", "smooth transition"],
        stems: ["concern", "doc", "workshop", "gradual", "opt", "feedb", "transit"],
        tip: "Show how you helped teammates adopt the tool without friction."
      },
      {
        id: "d4",
        label: "Quantified Team Productivity Gain",
        keywords: ["reduced build time", "saved hours", "% faster", "adopted 100%", "zero bugs", "improved velocity"],
        stems: ["reduc", "save", "fast", "adopt", "bug", "improv", "veloc"],
        isMetricSensitive: true,
        tip: "Quantify the time or quality improvement achieved."
      }
    ],
    sampleTranscript: "Our manual QA testing was a bottleneck because it took 6 hours per release. I built an automated Cypress POC and showed benchmarks proving that test time was reduced to 15 minutes. After addressing concerns via a team workshop, 100% of the team adopted automated CI checks, which resulted in saving 20 engineering hours every single week.",
    sampleDurationSec: 43,
    improvedVersion: `"Our manual QA testing cycle was taking 6 hours per release sprint — creating a major deployment bottleneck.

I built a working automated testing proof-of-concept in Cypress and ran a live demonstration showing release validation reduced from 6 hours to 15 minutes.

I created step-by-step onboarding docs and led a 30-minute team workshop. Within one month, 100% of our codebase adopted automated CI checks, saving our team 20+ engineering hours weekly."`
  },

  // --- CATEGORY 4: System Design ---
  {
    id: "q4_1",
    category: "System Design",
    title: "Describe a complex system or feature you designed from scratch.",
    requiredDetails: [
      {
        id: "d1",
        label: "High-Level Architecture & Components",
        keywords: ["architecture", "designed", "microservices", "system", "backend", "api", "pipeline", "infrastructure", "kafka", "redis"],
        stems: ["architect", "design", "microservic", "system", "backen", "api", "pipelin", "infrastruct"],
        tip: "Outline the core architectural layers and services."
      },
      {
        id: "d2",
        label: "Tech Stack Choices & Trade-offs",
        keywords: ["database", "cache", "queue", "postgres", "redis", "kafka", "docker", "aws", "trade-offs", "chose", "why"],
        stems: ["databas", "cach", "queu", "postg", "red", "kafk", "dock", "aws", "tradeoff", "choos", "whi"],
        tip: "Explain why specific tools/databases were selected over alternatives."
      },
      {
        id: "d3",
        label: "Your Personal Engineering Contributions",
        keywords: ["spearheaded", "built", "designed", "wrote", "implemented", "coded", "engineered", "created", "owned"],
        stems: ["spearhead", "build", "design", "write", "implement", "code", "engin", "creat", "own"],
        tip: "Focus on your direct hands-on code and design decisions."
      },
      {
        id: "d4",
        label: "Scale, Throughput & Performance Metrics",
        keywords: ["requests", "users", "ms", "latency", "uptime", "scale", "%", "throughput", "concurrency", "50,000", "99.99%"],
        stems: ["request", "user", "latenc", "uptim", "scal", "throughp", "concurren", "event"],
        isMetricSensitive: true,
        tip: "Quantify system throughput (e.g. 50k req/sec, 99.99% uptime)."
      }
    ],
    sampleTranscript: "I spearheaded the design of an analytics pipeline using Kafka, Node, and Redis. I chose Kafka because it handles high throughput reliably. Since I implemented sliding-window rate limiting using Redis, the system processes 50,000 events per second. The result was 99.99% uptime and 100M daily events handled with zero message loss.",
    sampleDurationSec: 50,
    improvedVersion: `"I designed and built a real-time event ingestion pipeline from scratch to process over 50,000 events per second with sub-50ms latency.

I selected Kafka for durable distributed messaging, Redis for sliding-window rate limiting, and PostgreSQL for long-term historical storage — balancing high write throughput with query flexibility.

The architecture has operated at 99.99% uptime processing 100M+ daily events with zero data loss, serving as the foundational data infrastructure for four downstream services."`
  },
  {
    id: "q4_2",
    category: "System Design",
    title: "How would you design a scalable real-time notification system?",
    requiredDetails: [
      {
        id: "d1",
        label: "Real-Time Transport & Connection Layer",
        keywords: ["websockets", "sse", "server-sent events", "push notifications", "connections", "gateway", "load balancer", "socket"],
        stems: ["websocket", "sse", "push", "notif", "connect", "gatewa", "balanc", "socket"],
        tip: "Explain the connection layer (WebSockets / SSE / Push)."
      },
      {
        id: "d2",
        label: "Pub/Sub & Message Fan-out Queue",
        keywords: ["pub/sub", "kafka", "rabbitmq", "redis pubsub", "decoupling", "queue", "worker", "fanout", "async"],
        stems: ["pub/sub", "pubsub", "kafk", "rabbit", "redis", "decoupl", "queu", "work", "fanout", "async"],
        tip: "Detail how events are queued and broadcast to millions of users."
      },
      {
        id: "d3",
        label: "State Management & Fallbacks",
        keywords: ["unread count", "persistence", "db", "offline", "polling fallback", "retry", "idempotency", "ack"],
        stems: ["unread", "persist", "offlin", "poll", "retri", "idempot", "ack"],
        tip: "Describe how offline users receive notifications upon reconnecting."
      },
      {
        id: "d4",
        label: "Scale, SLA & Security Boundaries",
        keywords: ["million", "concurrent", "latency", "ms", "auth", "jwt", "rate limiting", "99.9%"],
        stems: ["million", "concurren", "latenc", "auth", "limit", "sla"],
        isMetricSensitive: true,
        tip: "State scale target (e.g. 1M concurrent connections, <100ms delivery)."
      }
    ],
    sampleTranscript: "For a real-time notification system, I designed a WebSockets layer because it enables bi-directional communication. I used Kafka for pub/sub fan-out since it scales to millions of events. For offline state, I implemented PostgreSQL storage to ensure persistence. The system handles 1 million concurrent users while maintaining 99.9% SLA and sub-100ms delivery.",
    sampleDurationSec: 46,
    improvedVersion: `"To support 1 million concurrent users, I would design a distributed notification system using persistent WebSockets backed by Redis Pub/Sub.

Incoming events hit an API gateway, publish to Kafka for durable queuing, and worker nodes broadcast to user WebSocket channels via Redis. For offline devices, notifications persist in PostgreSQL with idempotency tokens and route through APNS/FCM.

This architecture ensures guaranteed at-least-once delivery, sub-100ms latency, and graceful fallback for offline clients."`
  },
  {
    id: "q4_3",
    category: "System Design",
    title: "Walk me through how you optimize high-latency API endpoints and database bottlenecks.",
    requiredDetails: [
      {
        id: "d1",
        label: "Diagnostic & Profiling Methodology",
        keywords: ["profiled", "apm", "tracer", "slow query log", "datadog", "new relic", "explain analyze", "bottleneck", "latency"],
        stems: ["profil", "apm", "trac", "slow", "datadog", "explain", "analyz", "bottleneck", "latenc"],
        tip: "Explain how you measure and isolate slow queries or API calls."
      },
      {
        id: "d2",
        label: "Database & Query Optimization",
        keywords: ["indexes", "indexing", "n+1 query", "joins", "denormalization", "query optimization", "read replica", "connection pool"],
        stems: ["index", "n+1", "join", "denorm", "optimi", "replica", "pool"],
        tip: "Describe database-level fixes (indexes, fixing N+1 queries, read replicas)."
      },
      {
        id: "d3",
        label: "Caching & Async Architecture",
        keywords: ["redis", "memcached", "cache invalidation", "ttl", "cdn", "async", "background job"],
        stems: ["red", "memcach", "cach", "ttl", "cdn", "async", "backg"],
        tip: "Detail caching layers (Redis, TTLs) and offloading heavy tasks."
      },
      {
        id: "d4",
        label: "Quantified Latency Reduction",
        keywords: ["reduced latency", "ms to ms", "80%", "300ms", "50ms", "throughput", "response time", "faster"],
        stems: ["reduc", "ms", "percent", "throughp", "fast", "response"],
        isMetricSensitive: true,
        tip: "Quantify the speed improvement (e.g. 800ms down to 45ms)."
      }
    ],
    sampleTranscript: "Hmm, when our search API latency spiked to 800ms, I used Datadog APM and EXPLAIN ANALYZE to diagnose the issue. I discovered an N+1 query problem and missing compound indexes on our Postgres order table. I refactored the ORM queries, added B-tree indexes, and implemented a 60-second Redis cache. This dropped latency from 800ms to 45ms — a 94% improvement.",
    sampleDurationSec: 45,
    improvedVersion: `"When our primary dashboard API endpoint degraded to 800ms response times, I used Datadog APM and EXPLAIN ANALYZE to isolate the bottleneck.

I identified two core issues: an N+1 query pattern across nested user relationships and unindexed joins on foreign keys. I refactored the data fetching into a single query, added targeted compound indexes, and introduced a Redis caching layer with write-through invalidation.

Response latency dropped from 800ms to 45ms — a 94% performance gain that reduced database CPU utilization by 60%."`
  }
];

export function getQuestionsByCategory(categoryName) {
  return SAMPLE_QUESTIONS.filter(q => q.category === categoryName);
}

export function getRandomQuestion(categoryName, currentQuestionId = null) {
  const pool = getQuestionsByCategory(categoryName);
  if (pool.length === 0) return SAMPLE_QUESTIONS[0];
  if (pool.length === 1) return pool[0];

  const available = pool.filter(q => q.id !== currentQuestionId);
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

// Specificity signals — evidence that a sentence is substantive, not vague/random.
// Each signal tests for concrete, evidenced language. 2+ signals = 'strong', 1 = 'partial', 0 = 'weak'.
const SPECIFICITY_SIGNALS = [
  /\b\d+[\d,.]*\b/,          // any number (quantity, timeframe, metric)
  /\b\d+%/,                  // explicit percentage
  // Causal connectors — must be explicit linkage words, not stray "which" or "so"
  /\b(because|since|therefore|as a result|led to|caused|resulted in|due to|which means|that means)\b/i,
  /\b(specifically|in particular|namely|for example|for instance|such as|including)\b/i,
  /\b(first|then|next|finally|after that|subsequently|following that|step one|step two)\b/i,
  // Only count capitalised proper nouns that appear MID-sentence (not sentence-start)
  // by requiring a lowercase word before them
  /\b[a-z]+\s+[A-Z][a-zA-Z]{3,}\b/,
  // Past-tense action verbs — evidence of concrete personal action
  /\b(implemented|designed|built|deployed|refactored|optimized|configured|resolved|reduced|increased|achieved|shipped|delivered|migrated|automated|analyzed|launched|improved|presented|negotiated|established|created|developed)\b/i,
];

// Common stopwords that don't add meaning to a sentence
const STOPWORDS_SET = new Set([
  "the","a","an","is","was","are","were","be","been","being",
  "i","my","me","we","our","you","your","it","its",
  "this","that","these","those","and","or","but","so","yet",
  "to","of","in","on","at","by","for","with","from","into",
  "have","has","had","do","does","did","will","would","can","could",
  "should","shall","may","might","must","not","no","up","out","about"
]);

// Meaningful (non-stopword) content words required in a matched sentence.
// Raising this to 5 ensures that vague/garbled single-clause utterances don't pass.
const MIN_CONTENT_WORDS_IN_SENTENCE = 5;

// Minimum total-word count per category for an answer to be taken seriously
const MIN_WORDS_BY_CATEGORY = {
  "General / Intro":            40,
  "Behavioral":                 60,
  "Leadership & Communication": 60,
  "System Design":              70
};

const METRIC_REGEX = /\b\d[\d,.]*\s*(%|percent|x|k\b|m\b|ms\b|sec\b|seconds?\b|mins?\b|minutes?\b|hours?\b|days?\b|users?\b|customers?\b|requests?\b|events?\b|transactions?\b|\$|usd|€|gbp|rps|qps)\b/i;

/** Split transcript into rough sentence-like segments for context analysis. */
function splitIntoSegments(text) {
  return text
    .split(/[.!?]+|,\s*(?=(?:but|and|so|because|however|although|though|while)\s)/i)
    .map(s => s.trim())
    .filter(s => s.split(/\s+/).length >= 3);
}

/** Count non-stopword content words in a string. */
function countContentWords(text) {
  return text.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS_SET.has(w.replace(/[^a-z]/g, '')))
    .length;
}

/**
 * Search sentence segments for one that contains the match AND has enough
 * surrounding content words to be considered a real statement (not random noise).
 */
function findMeaningfulSentence(segments, matchFn) {
  for (const seg of segments) {
    if (matchFn(seg.toLowerCase())) {
      if (countContentWords(seg) >= MIN_CONTENT_WORDS_IN_SENTENCE) {
        return seg;
      }
    }
  }
  return null;
}

/**
 * Rate how specific/evidence-rich a sentence is.
 * Returns: 'strong' | 'partial' | 'weak'
 */
function measureSentenceQuality(sentence) {
  if (!sentence) return 'none';
  const signals = SPECIFICITY_SIGNALS.filter(rx => rx.test(sentence)).length;
  if (signals >= 2) return 'strong';
  if (signals >= 1) return 'partial';
  return 'weak';
}

// ----- CONTEXT EVALUATION ENGINE -----

export function evaluateQuestionContext(transcriptText, selectedQuestion) {
  if (!selectedQuestion || !selectedQuestion.requiredDetails || !transcriptText) {
    return {
      completenessScore: 0,
      detailsChecklist: [],
      missingDetails: [],
      matchedCount: 0,
      totalRequired: 0,
      feedbackMessage: "No transcript to analyze yet."
    };
  }

  const normalized = normalizeSpeechPhonetics(transcriptText);
  const lower = normalized.toLowerCase();
  const totalWords = normalized.split(/\s+/).filter(w => w.length > 0).length;

  // Gate: is the answer long enough for this category?
  const minWords = MIN_WORDS_BY_CATEGORY[selectedQuestion.category] || 40;
  const isTooShort = totalWords < minWords;

  const tokenList = lower.split(/[\s,.!?;:"()\[\]]+/).map(cleanToken).filter(w => w.length >= 1);

  // Split into segments for context-window checking
  const segments = splitIntoSegments(normalized);

  let matchedCount = 0;
  const detailsChecklist = [];
  const missingDetails = [];

  selectedQuestion.requiredDetails.forEach(detail => {
    let quality = 'none'; // none | weak | partial | strong
    let matchedReason = "";
    let matchedSentence = null;

    // PASS 1: Exact keyword / phrase match in a meaningful sentence
    if (detail.keywords) {
      for (const kw of detail.keywords) {
        const kwLower = kw.toLowerCase().trim();
        const matchFn = kwLower.includes(' ')
          ? seg => seg.includes(kwLower)
          : seg => new RegExp(`\\b${kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(seg);

        const found = findMeaningfulSentence(segments, matchFn);
        if (found) {
          matchedSentence = found;
          matchedReason = `Matched "${kw}"`;
          quality = measureSentenceQuality(found);
          break;
        }
      }
    }

    // PASS 2: Stem / prefix match in a meaningful sentence
    if (!matchedSentence && detail.stems) {
      for (const seg of segments) {
        if (countContentWords(seg) < MIN_CONTENT_WORDS_IN_SENTENCE) continue;
        const segTokens = seg.toLowerCase()
          .split(/[\s,.!?;:"()\[\]]+/)
          .map(cleanToken)
          .filter(w => w.length >= 1);

        const stemHit = segTokens.find(token =>
          detail.stems.some(stem => stem.length >= 3 && (token.startsWith(stem) || token.includes(stem)))
        );

        if (stemHit) {
          matchedSentence = seg;
          matchedReason = `Matched "${stemHit}"`;
          quality = measureSentenceQuality(seg);
          break;
        }
      }
    }

    // PASS 3: Metric detection (only for metric-sensitive details) — always strong evidence
    if (!matchedSentence && detail.isMetricSensitive) {
      const metricSeg = findMeaningfulSentence(segments, seg => METRIC_REGEX.test(seg));
      if (metricSeg) {
        const m = metricSeg.match(METRIC_REGEX);
        matchedSentence = metricSeg;
        matchedReason = `Metric "${m ? m[0] : 'number'}"`;
        quality = 'strong';
      }
    }

    // QUALITY DECISION
    // 'strong'  → fully counts (keyword + evidence)
    // 'partial' → counts normally (keyword + some context)
    // 'weak'    → keyword isolated / context-poor → does NOT count
    // If the whole answer is too short, only 'strong' counts
    const isPresent = quality === 'strong' || quality === 'partial';
    const effectivelyPresent = isTooShort ? quality === 'strong' : isPresent;

    if (effectivelyPresent) {
      matchedCount++;
      const tipText = quality === 'strong'
        ? `✓ Addressed with specifics (${matchedReason})`
        : `⚡ Mentioned briefly (${matchedReason}) — add concrete details`;
      detailsChecklist.push({
        label: detail.label,
        isPresent: true,
        quality,
        matchedReason,
        tip: tipText
      });
    } else {
      missingDetails.push(detail.label);
      const notAddressedTip = quality === 'weak'
        ? `⚠ Term detected but context is too vague — ${detail.tip}`
        : detail.tip;
      detailsChecklist.push({
        label: detail.label,
        isPresent: false,
        quality,
        matchedReason: null,
        tip: notAddressedTip
      });
    }
  });

  const totalRequired = selectedQuestion.requiredDetails.length;
  const completenessScore = Math.round((matchedCount / totalRequired) * 100);

  let feedbackMessage;
  if (isTooShort && completenessScore < 100) {
    feedbackMessage = `Answer is too brief (${totalWords} words). Aim for at least ${minWords}+ words to give the interviewer enough to evaluate.`;
  } else if (completenessScore === 100) {
    feedbackMessage = "Excellent! Your answer addressed all required aspects of the question.";
  } else if (completenessScore >= 75) {
    feedbackMessage = `Strong answer! To make it perfect, elaborate on: ${missingDetails.join(', ')}.`;
  } else if (completenessScore >= 50) {
    feedbackMessage = `Good start! Your answer is missing depth on: ${missingDetails.join(', ')}.`;
  } else {
    feedbackMessage = `Answer needs more depth. Focus on covering: ${missingDetails.join(', ')}.`;
  }

  return {
    completenessScore,
    matchedCount,
    totalRequired,
    detailsChecklist,
    missingDetails,
    feedbackMessage,
    isTooShort,
    totalWords
  };
}

// ----- FILLER WORD DETECTION -----

export function detectFillers(transcriptText) {
  if (!transcriptText || transcriptText.trim().length === 0) {
    return { count: 0, breakdown: {}, rate: 0 };
  }

  const rawWords = transcriptText.trim().split(/\s+/).filter(w => w.length > 0);
  const totalWords = rawWords.length;

  let processedText = transcriptText;
  const breakdown = {};
  let count = 0;

  MULTI_FILLER_PHRASES.forEach(phrase => {
    const reg = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = processedText.match(reg);
    if (matches) {
      const cnt = matches.length;
      count += cnt;
      breakdown[phrase] = cnt;
      processedText = processedText.replace(reg, ' '.repeat(phrase.length));
    }
  });

  const tokens = processedText.split(/\s+/);
  for (let i = 0; i < tokens.length; i++) {
    const rawWord = tokens[i];
    const prevWord = i > 0 ? tokens[i - 1] : "";
    const nextWord = i < tokens.length - 1 ? tokens[i + 1] : "";

    if (isFillerWithContext(rawWord, prevWord, nextWord)) {
      const tokenClean = cleanToken(rawWord);
      const key = normalizeFiller(tokenClean);
      count++;
      breakdown[key] = (breakdown[key] || 0) + 1;
    }
  }

  const rate = totalWords > 0 ? parseFloat(((count / totalWords) * 100).toFixed(1)) : 0;

  return { count, breakdown, rate };
}

// ----- WPM CALCULATION -----

export function calculateWpm(totalWords, durationSeconds, isLiveRecording = false) {
  if (!durationSeconds || durationSeconds < 2) {
    return { wpm: null, status: "N/A", color: "text-zinc-400" };
  }

  const durationMinutes = durationSeconds / 60;
  const rawWpm = totalWords / durationMinutes;
  const wpm = Math.round(Math.min(Math.max(rawWpm, 50), 250));

  let status, color;
  if (wpm < 110) {
    status = "Too Slow";
    color = "text-amber-400";
  } else if (wpm <= 160) {
    status = "Optimal";
    color = "text-emerald-400";
  } else if (wpm <= 185) {
    status = "Slightly Fast";
    color = "text-yellow-400";
  } else {
    status = "Too Fast";
    color = "text-rose-400";
  }

  return { wpm, status, color };
}

// ----- PACING INCONSISTENCY -----

export function analyzePacingInconsistency(transcriptText, overallWpm) {
  const sentences = transcriptText
    .split(/(?<=[.!?])\s+|(?<=\.\.\.)/)
    .map(s => s.trim())
    .filter(s => s.length > 10 && s.split(/\s+/).length >= 3);

  if (sentences.length < 2) {
    return {
      volatilityScore: 0,
      status: "Steady",
      color: "text-emerald-400",
      segments: overallWpm ? [
        { label: "Opening", wpm: overallWpm },
        { label: "Middle", wpm: overallWpm },
        { label: "Closing", wpm: overallWpm }
      ] : [],
      desc: "Not enough sentences to analyze pacing variation."
    };
  }

  const segmentLabels = ["Opening", "Context / Build-up", "Core / Action", "Closing / Result"];
  const buckets = Math.min(sentences.length, 4);
  const chunkSize = Math.ceil(sentences.length / buckets);

  const segments = [];
  const totalWords = transcriptText.split(/\s+/).filter(w => w.length > 0).length;

  for (let i = 0; i < buckets; i++) {
    const chunk = sentences.slice(i * chunkSize, (i + 1) * chunkSize);
    const chunkWords = chunk.join(' ').split(/\s+/).filter(w => w.length > 0).length;
    const densityRatio = totalWords > 0 ? (chunkWords / totalWords) * buckets : 1;
    const segWpm = overallWpm
      ? Math.round(overallWpm * Math.min(Math.max(densityRatio, 0.6), 1.5))
      : 130;
    segments.push({ label: segmentLabels[i] || `Segment ${i + 1}`, wpm: segWpm });
  }

  const wpms = segments.map(s => s.wpm);
  const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
  const stdDev = Math.sqrt(wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length);
  const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
  const volatilityScore = Math.round(cv);

  let status, color, desc;
  if (volatilityScore < 8) {
    status = "Very Consistent";
    color = "text-emerald-400";
    desc = "Steady, professional cadence throughout the answer.";
  } else if (volatilityScore < 18) {
    status = "Naturally Varied";
    color = "text-teal-400";
    desc = "Natural rhythm with minor pace shifts — sounds authentic.";
  } else if (volatilityScore < 30) {
    status = "Moderately Uneven";
    color = "text-amber-400";
    desc = "Some sections noticeably faster or slower than others.";
  } else {
    status = "High Inconsistency";
    color = "text-rose-400";
    desc = "Large speed swings detected — practice smoother transitions.";
  }

  return { volatilityScore, status, color, segments, desc };
}

// ----- STAR METHOD EVALUATION -----

export function evaluateStarMethod(transcriptText) {
  const normalized = normalizeSpeechPhonetics(transcriptText);
  const lower = normalized.toLowerCase();
  const tokenSet = new Set(
    lower.split(/[\s,.!?;:"()\[\]]+/).map(cleanToken).filter(w => w.length >= 1)
  );

  const checks = {
    situation: {
      keywords: [
        "when", "situation", "context", "background", "company", "team",
        "project", "working", "role", "environment", "before", "during",
        "while", "challenge", "problem", "issue", "quarter", "sprint",
        "production", "system", "incident", "outage", "client", "customer",
        "traffic", "spike", "surge", "critical", "urgent", "failing", "major"
      ],
      phrases: [
        "when i was", "at my", "in my role", "the situation was", "we were",
        "i was working", "i was part of", "at the time", "last year",
        "during my time", "on my team", "in my previous", "at my previous",
        "we had", "our team", "the company", "i was assigned"
      ]
    },
    task: {
      keywords: [
        "task", "objective", "goal", "responsible", "needed", "required",
        "challenge", "problem", "job", "duty", "expected", "supposed",
        "ensure", "deliver", "within", "deadline", "minutes", "hours",
        "restore", "fix", "resolve", "achieve", "accomplish", "handle"
      ],
      phrases: [
        "my task", "my goal", "i was responsible", "i needed to", "my objective",
        "i had to", "the goal was", "required to", "i was asked to", "i was tasked",
        "my job was", "my role was", "i was expected", "the task was",
        "we needed to", "our goal was", "the challenge was"
      ]
    },
    action: {
      keywords: [
        "built", "designed", "implemented", "analyzed", "resolved", "created",
        "developed", "led", "wrote", "deployed", "fixed", "proposed", "migrated",
        "optimized", "refactored", "collaborated", "investigated", "presented",
        "reviewed", "enabled", "configured", "introduced", "applied", "tested",
        "profiled", "diagnosed", "escalated", "scheduled", "identified", "found",
        "quickly", "immediately", "decided", "chose", "selected", "switched",
        "coordinated", "partnered", "monitored", "checked", "used", "started"
      ],
      phrases: [
        "i implemented", "i built", "i resolved", "i designed", "i led",
        "i analyzed", "i wrote", "i proposed", "i quickly", "i immediately",
        "i started", "i first", "i decided", "i chose", "i worked",
        "i collaborated", "we implemented", "we deployed", "i enabled",
        "i introduced", "i investigated", "i identified", "i fixed",
        "i configured", "i reviewed", "i presented"
      ]
    },
    result: {
      keywords: [
        "result", "outcome", "achieved", "improved", "reduced", "increased",
        "succeeded", "delivered", "launched", "shipped", "recovered", "saved",
        "eliminated", "prevented", "percent", "%", "uptime", "faster",
        "handled", "processed", "solved", "completed", "stable", "stability",
        "success", "successfully", "maintained", "zero", "loss",
        "million", "thousand", "users", "requests", "transactions", "events",
        "minutes", "latency", "throughput", "revenue"
      ],
      phrases: [
        "as a result", "in the end", "ultimately", "this led to", "we achieved",
        "the outcome was", "we reduced", "we improved", "end result",
        "because of this", "we were able to", "successfully resolved",
        "we recovered", "we handled", "we delivered", "with zero",
        "no downtime", "no data loss", "zero loss"
      ]
    }
  };

  function scoreComponent(check) {
    let score = 0;
    check.keywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      if (kw.includes(' ') ? lower.includes(kwLower) : tokenSet.has(kwLower)) {
        score += 12;
      }
    });
    check.phrases.forEach(phrase => {
      if (lower.includes(phrase)) score += 20;
    });
    return Math.min(score, 100);
  }

  const rawSituation = scoreComponent(checks.situation);
  const rawTask = scoreComponent(checks.task);
  const rawAction = scoreComponent(checks.action);
  const rawResult = scoreComponent(checks.result);

  const situationScore = rawSituation > 0 ? Math.max(rawSituation, 40) : 25;
  const taskScore = rawTask > 0 ? Math.max(rawTask, 40) : 25;
  const actionScore = rawAction > 0 ? Math.max(rawAction, 40) : 25;
  const resultScore = rawResult > 0 ? Math.max(rawResult, 40) : 25;

  const overallScore = Math.round((situationScore + taskScore + actionScore + resultScore) / 4);

  function statusLabel(score) {
    if (score >= 80) return "Strong";
    if (score >= 55) return "Present";
    if (score >= 40) return "Weak";
    return "Missing";
  }

  return {
    overallScore,
    components: [
      { name: "Situation", score: situationScore, status: statusLabel(situationScore), desc: "Sets the scene — role, team, and context." },
      { name: "Task", score: taskScore, status: statusLabel(taskScore), desc: "Your specific responsibility or objective." },
      { name: "Action", score: actionScore, status: statusLabel(actionScore), desc: "Concrete steps YOU personally took." },
      { name: "Result", score: resultScore, status: statusLabel(resultScore), desc: "Measurable outcome and business impact." }
    ]
  };
}

// ----- CONFIDENCE SCORE -----

export function calculateConfidenceScore({ fillerRate, wpm, volatilityScore, starScore, contextScore }) {
  let score = 100;

  if (fillerRate > 10) score -= 40;
  else if (fillerRate > 7) score -= 28;
  else if (fillerRate > 4) score -= 18;
  else if (fillerRate > 2) score -= 10;
  else if (fillerRate > 0) score -= 4;

  if (wpm !== null) {
    if (wpm < 90 || wpm > 200) score -= 15;
    else if (wpm < 110 || wpm > 175) score -= 8;
    else if (wpm < 120 || wpm > 160) score -= 3;
  }

  if (volatilityScore > 30) score -= 12;
  else if (volatilityScore > 18) score -= 6;
  else if (volatilityScore > 8) score -= 2;

  if (starScore >= 80) score += 5;
  else if (starScore < 45) score -= 10;
  else if (starScore < 60) score -= 5;

  if (contextScore === 100) score += 5;
  else if (contextScore < 50) score -= 10;

  return Math.round(Math.min(Math.max(score, 35), 99));
}

// ----- STRENGTH & IMPROVEMENT GENERATOR -----

function generateFeedback(wpm, wpmStatus, fillerCount, fillerBreakdown, fillerRate, contextEval, starAnalysis, volatilityScore, selectedQuestion) {
  const strengths = [];
  const areasForImprovement = [];

  if (wpm === null) {
    // No timer
  } else if (wpmStatus === "Optimal") {
    strengths.push(`Speaking pace is ideal at ${wpm} WPM — keeps the listener engaged without losing them.`);
  } else if (wpmStatus === "Slightly Fast") {
    areasForImprovement.push(`Pace at ${wpm} WPM is slightly rushed. Try pausing after key points.`);
  } else if (wpmStatus === "Too Fast") {
    areasForImprovement.push(`${wpm} WPM is too fast — the interviewer may miss key details. Target 120–160 WPM.`);
  } else if (wpmStatus === "Too Slow") {
    areasForImprovement.push(`${wpm} WPM sounds hesitant. Increasing your pace slightly will project more confidence.`);
  }

  if (fillerCount === 0) {
    strengths.push("No filler words detected — clean, polished delivery.");
  } else if (fillerRate <= 2) {
    strengths.push(`Very low filler usage (${fillerRate}%). Minor vocal habit, nothing that hurts your delivery.`);
  } else if (fillerRate <= 5) {
    const topFillers = Object.entries(fillerBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([w]) => `"${w}"`).join(' and ');
    areasForImprovement.push(`${fillerCount} filler word(s) detected (${fillerRate}%), mainly ${topFillers}. Practice pausing silently instead.`);
  } else {
    const topFillers = Object.entries(fillerBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([w, c]) => `"${w}" ×${c}`).join(', ');
    areasForImprovement.push(`High filler rate (${fillerRate}%): ${topFillers}. Record yourself, identify triggers, and replace with 1–2 second pauses.`);
  }

  if (volatilityScore < 8) {
    strengths.push("Consistent pacing throughout — no jarring speed changes that distract from your message.");
  } else if (volatilityScore >= 18) {
    areasForImprovement.push("Uneven pacing detected — some sections are rushed while others drag. Practice maintaining a steady rhythm.");
  }

  if (contextEval.completenessScore === 100) {
    strengths.push(`Comprehensive answer — covered all ${contextEval.totalRequired} expected aspects of the question.`);
  } else if (contextEval.completenessScore >= 75) {
    strengths.push(`Good coverage — addressed ${contextEval.matchedCount}/${contextEval.totalRequired} key aspects.`);
    if (contextEval.missingDetails.length > 0) {
      areasForImprovement.push(`To strengthen further, include: ${contextEval.missingDetails.join(', ')}.`);
    }
  } else {
    areasForImprovement.push(`Answer lacks depth. Missing key points: ${contextEval.missingDetails.join(', ')}.`);
  }

  if (starAnalysis.overallScore >= 80) {
    strengths.push("Strong STAR structure — situation, actions, and results are all clearly communicated.");
  } else if (starAnalysis.overallScore >= 55) {
    const weakComponent = starAnalysis.components.reduce((a, b) => a.score < b.score ? a : b);
    areasForImprovement.push(`STAR framework partially present but "${weakComponent.name}" section is weak — ${weakComponent.desc}`);
  } else {
    areasForImprovement.push("Structure your answer with STAR: set the situation, your task, what you did, and the result.");
  }

  return { strengths, areasForImprovement };
}

// ----- DYNAMIC REWRITE -----

function generateRewrite(selectedQuestion) {
  if (selectedQuestion?.improvedVersion) {
    return selectedQuestion.improvedVersion.trim();
  }
  return "Your executive STAR rewrite will appear here after speech analysis.";
}

// ----- MAIN ANALYZER -----

export function analyzeSpeech(transcriptText, durationSeconds = 0, selectedQuestion = SAMPLE_QUESTIONS[0], isLiveRecording = false) {
  if (!transcriptText || transcriptText.trim().length === 0) {
    return getEmptyAnalysis(selectedQuestion);
  }

  const cleanText = transcriptText.trim();
  const rawWords = cleanText.split(/\s+/).filter(w => w.length > 0);
  const totalWords = rawWords.length;

  const { wpm, status: wpmStatus, color: wpmColor } = calculateWpm(totalWords, durationSeconds, isLiveRecording);
  const { count: fillerCount, breakdown: fillerBreakdown, rate: fillerRate } = detectFillers(cleanText);
  const starAnalysis = evaluateStarMethod(cleanText);
  const contextEvaluation = evaluateQuestionContext(cleanText, selectedQuestion);
  const pacingAnalysis = analyzePacingInconsistency(cleanText, wpm);

  const confidenceScore = calculateConfidenceScore({
    fillerRate,
    wpm,
    volatilityScore: pacingAnalysis.volatilityScore,
    starScore: starAnalysis.overallScore,
    contextScore: contextEvaluation.completenessScore
  });

  const { strengths, areasForImprovement } = generateFeedback(
    wpm, wpmStatus, fillerCount, fillerBreakdown, fillerRate,
    contextEvaluation, starAnalysis, pacingAnalysis.volatilityScore, selectedQuestion
  );

  const improvedVersion = generateRewrite(selectedQuestion);

  return {
    totalWords,
    durationSeconds,
    wpm,
    wpmStatus,
    wpmColor,
    fillerCount,
    fillerRate,
    fillerPercentage: fillerRate,
    fillerBreakdown,
    contextEvaluation,
    pacingAnalysis,
    confidenceScore,
    starAnalysis,
    strengths,
    areasForImprovement,
    improvedVersion,
    rawText: cleanText
  };
}

function getEmptyAnalysis(selectedQuestion = SAMPLE_QUESTIONS[0]) {
  return {
    totalWords: 0,
    durationSeconds: 0,
    wpm: null,
    wpmStatus: "N/A",
    wpmColor: "text-zinc-500",
    fillerCount: 0,
    fillerRate: 0,
    fillerPercentage: 0,
    fillerBreakdown: {},
    contextEvaluation: {
      completenessScore: 0,
      matchedCount: 0,
      totalRequired: selectedQuestion?.requiredDetails?.length || 0,
      detailsChecklist: (selectedQuestion?.requiredDetails || []).map(d => ({
        label: d.label, isPresent: false, tip: d.tip
      })),
      missingDetails: (selectedQuestion?.requiredDetails || []).map(d => d.label),
      feedbackMessage: "Start recording or paste your transcript to see feedback."
    },
    pacingAnalysis: {
      volatilityScore: 0,
      status: "N/A",
      color: "text-zinc-500",
      segments: [],
      desc: "Record or paste text to analyze pacing."
    },
    confidenceScore: 0,
    starAnalysis: {
      overallScore: 0,
      components: [
        { name: "Situation", score: 0, status: "Missing", desc: "Context and background." },
        { name: "Task", score: 0, status: "Missing", desc: "Your responsibility or objective." },
        { name: "Action", score: 0, status: "Missing", desc: "Steps you personally took." },
        { name: "Result", score: 0, status: "Missing", desc: "Measurable outcome and impact." }
      ]
    },
    strengths: [],
    areasForImprovement: ["Record or paste a transcript above to get your full analysis."],
    improvedVersion: selectedQuestion?.improvedVersion || "Your executive STAR rewrite will appear here.",
    rawText: ""
  };
}
