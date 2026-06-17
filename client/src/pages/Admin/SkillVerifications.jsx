import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSkills } from '../../services/adminService';

const sidebarItems = [
  { icon: "⊞", label: "Dashboard", path: "/admin/dashboard" },
  { icon: "👥", label: "User Management", path: "/admin/users" },
  { icon: "✅", label: "Skill Verifications", path: "/admin/verifications" },
  { icon: "📊", label: "Analytics", path: "/admin/analytics" },
  { icon: "⚙️", label: "Settings", path: "/admin/settings" },
];

const skills = [
  { name: "React JS", category: "Advanced Frontend Development", icon: "⚛️", color: "#61dafb", link: "hackerrank.com/edu-react-adv", threshold: 75, quizzes: 12, active: true },
  { name: "Python", category: "Core Data Science & Scripting", icon: "🐍", color: "#3776ab", link: "hackerrank.com/edu-py-master", threshold: 70, quizzes: 24, active: true },
  { name: "AWS Cloud", category: "Architecture & Deployment", icon: "☁️", color: "#ff9900", link: "hackerrank.com/edu-cloud-ops", threshold: 80, quizzes: 8, active: true },
  { name: "UX/UI Design", category: "Visual Design & Research", icon: "🎨", color: "#a259ff", link: "hackerrank.com/edu-ux-standard", threshold: 70, quizzes: 15, active: true },
];

const pendingRequests = [
  { name: "Sarah Jenkins", skill: "React JS", level: "Gold", submitted: "2h ago", avatar: "https://i.pravatar.cc/40?img=47", status: "pending" },
  { name: "Marcus Chen", skill: "AWS Cloud", level: "Silver", submitted: "5h ago", avatar: "https://i.pravatar.cc/40?img=13", status: "pending" },
  { name: "Jordan Lee", skill: "Python", level: "Bronze", submitted: "1d ago", avatar: "https://i.pravatar.cc/40?img=25", status: "pending" },
];

