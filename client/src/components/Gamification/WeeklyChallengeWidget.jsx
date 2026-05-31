// client/src/components/Gamification/WeeklyChallengeWidget.jsx

import { useState, useEffect } from "react";

const challenges = [
  {
    id: 1,
    title: "Complete 3 Sessions",
    description: "Book and complete 3 mentoring sessions this week",
    icon: "📅",
    reward: 150,
    current: 2,
    total: 3,
    completed: false,
  },
  {
    id: 2,
    title: "7-Day Learning Streak",
    description: "Log in and learn something new every day",
    icon: "🔥",
    reward: 100,
    current: 5,
    total: 7,
    completed: false,
  },
  {
    id: 3,
    title: "Help 2 Peers",
    description: "Answer questions in the community forum",
    icon: "👥",
    reward: 50,
    current: 2,
    total: 2,
    completed: true,
  },
];

function ProgressBar({ progress, color = "#1D9E75" }) {
  return (
    <div style={{
      width: "100%", height: "6px",
      background: "#E8E8E8", borderRadius: "10px",
      overflow: "hidden",
    }}>
      <div style={{
        width: `${progress}%`, height: "100%",
        background: color, borderRadius: "10px",
        transition: "width 0.4s ease",
      }} />
    </div>
  );
}

// Countdown timer to next reset (next Monday)
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calc = () => {
      const now  = new Date();
      const next = new Date();
      next.setDate(now.getDate() + (7 - now.getDay() + 1) % 7 || 7);
      next.setHours(0, 0, 0, 0);
      const diff = next - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${h}h ${m}m`);
    };
    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span style={{ fontSize: "12px", color: "#888" }}>
      Resets in <strong style={{ color: "#1D9E75" }}>{timeLeft}</strong>
    </span>
  );
}

export default function WeeklyChallengeWidget() {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E8E8E8",
      borderRadius: "16px",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>⚡</span>
          <p style={{ margin: 0, fontWeight: "700", fontSize: "16px" }}>
            Weekly Challenges
          </p>
        </div>
        <CountdownTimer />
      </div>

      {/* ── Challenges ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {challenges.map(ch => {
          const progress = Math.min((ch.current / ch.total) * 100, 100);
          return (
            <div key={ch.id} style={{
              padding: "14px",
              border: ch.completed
                ? "1px solid #B8E6D4"
                : "1px solid #F0F0F0",
              borderRadius: "12px",
              background: ch.completed ? "#F0FDF8" : "#FAFAFA",
              opacity: ch.completed ? 0.85 : 1,
            }}>
              <div style={{
                display: "flex", alignItems: "flex-start",
                gap: "12px",
              }}>
                {/* Icon */}
                <div style={{
                  width: "40px", height: "40px",
                  borderRadius: "10px",
                  background: ch.completed ? "#E1F5EE" : "#F5F5F5",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "18px",
                  flexShrink: 0,
                }}>{ch.icon}</div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", marginBottom: "4px",
                  }}>
                    <p style={{
                      margin: 0, fontWeight: "600",
                      fontSize: "13px", color: "#1a1a1a",
                    }}>{ch.title}</p>

                    {/* Reward */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      background: "#FFF8E1", padding: "2px 8px",
                      borderRadius: "10px",
                    }}>
                      <span style={{ fontSize: "12px" }}>🪙</span>
                      <span style={{
                        fontSize: "11px", fontWeight: "700",
                        color: "#F9A825",
                      }}>+{ch.reward}</span>
                    </div>
                  </div>

                  <p style={{
                    margin: "0 0 8px", fontSize: "12px",
                    color: "#888", lineHeight: "1.4",
                  }}>{ch.description}</p>

                  {/* Progress */}
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", marginBottom: "4px",
                  }}>
                    <span style={{ fontSize: "11px", color: "#888" }}>
                      {ch.current}/{ch.total}
                    </span>
                    {ch.completed
                      ? <span style={{ fontSize: "11px", color: "#1D9E75", fontWeight: "600" }}>
                          ✓ Completed
                        </span>
                      : <span style={{ fontSize: "11px", color: "#555", fontWeight: "600" }}>
                          {Math.round(progress)}%
                        </span>
                    }
                  </div>
                  <ProgressBar
                    progress={progress}
                    color={ch.completed ? "#1D9E75" : "#3B82F6"}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── View All Challenges ── */}
      <button style={{
        width: "100%", marginTop: "14px",
        padding: "10px", border: "1px solid #1D9E75",
        borderRadius: "8px", background: "#fff",
        color: "#1D9E75", fontWeight: "600",
        fontSize: "13px", cursor: "pointer",
      }}>
        View All Challenges
      </button>
    </div>
  );
}
