import React, { useState } from 'react';

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const SessionsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MoneyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockCircleIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WifiIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

const activityData = [
  {
    id: 1,
    name: 'Alex Chen',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChRpJhdjPZWDUmoqPVHQqvgcVCQLJjfiRBYdxQPv6LZi7w0b1kwY1_dpSoEF8sd_ydDM0kc0r16yP4rK3Q2SMUkidClLmG2bCW84NDqm0nxpplpSrR780DpjeemBDcJhiLvQWSsRvXHGo32mQkzkLSH3avkZcv6wlJnhP8Ojt_andR4lYgh5Uv_OrcIfXRaUFMjNSNpQlGkkPKidlfzlLUy2S5OLmXIFSbeQHvKhcAj9EZ8B5Mu7CNu5zARyDaz9OF2KIQIbXCKhQ',
    skill: 'PYTHON',
    skillBg: 'bg-emerald-50',
    skillColor: 'text-emerald-600',
    amount: '+20 SC',
    amountColor: 'text-emerald-500',
    statusIcon: <CheckCircleIcon />
  },
  {
    id: 2,
    name: 'Sarah Miller',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMxrK4OuARkUPu_rMlfOMVbQp87QHakc5NC0bI-KTAxi_V8pq_rAbjIN3By_5uudlWNvEqR2I5EhBip0CwiSZ-7kRLc80Xd8YLtdHbUnSaomxxk5yQ7mDrn7LNjrSWILkEMGjRT4ElwnXlqDYr6pODmzvkw3Vc9ryN-ISA84RV5XMkfmCGQ1_i36P414-yM8zL709x0VZ9Sv_J0uW7AQ5kcQqal4WFnBjypB8NjIKwlr47wtn84rh2DRJrnsZyt5BnfWS5o3SZXdc',
    skill: 'REACT',
    skillBg: 'bg-emerald-50',
    skillColor: 'text-emerald-600',
    amount: '+20 SC',
    amountColor: 'text-emerald-500',
    statusIcon: <CheckCircleIcon />
  },
  {
    id: 3,
    name: 'David Kim',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC15jNJJ6a6rbHCeHwkFCp4YqVNp6U8y71i6b3IsFUMwrlS-LGnoY4niHGIu7IFV9fDNzoIGg49NLOq8Ye-9y-UlSC_FG_Zov_8UN1N-wBTBps-MUXRlh9KSwsH34oeiVhzQmlj5SxpfEzEVGioexRksoUWDUDEwdILghN5ANRkoWJ9TNJiaST8n5KMdWXN676NonnVFEbJZ8McyLqzaH94N-z4Y5DViOx-Bc1wHh8r2L26UOApx_YhAhip-cxp8LPXBnHLe11UveA',
    skill: 'UX DESIGN',
    skillBg: 'bg-emerald-50',
    skillColor: 'text-emerald-600',
    amount: '+40 SC',
    amountColor: 'text-emerald-500',
    statusIcon: <CheckCircleIcon />
  },
  {
    id: 4,
    name: 'Redemption',
    avatar: '',
    isSystem: true,
    skill: 'LIBRARY PASS',
    skillBg: 'bg-slate-100',
    skillColor: 'text-slate-500',
    amount: '-50 SC',
    amountColor: 'text-red-500',
    statusIcon: <ClockCircleIcon />
  }
];

