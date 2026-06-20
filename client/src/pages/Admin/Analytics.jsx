import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalytics } from '../../services/adminService';

const sidebarItems = [
  { icon: "📊", label: "Dashboard", path: "/admin/dashboard" },
  { icon: "👥", label: "User Management", path: "/admin/users" },
  { icon: "✅", label: "Skill Verifications", path: "/admin/verifications" },
  { icon: "📈", label: "Analytics", path: "/admin/analytics" },
  { icon: "⚙️", label: "Settings", path: "/admin/settings" },
];

const barData = [
  { label: "May 15", v1: 60, v2: 40 },
  { label: "May 22", v1: 75, v2: 55 },
  { label: "May 29", v1: 50, v2: 70 },
  { label: "Jun 05", v1: 90, v2: 60 },
  { label: "Jun 12", v1: 80, v2: 85 },
];

const skillDist = [
  { label: "Programming", pct: 42, color: "#10b981" },
  { label: "Design", pct: 28, color: "#3b82f6" },
  { label: "Business", pct: 18, color: "#f59e0b" },
  { label: "Others", pct: 12, color: "#8b5cf6" },
];

export default function Analytics() {
  const [activePage, setActivePage] = useState('Analytics');
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    totalSessions: 0,
    completedSessions: 0,
    skillCoinsCirculation: 0,
    topMentors: []
  });
  const navigate = useNavigate();
  const maxBar = 100;

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalyticsData(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      }
    };
    fetchAnalytics();
  }, []);

  const stats = [
    { label: "Total Active Users", value: analyticsData.totalUsers, change: "+12.4%", icon: "👥", iconBg: "#ecfdf5", iconColor: "#10b981", positive: true },
    { label: "Sessions This Month", value: analyticsData.totalSessions, change: "+5.2%", icon: "📅", iconBg: "#eff6ff", iconColor: "#3b82f6", positive: true },
    { label: "Skill Wallet Circulation", value: analyticsData.skillCoinsCirculation, change: "+2.1M", icon: "💰", iconBg: "#f5f3ff", iconColor: "#8b5cf6", positive: true },
    { label: "Mentor Satisfaction", value: "4.8★", change: "Top Tier", icon: "⭐", iconBg: "#fffbeb", iconColor: "#f59e0b", positive: true },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <nav style={{ background: "#fff", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "#10b981", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>E</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#0a1628" }}>EduConnect</span>
          <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: "#10b981", background: "#ecfdf5", padding: "3px 10px", borderRadius: 20, border: "1px solid #a7f3d0" }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="https://i.pravatar.cc/40?img=33" alt="admin" style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #e2e8f0" }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0a1628" }}>Alex Rivera</span>
        </div>
      </nav>

      <div style={{ display: "flex", flex: 1 }}>

        {/* Sidebar */}
        <div style={{ width: 230, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "1.5rem 1rem", flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 1rem 0.5rem" }}>Main Menu</p>
            {sidebarItems.map(item => (
              <div key={item.label} onClick={() => { setActivePage(item.label); navigate(item.path); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, marginBottom: 4, cursor: "pointer", background: activePage === item.label ? "#ecfdf5" : "transparent", color: activePage === item.label ? "#10b981" : "#64748b", fontWeight: activePage === item.label ? 700 : 500, fontSize: 14, borderLeft: activePage === item.label ? "3px solid #10b981" : "3px solid transparent" }}>
                <span style={{ fontSize: 17 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "1rem", margin: "0 1rem 1rem", background: "#f8fafc", borderRadius: 14, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src="https://i.pravatar.cc/40?img=33" alt="admin" style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #a7f3d0" }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0a1628" }}>Super Admin</p>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "2rem" }}>

            {/* Header */}
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ margin: "0 0 0.25rem", fontSize: 28, fontWeight: 900, color: "#0a1628" }}>Platform Performance & Growth</h1>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>📅 Last updated: June 15, 2024 • Global Data Overview</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "1.5rem" }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0", borderTop: `3px solid ${stat.iconColor}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div style={{ width: 44, height: 44, background: stat.iconBg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{stat.icon}</div>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: "#ecfdf5", color: "#10b981" }}>{stat.change}</span>
                  </div>
                  <p style={{ margin: "0 0 0.25rem", fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{stat.label}</p>
                  <p style={{ margin: 0, fontSize: 30, fontWeight: 900, color: "#0a1628" }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.25rem", marginBottom: "1.5rem" }}>

              {/* Bar Chart */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <h3 style={{ margin: "0 0 0.25rem", fontSize: 16, fontWeight: 700, color: "#0a1628" }}>Daily User Engagement</h3>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Active interactions across 30 days</p>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 160 }}>
                  {barData.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: "100%", display: "flex", gap: 4, alignItems: "flex-end", height: 140 }}>
                        <div style={{ flex: 1, background: "#10b981", borderRadius: "6px 6px 0 0", height: `${(d.v1 / maxBar) * 140}px`, opacity: 0.9 }} />
                        <div style={{ flex: 1, background: "#a7f3d0", borderRadius: "6px 6px 0 0", height: `${(d.v2 / maxBar) * 140}px` }} />
                      </div>
                      <span style={{ fontSize: 10, color: "#94a3b8", marginTop: 6 }}>{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donut Chart */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 0.25rem", fontSize: 16, fontWeight: 700, color: "#0a1628" }}>Skill Distribution</h3>
                <p style={{ margin: "0 0 1.25rem", fontSize: 12, color: "#94a3b8" }}>Popular categories by enrollment</p>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
                  <div style={{ position: "relative", width: 120, height: 120 }}>
                    <svg viewBox="0 0 36 36" style={{ width: 120, height: 120, transform: "rotate(-90deg)" }}>
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="42 58" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="28 72" strokeDashoffset="-42" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="18 82" strokeDashoffset="-70" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="12 88" strokeDashoffset="-88" />
                    </svg>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0a1628" }}>84%</p>
                      <p style={{ margin: 0, fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>MATCHED</p>
                    </div>
                  </div>
                </div>
                {skillDist.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                      <span style={{ fontSize: 12, color: "#475569" }}>{s.label}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#0a1628" }}>{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Mentors */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.25rem", fontSize: 16, fontWeight: 700, color: "#0a1628" }}>Top-Performing Mentors</h3>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Leading growth by session volume and rating</p>
                </div>
                <button style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#10b981", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  View All Reports →
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr", padding: "0.75rem 1rem", background: "#f8fafc", borderRadius: 10, marginBottom: "0.5rem" }}>
                {["MENTOR PROFILE", "PRIMARY SKILL", "SESSIONS", "RATING", "EARNINGS (SC)", "STATUS"].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1 }}>{h}</span>
                ))}
              </div>

              {analyticsData.topMentors.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8", fontSize: 14 }}>
                  No mentor data available yet.
                </div>
              ) : (
                analyticsData.topMentors.map((m, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr", padding: "1rem", borderBottom: i < analyticsData.topMentors.length - 1 ? "1px solid #f1f5f9" : "none", alignItems: "center" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={m.avatar || 'https://i.pravatar.cc/40'} alt={m.First_Name} style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #e2e8f0" }} />
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0a1628" }}>{m.First_Name} {m.Last_Name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{m.Email}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: "#ecfdf5", color: "#10b981", display: "inline-block" }}>Mentor</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0a1628" }}>{m.total_sessions}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b" }}>★ {Number(m.avg_rating || 0).toFixed(1)}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>💰 {(m.total_earnings || 0).toLocaleString()}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: "#ecfdf5", color: "#10b981", display: "inline-block" }}>Active</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
      {/* Footer */}
          <div style={{ background: "#022C22", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>© 2026 EduConnect. All rights reserved.</span>
            <span style={{ fontSize: 12, color: "#64748b", cursor: "pointer" }}>Help Center</span>
          </div>
    </div>
  );
}