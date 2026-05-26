import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const sidebarItems = [
  { icon: "⊞", label: "Dashboard", path: "/admin/dashboard" },
  { icon: "👥", label: "User Management", path: "/admin/users" },
  { icon: "✅", label: "Skill Verifications", path: "/admin/verifications" },
  { icon: "📊", label: "Analytics", path: "/admin/analytics" },
  { icon: "⚙️", label: "Settings", path: "/admin/settings" },
];

const stats = [
  { label: "Total Active Users", value: "12.4k", change: "+12.4%", icon: "👥", positive: true },
  { label: "Sessions This Month", value: "2.1k", change: "+5.2%", icon: "📅", positive: true },
  { label: "Skill Coins Circulation", value: "1.2M", change: "+2.1M", icon: "💰", positive: true },
  { label: "Mentor Satisfaction", value: "4.8★", change: "Top Tier", icon: "⭐", positive: true },
];

const barData = [
  { label: "May 15", v1: 60, v2: 40 },
  { label: "May 22", v1: 75, v2: 55 },
  { label: "May 29", v1: 50, v2: 70 },
  { label: "Jun 05", v1: 90, v2: 60 },
  { label: "Jun 12", v1: 80, v2: 85 },
];

const skillDist = [
  { label: "Programming", pct: 42, color: "#16a34a" },
  { label: "Design", pct: 28, color: "#22c55e" },
  { label: "Business", pct: 18, color: "#4ade80" },
  { label: "Others", pct: 12, color: "#bbf7d0" },
];

const mentors = [
  { name: "Dr. Aria Thorne", joined: "Jan 2024", skill: "React Development", sessions: 412, rating: 4.9, earnings: 12400, status: "Active", avatar: "https://i.pravatar.cc/40?img=47" },
  { name: "Sasha Kovic", joined: "Feb 2024", skill: "UX Design", sessions: 385, rating: 5.0, earnings: 10820, status: "Active", avatar: "https://i.pravatar.cc/40?img=25" },
  { name: "Marcus Chen", joined: "Mar 2024", skill: "Cloud Architecture", sessions: 290, rating: 4.8, earnings: 8950, status: "On Break", avatar: "https://i.pravatar.cc/40?img=13" },
];

