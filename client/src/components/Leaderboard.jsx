import React from 'react';

const mentors = [
  { rank: "#1", name: "Saman Kumara", level: "GOLD", rating: 5.0, status: "Verified" },
  { rank: "#2", name: "Dilini Perera", level: "SILVER", rating: 4.8, status: "Verified" },
  { rank: "#3", name: "Arjun Silva", level: "BRONZE", rating: 4.6, status: "Verified" }
];

const Leaderboard = () => (
  <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row gap-16">
    {/* Left Side: Stats & Info */}
    <div className="lg:w-1/3 space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">Weekly Top Mentors</h2>
      <p className="text-slate-600 leading-relaxed">
        Recognizing the students who went above and beyond this week to help their peers succeed.
      </p>
      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl">
        <p className="text-emerald-600 font-bold uppercase tracking-wider text-[10px] mb-2">
          Platform Growth
        </p>
        <p className="text-4xl font-black text-slate-900 mb-1">452 Sessions</p>
        <p className="text-slate-500 text-sm">Completed this week across all faculties.</p>
      </div>
    </div>

    {/* Right Side: The Table */}
    <div className="lg:w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-8 py-4 font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Rank</th>
            <th className="px-8 py-4 font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Mentor</th>
            <th className="px-8 py-4 font-semibold text-slate-500 text-[10px] uppercase tracking-wider text-center">Level</th>
            <th className="px-8 py-4 font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {mentors.map((m, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors group">
              <td className="px-8 py-6 font-medium text-slate-400">{m.rank}</td>
              <td className="px-8 py-6 font-bold text-slate-800">{m.name}</td>
              <td className="px-8 py-6 text-center">
                <span className="bg-amber-100 text-amber-700 text-[10px] px-3 py-1 rounded-full font-black uppercase">
                  {m.level}
                </span>
              </td>
              <td className="px-8 py-6 text-emerald-600 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> 
                <span className="text-sm">{m.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 text-center bg-slate-50 border-t border-slate-200">
        <button className="text-emerald-600 font-bold text-sm hover:text-emerald-700 cursor-pointer transition-colors">
          View All Rankings
        </button>
      </div>
    </div>
  </section>
);

export default Leaderboard;