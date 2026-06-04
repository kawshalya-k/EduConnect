import axiosInstance from './axiosConfig';

export const bookSession = async (sessionData) => {
  const res = await axiosInstance.post('/sessions/book', sessionData);
  return res.data;
};

export const getMySessions = async () => {
  const res = await axiosInstance.get('/sessions/my');
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