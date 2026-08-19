import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAvatarImg } from './AdminProfile';

const sidebarItems = [
  { icon: "📊", label: "Dashboard", path: "/admin/dashboard" },
  { icon: "👥", label: "User Management", path: "/admin/users" },
  { icon: "✅", label: "Skill Verifications", path: "/admin/verifications" },
  { icon: "📈", label: "Analytics", path: "/admin/analytics" },
  { icon: "⚙️", label: "Settings", path: "/admin/settings" },
];

const Toggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)}
    style={{ width: 48, height: 26, borderRadius: 13, background: value ? "#10b981" : "#e2e8f0", cursor: "pointer", position: "relative", transition: "all 0.25s", flexShrink: 0, boxShadow: value ? "0 2px 8px rgba(16,185,129,0.4)" : "none" }}>
    <div style={{ position: "absolute", top: 3, left: value ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.25s", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" }} />
  </div>
);

export default function Settings() {
  const [activePage, setActivePage] = useState('Settings');
  const navigate = useNavigate();
  const [coinRate, setCoinRate] = useState(1.5);
  const [sessionCost, setSessionCost] = useState(10);
  const [cooldown, setCooldown] = useState(7);
  const [academicEmail, setAcademicEmail] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [sysEmails, setSysEmails] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [criticalSms, setCriticalSms] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [saved, setSaved] = useState(false);

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const adminName = adminUser.name || 'Super Admin';
  const adminAvatar = (() => { const u = adminUser.avatar; if (!u) return null; if (u.startsWith('http')) return u; const b = import.meta.env.PROD ? 'https://educonnect-production-c0d9.up.railway.app' : 'http://localhost:5000'; return `${b}${u}`; })();
  const adminInitials = adminName.slice(0,2).toUpperCase();
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

  // Admin auth guard
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
  }, []);

  const themes = [
    { color: "#10b981", name: "Emerald" },
    { color: "#0f172a", name: "Dark" },
    { color: "#1d4ed8", name: "Ocean" },
    { color: "#d97706", name: "Amber" },
    { color: "#ef4444", name: "Ruby" },
    { color: "#7c3aed", name: "Purple" },
    { color: "#059669", name: "Forest" },
    { color: "#06b6d4", name: "Cyan" },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
          <button onClick={handleSave}
            style={{ padding: "8px 20px", borderRadius: 10, border: "none", background: saved ? "#059669" : "#10b981", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
          <button style={{ padding: "8px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Discard
          </button>
          {/* Admin Dropdown */}
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 10, transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              <AdminAvatarImg url={adminAvatar} initials={adminInitials} size={36} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#0a1628" }}>{adminName}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {dropdownOpen && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 200, background: "#fff", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid #e2e8f0", overflow: "hidden", zIndex: 100 }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0a1628" }}>{adminName}</p>
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
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0a1628" }}>{adminName}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Super Administrator</p>
              </div>
              <span onClick={handleLogout} title="Logout" style={{ cursor: "pointer", fontSize: 16, color: "#94a3b8" }}>↪</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "2rem" }}>

            {/* Header */}
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ margin: "0 0 0.25rem", fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>ADMIN / <span style={{ color: "#10b981" }}>SETTINGS</span></p>
              <h1 style={{ margin: "0 0 0.25rem", fontSize: 28, fontWeight: 900, color: "#0a1628" }}>Platform Configuration & Rules</h1>
              <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Manage core economic parameters, security protocols, and visual identity.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

              {/* System Rules */}
              <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
                <div style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #a7f3d0" }}>
                  <div style={{ width: 44, height: 44, background: "#10b981", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚙️</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#065f46" }}>System Rules</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "#059669" }}>Configure the platform's internal economy</p>
                  </div>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Skill Coin Earning Rate</label>
                    <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: 12, overflow: "hidden", background: "#f8fafc" }}>
                      <input type="number" value={coinRate} onChange={e => setCoinRate(e.target.value)}
                        style={{ flex: 1, padding: "12px 14px", border: "none", background: "transparent", fontSize: 18, fontWeight: 800, color: "#0a1628", outline: "none" }} />
                      <div style={{ padding: "0 16px", background: "#ecfdf5", height: "100%", display: "flex", alignItems: "center", borderLeft: "1px solid #e2e8f0" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981" }}>COINS/HR</span>
                      </div>
                    </div>
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "#94a3b8" }}>Multiplier for verified teaching hours</p>
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Base Session Cost</label>
                    <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: 12, overflow: "hidden", background: "#f8fafc" }}>
                      <input type="number" value={sessionCost} onChange={e => setSessionCost(e.target.value)}
                        style={{ flex: 1, padding: "12px 14px", border: "none", background: "transparent", fontSize: 18, fontWeight: 800, color: "#0a1628", outline: "none" }} />
                      <div style={{ padding: "0 16px", background: "#ecfdf5", height: "100%", display: "flex", alignItems: "center", borderLeft: "1px solid #e2e8f0" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981" }}>CREDITS</span>
                      </div>
                    </div>
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "#94a3b8" }}>Minimum cost to initiate a skill swap</p>
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5 }}>Verification Cooldown</label>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#10b981", background: "#ecfdf5", padding: "3px 12px", borderRadius: 20, border: "1px solid #a7f3d0" }}>{cooldown} Days</span>
                    </div>
                    <input type="range" min={1} max={30} value={cooldown} onChange={e => setCooldown(e.target.value)}
                      style={{ width: "100%", accentColor: "#10b981", cursor: "pointer" }} />
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "#94a3b8" }}>Days users must wait between badge verification attempts</p>
                  </div>

                  <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 12, padding: "1rem", display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
                    <p style={{ margin: 0, fontSize: 12, color: "#065f46", lineHeight: 1.6 }}>Economic changes take effect immediately for all new transactions. Existing sessions are grandfathered in under previous rates.</p>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
                <div style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #bfdbfe" }}>
                  <div style={{ width: 44, height: 44, background: "#3b82f6", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔐</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1e40af" }}>Security</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "#3b82f6" }}>Access control and privacy settings</p>
                  </div>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  {[
                    { label: "Academic Email Enforcement", desc: "Restrict registration to .ac.lk domains only", value: academicEmail, setter: setAcademicEmail, icon: "📧" },
                    { label: "Two-Factor Authentication", desc: "Required for all users with Mentor badges", value: twoFactor, setter: setTwoFactor, icon: "🔑" },
                    { label: "Public Profile Visibility", desc: "Allow guest users to view student profiles", value: publicProfile, setter: setPublicProfile, icon: "👁️" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", marginBottom: "0.75rem", background: item.value ? "#ecfdf5" : "#f8fafc", borderRadius: 12, border: `1px solid ${item.value ? "#a7f3d0" : "#e2e8f0"}`, transition: "all 0.2s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, background: item.value ? "#d1fae5" : "#f1f5f9", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{item.icon}</div>
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0a1628" }}>{item.label}</p>
                          <p style={{ margin: "0.2rem 0 0", fontSize: 11, color: "#94a3b8" }}>{item.desc}</p>
                        </div>
                      </div>
                      <Toggle value={item.value} onChange={item.setter} />
                    </div>
                  ))}

                  <div style={{ background: "linear-gradient(135deg, #1e3a5f, #1e40af)", borderRadius: 12, padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>🛡️ Security Score</span>
                      <span style={{ fontSize: 14, fontWeight: 900, color: "#10b981" }}>{[academicEmail, twoFactor, publicProfile].filter(Boolean).length * 33}%</span>
                    </div>
                    <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>
                      <div style={{ height: "100%", width: `${[academicEmail, twoFactor, publicProfile].filter(Boolean).length * 33}%`, background: "linear-gradient(90deg, #10b981, #34d399)", borderRadius: 4, transition: "width 0.3s" }} />
                    </div>
                    <p style={{ margin: "8px 0 0", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Enable all security features for maximum protection</p>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
                <div style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #fde68a" }}>
                  <div style={{ width: 44, height: 44, background: "#f59e0b", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔔</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#92400e" }}>Notifications</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "#d97706" }}>Global alert preferences</p>
                  </div>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  {[
                    { label: "System-wide Emails", desc: "Send platform updates to all users", value: sysEmails, setter: setSysEmails, icon: "📨" },
                    { label: "App Push Alerts", desc: "Real-time notifications in the app", value: pushAlerts, setter: setPushAlerts, icon: "📱" },
                    { label: "Critical Error SMS", desc: "SMS alerts for system-critical events", value: criticalSms, setter: setCriticalSms, icon: "🚨" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", marginBottom: "0.75rem", background: item.value ? "#ecfdf5" : "#f8fafc", borderRadius: 12, border: `1px solid ${item.value ? "#a7f3d0" : "#e2e8f0"}`, transition: "all 0.2s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, background: item.value ? "#d1fae5" : "#f1f5f9", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{item.icon}</div>
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0a1628" }}>{item.label}</p>
                          <p style={{ margin: "0.2rem 0 0", fontSize: 11, color: "#94a3b8" }}>{item.desc}</p>
                        </div>
                      </div>
                      <Toggle value={item.value} onChange={item.setter} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Branding */}
              <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
                <div style={{ background: "linear-gradient(135deg, #f5f3ff, #ede9fe)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #ddd6fe" }}>
                  <div style={{ width: 44, height: 44, background: "#8b5cf6", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎨</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#5b21b6" }}>Branding</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "#7c3aed" }}>Customize themes & visual identity</p>
                  </div>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Platform Logo</label>
                    <div style={{ border: "2px dashed #e2e8f0", borderRadius: 12, padding: "1.5rem", textAlign: "center", background: "#f8fafc", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#10b981"; e.currentTarget.style.background = "#ecfdf5"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>☁️</div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#475569" }}>Drop your logo here</p>
                      <p style={{ margin: "4px 0 0", fontSize: 11, color: "#94a3b8" }}>SVG or PNG • Max 2MB</p>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Primary System Theme</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
                      {themes.map((t, i) => (
                        <div key={i} onClick={() => setSelectedTheme(i)}
                          style={{ height: 40, borderRadius: 10, background: t.color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", border: selectedTheme === i ? "3px solid #0f172a" : "3px solid transparent", transition: "all 0.15s", boxShadow: selectedTheme === i ? `0 0 0 2px #fff, 0 0 0 4px ${t.color}` : "0 2px 6px rgba(0,0,0,0.15)" }}>
                          {selectedTheme === i && <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>✓</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "#f8fafc", borderRadius: 10, padding: "0.75rem", display: "flex", alignItems: "center", gap: 10, border: "1px solid #e2e8f0" }}>
                      <div style={{ width: 18, height: 18, borderRadius: 6, background: themes[selectedTheme].color, flexShrink: 0 }} />
                      <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                        <strong style={{ color: "#0a1628" }}>{themes[selectedTheme].name}</strong> theme selected. Changes apply system-wide.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset */}
              <div style={{ gridColumn: "1 / -1", background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1.5px solid #fecaca" }}>
                <div style={{ background: "linear-gradient(135deg, #fef2f2, #fee2e2)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #fecaca" }}>
                  <span style={{ fontSize: 18 }}>⚠️</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#991b1b" }}>Danger Zone</span>
                </div>
                <div style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ margin: "0 0 0.25rem", fontSize: 14, fontWeight: 700, color: "#ef4444" }}>Reset Platform Parameters</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Reset all system rules and branding to factory defaults. This action cannot be undone.</p>
                  </div>
                  <button style={{ padding: "10px 20px", borderRadius: 10, border: "1.5px solid #fecaca", background: "#fef2f2", color: "#ef4444", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
                    ⚠️ Perform Reset
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