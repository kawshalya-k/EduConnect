import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: "Total Active Users", value: "12,482", change: "+12%", icon: "👥", color: "#3b82f6", bg: "#eff6ff", positive: true },
  { label: "Pending Verifications", value: "158", change: "! High", icon: "⚠️", color: "#f59e0b", bg: "#fffbeb", positive: false },
  { label: "Sessions Today", value: "2,104", change: "+5%", icon: "📅", color: "#22c55e", bg: "#f0fdf4", positive: true },
  { label: "Skill Coins Circulation", value: "1.2M", change: "+8%", icon: "💰", color: "#8b5cf6", bg: "#f5f3ff", positive: true },
];

const disputes = [
  { type: "REPORTED SESSION", time: "2m ago", desc: "Inappropriate behavior in UI Design session", reporter: "Sarah Jenkins", color: "#ef4444", icon: "🚨" },
  { type: "SKILL MISMATCH", time: "45m ago", desc: "Mentor lacking verified credentials", reporter: "Alex Rivera", color: "#f59e0b", icon: "⚠️" },
  { type: "SPAM ACCOUNT", time: "2h ago", desc: "Automated bot behavior detected", reporter: "System Auto-Flagged", color: "#8b5cf6", icon: "🤖" },
  { type: "CONTENT APPEAL", time: "5h ago", desc: "Appeal for removed workshop content", reporter: "Jordan Lee", color: "#3b82f6", icon: "📋" },
];

const activityData = [30, 45, 35, 60, 55, 75, 65, 80, 70, 90, 85, 95, 88, 92, 98];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Monthly');
  const [activePage, setActivePage] = useState('Dashboard');
  const navigate = useNavigate();

  const maxVal = Math.max(...activityData);

  const sidebarItems = [
    { icon: "⊞", label: "Dashboard", path: "/admin/dashboard" },
    { icon: "👥", label: "User Management", path: "/admin/users" },
    { icon: "✅", label: "Skill Verifications", path: "/admin/verifications" },
    { icon: "📊", label: "Analytics", path: "/admin/analytics" },
    { icon: "⚙️", label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Top Bar */}
      <div style={{ background: "#022C22", padding: "0.6rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>Admin - Dashboard</span>
        <span style={{ color: "#94a3b8", fontSize: 12 }}>EduConnect Admin Panel v2.0</span>
      </div>

      <div style={{ display: "flex", flex: 1 }}>

        {/* Sidebar */}
        <div style={{ width: 220, background: "#fff", borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", minHeight: "calc(100vh - 40px)", flexShrink: 0 }}>

          {/* Logo */}
          <div style={{ padding: "1.25rem 1.25rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#16a34a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>E</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>EduConnect</span>
          </div>

          {/* Nav Items */}
          <div style={{ padding: "1rem 0.75rem", flex: 1 }}>
            {sidebarItems.map(item => (
              <div key={item.label}
                onClick={() => { setActivePage(item.label); navigate(item.path); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 4, cursor: "pointer", background: activePage === item.label ? "#f0fdf4" : "transparent", color: activePage === item.label ? "#16a34a" : "#64748b", fontWeight: activePage === item.label ? 700 : 500, fontSize: 14, transition: "all 0.15s", borderLeft: activePage === item.label ? "3px solid #16a34a" : "3px solid transparent" }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Admin Profile */}
          <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
            <img src="https://i.pravatar.cc/40?img=33" alt="admin" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #bbf7d0" }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Super Admin</p>
              <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Administrator</p>
            </div>
            <span style={{ cursor: "pointer", fontSize: 16, color: "#94a3b8" }}>↪</span>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>

          {/* Header */}
          <div style={{ background: "#fff", padding: "1.25rem 2rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Dashboard</h1>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Welcome back! Here's what's happening today.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, background: "#22c55e", borderRadius: "50%" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>System Online</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <img src="https://i.pravatar.cc/40?img=33" alt="admin" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #e2e8f0" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Alex Rivera</span>
              </div>
            </div>
          </div>

          <div style={{ padding: "1.5rem 2rem", display: "flex", gap: "1.5rem" }}>

            {/* Left — Stats + Chart */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                {stats.map((stat, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -10, right: -10, width: 60, height: 60, background: stat.bg, borderRadius: "50%", opacity: 0.5 }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                      <div style={{ width: 40, height: 40, background: stat.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{stat.icon}</div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: stat.positive ? "#f0fdf4" : "#fffbeb", color: stat.positive ? "#16a34a" : "#d97706" }}>{stat.change}</span>
                    </div>
                    <p style={{ margin: "0 0 0.25rem", fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{stat.label}</p>
                    <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#0f172a" }}>{stat.value}</p>
                    <div style={{ marginTop: "0.75rem", height: 3, background: "#f1f5f9", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${60 + i * 10}%`, background: stat.color, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity Chart */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Platform Activity</h3>
                    <p style={{ margin: "0.25rem 0 0", fontSize: 12, color: "#94a3b8" }}>User engagement metrics over the last 30 days</p>
                  </div>
                  <div style={{ display: "flex", gap: 4, background: "#f8fafc", borderRadius: 10, padding: 4 }}>
                    {['Daily', 'Monthly'].map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: activeTab === tab ? "#16a34a" : "transparent", color: activeTab === tab ? "#fff" : "#64748b", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 180, padding: "0 0.5rem" }}>
                  {activityData.map((val, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ width: "100%", background: `linear-gradient(180deg, #16a34a, #4ade80)`, borderRadius: "6px 6px 0 0", height: `${(val / maxVal) * 160}px`, opacity: i === activityData.length - 1 ? 1 : 0.7, transition: "height 0.3s", cursor: "pointer", position: "relative" }}
                        title={`${val}k users`} />
                    </div>
                  ))}
                </div>

                {/* X Axis */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem", padding: "0 0.5rem" }}>
                  {['01 Oct', '08 Oct', '15 Oct', '22 Oct', '30 Oct'].map(d => (
                    <span key={d} style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Disputes */}
            <div style={{ width: 280, display: "flex", flexDirection: "column", gap: "1rem", flexShrink: 0 }}>
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Recent Disputes</h3>
                  <span style={{ background: "#fef2f2", color: "#ef4444", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20 }}>4 NEW</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {disputes.map((d, i) => (
                    <div key={i} style={{ padding: "0.875rem", background: "#f8fafc", borderRadius: 12, border: "1px solid #f1f5f9", borderLeft: `3px solid ${d.color}`, cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                      onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: d.color, letterSpacing: 0.5 }}>{d.icon} {d.type}</span>
                        <span style={{ fontSize: 10, color: "#94a3b8" }}>{d.time}</span>
                      </div>
                      <p style={{ margin: "0 0 0.375rem", fontSize: 12, color: "#475569", lineHeight: 1.4 }}>{d.desc}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 18, height: 18, background: "#e2e8f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>👤</div>
                        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{d.reporter}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button style={{ width: "100%", marginTop: "1rem", padding: "10px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#16a34a"; e.currentTarget.style.color = "#16a34a"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#475569"; }}>
                  View All Disputes →
                </button>
              </div>
            </div>
          </div>

          
        </div>
      </div>
      {/* Simple Admin Footer */}
          <div style={{ background: "#022C22", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>© 2026 EduConnect. All rights reserved.</span>
          <span style={{ fontSize: 12, color: "#64748b", cursor: "pointer" }}>Help Center</span>
        </div>
    </div>
  );
}