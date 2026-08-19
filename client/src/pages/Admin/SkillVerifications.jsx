import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSkills } from '../../services/adminService';
import { AdminAvatarImg } from './AdminProfile';
import logo from '../../Assets/educonnect-logo.svg';

const sidebarItems = [
  { icon: "📊", label: "Dashboard", path: "/admin/dashboard" },
  { icon: "👥", label: "User Management", path: "/admin/users" },
  { icon: "✅", label: "Skill Verifications", path: "/admin/verifications" },
  { icon: "📈", label: "Analytics", path: "/admin/analytics" },
  { icon: "⚙️", label: "Settings", path: "/admin/settings" },
];

export default function SkillVerifications() {
  const [activePage, setActivePage] = useState('Skill Verifications');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
    const fetchSkills = async () => {
      try {
        const data = await getAllSkills();
        setSkills(data);
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <nav style={{ background: "#fff", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logo} alt="EduConnect Logo" style={{ height: 36, objectFit: "contain" }} />
          <span style={{ fontWeight: 800, fontSize: 18, color: "#0a1628" }}>EduConnect</span>
          <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: "#10b981", background: "#ecfdf5", padding: "3px 10px", borderRadius: 20, border: "1px solid #a7f3d0" }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h1 style={{ margin: "0 0 0.25rem", fontSize: 28, fontWeight: 900, color: "#0a1628" }}>Skill Verifications</h1>
                <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Manage and verify platform skill assessments</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{ padding: "10px 18px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  🔄 Sync HackerRank
                </button>
                <button style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: "#10b981", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  ➕ Add New Skill
                </button>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { label: "Total Active Skills", value: skills.length, sub: "In registry", icon: "🎯", bg: "#ecfdf5", color: "#10b981" },
                { label: "Avg. Passing Rate", value: "75%", sub: "Platform average", icon: "📊", bg: "#fffbeb", color: "#d97706" },
                { label: "Verification Requests", value: "0", sub: "Pending review", icon: "📋", bg: "#eff6ff", color: "#3b82f6" },
                { label: "Cooldown Policy", value: "24 hrs", sub: "Between attempts", icon: "⏱️", bg: "#f5f3ff", color: "#7c3aed" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
                  <div style={{ width: 40, height: 40, background: s.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: "0.75rem" }}>{s.icon}</div>
                  <p style={{ margin: "0 0 0.25rem", fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</p>
                  <p style={{ margin: "0 0 0.25rem", fontSize: 26, fontWeight: 900, color: "#0a1628" }}>{s.value}</p>
                  <p style={{ margin: 0, fontSize: 11, color: s.color, fontWeight: 600 }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Skills Table */}
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
              <div style={{ background: "linear-gradient(135deg, #14532d 0%, #10b981 100%)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📚</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>Skill Assessment Registry</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Showing {skills.length} skills from database</p>
                  </div>
                </div>
              </div>

              {/* Table Header */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr", padding: "0.875rem 1.5rem", background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                {["SKILL NAME", "CATEGORY", "DESCRIPTION", "QUIZZES", "ACTIONS"].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1 }}>{h}</span>
                ))}
              </div>

              {loading ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "#10b981" }}>Loading skills...</div>
              ) : skills.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>No skills found in database</div>
              ) : skills.map((skill, i) => (
                <div key={i}
                  style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr", padding: "1rem 1.5rem", borderBottom: i < skills.length - 1 ? "1px solid #f1f5f9" : "none", alignItems: "center", transition: "background 0.15s", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: "#ecfdf5", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🎯</div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0a1628" }}>{skill.Skill_Name}</p>
                  </div>

                  <span style={{ fontSize: 12, color: "#475569" }}>{skill.Category || '—'}</span>

                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{skill.Description ? skill.Description.substring(0, 30) + '...' : '—'}</span>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#0a1628" }}>10</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Active</span>
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ padding: "5px 10px", borderRadius: 8, border: "1px solid #bbf7d0", background: "#f0fdf4", fontSize: 11, cursor: "pointer", color: "#10b981", fontWeight: 700 }}>Edit</button>
                    <button style={{ padding: "5px 10px", borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", fontSize: 11, cursor: "pointer", color: "#ef4444", fontWeight: 600 }}>Delete</button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>Showing {skills.length} skills</span>
              </div>
            </div>

            {/* Verification Integrity */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", marginTop: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
                <span style={{ fontSize: 20 }}>🛡️</span>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0a1628" }}>Verification Integrity</h3>
              </div>
              <p style={{ margin: "0 0 1rem", fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                All skill assessments must contain at least 3 algorithmic questions and 1 practical project scenario to qualify for university-certified skill badges.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {["Auto-Sync: Enabled", "Strict Proctoring: ON"].map((tag, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "#ecfdf5", color: "#10b981", border: "1px solid #a7f3d0" }}>● {tag}</span>
                ))}
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