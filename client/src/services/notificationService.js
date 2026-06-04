import axiosInstance from './axiosConfig';

export const getMyNotifications = async () => {
  const res = await axiosInstance.get('/notifications');
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await axiosInstance.get('/notifications/unread-count');
  return res.data;
};

export const markAsRead = async (notificationId) => {
  const res = await axiosInstance.put(`/notifications/${notificationId}/read`);
  return res.data;
};

export const markAllAsRead = async () => {
  const res = await axiosInstance.put('/notifications/mark-all-read');
  return res.data;
};

export const deleteNotification = async (notificationId) => {
  const res = await axiosInstance.delete(`/notifications/${notificationId}`);
  return res.data;
};