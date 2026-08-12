// client/src/pages/MentorWallet.jsx

import { useState, useEffect } from 'react';
import PageLayout from '../components/Layout/PageLayout';
import DashboardSidebar from '../components/Mentorship/MentorSideBar';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../services/axiosConfig';

// ── Earnings Line Graph ──
function EarningsGraph({ data }) {
  const w = 300, h = 80;
  const max = Math.max(...data.map(d => d.value), 1);
  const pts = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * w : w / 2;
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
        <text key={i} x={data.length > 1 ? (i / (data.length - 1)) * w : w / 2} y={h + 18}
          textAnchor="middle" fontSize="9" fill="#aaa">{d.week}</text>
      ))}
    </svg>
  );
}

export default function MentorWallet() {
  const { user, syncWalletBalance } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [allTimeEarned, setAllTimeEarned] = useState(0);
  const [last30DaysEarned, setLast30DaysEarned] = useState(0);
  const [mentorLevel, setMentorLevel] = useState('Bronze');
  const [mentorScore, setMentorScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const displayBalance = user?.skillCoins ?? user?.coins ?? balance;

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const [balRes, txRes, earnRes, dashRes] = await Promise.all([
          axiosInstance.get(`/wallet/${user.id}`),
          axiosInstance.get(`/wallet/${user.id}/transactions?limit=20`),
          axiosInstance.get('/mentors/dashboard/earnings'),
          axiosInstance.get('/mentors/dashboard'),
        ]);

        if (balRes.data.success) {
          setBalance(balRes.data.balance);
          syncWalletBalance(balRes.data.balance);
        }

        if (txRes.data.success) {
          setTransactions(txRes.data.transactions || []);
        }

        const monthly = earnRes.data?.monthly_breakdown || [];
        setEarningsData(monthly.map(m => ({
          week: m.Month ? m.Month.slice(-2) + '/' + m.Month.slice(0,4) : 'N/A',
          value: Number(m.Total_Earned) || 0,
        })));
        setAllTimeEarned(Number(earnRes.data?.all_time_earned) || 0);
        setLast30DaysEarned(Number(earnRes.data?.last_30_days_earned) || 0);

        // Get best level and score from skill_stats
        const skills = dashRes.data?.skill_stats || [];
        if (skills.length > 0) {
          const levels = { bronze: 1, silver: 2, gold: 3, platinum: 4, diamond: 5 };
          const best = skills.reduce((max, s) => {
            const lvl = levels[s.Mentor_Level?.toLowerCase()] || 0;
            return lvl > (levels[max.Mentor_Level?.toLowerCase()] || 0) ? s : max;
          }, skills[0]);
          setMentorLevel(best.Mentor_Level || 'Bronze');
          setMentorScore(Number(best.Score) || 0);
        }
      } catch (err) {
        console.error('Failed to fetch wallet data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const last30DaysTotal = last30DaysEarned;

  const skillColorMap = {
    PYTHON: '#3B82F6', REACT: '#06B6D4', JAVASCRIPT: '#F59E0B',
    'UX DESIGN': '#8B5CF6', 'UI/UX': '#8B5CF6', TYPESCRIPT: '#3178C6',
    NODE: '#10B981', 'NODE.JS': '#10B981', DEFAULT: '#6B7280',
  };
  const skillBgMap = {
    PYTHON: '#EFF6FF', REACT: '#ECFEFF', JAVASCRIPT: '#FFFBEB',
    'UX DESIGN': '#F5F3FF', 'UI/UX': '#F5F3FF', TYPESCRIPT: '#EEF2FF',
    NODE: '#ECFDF5', 'NODE.JS': '#ECFDF5', DEFAULT: '#F9FAFB',
  };

  const parseTransaction = (tx) => {
    const isCredit = tx.type === 'CREDIT';
    const reason = tx.reason || '';
    const learnerMatch = reason.match(/with\s(.+)$/);
    const skillMatch = reason.match(/completed:\s(.+?)\swith/);
    const bookedSkillMatch = reason.match(/Booked session:\s(.+?)\swith/);
    const skill = skillMatch?.[1] || bookedSkillMatch?.[1] || (reason.includes('Skill verified') ? 'VERIFICATION' : '');
    const learner = learnerMatch?.[1] || '';
    const avatar = learner ? learner.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : (isCredit ? '💰' : '💳');
    const skillKey = Object.keys(skillColorMap).find(k => skill.toUpperCase().includes(k)) || 'DEFAULT';
    const skillColor = skillColorMap[skillKey] || skillColorMap.DEFAULT;
    const skillBg = skillBgMap[skillKey] || skillBgMap.DEFAULT;
    return {
      id: tx.transaction_id || tx.id,
      learner: learner || (isCredit ? 'Earned' : 'Spent'),
      avatar,
      skill,
      skillColor,
      skillBg,
      amount: isCredit ? tx.amount : -tx.amount,
      status: isCredit ? 'done' : 'pending',
    };
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="dash-layout">
          <DashboardSidebar user={user} />
          <div className="dash-content">
            <div className="dash-main" style={{ padding: "28px 32px" }}>
              <p style={{ textAlign: "center", color: "#16a34a", padding: "3rem" }}>Loading wallet...</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="dash-layout">
        <DashboardSidebar user={user} />
        <div className="dash-content">
          <div className="dash-main" style={{ padding: "28px 32px" }}>

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
                <span style={{ fontSize: "44px", fontWeight: "bold" }}>{displayBalance.toLocaleString()} </span>
                <span style={{ fontSize: "20px", color: "#1D9E75", fontWeight: "600" }}>SC</span>
              </p>
              <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>
                Total Lifetime Earnings: <strong style={{ color: "#1a1a1a" }}>{allTimeEarned.toLocaleString()} SC</strong>
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
                    +{last30DaysTotal.toLocaleString()} SC
                  </p>
                </div>
              </div>
              {earningsData.length > 0 ? (
                <EarningsGraph data={earningsData} />
              ) : (
                <p style={{ textAlign: "center", color: "#aaa", fontSize: "13px", paddingTop: "2rem" }}>No earnings data yet</p>
              )}
            </div>
          </div>

          {/* ── Recent Activity + Right Column ── */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 280px",
            gap: "16px",
          }}>

            {/* Recent Activity */}
            <div id="recent-activity" style={{
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
              {transactions.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#aaa", fontSize: "13px" }}>
                  No transactions yet
                </div>
              ) : (
                transactions.map(tx => {
                  const parsed = parseTransaction(tx);
                  return (
                    <div key={parsed.id} style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 130px 110px 80px",
                      padding: "13px 20px",
                      borderBottom: "1px solid #F9F9F9",
                      alignItems: "center",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "34px", height: "34px", borderRadius: "50%",
                          background: "#E1F5EE", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          fontSize: "13px", fontWeight: "bold", color: "#0F6E56",
                          overflow: "hidden",
                        }}>
                          {parsed.avatar}
                        </div>
                        <span style={{ fontSize: "14px" }}>{parsed.learner}</span>
                      </div>

                      <span style={{
                        fontSize: "10px", fontWeight: "700",
                        padding: "3px 10px", borderRadius: "20px",
                        background: parsed.skillBg, color: parsed.skillColor,
                        display: "inline-block", width: "fit-content",
                      }}>{parsed.skill || (tx.type === 'CREDIT' ? 'CREDIT' : 'DEBIT')}</span>

                      <span style={{
                        fontWeight: "700", fontSize: "14px",
                        color: parsed.amount > 0 ? "#1D9E75" : "#E24B4A",
                      }}>
                        {parsed.amount > 0 ? "+" : ""}{parsed.amount} SC
                      </span>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        {parsed.status === "done"
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
                  );
                })
              )}

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
              <div id="payout" style={{
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
                  Mentor Level: {mentorLevel}
                </p>
                <div style={{
                  height: "6px", background: "rgba(255,255,255,0.15)",
                  borderRadius: "10px", marginBottom: "12px",
                }}>
                  <div style={{
                    width: Math.min(mentorScore, 100) + "%", height: "100%",
                    background: "#1D9E75", borderRadius: "10px",
                  }} />
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "#aaa", lineHeight: "1.6" }}>
                  Score: {mentorScore} &mdash; Keep mentoring to unlock the next level!
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </PageLayout>
  );
}
