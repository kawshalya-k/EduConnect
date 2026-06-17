import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getWalletBalance } from '../../services/walletService';

const WalletWidget = () => {
  const { user, setUser } = useAuth();
  const [balance, setBalance] = useState(user?.skillCoins ?? 0);

  useEffect(() => {
    let isMounted = true;
    const loadBalance = async () => {
      if (!user?.id) return;
      try {
        const response = await getWalletBalance(user.id);
        if (!isMounted) return;
        setBalance(response.balance ?? 0);
        if (setUser) {
          setUser((prev) => prev ? { ...prev, skillCoins: response.balance ?? prev.skillCoins } : prev);
        }
      } catch (err) {
        console.error('WalletWidget balance fetch failed:', err);
      }
    };

    loadBalance();
    return () => {
      isMounted = false;
    };
  }, [user?.id, setUser]);

  return (
    <div className="box-border flex flex-row items-center py-1.5 px-3 gap-2 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg h-[34px]">
      <div className="flex flex-col items-start w-[16.67px] h-[16.67px]">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#10B981]">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7V17M9 10.5H15M9 13.5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col items-start h-5">
        <span className="font-['Lexend'] font-bold text-sm leading-5 flex items-center text-[#10B981]">
          {balance?.toLocaleString() ?? '0'} Skill Coins
        </span>
      </div>
    </div>
  );
};

export default WalletWidget;
