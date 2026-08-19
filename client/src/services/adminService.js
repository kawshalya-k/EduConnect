import axios from 'axios';

const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://educonnect-production-c0d9.up.railway.app/api' : 'http://localhost:5000/api'),
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

export const getAdminProfile = async () => {
  const res = await adminAxios.get('/admin/profile');
  return res.data;
};

export const updateAdminProfile = async (profileData) => {
  const res = await adminAxios.put('/admin/profile', profileData);
  return res.data;
};

export const changeAdminPassword = async (passwords) => {
  const res = await adminAxios.put('/admin/profile/password', passwords);
  return res.data;
};

export const uploadAdminAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://educonnect-production-c0d9.up.railway.app/api' : 'http://localhost:5000/api');
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${baseURL}/admin/profile/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Upload failed');
  }
  return res.json(); // { avatarUrl }
};
