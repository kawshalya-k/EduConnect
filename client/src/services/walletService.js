import axiosInstance from './axiosConfig';

export const getWalletBalance = async (userId) => {
	const res = await axiosInstance.get(`/wallet/${userId}`);
	return res.data;
};

export const getWalletTransactions = async (userId, page = 1, limit = 10) => {
	const res = await axiosInstance.get(`/wallet/${userId}/transactions?page=${page}&limit=${limit}`);
	return res.data;
};

export const createTransaction = async (payload) => {
	const res = await axiosInstance.post('/wallet/transact', payload);
	return res.data;
};
