// ---- localStorage Session & Profile Persistence ----

const SESSIONS_KEY = 'kadence_sessions';
const PROFILE_KEY  = 'kadence_profile';

function getInitialSampleSessions() {
  return [
    {
      id: 'session_sample_1',
      date: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
      questionId: 'gen_1',
      questionTitle: 'Tell me about yourself and your background.',
      category: 'General / Intro',
      confidenceScore: 88,
      completenessScore: 100,
      wpm: 138,
      fillerCount: 1,
      fillerRate: 1.2,
      durationSeconds: 45,
      transcript: 'I have worked as a software developer for 4 years specifically building web applications using React and Node.js. My work at my current company served over 200,000 users. Because I led a migration to microservices, we reduced latency by 35% and improved system reliability by 20%.'
    },
    {
      id: 'session_sample_2',
      date: new Date(Date.now() - 3600000 * 26).toISOString(), // 1 day ago
      questionId: 'tech_1',
      questionTitle: 'Describe a challenging bug you debugged and resolved.',
      category: 'Technical / Architecture',
      confidenceScore: 78,
      completenessScore: 75,
      wpm: 142,
      fillerCount: 3,
      fillerRate: 2.8,
      durationSeconds: 62,
      transcript: 'We encountered a memory leak in our production node server caused by unclosed database connections. I used Chrome DevTools and heap snapshot profiling to trace the source, refactored the connection pool lifecycle, and eliminated the leak under peak traffic.'
    },
    {
      id: 'session_sample_3',
      date: new Date(Date.now() - 3600000 * 50).toISOString(), // 2 days ago
      questionId: 'lead_1',
      questionTitle: 'Tell me about a time you had a conflict with a team member.',
      category: 'Leadership / Behavioral',
      confidenceScore: 82,
      completenessScore: 80,
      wpm: 130,
      fillerCount: 2,
      fillerRate: 1.9,
      durationSeconds: 50,
      transcript: 'During a sprint planning meeting, a peer engineer and I disagreed on whether to refactor our backend API first or deliver a critical user feature. I organized a data-backed discussion, aligned on a phased roadmap, and delivered both on schedule.'
    }
  ];
}

/** Save a completed practice session */
export function saveSession(sessionData) {
  const sessions = getSessions();
  const entry = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    ...sessionData
  };
  sessions.unshift(entry); // newest first
  // Keep last 100 sessions
  if (sessions.length > 100) sessions.pop();
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    updateProfile();
  } catch (e) {
    console.warn('Storage quota exceeded, could not save session.');
  }
  return entry;
}

/** Add a new mock session record for testing progress analytics */
export function seedSampleSession() {
  const titles = [
    { title: 'Explain a microservices architecture trade-off you evaluated.', category: 'Technical / Architecture' },
    { title: 'Tell me about a project where you had strict deadlines.', category: 'Leadership / Behavioral' },
    { title: 'Why do you want to join our engineering team?', category: 'General / Intro' },
    { title: 'How do you handle unexpected system downtime in production?', category: 'Technical / Architecture' }
  ];
  const pick = titles[Math.floor(Math.random() * titles.length)];
  const randomConf = Math.floor(Math.random() * 20) + 75; // 75..95
  const randomWpm  = Math.floor(Math.random() * 25) + 125; // 125..150
  const randomComp = Math.floor(Math.random() * 25) + 75; // 75..100
  const randomFill = parseFloat((Math.random() * 2.5 + 0.5).toFixed(1)); // 0.5..3.0

  return saveSession({
    questionTitle: pick.title,
    category: pick.category,
    confidenceScore: randomConf,
    completenessScore: randomComp,
    wpm: randomWpm,
    fillerCount: Math.floor(randomFill * 2),
    fillerRate: randomFill,
    durationSeconds: 48,
    transcript: `Demonstrated ${pick.title.toLowerCase()} with concrete situation context, task objectives, specific technical actions taken, and quantifiable business outcomes.`
  });
}

/** Get all saved sessions */
export function getSessions() {
  try {
    const data = localStorage.getItem(SESSIONS_KEY) || localStorage.getItem('voicecraft_sessions');
    if (!data) {
      const initial = getInitialSampleSessions();
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(initial));
      updateProfile();
      return initial;
    }
    const parsed = JSON.parse(data);
    if (!parsed.length) {
      const initial = getInitialSampleSessions();
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(initial));
      updateProfile();
      return initial;
    }
    return parsed;
  } catch {
    return getInitialSampleSessions();
  }
}

