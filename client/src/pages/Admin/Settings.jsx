import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const sidebarItems = [
  { icon: "⊞", label: "Dashboard", path: "/admin/dashboard" },
  { icon: "👥", label: "User Management", path: "/admin/users" },
  { icon: "✅", label: "Skill Verifications", path: "/admin/verifications" },
  { icon: "📊", label: "Analytics", path: "/admin/analytics" },
  { icon: "⚙️", label: "Settings", path: "/admin/settings" },
];

const Toggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)}
    style={{ width: 48, height: 26, borderRadius: 13, background: value ? "linear-gradient(135deg, #10b981, #22c55e)" : "#e2e8f0", cursor: "pointer", position: "relative", transition: "all 0.25s", flexShrink: 0, boxShadow: value ? "0 2px 8px rgba(22,163,74,0.4)" : "none" }}>
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

  const themes = [
    { color: "#10b981", name: "Forest" },
    { color: "#0f172a", name: "Dark" },
    { color: "#1d4ed8", name: "Ocean" },
    { color: "#d97706", name: "Amber" },
    { color: "#ef4444", name: "Ruby" },
    { color: "#7c3aed", name: "Purple" },
    { color: "#059669", name: "Emerald" },
    { color: "#06b6d4", name: "Cyan" },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f1f5f9", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Top Bar */}
      <div style={{ background: "#0f172a", padding: "0.6rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>Admin - Settings</span>
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
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Alex Thompson</p>
              <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Super Administrator</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>

          {/* Header */}
          <div style={{ background: "#fff", padding: "1.5rem 2rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.5rem" }}>
                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>ADMIN</span>
                <span style={{ color: "#cbd5e1" }}>/</span>
                <span style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>SETTINGS</span>
              </div>
              <h1 style={{ margin: "0 0 0.25rem", fontSize: 24, fontWeight: 900, color: "#0f172a" }}>Platform Configuration & Rules</h1>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Manage core economic parameters, security protocols, and visual identity.</p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button style={{ padding: "10px 20px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Discard Changes
              </button>
              <button onClick={handleSave}
                style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: saved ? "#166534" : "#10b981", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 14px rgba(22,163,74,0.35)", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 }}>
                {saved ? "✓ Saved!" : "Save Changes"}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src="https://i.pravatar.cc/40?img=33" alt="admin" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #e2e8f0" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Alex Rivera</span>
              </div>
            </div>
          </div>

          <div style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Row 1 — System Rules + Security */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

              {/* System Rules */}
              <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                {/* Card Header */}
                <div style={{ background: "linear-gradient(135deg, #14532d 0%, #166534 100%)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚙️</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>System Rules</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Configure the platform's internal economy</p>
                  </div>
                </div>

                <div style={{ padding: "1.5rem" }}>
                  {/* Coin Rate */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Skill Coin Earning Rate</label>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
                        <input type="number" value={coinRate} onChange={e => setCoinRate(e.target.value)}
                          style={{ flex: 1, padding: "12px 14px", border: "none", background: "transparent", fontSize: 20, fontWeight: 800, color: "#0f172a", outline: "none", width: "80px" }} />
                        <div style={{ padding: "0 14px", background: "#f0fdf4", height: "100%", display: "flex", alignItems: "center", borderLeft: "1px solid #e2e8f0" }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981", whiteSpace: "nowrap" }}>COINS/HR</span>
                        </div>
                      </div>
                    </div>
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "#94a3b8" }}>Multiplier for verified teaching hours</p>
                  </div>

                  {/* Session Cost */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Base Session Cost</label>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
                      <input type="number" value={sessionCost} onChange={e => setSessionCost(e.target.value)}
                        style={{ flex: 1, padding: "12px 14px", border: "none", background: "transparent", fontSize: 20, fontWeight: 800, color: "#0f172a", outline: "none", width: "80px" }} />
                      <div style={{ padding: "0 14px", background: "#f0fdf4", height: "100%", display: "flex", alignItems: "center", borderLeft: "1px solid #e2e8f0" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981" }}>CREDITS</span>
                      </div>
                    </div>
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "#94a3b8" }}>Minimum cost to initiate a skill swap</p>
                  </div>

                  {/* Cooldown Slider */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5 }}>Verification Cooldown</label>
                      <div style={{ background: "linear-gradient(135deg, #10b981, #22c55e)", borderRadius: 20, padding: "4px 12px" }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{cooldown} Days</span>
                      </div>
                    </div>
                    <div style={{ position: "relative", height: 6, background: "#e2e8f0", borderRadius: 3, marginBottom: 8 }}>
                      <div style={{ position: "absolute", left: 0, width: `${(cooldown / 30) * 100}%`, height: "100%", background: "linear-gradient(90deg, #10b981, #22c55e)", borderRadius: 3 }} />
                    </div>
                    <input type="range" min={1} max={30} value={cooldown} onChange={e => setCooldown(e.target.value)}
                      style={{ width: "100%", accentColor: "#10b981", cursor: "pointer", margin: 0 }} />
                    <p style={{ margin: "6px 0 0", fontSize: 11, color: "#94a3b8" }}>Days users must wait between badge verification attempts</p>
                  </div>

                  {/* Info */}
                  <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #bbf7d0", borderRadius: 12, padding: "1rem", display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
                    <p style={{ margin: 0, fontSize: 12, color: "#166534", lineHeight: 1.6 }}>Economic changes take effect immediately for all new transactions. Existing sessions are grandfathered in under previous rates.</p>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                <div style={{ background: "linear-gradient(135deg, #166534 0%, #15803d 100%)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔐</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>Security</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Access control and privacy settings</p>
                  </div>
                </div>

                <div style={{ padding: "1.5rem" }}>
                  {[
                    { label: "Academic Email Enforcement", desc: "Restrict registration to .ac.lk domains only", value: academicEmail, setter: setAcademicEmail, icon: "📧" },
                    { label: "Two-Factor Authentication", desc: "Required for all users with Mentor badges", value: twoFactor, setter: setTwoFactor, icon: "🔑" },
                    { label: "Public Profile Visibility", desc: "Allow guest users to view student profiles", value: publicProfile, setter: setPublicProfile, icon: "👁️" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", marginBottom: "0.75rem", background: item.value ? "#f0fdf4" : "#f8fafc", borderRadius: 14, border: `1.5px solid ${item.value ? "#bbf7d0" : "#f1f5f9"}`, transition: "all 0.2s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 38, height: 38, background: item.value ? "#dcfce7" : "#f1f5f9", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{item.icon}</div>
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{item.label}</p>
                          <p style={{ margin: "0.2rem 0 0", fontSize: 11, color: "#94a3b8" }}>{item.desc}</p>
                        </div>
                      </div>
                      <Toggle value={item.value} onChange={item.setter} />
                    </div>
                  ))}

                  {/* Security Score */}
                  <div style={{ background: "linear-gradient(90deg, #0c0d0d, #88aba9)", borderRadius: 14, padding: "1rem 1.25rem", marginTop: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>Security Score</span>
                      <span style={{ fontSize: 14, fontWeight: 900, color: "#a5b4fc" }}>{[academicEmail, twoFactor, publicProfile].filter(Boolean).length * 33}%</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${[academicEmail, twoFactor, publicProfile].filter(Boolean).length * 33}%`, background: "linear-gradient(90deg, #6366f1, #a5b4fc)", borderRadius: 3, transition: "width 0.3s" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 — Notifications + Branding */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

              {/* Notifications */}
              <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                <div style={{ background: "linear-gradient(135deg, #15803d 0%, #10b981 100%)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔔</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>Notifications</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Global alert preferences</p>
                  </div>
                </div>

                <div style={{ padding: "1.5rem" }}>
                  {[
                    { label: "System-wide Emails", desc: "Send platform updates to all users", value: sysEmails, setter: setSysEmails, icon: "📨" },
                    { label: "App Push Alerts", desc: "Real-time notifications in the app", value: pushAlerts, setter: setPushAlerts, icon: "📱" },
                    { label: "Critical Error SMS", desc: "SMS alerts for system-critical events", value: criticalSms, setter: setCriticalSms, icon: "🚨" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", marginBottom: "0.75rem", background: item.value ? "#f0f9ff" : "#f8fafc", borderRadius: 14, border: `1.5px solid ${item.value ? "#bae6fd" : "#f1f5f9"}`, transition: "all 0.2s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 38, height: 38, background: item.value ? "#e0f2fe" : "#f1f5f9", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{item.icon}</div>
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{item.label}</p>
                          <p style={{ margin: "0.2rem 0 0", fontSize: 11, color: "#94a3b8" }}>{item.desc}</p>
                        </div>
                      </div>
                      <Toggle value={item.value} onChange={item.setter} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Branding */}
              <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                <div style={{ background: "linear-gradient(135deg, #10b981 0%, #22c55e 100%)", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎨</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>Branding</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Customize themes & visual identity</p>
                  </div>
                </div>

                <div style={{ padding: "1.5rem" }}>
                  {/* Logo Upload */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Platform Logo</label>
                    <div style={{ border: "2px dashed #e2e8f0", borderRadius: 14, padding: "1.5rem", textAlign: "center", background: "#f8fafc", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#10b981"; e.currentTarget.style.background = "#f0fdf4"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>☁️</div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#475569" }}>Drop your logo here</p>
                      <p style={{ margin: "4px 0 0", fontSize: 11, color: "#94a3b8" }}>SVG or PNG • Max 2MB • 256×256px recommended</p>
                    </div>
                  </div>

                  {/* Theme */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Primary System Theme</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
                      {themes.map((t, i) => (
                        <div key={i} onClick={() => setSelectedTheme(i)}
                          style={{ height: 44, borderRadius: 12, background: t.color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", border: selectedTheme === i ? "3px solid #0f172a" : "3px solid transparent", transition: "all 0.15s", boxShadow: selectedTheme === i ? `0 0 0 3px ${t.color}40` : "0 2px 6px rgba(0,0,0,0.15)" }}>
                          {selectedTheme === i && <span style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>✓</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "#f8fafc", borderRadius: 10, padding: "0.75rem", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: themes[selectedTheme].color, flexShrink: 0 }} />
                      <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                        <strong style={{ color: "#0f172a" }}>{themes[selectedTheme].name}</strong> theme selected. Changes apply system-wide instantly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reset */}
            <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1.5px solid #fecaca" }}>
              <div style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>⚠️</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Danger Zone</span>
              </div>
              <div style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ margin: "0 0 0.25rem", fontSize: 14, fontWeight: 700, color: "#ef4444" }}>Reset Platform Parameters</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Reset all system rules and branding to factory defaults. This action cannot be undone.</p>
                </div>
                <button style={{ padding: "10px 24px", borderRadius: 12, border: "1.5px solid #fecaca", background: "#fef2f2", color: "#ef4444", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8 }}>
                  ⚠️ Perform Reset
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