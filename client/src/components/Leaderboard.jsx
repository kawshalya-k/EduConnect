import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2 } from 'lucide-react';

import axiosInstance from '../services/axiosConfig';

const getLevelBadge = (level) => {
  switch(level) {
    case 'GOLD':
      return <span className="bg-amber-100 text-amber-700 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wide">GOLD</span>;
    case 'SILVER':
      return <span className="bg-slate-200 text-slate-600 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wide">SILVER</span>;
    case 'BRONZE':
      return <span className="bg-orange-100 text-orange-800 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wide">BRONZE</span>;
    default:
      return null;
  }
};

const Leaderboard = () => {
  const [mentors, setMentors] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await axiosInstance.get('/mentors/featured');
        const data = res.data || [];
        const formattedMentors = data.slice(0, 3).map((mentor, index) => ({
          rank: `#${index + 1}`,
          name: `${mentor.First_Name} ${mentor.Last_Name}`,
          faculty: mentor.University || "University",
          level: mentor.Mentor_Level ? mentor.Mentor_Level.toUpperCase().replace(' MENTOR', '') : 'BRONZE',
          rating: parseFloat(mentor.Average_Rating) || 5.0,
          status: "Verified",
          session_count: mentor.Total_Sessions || 0,
          avatar: mentor.Avatar || '/default-avatar.svg'
        }));
        setMentors(formattedMentors);
        
        // Count total sessions of all featured mentors
        const total = formattedMentors.reduce((acc, m) => acc + m.session_count, 0);
        setTotalSessions(total || 12);
      } catch (err) {
        setError('Failed to load featured mentors');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/3 space-y-6">
          <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="lg:w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row gap-16">
      {/* Left Side: Stats & Info */}
      <div className="lg:w-1/3 space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">Weekly Top Mentors</h2>
        <p className="text-slate-600 leading-relaxed">
          Recognizing the students who went above and beyond this week to help their peers succeed.
        </p>
        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl">
          <p className="text-emerald-600 font-bold uppercase tracking-wider text-[10px] mb-2 flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            Platform Growth
          </p>
          <p className="text-4xl font-black text-slate-900 mb-1">{totalSessions} Sessions</p>
          <p className="text-slate-500 text-sm">Completed this week alone across all faculties.</p>
        </div>
      </div>

      {/* Right Side: The Table */}
      <div className="lg:w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Rank</th>
                <th className="px-6 py-5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Mentor</th>
                <th className="px-6 py-5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider text-center">Level</th>
                <th className="px-6 py-5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Rating</th>
                <th className="px-6 py-5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mentors.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5 font-medium text-slate-400 text-sm">{m.rank}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{m.name}</div>
                        <div className="text-[11px] text-slate-500">{m.faculty}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {getLevelBadge(m.level)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < Math.round(m.rating) ? 'fill-[#10B981] text-[#10B981]' : 'fill-slate-200 text-slate-200'}`} />
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-1">{m.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-[#10B981] font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      {m.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 text-center bg-slate-50/50 border-t border-slate-100">
          <Link to="/leaderboard" className="text-[#10B981] font-bold text-sm hover:text-[#059669] cursor-pointer transition-colors">
            View All Rankings
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;