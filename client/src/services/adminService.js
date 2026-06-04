import axiosInstance from './axiosConfig';

export const getDashboardStats = async () => {
  const res = await axiosInstance.get('/admin/stats');
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axiosInstance.get('/admin/users');
  return res.data;
};

export const updateUserStatus = async (userId, status) => {
  const res = await axiosInstance.put(`/admin/users/${userId}/status`, { status });
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await axiosInstance.delete(`/admin/users/${userId}`);
  return res.data;
};

export const getAllSessions = async () => {
  const res = await axiosInstance.get('/admin/sessions');
  return res.data;
};

export const getAnalytics = async () => {
  const res = await axiosInstance.get('/admin/analytics');
  return res.data;
};

export const getAllSkills = async () => {
  const res = await axiosInstance.get('/admin/skills');
  return res.data;
};