export default function Analytics() {
  const [activePage, setActivePage] = useState('Analytics');
  const navigate = useNavigate();
  const maxBar = 100;

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Top Bar */}
      <div style={{ background: "#0f172a", padding: "0.6rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>Admin - Analytics</span>
        <span style={{ color: "#94a3b8", fontSize: 12 }}>EduConnect Admin Panel v2.0</span>
      </div>

      <div style={{ display: "flex", flex: 1 }}>

        {/* Sidebar */}
        <div style={{ width: 220, background: "#fff", borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "1.25rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#16a34a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>E</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>EduConnect</span>
          </div>
          <div style={{ padding: "1rem 0.75rem", flex: 1 }}>
            {sidebarItems.map(item => (
              <div key={item.label} onClick={() => { setActivePage(item.label); navigate(item.path); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 4, cursor: "pointer", background: activePage === item.label ? "#f0fdf4" : "transparent", color: activePage === item.label ? "#16a34a" : "#64748b", fontWeight: activePage === item.label ? 700 : 500, fontSize: 14, borderLeft: activePage === item.label ? "3px solid #16a34a" : "3px solid transparent" }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
            <img src="https://i.pravatar.cc/40?img=33" alt="admin" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #bbf7d0" }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Elena Vance</p>
              <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Global Administrator</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>

          {/* Header */}
          <div style={{ background: "#fff", padding: "1.25rem 2rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f8fafc", maxWidth: 300 }}>
                <span>🔍</span>
                <input placeholder="Search analytics or reports..." style={{ flex: 1, padding: "8px 0", border: "none", background: "transparent", fontSize: 13, outline: "none" }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src="https://i.pravatar.cc/40?img=33" alt="admin" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #e2e8f0" }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Alex Rivera</span>
            </div>
          </div>

          <div style={{ padding: "1.5rem 2rem" }}>

            {/* Title */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h1 style={{ margin: "0 0 0.25rem", fontSize: 26, fontWeight: 900, color: "#0f172a" }}>Platform Performance & Growth</h1>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>📅 Last updated: June 15, 2024 • Global Data Overview</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              {stats.map((s, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: "#f0fdf4", color: "#16a34a" }}>{s.change}</span>
                  </div>
                  <p style={{ margin: "0 0 0.25rem", fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#0f172a" }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.25rem", marginBottom: "1.5rem" }}>

              {/* Bar Chart */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Daily User Engagement</h3>
                    <p style={{ margin: "0.25rem 0 0", fontSize: 12, color: "#94a3b8" }}>Active interactions across 30 days</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {['300', '600'].map(v => (
                      <span key={v} style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: "#f0fdf4", color: "#16a34a" }}>{v}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 160 }}>
                  {barData.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ width: "100%", display: "flex", gap: 4, alignItems: "flex-end", height: 140 }}>
                        <div style={{ flex: 1, background: "linear-gradient(180deg, #16a34a, #4ade80)", borderRadius: "6px 6px 0 0", height: `${(d.v1 / maxBar) * 140}px`, opacity: 0.8 }} />
                        <div style={{ flex: 1, background: "linear-gradient(180deg, #4ade80, #bbf7d0)", borderRadius: "6px 6px 0 0", height: `${(d.v2 / maxBar) * 140}px` }} />
                      </div>
                      <span style={{ fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap" }}>{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donut Chart */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
                <h3 style={{ margin: "0 0 0.25rem", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Skill Distribution</h3>
                <p style={{ margin: "0 0 1.25rem", fontSize: 12, color: "#94a3b8" }}>Popular categories by enrollment</p>

                {/* Donut */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
                  <div style={{ position: "relative", width: 120, height: 120 }}>
                    <svg viewBox="0 0 36 36" style={{ width: 120, height: 120, transform: "rotate(-90deg)" }}>
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#16a34a" strokeWidth="3" strokeDasharray="42 58" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="28 72" strokeDashoffset="-42" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="18 82" strokeDashoffset="-70" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#bbf7d0" strokeWidth="3" strokeDasharray="12 88" strokeDashoffset="-88" />
                    </svg>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#0f172a" }}>84%</p>
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
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Mentors */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Top-Performing Mentors</h3>
                  <p style={{ margin: "0.25rem 0 0", fontSize: 12, color: "#94a3b8" }}>Leading growth by session volume and rating</p>
                </div>
                <button style={{ padding: "10px 18px", borderRadius: 12, border: "none", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 12px rgba(22,163,74,0.3)" }}>
                  View All Reports →
                </button>
              </div>

              {/* Table Header */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr", padding: "0.75rem 1rem", background: "#f8fafc", borderRadius: 10, marginBottom: "0.5rem" }}>
                {["MENTOR PROFILE", "PRIMARY SKILL", "SESSIONS", "RATING", "EARNINGS (SC)", "STATUS"].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1 }}>{h}</span>
                ))}
              </div>

              {mentors.map((m, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr", padding: "1rem", borderBottom: i < mentors.length - 1 ? "1px solid #f1f5f9" : "none", alignItems: "center" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={m.avatar} alt={m.name} style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #e2e8f0" }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{m.name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Joined {m.joined}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: "#f0fdf4", color: "#16a34a", display: "inline-block" }}>{m.skill}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{m.sessions}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b" }}>★ {m.rating}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#16a34a" }}>💰 {m.earnings.toLocaleString()}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: m.status === "Active" ? "#f0fdf4" : "#fffbeb", color: m.status === "Active" ? "#16a34a" : "#d97706", display: "inline-block" }}>{m.status}</span>
                </div>
              ))}

              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button style={{ padding: "10px 24px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  Show 25 more mentors
                </button>
              </div>
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