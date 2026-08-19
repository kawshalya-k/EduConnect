import axiosInstance from './axiosConfig';

export const getLeaderboard = async () => {
  const res = await axiosInstance.get('/gamification/leaderboard');
  return res.data;
};

export const getBadges = async () => {
  const res = await axiosInstance.get('/gamification/badges');
  return res.data;
};

export const getUserBadges = async (userId) => {
  const res = await axiosInstance.get(`/gamification/users/${userId}/badges`);
  return res.data;
};
