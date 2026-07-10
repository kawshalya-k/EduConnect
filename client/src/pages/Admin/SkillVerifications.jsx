import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUserSkills } from '../../services/adminService';

const sidebarItems = [
  { icon: "⊞", label: "Dashboard", path: "/admin/dashboard" },
  { icon: "👥", label: "User Management", path: "/admin/users" },
  { icon: "✅", label: "Skill Verifications", path: "/admin/verifications" },
  { icon: "📊", label: "Analytics", path: "/admin/analytics" },
  { icon: "⚙️", label: "Settings", path: "/admin/settings" },
];

export default function SkillVerifications() {
  const [activePage, setActivePage] = useState('Skill Verifications');
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getAllUserSkills();
        setUserSkills(data);
      } catch (err) {
        console.error('Error fetching user skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Compute live stats from DB data
  const totalSubmissions = userSkills.length;
  const verifiedCount = userSkills.filter(s => s.Verification_Status === 'Verified').length;
  const pendingCount = userSkills.filter(s => s.Verification_Status === 'Pending').length;
  const otherCount = userSkills.filter(s => s.Verification_Status !== 'Verified' && s.Verification_Status !== 'Pending').length;

  // Filter skills based on search query and status filter
  const filteredSkills = userSkills.filter(item => {
    const userName = `${item.First_Name || ''} ${item.Last_Name || ''}`.toLowerCase();
    const skillName = (item.Skill_Name || '').toLowerCase();
    const email = (item.Email || '').toLowerCase();
    const category = (item.Category || '').toLowerCase();
    const matchesSearch = 
      userName.includes(searchQuery.toLowerCase()) || 
      skillName.includes(searchQuery.toLowerCase()) || 
      email.includes(searchQuery.toLowerCase()) ||
      category.includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.Verification_Status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified':
        return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
      case 'Pending':
        return { bg: '#fef3c7', text: '#d97706', border: '#fde68a' };
      case 'Testing':
        return { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' };
      case 'Rejected':
        return { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' };
      default:
        return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <h1 style={{ margin: "0 0 0.25rem", fontSize: 24, fontWeight: 900, color: "#0f172a" }}>Manage User Skill Levels</h1>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Track automatic mentor skill verifications, attempts, and quiz history.</p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
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
                { label: "Total Skill Attempts", value: totalSubmissions, sub: "All time submissions", icon: "📊", bg: "#eff6ff", color: "#3b82f6" },
                { label: "Verified Skills", value: verifiedCount, sub: "Successfully verified", icon: "✅", bg: "#f0fdf4", color: "#10b981" },
                { label: "Pending Verification", value: pendingCount, sub: "Manual review queue", icon: "⏳", bg: "#fffbeb", color: "#d97706" },
                { label: "Testing / Failed", value: otherCount, sub: "In-progress or cooldown", icon: "⏱️", bg: "#fef2f2", color: "#ef4444" },
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

            {/* Main Table Section */}
            <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
              
              {/* Table Header Controls */}
              <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "1.25rem 1.5rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📚</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>User Skill Registry</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Showing {filteredSkills.length} of {totalSubmissions} records</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search mentor or skill..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: "13px",
                      outline: "none",
                      width: "220px",
                    }}
                  />

                  {/* Status Dropdown */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "#1e293b",
                      color: "#fff",
                      fontSize: "13px",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Testing">Testing</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Table Data */}
              {loading ? (
                <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Loading user skill registry...</p>
                </div>
              ) : filteredSkills.length === 0 ? (
                <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>No user skill records found matching search filters.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                        <th style={{ padding: "12px 24px", fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1 }}>USER</th>
                        <th style={{ padding: "12px 24px", fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1 }}>SKILL</th>
                        <th style={{ padding: "12px 24px", fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1 }}>STATUS</th>
                        <th style={{ padding: "12px 24px", fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1 }}>LEVEL & SCORE</th>
                        <th style={{ padding: "12px 24px", fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1 }}>LAST ATTEMPT</th>
                        <th style={{ padding: "12px 24px", fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1 }}>PROOF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSkills.map((item, idx) => {
                        const statusColor = getStatusColor(item.Verification_Status);
                        return (
                          <tr
                            key={idx}
                            style={{
                              borderBottom: idx < filteredSkills.length - 1 ? "1px solid #f1f5f9" : "none",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                          >
                            {/* User details */}
                            <td style={{ padding: "16px 24px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <img
                                  src={item.Avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.First_Name}&backgroundColor=E2E8F0`}
                                  alt="avatar"
                                  style={{ width: 34, height: 34, borderRadius: "50%", border: "2px solid #e2e8f0" }}
                                />
                                <div>
                                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                                    {item.First_Name} {item.Last_Name}
                                  </p>
                                  <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{item.Email}</p>
                                </div>
                              </div>
                            </td>

                            {/* Skill details */}
                            <td style={{ padding: "16px 24px" }}>
                              <div>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{item.Skill_Name}</p>
                                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{item.Category}</p>
                              </div>
                            </td>

                            {/* Status */}
                            <td style={{ padding: "16px 24px" }}>
                              <span style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: "20px",
                                fontSize: "11px",
                                fontWeight: 700,
                                background: statusColor.bg,
                                color: statusColor.text,
                                border: `1px solid ${statusColor.border}`
                              }}>
                                {item.Verification_Status}
                              </span>
                            </td>

                            {/* Level and score */}
                            <td style={{ padding: "16px 24px" }}>
                              <div>
                                {item.Mentor_Level ? (
                                  <span style={{
                                    display: "inline-block",
                                    padding: "2px 8px",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    background: "#f0fdf4",
                                    color: "#16a34a",
                                    marginBottom: "4px"
                                  }}>
                                    {item.Mentor_Level} Level
                                  </span>
                                ) : (
                                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Unranked</span>
                                )}
                                <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>
                                  Quiz Score: <strong>{item.Score || 0}/15</strong>
                                </p>
                              </div>
                            </td>

                            {/* Last Attempt */}
                            <td style={{ padding: "16px 24px", fontSize: 12, color: "#64748b" }}>
                              {formatDate(item.Last_Attempt)}
                            </td>

                            {/* Proof Certificate */}
                            <td style={{ padding: "16px 24px" }}>
                              {item.Certificates ? (
                                <a
                                  href={`http://localhost:5000/uploads/${item.Certificates}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    fontSize: "12px",
                                    color: "#10b981",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px"
                                  }}
                                >
                                  📄 View Proof
                                </a>
                              ) : (
                                <span style={{ fontSize: "12px", color: "#94a3b8" }}>Quiz Verified</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
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