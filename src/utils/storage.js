// ---- localStorage Session & Profile Persistence ----

const SESSIONS_KEY = 'voicecraft_sessions';
const PROFILE_KEY  = 'voicecraft_profile';

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
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
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
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
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
}
