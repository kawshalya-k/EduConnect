import axiosInstance from './axiosConfig';

export const fetchUserBadges = async (userId) => {
  const res = await axiosInstance.get(`/gamification/users/${userId}/badges`);
  return res.data;
};
