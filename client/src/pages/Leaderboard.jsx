import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../services/gamificationService';
import { useAuth } from '../context/AuthContext';
import LearnerSidebar from '../components/LearnerSidebar';


const StarIcon = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        if (data.success && data.mentors) {
          const sorted = [...data.mentors].sort((a, b) => (Number(b.skill_coins) || 0) - (Number(a.skill_coins) || 0));
          setLeaderboardData(sorted);
        }
      } catch (err) {
        setError('Failed to load leaderboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const getLevelFromScore = (level) => {
    const upperLevel = level ? level.toUpperCase() : 'BRONZE';
    switch (upperLevel) {
      case 'GOLD':
        return { level: 'Gold', color: 'bg-orange-50 text-orange-600' };
      case 'SILVER':
        return { level: 'Silver', color: 'bg-slate-100 text-slate-500' };
      default:
        return { level: 'Bronze', color: 'bg-orange-100 text-orange-700' };
    }
  };

  const getAvatar = (firstName, lastName, avatar) => {
    return avatar || `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=10B981&color=fff`;
  };

  const podiumData = leaderboardData.slice(0, 3);
  const top7Ids = new Set(leaderboardData.slice(0, 7).map(m => m.user_id));
  const rankData = leaderboardData.slice(3, 7).map((mentor, index) => ({
    rank: `#${index + 4}`,
    name: `${mentor.first_name} ${mentor.last_name}`,
    university: mentor.university || 'University',
    level: getLevelFromScore(mentor.mentor_level).level,
    levelColor: getLevelFromScore(mentor.mentor_level).color,
    coins: mentor.skill_coins || 0,
    avatar: getAvatar(mentor.first_name, mentor.last_name, mentor.avatar),
  }));

  const currentUserIndex = leaderboardData.findIndex(m => m.user_id === authUser?.id);
  const currentUserEntry = currentUserIndex >= 0 ? leaderboardData[currentUserIndex] : null;
  const currentUserRank = currentUserIndex >= 0 ? currentUserIndex + 1 : null;

  // If current user is not in top 7, add their row to the table
  if (currentUserEntry && !top7Ids.has(authUser?.id)) {
    rankData.push({
      rank: `#${currentUserRank}`,
      name: `${currentUserEntry.first_name} ${currentUserEntry.last_name}`,
      university: currentUserEntry.university || 'University',
      level: getLevelFromScore(currentUserEntry.mentor_level).level,
      levelColor: getLevelFromScore(currentUserEntry.mentor_level).color,
      coins: currentUserEntry.skill_coins || 0,
      avatar: getAvatar(currentUserEntry.first_name, currentUserEntry.last_name, currentUserEntry.avatar),
      isCurrentUser: true,
    });
  }

  if (loading) {
    return (
      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r border-gray-100 p-4 hidden lg:flex flex-col">
          <div className="animate-pulse space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded"></div>
            ))}
          </div>
        </aside>
        <main className="flex-1 p-8" style={{ backgroundColor: '#fcfdfe' }}>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
            <div className="h-96 bg-gray-100 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No leaderboard data available yet</p>
          <p className="text-gray-400 text-sm mt-2">Complete sessions to appear on the leaderboard</p>
        </div>
      </div>
    );
  }
  const renderMainContent = () => (
    <main className="flex-1 p-8 overflow-y-auto" style={{ backgroundColor: '#fcfdfe', minWidth: 0 }}>
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
          {podiumData[1] ? (
            <div className="flex flex-col items-center">
              <div className="relative mb-[-10px] z-10">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  <img
                    alt={`${podiumData[1].first_name} ${podiumData[1].last_name}`}
                    className="w-full h-full object-cover"
                    src={getAvatar(podiumData[1].first_name, podiumData[1].last_name, podiumData[1].avatar)}
                  />
                </div>
                <span className="absolute -bottom-2 -right-1 bg-gray-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                  #2
                </span>
              </div>
              <div className="podium-gradient-silver w-40 h-44 rounded-2xl shadow-sm border border-emerald-50 flex flex-col items-center justify-end pb-8">
                <h3 className="font-bold text-gray-700 text-sm">{`${podiumData[1].first_name} ${podiumData[1].last_name}`}</h3>
                <p className="text-emerald-500 font-bold text-lg">{podiumData[1].skill_coins || 0}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Skill Wallet</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center opacity-30">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 mb-[-10px]"></div>
              <div className="podium-gradient-silver w-40 h-44 rounded-2xl shadow-sm border border-emerald-50"></div>
            </div>
          )}

          {/* 1st Place */}
          {podiumData[0] ? (
            <div className="flex flex-col items-center scale-110">
              <div className="mb-4">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="relative mb-[-10px] z-10">
                <div className="w-32 h-32 rounded-full border-4 border-emerald-500 shadow-xl overflow-hidden ring-8 ring-emerald-50">
                  <img
                    alt={`${podiumData[0].first_name} ${podiumData[0].last_name}`}
                    className="w-full h-full object-cover"
                    src={getAvatar(podiumData[0].first_name, podiumData[0].last_name, podiumData[0].avatar)}
                  />
                </div>
                <span className="absolute -bottom-2 right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white">
                  #1
                </span>
              </div>
              <div className="bg-white podium-gradient-gold w-48 h-56 rounded-2xl shadow-md border border-emerald-100 flex flex-col items-center justify-end pb-10">
                <h3 className="font-bold text-gray-800 text-base">{`${podiumData[0].first_name} ${podiumData[0].last_name}`}</h3>
                <p className="text-emerald-600 font-bold text-2xl">{podiumData[0].skill_coins || 0}</p>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-3">Skill Wallet</p>
                <div className="flex space-x-1">
                  <span className="text-emerald-400 text-sm">★</span>
                  <span className="text-emerald-400 text-sm">★</span>
                  <span className="text-emerald-400 text-sm">★</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center scale-110 opacity-30">
              <div className="w-32 h-32 rounded-full border-4 border-emerald-500 shadow-xl bg-gray-200 mb-[-10px] ring-8 ring-emerald-50"></div>
              <div className="bg-white podium-gradient-gold w-48 h-56 rounded-2xl shadow-md border border-emerald-100"></div>
            </div>
          )}

          {/* 3rd Place */}
          {podiumData[2] ? (
            <div className="flex flex-col items-center">
              <div className="relative mb-[-10px] z-10">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  <img
                    alt={`${podiumData[2].first_name} ${podiumData[2].last_name}`}
                    className="w-full h-full object-cover"
                    src={getAvatar(podiumData[2].first_name, podiumData[2].last_name, podiumData[2].avatar)}
                  />
                </div>
                <span className="absolute -bottom-2 -right-1 bg-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                  #3
                </span>
              </div>
              <div className="podium-gradient-silver w-40 h-40 rounded-2xl shadow-sm border border-emerald-50 flex flex-col items-center justify-end pb-8">
                <h3 className="font-bold text-gray-700 text-sm">{`${podiumData[2].first_name} ${podiumData[2].last_name}`}</h3>
                <p className="text-emerald-500 font-bold text-lg">{podiumData[2].skill_coins || 0}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Skill Wallet</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center opacity-30">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 mb-[-10px]"></div>
              <div className="podium-gradient-silver w-40 h-40 rounded-2xl shadow-sm border border-emerald-50"></div>
            </div>
          )}
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
                <th className="px-8 py-6 text-right">Total Skill Wallet</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-gray-600">
              {rankData.map((row) => (
                <tr
                  key={row.rank + row.name}
                  className={`border-b border-gray-50 hover:bg-emerald-50 transition-colors ${row.isCurrentUser ? 'bg-emerald-50/50' : ''}`}
                >
                  <td className="px-8 py-5 text-gray-400 font-bold">{row.rank}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <img
                        alt={row.name}
                        className="w-10 h-10 rounded-full"
                        src={row.avatar}
                      />
                      <span className="text-gray-800">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-gray-500">{row.university}</td>
                  <td className="px-8 py-5">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.levelColor}`}
                    >
                      <StarIcon />
                      <span>{row.level}</span>
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-emerald-600 text-base">
                    {row.coins}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Bar */}
          {currentUserEntry ? (
            <div className="bg-emerald-500 text-white p-6 flex items-center justify-between">
              <div className="flex items-center space-x-12">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-400 border border-emerald-300 flex items-center justify-center font-bold text-sm">
                    {currentUserRank}
                  </div>
                  <span className="font-bold text-lg">Your Position</span>
                </div>
                <div className="flex items-center space-x-4">
                  <img
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    src={getAvatar(currentUserEntry.first_name, currentUserEntry.last_name, currentUserEntry.avatar)}
                  />
                  <div>
                    <h4 className="font-bold leading-tight">{currentUserEntry.first_name} {currentUserEntry.last_name}</h4>
                    <p className="text-[10px] uppercase opacity-80 font-semibold">
                      {getLevelFromScore(currentUserEntry.mentor_level).level} Level
                    </p>
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
                    <span className="text-[10px] font-bold uppercase">{getLevelFromScore(currentUserEntry.mentor_level).level}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase opacity-80 font-semibold mb-1">Skill Wallet</p>
                  <p className="text-2xl font-black">{currentUserEntry.skill_coins || 0}</p>
                </div>
                <button className="bg-white text-emerald-600 font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-gray-50 transition active:scale-95">
                  Boost Rank
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500 text-white p-6 flex items-center justify-center">
              <div className="text-center">
                <p className="font-bold text-lg">Complete sessions to appear on the leaderboard</p>
                <p className="text-[10px] uppercase opacity-80 font-semibold mt-1">Your rank will appear here once you have session data</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );

  return (
    <div className="flex flex-1">
      <LearnerSidebar />
      {renderMainContent()}
    </div>
  );
};

export default Leaderboard;
