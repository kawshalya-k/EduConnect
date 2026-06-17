// client/src/pages/MentorWallet.jsx

import { useState } from "react";
import { Link } from 'react-router-dom';

const mentorTransactions = [
  { id: 1, learner: "Alex Chen",    avatar: "AC", skill: "PYTHON",       skillColor: "#3B82F6", skillBg: "#EFF6FF", amount: +20, status: "done"    },
  { id: 2, learner: "Sarah Miller", avatar: "SM", skill: "REACT",        skillColor: "#06B6D4", skillBg: "#ECFEFF", amount: +20, status: "done"    },
  { id: 3, learner: "David Kim",    avatar: "DK", skill: "UX DESIGN",    skillColor: "#8B5CF6", skillBg: "#F5F3FF", amount: +40, status: "done"    },
  { id: 4, learner: "Redemption",   avatar: "🎁", skill: "LIBRARY PASS", skillColor: "#6B7280", skillBg: "#F9FAFB", amount: -50, status: "pending" },
];

const graphData = [
  { week: "WEEK 1", value: 20  },
  { week: "WEEK 2", value: 45  },
  { week: "WEEK 3", value: 60  },
  { week: "WEEK 4", value: 100 },
];

// ── Earnings Line Graph ──
function EarningsGraph({ data }) {
  const w = 300, h = 80;
  const max = Math.max(...data.map(d => d.value));
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (d.value / max) * h;
    return { x, y };
  });
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const area = `0,${h} ${polyline} ${w},${h}`;

  return (
    <svg width="100%" height={h + 24} viewBox={`0 0 ${w} ${h + 24}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1D9E75" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1D9E75" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#areaGrad)" />
      <polyline points={polyline} fill="none" stroke="#1D9E75" strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#1D9E75" />
      ))}
      {data.map((d, i) => (
        <text key={i} x={(i / (data.length - 1)) * w} y={h + 18}
          textAnchor="middle" fontSize="9" fill="#aaa">{d.week}</text>
      ))}
    </svg>
  );
}

export default function MentorWallet() {
  const [available, setAvailable] = useState(true);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F7F5", fontFamily: "Arial, sans-serif" }}>

      {/* ── Navbar ── */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #E8E8E8",
        padding: "0 32px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "28px", height: "28px", background: "#1D9E75",
            borderRadius: "8px", display: "flex", alignItems: "center",
            justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "14px",
          }}>E</div>
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>EduConnect</span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Sessions", path: "/MySessions" },
            { label: "Messages", path: "/session-room#messages" }
          ].map(link => (
            <Link key={link.label} to={link.path} style={{
              fontSize: "14px", cursor: "pointer",
              color: link.label === "Sessions" ? "#1D9E75" : "#666",
              fontWeight: link.label === "Sessions" ? "600" : "400",
              borderBottom: link.label === "Sessions" ? "2px solid #1D9E75" : "none",
              paddingBottom: "4px",
              textDecoration: 'none'
            }}>{link.label}</Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            display: "flex", border: "1px solid #E0E0E0",
            borderRadius: "20px", overflow: "hidden", fontSize: "13px",
          }}>
            <span style={{
              padding: "6px 14px", background: "#1D9E75",
              color: "#fff", cursor: "pointer", fontWeight: "500",
            }}>Mentor Mode</span>
            <span style={{ padding: "6px 14px", cursor: "pointer", color: "#666" }}>Learner</span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "#E1F5EE", padding: "6px 14px",
            borderRadius: "20px", fontSize: "13px",
            fontWeight: "600", color: "#0F6E56",
          }}>
            🪙 100 Skill Coins
          </div>
          <span style={{ fontSize: "20px", cursor: "pointer" }}>🔔</span>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "#2D4A3E", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: "bold", fontSize: "14px",
          }}>M</div>
        </div>
      </nav>

      <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>

        {/* ── Left Sidebar ── */}
        <div style={{
          width: "220px", flexShrink: 0,
          background: "#fff", borderRight: "1px solid #E8E8E8",
          padding: "24px 16px",
          display: "flex", flexDirection: "column", gap: "4px",
        }}>
          {/* Title */}
          <p style={{ margin: "0 0 2px", fontWeight: "700", fontSize: "15px", color: "#1D9E75" }}>
            Session Manager
          </p>
          <p style={{ margin: "0 0 20px", fontSize: "12px", color: "#aaa" }}>
            Manage your learning sessions
          </p>

          {/* Nav items */}
          {[
            { label: "Dashboard",    icon: "📊", active: false },
            { label: "Sessions",     icon: "👥", active: true  },
            { label: "Availability", icon: "🕐", active: false },
            { label: "Earnings",     icon: "💰", active: false },
            { label: "Settings",     icon: "⚙️", active: false },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "8px",
              background: item.active ? "#E1F5EE" : "transparent",
              color: item.active ? "#1D9E75" : "#555",
              cursor: "pointer", fontSize: "14px",
              fontWeight: item.active ? "600" : "400",
            }}>
              <span style={{ fontSize: "15px" }}>{item.icon}</span>
              {item.label}
            </div>
          ))}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Availability toggle */}
          <div style={{
            padding: "12px", border: "1px solid #E8E8E8",
            borderRadius: "12px", marginBottom: "12px",
          }}>
            <p style={{
              margin: "0 0 6px", fontSize: "10px",
              color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px",
            }}>Availability</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>
                Accepting new requests
              </p>
              <div
                onClick={() => setAvailable(!available)}
                style={{
                  width: "38px", height: "20px",
                  background: available ? "#1D9E75" : "#ccc",
                  borderRadius: "20px", position: "relative",
                  cursor: "pointer", transition: "background 0.2s",
                }}
              >
                <div style={{
                  position: "absolute",
                  left: available ? "20px" : "2px",
                  top: "2px",
                  width: "16px", height: "16px",
                  background: "#fff", borderRadius: "50%",
                  transition: "left 0.2s",
                }} />
              </div>
            </div>
          </div>

          {/* Daily Earnings card */}
          <div style={{
            background: "#0F2D27", borderRadius: "12px",
            padding: "16px", color: "#fff",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px" }}>🟢</span>
              <p style={{ margin: 0, fontSize: "11px", color: "#aaa" }}>Daily Earnings</p>
            </div>
            <p style={{ margin: "0 0 14px" }}>
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>150 </span>
              <span style={{ fontSize: "13px", color: "#1D9E75", fontWeight: "500" }}>Skill Coins</span>
            </p>
            <button style={{
              width: "100%", padding: "9px",
              background: "#1D9E75", border: "none",
              borderRadius: "8px", color: "#fff",
              fontWeight: "600", fontSize: "13px", cursor: "pointer",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "6px",
            }}>
              📡 Go Live
            </button>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* ── Top Row — Balance + Graph ── */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "16px", marginBottom: "20px",
          }}>

            {/* Balance card */}
            <div style={{
              background: "#fff", borderRadius: "16px",
              border: "1px solid #E8E8E8", padding: "24px",
              position: "relative", overflow: "hidden",
            }}>
              {/* Big circle decoration */}
              <div style={{
                position: "absolute", top: "-30px", right: "-30px",
                width: "140px", height: "140px", borderRadius: "50%",
                background: "#E1F5EE", opacity: 0.5,
              }} />
              <p style={{
                margin: "0 0 8px", fontSize: "11px",
                color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px",
              }}>Current Balance</p>
              <p style={{ margin: "0 0 16px" }}>
                <span style={{ fontSize: "44px", fontWeight: "bold" }}>150 </span>
                <span style={{ fontSize: "20px", color: "#1D9E75", fontWeight: "600" }}>SC</span>
              </p>
              <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
                Total Lifetime Earnings: <strong style={{ color: "#1a1a1a" }}>1,240 SC</strong>
              </p>
            </div>

            {/* Graph card */}
            <div style={{
              background: "#fff", borderRadius: "16px",
              border: "1px solid #E8E8E8", padding: "24px",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", marginBottom: "4px",
              }}>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: "13px", color: "#888" }}>Last 30 Days</p>
                  <p style={{ margin: 0, fontSize: "26px", fontWeight: "bold", color: "#1D9E75" }}>
                    +340 SC
                  </p>
                </div>
                <span style={{
                  background: "#E1F5EE", color: "#0F6E56",
                  fontSize: "11px", fontWeight: "600",
                  padding: "3px 10px", borderRadius: "20px",
                }}>+12% vs LY</span>
              </div>
              <EarningsGraph data={graphData} />
            </div>
          </div>

          {/* ── Recent Activity + Right Column ── */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 280px",
            gap: "16px",
          }}>

            {/* Recent Activity */}
            <div style={{
              background: "#fff", borderRadius: "16px",
              border: "1px solid #E8E8E8", overflow: "hidden",
            }}>
              <div style={{ padding: "18px 20px", borderBottom: "1px solid #E8E8E8" }}>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "16px" }}>Recent Activity</p>
              </div>

              {/* Column headers */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 130px 110px 80px",
                padding: "10px 20px",
                fontSize: "11px", fontWeight: "600",
                color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px",
                borderBottom: "1px solid #F5F5F5",
              }}>
                <span>Learner</span>
                <span>Skill</span>
                <span>Amount</span>
                <span>Status</span>
              </div>

              {/* Rows */}
              {mentorTransactions.map(tx => (
                <div key={tx.id} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 130px 110px 80px",
                  padding: "13px 20px",
                  borderBottom: "1px solid #F9F9F9",
                  alignItems: "center",
                }}>
                  {/* Learner */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "34px", height: "34px", borderRadius: "50%",
                      background: "#E1F5EE", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: "bold", color: "#0F6E56",
                      overflow: "hidden",
                    }}>
                      {tx.avatar}
                    </div>
                    <span style={{ fontSize: "14px" }}>{tx.learner}</span>
                  </div>

                  {/* Skill badge */}
                  <span style={{
                    fontSize: "10px", fontWeight: "700",
                    padding: "3px 10px", borderRadius: "20px",
                    background: tx.skillBg, color: tx.skillColor,
                    display: "inline-block", width: "fit-content",
                  }}>{tx.skill}</span>

                  {/* Amount */}
                  <span style={{
                    fontWeight: "700", fontSize: "14px",
                    color: tx.amount > 0 ? "#1D9E75" : "#E24B4A",
                  }}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount} SC
                  </span>

                  {/* Status */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {tx.status === "done"
                      ? <span style={{
                          width: "22px", height: "22px", borderRadius: "50%",
                          border: "2px solid #1D9E75", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          color: "#1D9E75", fontSize: "12px",
                        }}>✓</span>
                      : <span style={{
                          width: "22px", height: "22px", borderRadius: "50%",
                          border: "2px solid #aaa", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          color: "#aaa", fontSize: "12px",
                        }}>🕐</span>
                    }
                  </div>
                </div>
              ))}

              {/* View all */}
              <div style={{ padding: "14px 20px", textAlign: "center" }}>
                <button style={{
                  background: "none", border: "none",
                  color: "#1D9E75", fontWeight: "700",
                  fontSize: "12px", cursor: "pointer",
                  letterSpacing: "0.5px",
                }}>VIEW ALL TRANSACTIONS</button>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Payout Info */}
              <div style={{
                background: "#fff", borderRadius: "16px",
                border: "1px solid #E8E8E8", padding: "20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div style={{
                    width: "22px", height: "22px", borderRadius: "50%",
                    border: "2px solid #1D9E75", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: "#1D9E75", fontSize: "12px",
                  }}>ℹ</div>
                  <p style={{ margin: 0, fontWeight: "700", fontSize: "15px" }}>Payout Information</p>
                </div>

                {[
                  { title: "Redeem for Sessions", desc: "Use your coins to book expert mentoring sessions for yourself or your team." },
                  { title: "University Rewards",  desc: "Redeem SC for library access, course certifications, or campus perks." },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: "14px" }}>
                    <p style={{ margin: "0 0 4px", fontWeight: "600", fontSize: "13px" }}>{item.title}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#888", lineHeight: "1.6" }}>{item.desc}</p>
                  </div>
                ))}

                <button style={{
                  width: "100%", padding: "10px",
                  border: "1px solid #1D9E75", borderRadius: "8px",
                  background: "#fff", color: "#1D9E75",
                  fontWeight: "600", fontSize: "13px", cursor: "pointer",
                  marginTop: "4px",
                }}>Browse Rewards</button>
              </div>

              {/* Mentor Level card */}
              <div style={{
                background: "#0F2D27", borderRadius: "16px",
                padding: "20px", color: "#fff",
              }}>
                <p style={{ margin: "0 0 10px", fontWeight: "700", fontSize: "14px" }}>
                  Mentor Level: Platinum
                </p>
                <div style={{
                  height: "6px", background: "rgba(255,255,255,0.15)",
                  borderRadius: "10px", marginBottom: "12px",
                }}>
                  <div style={{
                    width: "75%", height: "100%",
                    background: "#1D9E75", borderRadius: "10px",
                  }} />
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "#aaa", lineHeight: "1.6" }}>
                  You are 260 SC away from Diamond status and a 5% bonus multiplier!
                </p>
              </div>

            </div>
          </div>

          {/* ── Footer ── */}
          <div style={{
            background: "#0F2D27", borderRadius: "16px",
            padding: "40px 32px", marginTop: "28px",
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "32px",
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{
                  width: "28px", height: "28px", background: "#1D9E75",
                  borderRadius: "8px", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "14px",
                }}>E</div>
                <span style={{ fontWeight: "bold", fontSize: "16px", color: "#fff" }}>EduConnect</span>
              </div>
              <p style={{ fontSize: "13px", color: "#aaa", lineHeight: "1.7", margin: 0 }}>
                Empowering University students through peer-to-peer learning and community recognition.
              </p>
            </div>
            {[
              { title: "Student Center", links: ["Student Registration", "Search Mentors", "Skill Marketplace"] },
              { title: "Mentorship",     links: ["Mentor Onboarding", "Verification Center", "Teaching Tools", "Mentor Guidelines"] },
              { title: "Portal",         links: ["About Us", "Privacy Policy", "Terms of Service", "Community Guidelines", "Contact Support", "Help Center"] },
            ].map(col => (
              <div key={col.title}>
                <p style={{ fontWeight: "600", fontSize: "13px", color: "#1D9E75", marginBottom: "12px" }}>
                  {col.title}
                </p>
                {col.links.map(link => (
                  <p key={link} style={{ fontSize: "13px", color: "#aaa", marginBottom: "8px", cursor: "pointer" }}>
                    {link}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Footer bottom */}
          <p style={{ textAlign: "center", fontSize: "12px", color: "#aaa", marginTop: "16px" }}>
            © 2026 EduConnect. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  );
}
