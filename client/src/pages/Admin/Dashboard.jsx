import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getAllSessions } from '../../services/adminService';
import { AdminAvatarImg } from './AdminProfile';

const activityData = [30, 45, 35, 60, 55, 75, 65, 80, 70, 90, 85, 95, 88, 92, 98];

const sidebarItems = [
  { icon: "📊", label: "Dashboard", path: "/admin/dashboard" },
  { icon: "👥", label: "User Management", path: "/admin/users" },
  { icon: "✅", label: "Skill Verifications", path: "/admin/verifications" },
  { icon: "📈", label: "Analytics", path: "/admin/analytics" },
  { icon: "⚙️", label: "Settings", path: "/admin/settings" },
];

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [activeTab, setActiveTab] = useState('Monthly');
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    sessionsToday: 0,
    pendingVerifications: 0,
    skillCoinsCirculation: 0
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const navigate = useNavigate();
  const maxVal = Math.max(...activityData);
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const adminAvatar = (() => { const u = adminUser.avatar; if (!u) return null; if (u.startsWith('http')) return u; const b = import.meta.env.PROD ? 'https://educonnect-production-c0d9.up.railway.app' : 'http://localhost:5000'; return `${b}${u}`; })();
  const adminInitials = (adminUser.name || 'AD').slice(0,2).toUpperCase();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) navigate('/admin/login');
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    const fetchSessions = async () => {
      try {
        const data = await getAllSessions();
        setRecentSessions(data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching sessions:', err);
      }
    };
    fetchStats();
    fetchSessions();
  }, []);

  const stats = [
    { label: "Total Active Users", value: dashboardData.totalUsers, change: "+12%", icon: "👥", iconBg: "#ecfdf5", iconColor: "#10b981", positive: true },
    { label: "Pending Verifications", value: dashboardData.pendingVerifications, change: "High", icon: "⚠️", iconBg: "#fffbeb", iconColor: "#f59e0b", positive: false },
    { label: "Sessions Today", value: dashboardData.sessionsToday, change: "+5%", icon: "📅", iconBg: "#eff6ff", iconColor: "#3b82f6", positive: true },
    { label: "Skill Coins", value: dashboardData.skillCoinsCirculation, change: "+8%", icon: "💰", iconBg: "#f5f3ff", iconColor: "#8b5cf6", positive: true },
  ];

  const statusColor = (status) => {
    if (status === 'Completed') return "#10b981";
    if (status === 'Cancelled') return "#ef4444";
    if (status === 'Scheduled') return "#3b82f6";
    return "#f59e0b";
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <nav style={{ background: "#fff", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/src/Assets/EduConnect_Logo.png" alt="EduConnect" style={{ height: 36, objectFit: "contain" }} />
          <span style={{ fontWeight: 800, fontSize: 18, color: "#0a1628" }}>EduConnect</span>
          <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: "#10b981", background: "#ecfdf5", padding: "3px 10px", borderRadius: 20, border: "1px solid #a7f3d0" }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, background: "#10b981", borderRadius: "50%" }} />
          <span style={{ fontSize: 13, color: "#64748b" }}>System Online</span>
          {/* Admin Dropdown */}
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 10, transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              <AdminAvatarImg url={adminAvatar} initials={adminInitials} size={36} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#0a1628" }}>{adminUser.name || 'Admin'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {dropdownOpen && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 200, background: "#fff", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid #e2e8f0", overflow: "hidden", zIndex: 100 }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0a1628" }}>{adminUser.name || 'Admin'}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8" }}>{adminUser.role || 'Administrator'}</p>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/admin/profile'); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#0a1628", textAlign: "left", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <span style={{ fontSize: 15 }}>👤</span> Admin Profile
                </button>
                <div style={{ height: 1, background: "#f1f5f9", margin: "0 12px" }} />
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#ef4444", textAlign: "left", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <span style={{ fontSize: 15 }}>↪</span> Log Out
                </button>
              </div>
            )}
          </div>
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
              <AdminAvatarImg url={adminAvatar} initials={adminInitials} size={38} border="2px solid #a7f3d0" />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0a1628" }}>{adminUser.name || 'Super Admin'}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{adminUser.role || 'Administrator'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "2rem" }}>

            {/* Header */}
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ margin: "0 0 0.25rem", fontSize: 28, fontWeight: 900, color: "#0a1628" }}>Dashboard</h1>
              <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Welcome back! Here's what's happening on EduConnect today.</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "1.5rem" }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0", borderTop: `3px solid ${stat.iconColor}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div style={{ width: 44, height: 44, background: stat.iconBg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{stat.icon}</div>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: stat.positive ? "#ecfdf5" : "#fffbeb", color: stat.positive ? "#10b981" : "#d97706" }}>
                      {stat.positive ? "↑" : "!"} {stat.change}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 0.25rem", fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{stat.label}</p>
                  <p style={{ margin: 0, fontSize: 30, fontWeight: 900, color: "#0a1628" }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.25rem" }}>

              {/* Activity Chart */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <div>
                    <h3 style={{ margin: "0 0 0.25rem", fontSize: 16, fontWeight: 700, color: "#0a1628" }}>Platform Activity</h3>
                    <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>User engagement metrics over the last 30 days</p>
                  </div>
                  <div style={{ display: "flex", background: "#f8fafc", borderRadius: 10, padding: 4, border: "1px solid #e2e8f0" }}>
                    {['Daily', 'Monthly'].map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: activeTab === tab ? "#10b981" : "transparent", color: activeTab === tab ? "#fff" : "#64748b", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 180, padding: "0 0.5rem" }}>
                  {activityData.map((val, i) => (
                    <div key={i} style={{ flex: 1 }}>
                      <div style={{ width: "100%", background: i === activityData.length - 1 ? "#10b981" : `rgba(16, 185, 129, ${0.2 + (i / activityData.length) * 0.6})`, borderRadius: "6px 6px 0 0", height: `${(val / maxVal) * 160}px`, transition: "all 0.3s", cursor: "pointer" }}
                        onMouseEnter={e => e.target.style.background = "#10b981"}
                        onMouseLeave={e => e.target.style.background = i === activityData.length - 1 ? "#10b981" : `rgba(16, 185, 129, ${0.2 + (i / activityData.length) * 0.6})`} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem" }}>
                  {['01 Oct', '08 Oct', '15 Oct', '22 Oct', '30 Oct'].map(d => (
                    <span key={d} style={{ fontSize: 11, color: "#94a3b8" }}>{d}</span>
                  ))}
                </div>
              </div>

              {/* Recent Sessions from DB */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0a1628" }}>Recent Sessions</h3>
                  <span style={{ background: "#ecfdf5", color: "#10b981", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>{recentSessions.length} Latest</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {recentSessions.length === 0 ? (
                    <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "2rem 0" }}>No sessions yet</p>
                  ) : recentSessions.map((s, i) => (
                    <div key={i} style={{ padding: "0.875rem", background: "#f8fafc", borderRadius: 12, borderLeft: `3px solid ${statusColor(s.Status)}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: statusColor(s.Status) }}>{s.Status}</span>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>{s.Date || '—'}</span>
                      </div>
                      <p style={{ margin: "0 0 4px", fontSize: 12, color: "#475569" }}>Session #{s.Session_Id}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>💰 Cost: {s.Cost} SC</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/admin/sessions')}
                  style={{ width: "100%", marginTop: "1rem", padding: "10px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#10b981", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  View All Sessions →
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ background: "#022C22", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>© 2026 EduConnect. All rights reserved.</span>
            <span style={{ fontSize: 12, color: "#64748b", cursor: "pointer" }}>Help Center</span>
          </div>
        </div>
      </div>
    </div>
  );
}
