import axiosInstance from './axiosConfig';

export const getLeaderboard = async () => {
  const res = await axiosInstance.get('/gamification/leaderboard');
  return res.data;
};

export const getBadges = async (userId) => {
  const res = await axiosInstance.get('/gamification/badges', {
    params: { user_id: userId },
  });
  return res.data;
};

export const getUserBadges = async (userId) => {
  const res = await axiosInstance.get(`/gamification/users/${userId}/badges`);
  return res.data;
};
