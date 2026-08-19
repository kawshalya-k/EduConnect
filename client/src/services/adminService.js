import axios from 'axios';

const adminAxios = axios.create({
  baseURL: 'http://localhost:5000/api',
});

adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDashboardStats = async () => {
  const res = await adminAxios.get('/admin/stats');
  return res.data;
};

export const getAllUsers = async () => {
  const res = await adminAxios.get('/admin/users');
  return res.data;
};

export const updateUserStatus = async (userId, status) => {
  const res = await adminAxios.put(`/admin/users/${userId}/status`, { status });
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await adminAxios.delete(`/admin/users/${userId}`);
  return res.data;
};

export const getAllSessions = async () => {
  const res = await adminAxios.get('/admin/sessions');
  return res.data;
};

export const getAnalytics = async () => {
  const res = await adminAxios.get('/admin/analytics');
  return res.data;
};

export const getAllSkills = async () => {
  const res = await adminAxios.get('/admin/skills');
  return res.data;
};

export const addSkill = async (skillData) => {
  const res = await adminAxios.post('/admin/skills', skillData);
  return res.data;
};

export const deleteSkill = async (skillId) => {
  const res = await adminAxios.delete(`/admin/skills/${skillId}`);
  return res.data;
};

export const getAllUserSkills = async () => {
  const res = await adminAxios.get('/admin/user-skills');
  return res.data;
};