export default function SkillVerifications() {
  const [activePage, setActivePage] = useState('Skill Verifications');
  const [skills, setSkills] = useState([]);
  const [requests, setRequests] = useState(pendingRequests);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getAllSkills();
        setSkills(data);
      } catch (err) {
        console.error('Error fetching skills:', err);
      }
    };
    fetchSkills();
  }, []);

  const handleApprove = (i) => {
    const updated = [...requests];
    updated[i].status = 'approved';
    setRequests(updated);
  };

  const handleReject = (i) => {
    const updated = [...requests];
    updated[i].status = 'rejected';
    setRequests(updated);
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f1f5f9", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Top Bar */}
      <div style={{ background: "#0f172a", padding: "0.6rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>Admin - Skill Verification</span>
        <span style={{ color: "#475569", fontSize: 12 }}>EduConnect Admin Panel v2.0</span>
      </div>

      <div style={{ display: "flex", flex: 1 }}>

        {/* Sidebar */}
        <div style={{ width: 220, background: "#fff", borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "1.25rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#10b981", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>E</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>EduConnect</span>
          </div>
          <div style={{ padding: "1rem 0.75rem", flex: 1 }}>
            {sidebarItems.map(item => (
              <div key={item.label} onClick={() => { setActivePage(item.label); navigate(item.path); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 4, cursor: "pointer", background: activePage === item.label ? "#f0fdf4" : "transparent", color: activePage === item.label ? "#10b981" : "#64748b", fontWeight: activePage === item.label ? 700 : 500, fontSize: 14, borderLeft: activePage === item.label ? "3px solid #10b981" : "3px solid transparent" }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
            <img src="https://i.pravatar.cc/40?img=33" alt="admin" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #bbf7d0" }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Admin Profile</p>
              <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Super User</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>

          {/* Header */}
          <div style={{ background: "#fff", padding: "1.5rem 2rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ margin: "0 0 0.25rem", fontSize: 24, fontWeight: 900, color: "#0f172a" }}>Manage Skill Assessments</h1>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Integrate HackerRank workflows and university-approved benchmarks.</p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button style={{ padding: "10px 18px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                🔄 Sync HackerRank Data
              </button>
              <button style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: "#10b981", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 12px rgba(22,163,74,0.3)", display: "flex", alignItems: "center", gap: 8 }}>
                ➕ Add New Skill Quiz
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src="https://i.pravatar.cc/40?img=33" alt="admin" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #e2e8f0" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Alex Rivera</span>
              </div>
            </div>
          </div>

          <div style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
              {[
                { label: "Total Active Skills", value: "42", sub: "+3 this month", icon: "🎯", bg: "#f0fdf4", color: "#10b981" },
                { label: "Avg. Passing Rate", value: "68%", sub: "-2% vs last week", icon: "📊", bg: "#fffbeb", color: "#d97706" },
                { label: "Verification Requests", value: "1,204", sub: "12k Pending", icon: "📋", bg: "#eff6ff", color: "#3b82f6" },
                { label: "Cooldown Policy", value: "24 hrs", sub: "Failed attempts limit", icon: "⏱️", bg: "#f5f3ff", color: "#7c3aed" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div style={{ width: 40, height: 40, background: s.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{s.icon}</div>
                  </div>
                  <p style={{ margin: "0 0 0.25rem", fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</p>
                  <p style={{ margin: "0 0 0.25rem", fontSize: 26, fontWeight: 900, color: "#0f172a" }}>{s.value}</p>
                  <p style={{ margin: 0, fontSize: 11, color: s.color, fontWeight: 600 }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Skill Registry + Pending */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.25rem" }}>

              {/* Skill Registry Table */}
              <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                <div style={{ background: "linear-gradient(135deg, #14532d 0%, #10b981 100%)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📚</div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>Skill Assessment Registry</h3>
                      <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Showing {skills.length} of 42 Skills</p>
                    </div>
                  </div>
                </div>

                {/* Table Header */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr", padding: "0.875rem 1.5rem", background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                  {["SKILL & PLATFORM", "INTEGRATION LINK", "THRESHOLD", "QUIZZES", "ACTIONS"].map(h => (
                    <span key={h} style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1 }}>{h}</span>
                  ))}
                </div>

                {skills.map((skill, i) => (
  <div key={i}
    style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr", padding: "1rem 1.5rem", borderBottom: i < skills.length - 1 ? "1px solid #f1f5f9" : "none", alignItems: "center", transition: "background 0.15s", cursor: "pointer" }}
    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
    onMouseLeave={e => e.currentTarget.style.background = "#fff"}>

    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 38, height: 38, background: "#f0fdf4", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎯</div>
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{skill.Skill_Name}</p>
        <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{skill.Category}</p>
      </div>
    </div>

    <span style={{ fontSize: 12, color: "#10b981", fontWeight: 500 }}>🔗 educonnect.com/skills</span>

    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 3 }}>
        <div style={{ height: "100%", width: "75%", background: "linear-gradient(90deg, #10b981, #4ade80)", borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981", flexShrink: 0 }}>75%</span>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>10</span>
      <span style={{ fontSize: 11, color: "#94a3b8" }}>Active</span>
    </div>

    <div style={{ display: "flex", gap: 6 }}>
      <button style={{ padding: "5px 10px", borderRadius: 8, border: "1px solid #bbf7d0", background: "#f0fdf4", fontSize: 11, cursor: "pointer", color: "#10b981", fontWeight: 700 }}>Update</button>
      <button style={{ padding: "5px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 11, cursor: "pointer", color: "#64748b", fontWeight: 600 }}>Link</button>
    </div>
  </div>
))}

                <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>Showing 4 of 42 Skills</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {['←', '1', '2', '3', '→'].map((p, i) => (
                      <button key={i} style={{ width: 30, height: 30, borderRadius: 8, border: p === '1' ? "none" : "1px solid #e2e8f0", background: p === '1' ? "#10b981" : "#fff", color: p === '1' ? "#fff" : "#475569", fontSize: 12, fontWeight: p === '1' ? 700 : 400, cursor: "pointer" }}>{p}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                {/* Pending Requests */}
                <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                  <div style={{ background: "linear-gradient(135deg, #166534 0%, #22c55e 100%)", padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>⏳</span>
                      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff" }}>Pending Requests</h3>
                    </div>
                    <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20 }}>
                      {requests.filter(r => r.status === 'pending').length} NEW
                    </span>
                  </div>

                  <div style={{ padding: "1rem" }}>
                    {requests.map((req, i) => (
                      <div key={i} style={{ padding: "0.875rem", marginBottom: "0.75rem", background: req.status === 'approved' ? "#f0fdf4" : req.status === 'rejected' ? "#fef2f2" : "#f8fafc", borderRadius: 12, border: `1px solid ${req.status === 'approved' ? "#bbf7d0" : req.status === 'rejected' ? "#fecaca" : "#f1f5f9"}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: req.status === 'pending' ? "0.75rem" : 0 }}>
                          <img src={req.avatar} alt={req.name} style={{ width: 34, height: 34, borderRadius: "50%", border: "2px solid #e2e8f0" }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{req.name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{req.skill} • {req.level} • {req.submitted}</p>
                          </div>
                          {req.status !== 'pending' && (
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: req.status === 'approved' ? "#dcfce7" : "#fef2f2", color: req.status === 'approved' ? "#10b981" : "#ef4444" }}>
                              {req.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                            </span>
                          )}
                        </div>
                        {req.status === 'pending' && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => handleApprove(i)}
                              style={{ flex: 1, padding: "7px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                              ✓ Approve
                            </button>
                            <button onClick={() => handleReject(i)}
                              style={{ flex: 1, padding: "7px", borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", color: "#ef4444", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                              ✗ Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Integrity */}
                <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                  <div style={{ background: "linear-gradient(135deg, #14532d, #166534)", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>🛡️</span>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff" }}>Verification Integrity</h3>
                  </div>
                  <div style={{ padding: "1.25rem" }}>
                    <p style={{ margin: "0 0 1rem", fontSize: 12, color: "#475569", lineHeight: 1.6 }}>All HackerRank integrations must point to tests containing at least 3 algorithmic questions and 1 practical project scenario to qualify for university-certified skill badges.</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {["Auto-Sync: Enabled", "Strict Proctoring: ON"].map((tag, i) => (
                        <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "#f0fdf4", color: "#10b981", border: "1px solid #bbf7d0" }}>● {tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Global Analytics CTA */}
                <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #166534 100%)", borderRadius: 20, padding: "1.5rem", overflow: "hidden", position: "relative" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
                  <p style={{ margin: "0 0 0.25rem", fontSize: 14, fontWeight: 800, color: "#fff" }}>🌍 Global Skill Analytics</p>
                  <p style={{ margin: "0 0 1rem", fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>View comprehensive student performance across all assessments.</p>
                  <button style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: "#10b981", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 12px rgba(22,163,74,0.4)" }}>
                    Generate Global Report →
                  </button>
                </div>

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