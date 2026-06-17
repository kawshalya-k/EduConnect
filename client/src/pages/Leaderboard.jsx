import React, { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../services/leaderboardService';

const StarIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const getAvatarUrl = (mentor) => {
  const name = `${mentor?.First_Name || 'Mentor'} ${mentor?.Last_Name || ''}`.trim();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10B981&color=fff`;
};

const getLevelClass = (level) => {
  if (!level) return 'bg-orange-100 text-orange-700';
  const normalized = level.toLowerCase();
  if (normalized === 'gold') return 'bg-orange-50 text-orange-600';
  if (normalized === 'silver') return 'bg-slate-100 text-slate-500';
  return 'bg-orange-100 text-orange-700';
};

const Leaderboard = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard();
        if (data?.success && Array.isArray(data.mentors)) {
          setMentors(data.mentors);
        } else {
          setError('Leaderboard data is unavailable.');
        }
      } catch (err) {
        console.error('Leaderboard fetch failed:', err);
        setError('Unable to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const topMentors = mentors.slice(0, 3);

  return (
    <div className="flex flex-1">
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
          <a className="flex items-center space-x-3 p-3 rounded-lg active-nav-item shadow-sm" href="#">
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
          <a className="flex items-center space-x-3 p-3 rounded-lg text-gray-500 hover:bg-gray-50 transition" href="#">
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
          <a className="flex items-center space-x-3 p-3 rounded-lg text-gray-500 hover:bg-gray-50 transition" href="#">
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
          <a className="flex items-center space-x-3 p-3 rounded-lg text-gray-500 hover:bg-gray-50 transition" href="#">
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

      <main className="flex-1 p-8 overflow-y-auto" style={{ backgroundColor: '#fcfdfe' }}>
        <div className="max-w-6xl mx-auto">
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

          <div className="grid grid-cols-1 gap-8 mb-16 lg:grid-cols-3">
            {topMentors.map((mentor, index) => {
              const place = index + 1;
              const mentorName = `${mentor.First_Name || 'Mentor'} ${mentor.Last_Name || ''}`.trim();
              return (
                <div key={mentor.User_Id || index} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden mx-auto">
                      <img alt={mentorName} className="w-full h-full object-cover" src={getAvatarUrl(mentor)} />
                    </div>
                    <span className="absolute -bottom-2 right-1 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white">
                      #{place}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">{mentorName}</h2>
                  <p className="text-sm text-gray-500 mb-3">{mentor.University || 'Unknown University'}</p>
                  <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-100 bg-slate-50">
                    <StarIcon />
                    <span className="text-sm font-semibold text-gray-700">{mentor.level || 'Bronze'}</span>
                  </div>
                  <p className="mt-5 text-3xl font-bold text-emerald-600">{mentor.skill_coins?.toLocaleString() || 0}</p>
                  <p className="text-sm uppercase tracking-wider text-gray-400">Skill Coins</p>
                </div>
              );
            })}
          </div>

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
                  <tr className="border-b border-gray-50">
                    <td colSpan="5" className="px-8 py-12 text-center text-gray-400">
                      Loading leaderboard...
                    </td>
                  </tr>
                ) : error ? (
                  <tr className="border-b border-gray-50">
                    <td colSpan="5" className="px-8 py-12 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : mentors.length === 0 ? (
                  <tr className="border-b border-gray-50">
                    <td colSpan="5" className="px-8 py-12 text-center text-gray-400">
                      No mentors found.
                    </td>
                  </tr>
                ) : (
                  mentors.map((mentor, index) => {
                    const mentorName = `${mentor.First_Name || 'Mentor'} ${mentor.Last_Name || ''}`.trim();
                    const levelClass = getLevelClass(mentor.level);
                    return (
                      <tr
                        key={mentor.User_Id || index}
                        className="border-b border-gray-50 hover:bg-emerald-50 transition-colors"
                      >
                        <td className="px-8 py-5 text-gray-400 font-bold">#{index + 1}</td>
                        <td className="px-8 py-5">
                          <div className="flex items-center space-x-3">
                            <img alt={mentorName} className="w-10 h-10 rounded-full" src={getAvatarUrl(mentor)} />
                            <span className="text-gray-800">{mentorName}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-gray-500">{mentor.University || 'Unknown'}</td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${levelClass}`}>
                            <StarIcon />
                            <span>{mentor.level || 'Bronze'}</span>
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right font-bold text-emerald-600 text-base">
                          {mentor.skill_coins?.toLocaleString() || 0}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
