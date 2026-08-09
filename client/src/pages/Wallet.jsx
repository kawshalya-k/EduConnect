import React, { useState, useEffect } from 'react';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWalletBalance, getWalletTransactions } from '../services/walletService';

export default function Wallet() {
  const { user, syncWalletBalance } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayBalance = user?.skillCoins ?? user?.coins ?? balance;

  useEffect(() => {
    const loadWalletData = async () => {
      if (!user?.id) return;

      try {
        const [balanceData, transactionsData] = await Promise.all([
          getWalletBalance(user.id),
          getWalletTransactions(user.id)
        ]);

        if (balanceData.success) {
          setBalance(balanceData.balance);
          syncWalletBalance(balanceData.balance);
        }

        if (transactionsData.success) {
          setTransactions(transactionsData.transactions);
        }
      } catch (err) {
        setError('Failed to load wallet data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWalletData();
    const interval = setInterval(loadWalletData, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6F8F7] font-sans">
        <DashboardNavbar />
        <main className="flex-grow w-full max-w-[1152px] mx-auto pt-[30px] pb-16 px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F6F8F7] font-sans">
        <DashboardNavbar />
        <main className="flex-grow w-full max-w-[1152px] mx-auto pt-[30px] pb-16 px-6">
          <div className="text-red-500 text-center">{error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8F7] font-sans">
      <DashboardNavbar />

      <main className="flex-grow w-full max-w-[1152px] mx-auto pt-[30px] pb-16 px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-4">
          <Link to="/dashboard" className="text-[#64748B] font-normal text-[14px] leading-[20px] hover:underline">Dashboard</Link>
          <svg viewBox="0 0 24 24" fill="none" className="w-[10px] h-[10px] text-[#64748B] stroke-2 stroke-current">
            <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[#0F172A] font-medium text-[14px] leading-[20px]">Wallet</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#0F172A] font-black text-[36px] leading-[40px] tracking-[-0.9px]">Skill Wallet</h1>
            <p className="text-[#475569] text-[16px] leading-[24px] max-w-[512px]">
              Manage your Skill Wallet balance and view your transaction history.
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#10B77F] to-[#10B981] text-white rounded-[24px] py-6 pl-6 pr-12 min-w-[200px] shadow-lg">
            <p className="text-white/80 font-semibold text-[12px] leading-[16px] tracking-[0.6px] uppercase mb-1">Current Balance</p>
            <p className="font-bold text-[36px] leading-[40px]">{displayBalance.toLocaleString()}</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white border border-[#10B77F]/10 shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[24px] p-8">
          <h2 className="text-[#0F172A] font-bold text-[20px] leading-[28px] mb-6">Transaction History</h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#64748B] text-[16px]">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.transaction_id} className="flex items-center justify-between py-4 border-b border-[#F1F5F9] last:border-0">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.type === 'CREDIT' ? 'bg-[#10B77F]/10 text-[#10B981]' : 'bg-red-50 text-red-500'}`}>
                      {transaction.type === 'CREDIT' ? (
                        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-2 stroke-current">
                          <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-2 stroke-current">
                          <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-[#0F172A] font-semibold text-[14px] leading-[20px]">{transaction.reason}</p>
                      <p className="text-[#64748B] text-[12px] leading-[16px]">
                        {new Date(transaction.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold text-[16px] leading-[24px] ${transaction.type === 'CREDIT' ? 'text-[#10B981]' : 'text-red-500'}`}>
                    {transaction.type === 'CREDIT' ? '+' : '-'}{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
