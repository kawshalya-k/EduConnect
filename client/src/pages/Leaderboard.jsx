import React, { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../services/leaderboardService';
import { useAuth } from '../context/AuthContext';


const StarIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);



const Leaderboard = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchLeaderboard();
        if (mounted && data?.success && Array.isArray(data.mentors)) setMentors(data.mentors);
      } catch (e) {
        console.error('Failed to load leaderboard', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const podium = (i) => mentors[i] || null;

  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 p-4 hidden lg:flex flex-col">
        <nav className="space-y-2 flex-1">
          <a
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-500 hover:bg-gray-50 transition"
            href="/dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="font-medium">Dashboard</span>
          </a>

          <a
            className="flex items-center space-x-3 p-3 rounded-lg active-nav-item shadow-sm"
            href="#"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="font-medium">Leaderboard</span>
          </a>

          <a
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-500 hover:bg-gray-50 transition"
            href="#"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="font-medium">Courses</span>
          </a>

          <a
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-500 hover:bg-gray-50 transition"
            href="#"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="font-medium">Mentorship</span>
          </a>

          <a
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-500 hover:bg-gray-50 transition"
            href="#"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="font-medium">Skill Coins</span>
          </a>
        </nav>

        <button className="mt-auto border border-emerald-100 bg-emerald-50 text-emerald-600 font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-emerald-100 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <span>Invite Friends</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto" style={{ backgroundColor: '#fcfdfe' }}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-10">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">Weekly Champions</h1>
          </div>

          {/* Podium */}
          <div className="flex justify-center items-end space-x-4 mb-16 relative">
            {/* 2nd Place */}
            {(() => {
              const m = podium(1);
              return (
                <div className="flex flex-col items-center">
                  <div className="relative mb-[-10px] z-10">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                      {m?.avatar ? (
                        <img alt={`${m.first_name} ${m.last_name}`} className="w-full h-full object-cover" src={m.avatar} />
                      ) : (
                        <div className="w-full h-full bg-slate-300" />
                      )}
                    </div>
                    <span className="absolute -bottom-2 -right-1 bg-gray-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">#2</span>
                  </div>
                  <div className="podium-gradient-silver w-40 h-44 rounded-2xl shadow-sm border border-emerald-50 flex flex-col items-center justify-end pb-8">
                    <h3 className="font-bold text-gray-700 text-sm">{m ? `${m.first_name} ${m.last_name}` : '—'}</h3>
                    <p className="text-emerald-500 font-bold text-lg">{m?.skill_coins ?? '—'}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Skill Coins</p>
                  </div>
                </div>
              );
            })()}

            {/* 1st Place */}
            {(() => {
              const m = podium(0);
              return (
                <div className="flex flex-col items-center scale-110">
                  <div className="mb-4">
                    <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="relative mb-[-10px] z-10">
                    <div className="w-32 h-32 rounded-full border-4 border-emerald-500 shadow-xl overflow-hidden ring-8 ring-emerald-50">
                      {m?.avatar ? (
                        <img alt={`${m.first_name} ${m.last_name}`} className="w-full h-full object-cover" src={m.avatar} />
                      ) : (
                        <div className="w-full h-full bg-slate-300" />
                      )}
                    </div>
                    <span className="absolute -bottom-2 right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white">#1</span>
                  </div>
                  <div className="bg-white podium-gradient-gold w-48 h-56 rounded-2xl shadow-md border border-emerald-100 flex flex-col items-center justify-end pb-10">
                    <h3 className="font-bold text-gray-800 text-base">{m ? `${m.first_name} ${m.last_name}` : '—'}</h3>
                    <p className="text-emerald-600 font-bold text-2xl">{m?.skill_coins ?? '—'}</p>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-3">Skill Coins</p>
                    <div className="flex space-x-1">
                      <span className="text-emerald-400 text-sm">★</span>
                      <span className="text-emerald-400 text-sm">★</span>
                      <span className="text-emerald-400 text-sm">★</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 3rd Place */}
            {(() => {
              const m = podium(2);
              return (
                <div className="flex flex-col items-center">
                  <div className="relative mb-[-10px] z-10">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                      {m?.avatar ? (
                        <img alt={`${m.first_name} ${m.last_name}`} className="w-full h-full object-cover" src={m.avatar} />
                      ) : (
                        <div className="w-full h-full bg-slate-300" />
                      )}
                    </div>
                    <span className="absolute -bottom-2 -right-1 bg-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">#3</span>
                  </div>
                  <div className="podium-gradient-silver w-40 h-40 rounded-2xl shadow-sm border border-emerald-50 flex flex-col items-center justify-end pb-8">
                    <h3 className="font-bold text-gray-700 text-sm">{m ? `${m.first_name} ${m.last_name}` : '—'}</h3>
                    <p className="text-emerald-500 font-bold text-lg">{m?.skill_coins ?? '—'}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Skill Coins</p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Ranking Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-8 py-6">Rank</th>
                  <th className="px-8 py-6">Mentor Name</th>
                  <th className="px-8 py-6">University</th>
                  <th className="px-8 py-6">Mentor Level</th>
                  <th className="px-8 py-6 text-right">Total Skill Coins</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-600">
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center">Loading leaderboard...</td></tr>
                ) : mentors.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center">No leaderboard data available yet.</td></tr>
                ) : (
                  mentors.map((m, i) => (
                    <tr key={m.user_id} className="border-b border-gray-50 hover:bg-emerald-50 transition-colors">
                      <td className="px-8 py-5 text-gray-400 font-bold">#{i + 1}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-3">
                          {m.avatar ? <img alt={`${m.first_name} ${m.last_name}`} className="w-10 h-10 rounded-full" src={m.avatar} /> : <div className="w-10 h-10 rounded-full bg-slate-300" />}
                          <span className="text-gray-800">{m.first_name} {m.last_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-gray-500">{m.university || '—'}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500`}>
                          <StarIcon />
                          <span>{m.level || '—'}</span>
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-bold text-emerald-600 text-base">{m.skill_coins ?? 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Footer Bar */}
            <div className="bg-emerald-500 text-white p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                  {user?.Avatar ? (
                    <img alt="User Avatar" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" src={user.Avatar} />
                  ) : (
                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-slate-300" />
                  )}
                  <div>
                    <h4 className="font-bold leading-tight">{user?.First_Name || user?.first_name || user?.name ? `${user.First_Name || user.first_name || user.name}` : 'You'}</h4>
                    <p className="text-[10px] uppercase opacity-80 font-semibold">{user?.University || user?.university || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <img
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaHzN68D4dHQY5-vJxF1ePZCNpGfp4G52nehRj3n8cdBL60UHGQJJwgzu9befU7eC0df7X-EJwffxch_nmGGa49qJJpL_Iqs8uXW6LFh0UfJQ64hetvGRqWKNpObCeUYO-tBu2GfaHqcpI7jGoVp-5cC6hvR47zj_TCg8u5LIlBothL2Q_F4yFa1ucDLRqHEofWBSql5wEvKnEkMJTl-fPtpxjXSmyIiZtCk43BUYN0i3lDT7wlPxYFSRD-apHxeHbWg-Xk4zfWi4"
                  />
                  <div>
                    <h4 className="font-bold leading-tight">You (Alex Johnson)</h4>
                    <p className="text-[10px] uppercase opacity-80 font-semibold">Harvard University</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-16">
                <div className="text-center">
                  <p className="text-[10px] uppercase opacity-80 font-semibold mb-1">Level</p>
                  <div className="inline-flex items-center space-x-1 bg-emerald-600 px-3 py-1 rounded-full border border-emerald-400">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase">Bronze</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase opacity-80 font-semibold mb-1">Skill Coins</p>
                  <p className="text-2xl font-black">425</p>
                </div>
                <button className="bg-white text-emerald-600 font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-gray-50 transition active:scale-95">
                  Boost Rank
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
