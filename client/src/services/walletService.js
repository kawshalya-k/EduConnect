// client/src/services/walletService.js
import axiosInstance from './axiosConfig';

export const getWalletBalance = async (userId) => {
  const res = await axiosInstance.get(`/wallet/${userId}`);
  return res.data;
};

export const getTransactions = async (userId) => {
  const res = await axiosInstance.get(`/wallet/${userId}/transactions`);
  return res.data;
};