import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [stats, setStats] = useState({ totalUsers: 0, recentUsers: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiBase = import.meta.env.PROD ? 'https://educonnect-production-c0d9.up.railway.app/api' : 'http://localhost:5000/api';
        const res = await fetch(`${apiBase}/users/public/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalUsers: data.totalUsers || 0,
            recentUsers: data.recentUsers || []
          });
        }
      } catch (err) {
        console.error('Error fetching public stats:', err);
      }
    };
    fetchStats();
  }, []);

  const bgColors = ['0D8ABC', 'F59E0B', '10B981'];

  // Only real registered users
  const displayedUsers = stats.recentUsers.map((u) => ({
    name: `${u.First_Name} ${u.Last_Name}`,
    avatar: u.Avatar
  }));

  // Only real registered count
  const displayCount = stats.totalUsers;

  return (
    <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 space-y-8 text-left">
        <h1 className="text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
          Master New Skills with Your <span className="text-[#10B981]">Peers.</span>
        </h1>
        <p className="text-xl text-slate-600 font-light leading-relaxed max-w-lg">
          The AI-powered skill-sharing ecosystem for University students. Turn your knowledge into recognition and rewards.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/register" className="bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-emerald-200 transition-all cursor-pointer text-sm inline-block text-center">
            Get Started with Your Student Email
          </Link>
          <Link to="/discovery" className="bg-white border-2 border-slate-200 hover:border-slate-300 font-bold py-4 px-8 rounded-xl transition-all cursor-pointer text-sm text-slate-700 inline-block text-center">
            Explore Mentors
          </Link>
        </div>
        
        <div className="flex items-center gap-4 pt-4">
          {displayedUsers.length > 0 && (
            <div className="flex -space-x-3">
              {displayedUsers.map((u, i) => {
                const avatarUrl = u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=${bgColors[i % 3]}&color=fff`;
                return (
                  <img 
                    key={i} 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" 
                    src={avatarUrl} 
                    alt={u.name} 
                  />
                );
              })}
            </div>
          )}
          <p className="text-sm font-medium text-slate-500">
            Join {displayCount.toLocaleString()}+ students already learning
          </p>
        </div>
      </div>
      <div className="flex-1 w-full flex justify-end">
        <img 
          src="/images/hero_forest_desk.png" 
          alt="AI-powered skill sharing in a magical forest" 
          className="w-full max-w-lg rounded-[2rem] shadow-2xl object-cover aspect-square"
        />
      </div>
    </section>
  );
};

export default Hero;