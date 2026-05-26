import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';

const upcomingSessions = [
  {
    id: 1,
    mentor: "Sarani Perera",
    image: "https://i.pravatar.cc/80?img=47",
    skill: "UI/UX Design",
    topic: "Design Fundamentals & Portfolio Review",
    date: "Oct 24, 2026",
    time: "10:15 AM - 11:00 AM",
    status: "SCHEDULED",
    meetingLink: "https://zoom.us",
    meetingType: "Zoom Meeting",
  },
  {
    id: 2,
    mentor: "Michael Herath",
    image: "https://i.pravatar.cc/80?img=11",
    skill: "Frontend Dev",
    topic: "Advanced React Patterns & Performance",
    date: "Oct 26, 2026",
    time: "02:00 PM - 03:30 PM",
    status: "SCHEDULED",
    meetingLink: "https://meet.google.com",
    meetingType: "Google Meet",
  },
];

const pastSessions = [
  {
    id: 3,
    mentor: "kavisha Rodrigue",
    image: "https://i.pravatar.cc/80?img=25",
    skill: "Product Mgmt",
    date: "Oct 15, 2023 • 60 mins",
    status: "COMPLETED",
  },
  {
    id: 4,
    mentor: "Dasun Santhushka",
    image: "https://i.pravatar.cc/80?img=13",
    skill: "Python Basics",
    date: "Oct 10, 2026 • 30 mins",
    status: "CANCELLED",
  },
];

export default function MySessions() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  const statusColors = {
    SCHEDULED: "#22c55e",
    COMPLETED: "#3b82f6",
    CANCELLED: "#ef4444",
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

      <div style={{ display: "flex" }}>

        {/* Sidebar */}
        <div style={{ width: 300, background: "#fff", minHeight: "calc(100vh - 60px)", padding: "1.5rem 1rem", borderRight: "1px solid #eee", flexShrink: 0 }}>
          {[
            { icon: "🏠", label: "Dashboard", path: "/" },
            { icon: "👥", label: "Mentors", path: "/" },
            { icon: "📅", label: "My Sessions", path: "/my-sessions", active: true },
            { icon: "🏆", label: "Badges and Achievements", path: "/" },
          ].map(item => (
            <div key={item.label} onClick={() => navigate(item.path)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, marginBottom: 4, cursor: "pointer", background: item.active ? "#e8f5ee" : "transparent", color: item.active ? "#1a7a4a" : "#475569", fontWeight: item.active ? 600 : 400, fontSize: 14 }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "2rem" }}>

          {/* Breadcrumb */}
          <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: "1rem" }}>
            Dashboard &gt; <span style={{ color: "#1a7a4a" }}>My Sessions</span>
          </p>

          <h1 style={{ margin: "0 0 0.25rem", fontSize: 24, fontWeight: 700, color: "#1e293b" }}>My Sessions</h1>
          <p style={{ margin: "0 0 1.5rem", fontSize: 14, color: "#64748b" }}>Manage your learning journey and upcoming meetings.</p>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginBottom: "1.5rem", borderBottom: "2px solid #e2e8f0" }}>
            {["upcoming", "past"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: "10px 20px", border: "none", background: "transparent", cursor: "pointer", fontWeight: activeTab === tab ? 700 : 400, color: activeTab === tab ? "#1a7a4a" : "#64748b", borderBottom: activeTab === tab ? "2px solid #1a7a4a" : "2px solid transparent", marginBottom: -2, fontSize: 14 }}>
                {tab === "upcoming" ? "Upcoming Sessions" : "Past Sessions"}
              </button>
            ))}
          </div>

          {/* Upcoming Sessions */}
          {activeTab === "upcoming" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {upcomingSessions.map(session => (
                <div key={session.id} style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", display: "flex", alignItems: "center", gap: "1.25rem", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                  <img src={session.image} alt={session.mentor} style={{ width: 120, height: 120, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ background: "#e8f5ee", color: "#1a7a4a", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{session.status}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>{session.skill}</span>
                    </div>
                    <h3 style={{ margin: "0 0 0.25rem", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{session.mentor}</h3>
                    <p style={{ margin: "0 0 0.5rem", fontSize: 13, color: "#64748b" }}>{session.topic}</p>
                    <a href={session.meetingLink} target="_blank" rel="noreferrer"
                      style={{ fontSize: 13, color: "#1a7a4a", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                      🔗 {session.meetingType}
                    </a>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ margin: "0 0 0.25rem", fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{session.date}</p>
                    <p style={{ margin: "0 0 1rem", fontSize: 12, color: "#64748b" }}>{session.time}</p>
                    <button style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#1a7a4a", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                      Join Meeting
                    </button>
                  </div>
                </div>
              ))}

              {/* Past Sessions Preview */}
              <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginTop: "0.5rem" }}>Past Sessions Preview</p>
              {pastSessions.map(session => (
                <div key={session.id} style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", display: "flex", alignItems: "center", gap: "1.25rem", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                  <img src={session.image} alt={session.mentor} style={{ width: 120, height: 120, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ background: session.status === "COMPLETED" ? "#eff6ff" : "#fef2f2", color: statusColors[session.status], fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{session.status}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>{session.skill}</span>
                    </div>
                    <h3 style={{ margin: "0 0 0.25rem", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{session.mentor}</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{session.date}</p>
                  </div>
                  <button onClick={() => session.status === "COMPLETED" ? navigate('/session-feedback') : null}
                    style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    {session.status === "COMPLETED" ? "Rate Mentor" : "Feedback"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Past Sessions Tab */}
          {activeTab === "past" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {pastSessions.map(session => (
                <div key={session.id} style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", display: "flex", alignItems: "center", gap: "1.25rem", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                  <img src={session.image} alt={session.mentor} style={{ width: 80, height: 80, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ background: session.status === "COMPLETED" ? "#eff6ff" : "#fef2f2", color: statusColors[session.status], fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{session.status}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>{session.skill}</span>
                    </div>
                    <h3 style={{ margin: "0 0 0.25rem", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{session.mentor}</h3>
                    <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{session.date}</p>
                  </div>
                  <button onClick={() => navigate('/session-feedback')}
                    style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    {session.status === "COMPLETED" ? "Rate Mentor" : "Feedback"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}