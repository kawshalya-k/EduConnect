import { useState } from "react";

const mockMentor = {
  name: "Sarah Jenkins",
  level: "GOLD MENTOR",
  title: "Senior UX Researcher",
  university: "University of Arts",
  rating: 4.9,
  reviews: 124,
  sessions: 200,
  avatar: "https://i.pravatar.cc/80?img=47",
  wallet: 850,
};

const topics = [
  "Advanced UI Prototyping in Figma",
  "React.js Fundamentals",
  "Node.js Backend Development",
  "MySQL Database Design",
  "Python for Beginners",
];

const timeSlots = [
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "04:00 PM - 05:00 PM",
];

export default function SessionsPage() {
  const [topic, setTopic] = useState(topics[0]);
  const [date, setDate] = useState("2023-11-20");
  const [time, setTime] = useState(timeSlots[0]);
  const [message, setMessage] = useState("");
  const sessionCost = 50;
  const remaining = mockMentor.wallet - sessionCost;

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
            <span key={n} style={{ cursor: "pointer", fontWeight: n === "Sessions" ? 700 : 400, color: n === "Sessions" ? "#1a7a4a" : "#555", borderBottom: n === "Sessions" ? "2px solid #1a7a4a" : "none", paddingBottom: 4, fontSize: 14 }}>{n}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #ccc", background: "#fff", fontSize: 12, cursor: "pointer" }}>Mentor</button>
          <button style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: "#1a7a4a", color: "#fff", fontSize: 12, cursor: "pointer" }}>Learner Mode</button>
          <div style={{ background: "#e8f5ee", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#1a7a4a", fontSize: 14 }}>💰</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#1a7a4a" }}>100 Skill Coins</span>
          </div>
          <span style={{ fontSize: 20, cursor: "pointer" }}>🔔</span>
          <img src={mockMentor.avatar} alt="avatar" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>

        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Mentor Card */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1.25rem", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            <img src={mockMentor.avatar} alt="mentor" style={{ width: 72, height: 72, borderRadius: 10, objectFit: "cover" }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 18 }}>{mockMentor.name}</span>
                <span style={{ background: "#fff8e1", color: "#f59e0b", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, border: "1px solid #f59e0b" }}>⭐ {mockMentor.level}</span>
              </div>
              <div style={{ color: "#777", fontSize: 13, marginBottom: 8 }}>{mockMentor.title} • {mockMentor.university}</div>
              <div style={{ display: "flex", gap: 16 }}>
                <span style={{ fontSize: 13, color: "#555" }}>⭐ <strong>{mockMentor.rating}</strong> ({mockMentor.reviews} reviews)</span>
                <span style={{ fontSize: 13, color: "#555" }}>🎓 {mockMentor.sessions}+ Sessions</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "1.5rem", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>

            {/* Session Topic */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Session Topic</label>
              <div style={{ position: "relative" }}>
                <select
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #e0e0e0", fontSize: 14, appearance: "none", background: "#fff", cursor: "pointer", outline: "none" }}
                >
                  {topics.map(t => <option key={t}>{t}</option>)}
                </select>
                <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#999" }}>▼</span>
              </div>
            </div>

            {/* Date & Time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Select Date</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>📅</span>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{ width: "100%", padding: "12px 12px 12px 36px", borderRadius: 10, border: "1px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Select Time</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🕙</span>
                  <select
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    style={{ width: "100%", padding: "12px 12px 12px 36px", borderRadius: 10, border: "1px solid #e0e0e0", fontSize: 14, appearance: "none", background: "#fff", cursor: "pointer", outline: "none", boxSizing: "border-box" }}
                  >
                    {timeSlots.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#999" }}>▼</span>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Message for Mentor (Optional)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="What are your goals for this session? Share any specific questions you have..."
                rows={4}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #e0e0e0", fontSize: 14, resize: "none", outline: "none", boxSizing: "border-box", color: "#555", fontFamily: "inherit" }}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Payment Card */}
          <div style={{ background: "#1a3a2a", borderRadius: 14, padding: "1.5rem", color: "#fff" }}>
            <h3 style={{ margin: "0 0 1.25rem", fontSize: 16, fontWeight: 700 }}>Skill Coins Payment</h3>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: 14 }}>
              <span style={{ color: "#aac4b4" }}>Current Wallet Balance</span>
              <span style={{ fontWeight: 700 }}>{mockMentor.wallet} <span style={{ color: "#4ade80", fontSize: 12 }}>●</span></span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: 14 }}>
              <span style={{ color: "#aac4b4" }}>Session Cost (60 min)</span>
              <span style={{ fontWeight: 700, color: "#f87171" }}>- {sessionCost} <span style={{ color: "#f87171", fontSize: 12 }}>●</span></span>
            </div>

            <div style={{ borderTop: "1px solid #2d5a3d", paddingTop: "1rem", display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Remaining Balance</span>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{remaining} <span style={{ color: "#4ade80", fontSize: 12 }}>●</span></span>
            </div>

            {/* Info box */}
            <div style={{ background: "#1e4a32", borderRadius: 10, padding: "0.875rem", marginBottom: "1.25rem", display: "flex", gap: 10 }}>
              <span style={{ color: "#4ade80", fontSize: 16, flexShrink: 0 }}>ℹ️</span>
              <p style={{ margin: 0, fontSize: 12, color: "#aac4b4", lineHeight: 1.5 }}>
                The external meeting link (Zoom/Google Meet) will be generated and shared via email and your dashboard immediately after confirmation.
              </p>
            </div>

            {/* Confirm Button */}
            <button
              style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", letterSpacing: 0.5 }}
              onClick={() => alert("Session booked successfully! 🎉")}
            >
              Confirm and Book →
            </button>

            <p style={{ textAlign: "center", fontSize: 11, color: "#6b9e7e", marginTop: 10, margin: "10px 0 0" }}>
              100% REFUNDABLE UP TO 24H BEFORE SESSION
            </p>
          </div>

          {/* Booking Bonus */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>🏆</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", letterSpacing: 1, textTransform: "uppercase" }}>Booking Bonus</div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>Earn +10 XP for this booking!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}