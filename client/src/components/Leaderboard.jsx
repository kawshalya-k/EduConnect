import React from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2 } from 'lucide-react';

const mentors = [
  { 
    rank: "#1", 
    name: "Saman Kumara", 
    faculty: "Faculty of Computing",
    level: "GOLD", 
    rating: 5.0, 
    status: "Verified",
    avatar: "https://ui-avatars.com/api/?name=Saman+K&background=10B981&color=fff"
  },
  { 
    rank: "#2", 
    name: "Dilini Perera", 
    faculty: "Applied Sciences",
    level: "SILVER", 
    rating: 4.9, 
    status: "Verified",
    avatar: "https://ui-avatars.com/api/?name=Dilini+P&background=3B82F6&color=fff"
  },
  { 
    rank: "#3", 
    name: "Arjun Silva", 
    faculty: "Management Studies",
    level: "BRONZE", 
    rating: 4.8, 
    status: "Verified",
    avatar: "https://ui-avatars.com/api/?name=Arjun+S&background=F59E0B&color=fff"
  }
];

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

const Leaderboard = () => (
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
        <p className="text-4xl font-black text-slate-900 mb-1">452 Sessions</p>
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
                      <Star key={j} className="w-3 h-3 fill-[#10B981] text-[#10B981]" />
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

export default Leaderboard;