/** Get the last N sessions */
export function getRecentSessions(n = 10) {
  return getSessions().slice(0, n);
}

/** Delete a session by id */
export function deleteSession(id) {
  const updated = getSessions().filter(s => s.id !== id);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  updateProfile();
}

/** Compute and persist aggregate profile stats */
export function updateProfile() {
  const sessions = getSessions();
  if (sessions.length === 0) return;

  const avgConfidence = Math.round(
    sessions.reduce((a, s) => a + (s.confidenceScore || 0), 0) / sessions.length
  );
  const avgWpm = Math.round(
    sessions.filter(s => s.wpm).reduce((a, s) => a + s.wpm, 0) /
    (sessions.filter(s => s.wpm).length || 1)
  );
  const avgFiller = parseFloat(
    (sessions.reduce((a, s) => a + (s.fillerRate || 0), 0) / sessions.length).toFixed(1)
  );

  // Category breakdown
  const catCounts = {};
  sessions.forEach(s => {
    catCounts[s.category] = (catCounts[s.category] || 0) + 1;
  });

  const profile = {
    totalSessions: sessions.length,
    avgConfidence,
    avgWpm,
    avgFiller,
    catCounts,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

/** Get aggregate profile stats */
export function getProfile() {
  try {
    const data = localStorage.getItem(PROFILE_KEY) || localStorage.getItem('voicecraft_profile');
    const parsed = JSON.parse(data || 'null');
    if (!parsed) {
      updateProfile();
      return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Score trend over last N sessions (-100..100, positive = improving) */
export function getScoreTrend(n = 5) {
  const sessions = getSessions().slice(0, n * 2);
  if (sessions.length < 2) return 0;
  const recent = sessions.slice(0, Math.min(n, sessions.length));
  const older  = sessions.slice(n, Math.min(n * 2, sessions.length));
  if (older.length === 0) return 0;
  const recentAvg = recent.reduce((a, s) => a + (s.confidenceScore || 0), 0) / recent.length;
  const olderAvg  = older.reduce((a, s) => a + (s.confidenceScore || 0), 0) / older.length;
  return Math.round(recentAvg - olderAvg);
}

/** Clear all data (reset) */
export function clearAllData() {
  localStorage.removeItem(SESSIONS_KEY);
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(FEEDBACK_KEY);
}

const FEEDBACK_KEY = 'kadence_user_feedback';

/** Save user feedback entry */
export function saveUserFeedback(feedbackData) {
  const list = getUserFeedbacks();
  const entry = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    name: feedbackData.name || 'Anonymous User',
    role: feedbackData.role || 'Practitioner',
    rating: feedbackData.rating || 5,
    category: feedbackData.category || 'General Feedback',
    comment: feedbackData.comment || '',
  };
  list.unshift(entry);
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Could not save user feedback', e);
  }
  return entry;
}

/** Get user feedback entries */
export function getUserFeedbacks() {
  try {
    const data = localStorage.getItem(FEEDBACK_KEY);
    if (!data) return getInitialSampleFeedbacks();
    const parsed = JSON.parse(data);
    return parsed.length ? parsed : getInitialSampleFeedbacks();
  } catch {
    return getInitialSampleFeedbacks();
  }
}

/** Delete user feedback */
export function deleteUserFeedback(id) {
  const updated = getUserFeedbacks().filter(f => f.id !== id);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
  return updated;
}

function getInitialSampleFeedbacks() {
  return [
    {
      id: 'sample_1',
      date: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      name: 'Alex Rivera',
      role: 'Software Engineer',
      rating: 5,
      category: 'Speech Recognition & Accuracy',
      comment: 'The real-time STT engine and filler word detection is incredibly accurate! Helped me eliminate hesitation words during behavioral interview practice.'
    },
    {
      id: 'sample_2',
      date: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      name: 'Sarah Chen',
      role: 'Product Manager',
      rating: 5,
      category: 'STAR Method Evaluation',
      comment: 'Loved the STAR breakdown visualizer. It gives instant feedback on whether I included measurable results in my answers.'
    }
  ];
}