const Sessions = () => {
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 w-full min-h-[calc(100vh-140px)]">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-emerald-500 mb-1">Session Manager</h1>
          <p className="text-xs text-slate-400 font-medium">Manage your learning sessions</p>
        </div>

        <nav className="space-y-1 mb-10">
          <a href="/dashboard" className="flex items-center space-x-3 p-3 rounded-xl text-slate-500 font-medium hover:bg-slate-50 transition">
            <DashboardIcon />
            <span>Dashboard</span>
          </a>
          <a href="/sessions" className="flex items-center space-x-3 p-3 rounded-xl bg-emerald-50 text-emerald-600 font-semibold transition">
            <SessionsIcon />
            <span>Sessions</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-xl text-slate-500 font-medium hover:bg-slate-50 transition">
            <ClockIcon />
            <span>Availability</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-xl text-slate-500 font-medium hover:bg-slate-50 transition">
            <MoneyIcon />
            <span>Earnings</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-xl text-slate-500 font-medium hover:bg-slate-50 transition">
            <SettingsIcon />
            <span>Settings</span>
          </a>
        </nav>

        <div className="mt-auto space-y-4">
          {/* Availability Toggle */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Availability</span>
              <button 
                onClick={() => setIsAvailable(!isAvailable)}
                className={`w-11 h-6 rounded-full relative transition-colors ${isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isAvailable ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>
            <p className="text-xs font-medium text-slate-500">Accepting new requests</p>
          </div>

          {/* Daily Earnings */}
          <div className="bg-[#111827] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <MoneyIcon />
              </div>
              <span className="text-[11px] font-bold tracking-wider uppercase">Daily Earnings</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold">150</span>
              <span className="text-sm font-semibold text-emerald-400">Skill Coins</span>
            </div>
          </div>

          {/* Go Live Button */}
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center space-x-2 transition shadow-sm shadow-emerald-200">
            <WifiIcon />
            <span>Go Live</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col space-y-6 min-w-0">
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Current Balance */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-48">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-50/50 rounded-full"></div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Current Balance</h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl font-black text-slate-800">150</span>
                <span className="text-xl font-bold text-emerald-500">SC</span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-50 mt-4">
              <p className="text-sm text-slate-500 font-medium">
                Total Lifetime Earnings: <span className="font-bold text-slate-800">1,240 SC</span>
              </p>
            </div>
          </div>

          {/* Last 30 Days Chart */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm h-48 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Last 30 Days</h3>
                <span className="text-2xl font-black text-emerald-500">+340 SC</span>
              </div>
              <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                +12% vs LY
              </div>
            </div>
            
            {/* Mock Chart */}
            <div className="flex-1 relative w-full mt-2 flex flex-col justify-end">
              <svg className="w-full h-16" viewBox="0 0 200 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,35 Q20,30 40,25 T80,15 T120,20 T160,5 T200,10 L200,40 L0,40 Z" fill="url(#gradient)" />
                <path d="M0,35 Q20,30 40,25 T80,15 T120,20 T160,5 T200,10" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div className="flex justify-between text-[8px] font-bold text-slate-300 tracking-wider uppercase mt-2">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 mb-6 px-2">Recent Activity</h2>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-gray-50">
                    <th className="px-4 py-3">Learner</th>
                    <th className="px-4 py-3">Skill</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {activityData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50/50 hover:bg-slate-50/50 transition">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          {item.isSystem ? (
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          ) : (
                            <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full object-cover" />
                          )}
                          <span className="text-slate-700 font-bold">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${item.skillBg} ${item.skillColor}`}>
                          {item.skill}
                        </span>
                      </td>
                      <td className={`px-4 py-4 font-bold ${item.amountColor}`}>
                        {item.amount}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end">
                          {item.statusIcon}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="pt-4 mt-2 border-t border-gray-50 flex justify-center">
              <button className="text-xs font-bold text-emerald-500 uppercase tracking-widest hover:text-emerald-600 transition">
                View All Transactions
              </button>
            </div>
          </div>

          {/* Right Column: Payout & Level */}
          <div className="flex flex-col space-y-6">
            
            {/* Payout Information */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-2 mb-6">
                <InfoIcon />
                <h2 className="text-lg font-bold text-slate-800">Payout Information</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 mb-1">Redeem for Sessions</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Use your coins to book expert mentoring sessions for yourself or your team.
                  </p>
                </div>
                
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 mb-1">University Rewards</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Redeem SC for library access, course certifications, or campus perks.
                  </p>
                </div>
                
                <button className="w-full border-2 border-emerald-500 text-emerald-600 font-bold py-3 rounded-xl hover:bg-emerald-50 transition">
                  Browse Rewards
                </button>
              </div>
            </div>

            {/* Mentor Level */}
            <div className="bg-[#1e4438] rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden flex-1 flex flex-col justify-center">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl"></div>
              
              <h3 className="font-bold text-base mb-4 relative z-10">Mentor Level: Platinum</h3>
              
              <div className="w-full bg-slate-900/40 rounded-full h-2.5 mb-4 relative z-10 overflow-hidden">
                <div className="bg-emerald-400 h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
              
              <p className="text-[11px] text-emerald-50/80 leading-relaxed relative z-10 pr-4">
                You are 260 SC away from Diamond status and a 5% bonus multiplier!
              </p>
            </div>
            
          </div>
        </div>

      </main>
    </div>
  );
};

export default Sessions;
