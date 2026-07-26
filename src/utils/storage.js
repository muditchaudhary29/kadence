// ---- localStorage Session & Profile Persistence ----

const SESSIONS_KEY = 'kadence_sessions';
const PROFILE_KEY  = 'kadence_profile';

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

/** Get all saved sessions */
export function getSessions() {
  try {
    const data = localStorage.getItem(SESSIONS_KEY) || localStorage.getItem('voicecraft_sessions');
    return JSON.parse(data || '[]');
  } catch {
    return [];
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
    return JSON.parse(data || 'null');
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
