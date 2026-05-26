import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';


export default function BookingConfirmed() {
  const navigate = useNavigate();
  const session = {
    mentor: "Dr. Sarah Mitchell",
    mentorImg: "https://i.pravatar.cc/80?img=47",
    date: "Oct 24, 2024 • 10:00 AM",
    type: "Online Session",
    coinsDeducted: 200,
    remainingBalance: 1050,
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f5f6fa", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{ background: "#fff", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, borderBottom: "1px solid #eee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: "#1a7a4a", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>E</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>EduConnect</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Dashboard", "Sessions", "Messages"].map(n => (
            <span key={n} style={{ cursor: "pointer", fontWeight: n === "Sessions" ? 700 : 400, color: n === "Sessions" ? "#1a7a4a" : "#555", borderBottom: n === "Sessions" ? "2px solid #1a7a4a" : "none", paddingBottom: 4, fontSize: 14 }}>
              {n}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #ccc", background: "#fff", fontSize: 12, cursor: "pointer" }}>Mentor</button>
          <button style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: "#1a7a4a", color: "#fff", fontSize: 12, cursor: "pointer" }}>Learner Mode</button>
          <div style={{ background: "#e8f5ee", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#1a7a4a" }}>💰</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#1a7a4a" }}>100 Skill Coins</span>
          </div>
          <span style={{ fontSize: 20, cursor: "pointer" }}>🔔</span>
          <img src="https://i.pravatar.cc/40?img=12" alt="avatar" style={{ width: 36, height: 36, borderRadius: "50%" }} />
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: 600, margin: "3rem auto", padding: "0 1.5rem" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "2.5rem 2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", textAlign: "center" }}>

          {/* Success Icon */}
          <div style={{ width: 64, height: 64, background: "#22c55e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
            <span style={{ color: "#fff", fontSize: 28 }}>✓</span>
          </div>

          {/* Title */}
          <h2 style={{ margin: "0 0 0.5rem", fontSize: 22, fontWeight: 700, color: "#1e293b" }}>Booking Confirmed!</h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 2rem", lineHeight: 1.6 }}>
            Your session with {session.mentor} has been successfully<br />
            scheduled. We've sent the meeting link and calendar invite<br />
            to your email.
          </p>

          {/* Details Card */}
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", textAlign: "left", marginBottom: "1.5rem" }}>

            {/* Session Details */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 1rem" }}>Session Details</p>

              {/* Mentor */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
                <img src={session.mentorImg} alt="mentor" style={{ width: 36, height: 36, borderRadius: "50%" }} />
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Mentor</p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{session.mentor}</p>
                </div>
              </div>

              {/* Date */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
                <div style={{ width: 36, height: 36, background: "#f1f5f9", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📅</div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Date & Time</p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{session.date}</p>
                </div>
              </div>

              {/* Type */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, background: "#f1f5f9", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💻</div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Type</p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{session.type}</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 1rem" }}>Payment Summary</p>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: 14, color: "#475569" }}>Skill Coins Deducted</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>-{session.coinsDeducted} SC</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span style={{ fontSize: 14, color: "#475569" }}>Remaining Balance</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>🪙 {session.remainingBalance} SC</span>
              </div>

              {/* Info box */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "0.75rem", fontSize: 12, color: "#166534", lineHeight: 1.5 }}>
                ✅ You can cancel or reschedule this session up to 24 hours before the start time for a full refund.
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button 
  onClick={() => navigate('/my-sessions')}  // ✅ onClick as prop
  style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
  Go to My Sessions →
</button>
            <button style={{ padding: "12px 24px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              📥 Receipt
            </button>
          </div>

        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}