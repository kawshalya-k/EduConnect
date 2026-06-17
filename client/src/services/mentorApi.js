// All mentor-related API calls

import API from './axiosConfig';

// ─── Dashboard ───────────────────────────────────────────────
export const fetchMentorDashboard = (mentorId) =>
  API.get('/mentors/dashboard');

export const fetchMentorStats = (mentorId) =>
  API.get('/mentors/dashboard');

export const fetchPerformanceChart = (mentorId, period = '7days') =>
  API.get(`/mentors/dashboard/earnings?period=${period}`);

// ─── Profile ─────────────────────────────────────────────────
export const fetchMentorProfile = (mentorId) =>
  API.get('/mentors/profile');

export const updateMentorProfile = (mentorId, data) =>
  API.put(`/mentors/profile/${mentorId}`, data);

export const toggleAcceptingLearners = async (mentorId, value) => {
  // Save toggle in localStorage since backend doesn't have an availability column
  localStorage.setItem(`mentor_accepting_${mentorId}`, JSON.stringify(value));
  return { data: { accepting: value } };
};

// ─── Sessions ────────────────────────────────────────────────
export const fetchMentorSessions = (mentorId, params = {}) =>
  API.get('/sessions/my', { params });

export const fetchUpcomingSessions = (mentorId) =>
  API.get('/sessions/my');

export const fetchNextSession = (mentorId) =>
  API.get('/sessions/my');

export const acceptSessionRequest = (sessionId) =>
  API.put(`/sessions/${sessionId}/status`, { status: 'Scheduled' });

export const rejectSessionRequest = (sessionId) =>
  API.put(`/sessions/${sessionId}/status`, { status: 'Cancelled' });

export const createSession = (data) =>
  API.post('/sessions/book', data);

export const fetchPendingRequests = (mentorId) =>
  API.get('/sessions/my');

// ─── Skills & Verification ───────────────────────────────────
export const fetchMentorSkills = (mentorId) =>
  API.get('/mentors/skills/my');

export const fetchSkillDetail = (mentorId, skillId) =>
  API.get(`/mentors/skills/my`); // Fallback: filter in frontend if needed

export const addSkill = (mentorId, data) =>
  API.post('/mentors/skills/add', data);

export const fetchVerificationProgress = (mentorId) =>
  API.get('/mentors/skills/my');

export const startVerification = (skillId) =>
  API.post(`/verification/${skillId}/start`);

export const submitVerificationResult = (verificationId, data) =>
  API.post(`/verification/${verificationId}/result`, data);

// ─── Ratings & Feedback ──────────────────────────────────────
export const fetchMentorRatings = (mentorId) =>
  API.get(`/mentor/${mentorId}/ratings`);

// ─── Wallet ──────────────────────────────────────────────────
export const fetchWallet = (userId) =>
  API.get(`/wallet/${userId}`);

export const fetchWalletTransactions = (userId, params = {}) =>
  API.get(`/wallet/${userId}/transactions`, { params });

// ─── Notifications ───────────────────────────────────────────
export const fetchNotifications = (userId) =>
  API.get(`/notifications/${userId}`);

export const markNotificationRead = (notifId) =>
  API.patch(`/notifications/${notifId}/read`);

// ─── Discovery ───────────────────────────────────────────────
export const searchMentors = (params) =>
  API.get('/discovery/mentors', { params });

export const fetchRecommendedMentors = (params = {}) =>
  API.get('/discovery/recommended', { params });

export const aiMentorSearch = (query) =>
  API.post('/discovery/ai-search', { query });

// ─── Mode Toggle ─────────────────────────────────────────────
export const updateUserMode = (userId, mode) =>
  API.patch(`/users/${userId}/mode`, { mode });