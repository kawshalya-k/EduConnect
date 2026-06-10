// All mentor-related API calls

import API from './axiosConfig';

// ─── Dashboard ───────────────────────────────────────────────
export const fetchMentorDashboard = (mentorId) =>
  API.get(`/mentor/${mentorId}/dashboard`);

export const fetchMentorStats = (mentorId) =>
  API.get(`/mentor/${mentorId}/stats`);

export const fetchPerformanceChart = (mentorId, period = '7days') =>
  API.get(`/mentor/${mentorId}/performance?period=${period}`);

// ─── Profile ─────────────────────────────────────────────────
export const fetchMentorProfile = (mentorId) =>
  API.get(`/mentor/${mentorId}/profile`);

export const updateMentorProfile = (mentorId, data) =>
  API.put(`/mentor/${mentorId}/profile`, data);

export const toggleAcceptingLearners = (mentorId, value) =>
  API.patch(`/mentor/${mentorId}/accepting`, { accepting: value });

// ─── Sessions ────────────────────────────────────────────────
export const fetchMentorSessions = (mentorId, params = {}) =>
  API.get(`/mentor/${mentorId}/sessions`, { params });

export const fetchUpcomingSessions = (mentorId) =>
  API.get(`/mentor/${mentorId}/sessions/upcoming`);

export const fetchNextSession = (mentorId) =>
  API.get(`/mentor/${mentorId}/sessions/next`);

export const acceptSessionRequest = (sessionId) =>
  API.patch(`/sessions/${sessionId}/accept`);

export const rejectSessionRequest = (sessionId) =>
  API.patch(`/sessions/${sessionId}/reject`);

export const createSession = (data) =>
  API.post('/sessions', data);

export const fetchPendingRequests = (mentorId) =>
  API.get(`/mentor/${mentorId}/requests/pending`);

// ─── Skills & Verification ───────────────────────────────────
export const fetchMentorSkills = (mentorId) =>
  API.get(`/mentor/${mentorId}/skills`);

export const fetchSkillDetail = (mentorId, skillId) =>
  API.get(`/mentor/${mentorId}/skills/${skillId}`);

export const addSkill = (mentorId, data) =>
  API.post(`/mentor/${mentorId}/skills`, data);

export const fetchVerificationProgress = (mentorId) =>
  API.get(`/mentor/${mentorId}/verification/progress`);

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