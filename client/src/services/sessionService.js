import axiosInstance from './axiosConfig';

const getStoredUserId = () => {
  try {
    const stored = localStorage.getItem('educonnect_user');
    if (!stored) return null;
    const user = JSON.parse(stored);
    return user?.id || null;
  } catch {
    return null;
  }
};

export const bookSession = async (sessionData) => {
  const res = await axiosInstance.post('/sessions/book', sessionData);
  return res.data;
};

export const getMySessions = async () => {
  const token = localStorage.getItem('token');
  const fallbackUserId = getStoredUserId();
  const url = token ? '/sessions/my' : `/sessions/my${fallbackUserId ? `?userId=${fallbackUserId}` : ''}`;
  const res = await axiosInstance.get(url);
  return res.data;
};

export const updateSessionStatus = async (sessionId, status) => {
  const res = await axiosInstance.put(`/sessions/${sessionId}/status`, { status });
  return res.data;
};

export const addMeetingLink = async (sessionId, meeting_link) => {
  const res = await axiosInstance.put(`/sessions/${sessionId}/meeting-link`, { meeting_link });
  return res.data;
};

export const getSessionById = async (sessionId) => {
  const res = await axiosInstance.get(`/sessions/${sessionId}`);
  return res.data;
};