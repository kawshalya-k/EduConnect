import API from './axiosConfig';

export const fetchLeaderboard = async () => {
  const response = await API.get('/gamification/leaderboard');
  return response.data;
};
