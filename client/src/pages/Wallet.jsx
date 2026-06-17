import React, { useState, useEffect } from 'react';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { getWalletBalance, getTransactions } from '../services/walletService';

const Wallet = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    Promise.all([getWalletBalance(user.id), getTransactions(user.id)])
      .then(([balanceRes, txRes]) => {
        setBalance(balanceRes.balance ?? 0);
        setTransactions(txRes.transactions ?? []);
      })
      .catch(err => console.error('Wallet load error:', err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="p-10 text-center text-gray-400">Loading wallet...</div>;

  return (
    <div className="min-h-screen bg-[#fcfdfe]">
      <DashboardNavbar />
      <main className="max-w-5xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Skill Wallet</h1>
        <p className="text-gray-500 mb-8">Monitor your earnings and spending on EduConnect</p>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Available Balance</p>
          <p className="text-3xl font-bold text-emerald-600">{balance} Coins</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="text-lg font-bold p-6 border-b border-gray-50">Transaction History</h2>
          {transactions.length === 0 ? (
            <p className="p-6 text-gray-400">No transactions yet</p>
          ) : (
            transactions.map(tx => (
              <div key={tx.transaction_id} className="flex justify-between items-center px-6 py-4 border-b border-gray-50">
                <div>
                  <p className="font-medium text-gray-800">{tx.reason}</p>
                  <p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`font-bold ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {tx.type === 'CREDIT' ? '+' : '-'}{tx.amount}
                </span>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wallet;