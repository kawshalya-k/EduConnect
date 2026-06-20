import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Footer from '../../components/Footer';

const guidelines = [
  "Keep your microphone muted unless speaking.",
  "Prepare your Python environment (VS Code/PyCharm).",
  "Ask questions in the chat sidebar anytime.",
  "Review 'Loops & Lists' notes before starting.",
];

export default function SessionRoom() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 22);
  const [meetingLink, setMeetingLink] = useState('');
  const [linkSubmitted, setLinkSubmitted] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('id');

  useEffect(() => {
    if (timeLeft <= 0) { setSessionStarted(true); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (s) => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'learner',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage('');
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <nav style={{ background: "#fff", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, borderBottom: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#16a34a", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>E</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>EduConnect</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          <Link to="/learner-dashboard" style={{ textDecoration: "none", cursor: "pointer", fontWeight: 500, color: "#64748b", paddingBottom: 4, fontSize: 14 }}>Dashboard</Link>
          <Link to="/my-sessions" style={{ textDecoration: "none", cursor: "pointer", fontWeight: 700, color: "#16a34a", borderBottom: "2px solid #16a34a", paddingBottom: 4, fontSize: 14 }}>Sessions</Link>
          <Link to="/messages" style={{ textDecoration: "none", cursor: "pointer", fontWeight: 500, color: "#64748b", paddingBottom: 4, fontSize: 14 }}>Messages</Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button style={{ padding: "7px 16px", borderRadius: 24, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#475569" }}>Mentor Mode</button>
          <button style={{ padding: "7px 16px", borderRadius: 24, border: "none", background: "#16a34a", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Learner Mode</button>
          <div style={{ background: "#f0fdf4", borderRadius: 24, padding: "7px 14px", display: "flex", alignItems: "center", gap: 6, border: "1px solid #bbf7d0" }}>
            <span style={{ fontSize: 14 }}>💰</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#16a34a" }}>100 SC</span>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18 }}>🔔</div>
          <img src="https://i.pravatar.cc/40?img=12" alt="avatar" style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #e2e8f0" }} />
        </div>
      </nav>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, height: "calc(100vh - 64px)", overflow: "hidden" }}>

        {/* LEFT SIDEBAR */}
        <div style={{ width: 270, background: "#fff", borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", padding: "1.5rem 1.25rem", flexShrink: 0, overflowY: "auto" }}>

          {/* Mentor Info */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem", padding: "0.75rem", background: "#f8fafc", borderRadius: 12, border: "1px solid #f1f5f9" }}>
            <img src="https://i.pravatar.cc/40?img=47" alt="mentor" style={{ width: 42, height: 42, borderRadius: "50%", border: "2px solid #bbf7d0" }} />
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Dr. Sarah Mitchell</p>
              <p style={{ margin: 0, fontSize: 11, color: "#16a34a", fontWeight: 600 }}>🟢 Online • Your Mentor</p>
            </div>
          </div>

          {/* Topic */}
          <div style={{ marginBottom: "1.25rem" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 0.5rem" }}>Session Topic</p>
            <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", borderRadius: 12, padding: "1rem 1.25rem" }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.4 }}>Python Loops <span style={{ color: "#4ade80" }}>&</span> Lists</p>
              <p style={{ margin: "0.25rem 0 0", fontSize: 11, color: "#94a3b8" }}>Intermediate Level</p>
            </div>
          </div>

          {/* Balance */}
          <div style={{ background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
            <p style={{ margin: "0 0 0.25rem", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: "rgba(255,255,255,0.75)", textTransform: "uppercase" }}>💰 Balance</p>
            <p style={{ margin: "0 0 0.1rem", fontSize: 26, fontWeight: 900, color: "#fff" }}>120 <span style={{ fontSize: 14 }}>SC</span></p>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>SC available</p>
          </div>

          {/* Guidelines */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 0.875rem" }}>📋 Guidelines</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {guidelines.map((g, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "0.625rem", background: "#f8fafc", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                  <div style={{ width: 20, height: 20, background: "#dcfce7", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#16a34a", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{g}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, background: "#22c55e", borderRadius: "50%", boxShadow: "0 0 0 3px #dcfce7" }} />
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>System Ready</span>
          </div>
        </div>

        {/* CENTER */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", padding: "1.5rem", gap: "1.25rem" }}>

          {/* Countdown Hero */}
          <div style={{ background: sessionStarted ? "linear-gradient(135deg, #16a34a, #22c55e)" : "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", borderRadius: 20, padding: "2rem", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
            {!sessionStarted ? (
              <>
                <p style={{ margin: "0 0 0.5rem", fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: 500, letterSpacing: 0.5 }}>Get ready! The session is about to begin.</p>
                <div style={{ fontSize: 56, fontWeight: 900, color: "#4ade80", letterSpacing: -2, lineHeight: 1.1, margin: "0.5rem 0" }}>
                  {formatTime(timeLeft)}
                </div>
                <div style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "4px 16px", marginTop: "0.5rem" }}>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase" }}>Session Starts In</p>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 44, marginBottom: "0.5rem" }}>🎯</div>
                <p style={{ margin: "0 0 0.25rem", fontSize: 22, fontWeight: 800, color: "#fff" }}>Session is Live!</p>
                <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.75)" }}>Your session has started. Good luck!</p>
              </>
            )}
          </div>

          {/* Meeting Link Setup */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, background: "#f0fdf4", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔗</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Session Setup</h3>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Share your meeting link with the learner</p>
                </div>
              </div>
              <span style={{ background: "#fef9c3", color: "#ca8a04", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 20, letterSpacing: 0.5 }}>REQUIRED</span>
            </div>

            {!linkSubmitted ? (
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f8fafc" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>🔗</span>
                  <input
                    type="text"
                    value={meetingLink}
                    onChange={e => setMeetingLink(e.target.value)}
                    placeholder="Paste Zoom, Google Meet, or Teams link here..."
                    style={{ flex: 1, padding: "12px 0", border: "none", background: "transparent", fontSize: 13, outline: "none", color: "#0f172a" }}
                  />
                </div>
                <button onClick={() => meetingLink.trim() && setLinkSubmitted(true)}
                  style={{ padding: "12px 20px", borderRadius: 12, border: "none", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(22,163,74,0.3)" }}>
                  Submit Link ➤
                </button>
              </div>
            ) : (
              <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 12, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✅</div>
                <div>
                  <p style={{ margin: "0 0 0.2rem", fontSize: 13, fontWeight: 700, color: "#15803d" }}>Meeting link submitted successfully!</p>
                  <a href={meetingLink} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>{meetingLink}</a>
                </div>
              </div>
            )}
          </div>

          {/* Waiting Room */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
              <div style={{ width: 36, height: 36, background: "#f0fdf4", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎓</div>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Learner View: Waiting Room</h3>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Video call access for the learner</p>
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, #f8fafc, #f1f5f9)", borderRadius: 14, padding: "2rem", textAlign: "center", border: "2px dashed #e2e8f0" }}>
              <div style={{ width: 72, height: 72, background: linkSubmitted ? "#dcfce7" : "#f1f5f9", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: 32, transition: "background 0.3s" }}>
                {linkSubmitted ? "📹" : "⏳"}
              </div>
              {linkSubmitted ? (
                <>
                  <p style={{ margin: "0 0 0.25rem", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Meeting link is ready!</p>
                  <p style={{ margin: "0 0 1.25rem", fontSize: 13, color: "#64748b" }}>Click below to join your session.</p>
                  <a href={meetingLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                    <button style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(22,163,74,0.35)", display: "inline-flex", alignItems: "center", gap: 8 }}>
                      📹 Join Video Call
                    </button>
                  </a>
                </>
              ) : (
                <>
                  <p style={{ margin: "0 0 0.25rem", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Waiting for Mentor</p>
                  <p style={{ margin: "0 0 1.25rem", fontSize: 13, color: "#94a3b8" }}>Your mentor is preparing the meeting link...</p>
                  <button disabled style={{ padding: "12px 28px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#cbd5e1", fontWeight: 600, fontSize: 14, cursor: "not-allowed", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    📹 Join Video Call
                  </button>
                  <p style={{ margin: "0.75rem 0 0", fontSize: 11, color: "#cbd5e1", fontWeight: 500 }}>Activates when mentor shares the link</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR — CHAT */}
        <div style={{ width: 310, background: "#fff", borderLeft: "1px solid #f1f5f9", display: "flex", flexDirection: "column", flexShrink: 0 }}>

          {/* Chat Header */}
          <div style={{ padding: "1.125rem 1.25rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, background: "#f0fdf4", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💬</div>
              <div>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Session Chat</h3>
                <p style={{ margin: 0, fontSize: 11, color: "#22c55e", fontWeight: 600 }}>● Live</p>
              </div>
            </div>
            <div style={{ background: "#f0fdf4", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#16a34a" }}>
              {messages.length} msgs
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem", background: "#fafafa" }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: "4rem", padding: "0 1rem" }}>
                <div style={{ width: 64, height: 64, background: "#f0fdf4", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: 28 }}>💬</div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem" }}>No messages yet</p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>Start the conversation with your mentor or learner!</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === 'learner' ? "flex-end" : "flex-start" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.5 }}>
                    {msg.role === 'learner' ? 'YOU' : 'MENTOR'} · {msg.time}
                  </p>
                  <div style={{
                    maxWidth: "85%", padding: "10px 14px",
                    borderRadius: msg.role === 'learner' ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.role === 'learner' ? "linear-gradient(135deg, #16a34a, #22c55e)" : "#fff",
                    color: msg.role === 'learner' ? "#fff" : "#0f172a",
                    fontSize: 13, lineHeight: 1.5, fontWeight: 500,
                    boxShadow: msg.role === 'learner' ? "0 4px 12px rgba(22,163,74,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
                    border: msg.role !== 'learner' ? "1px solid #f1f5f9" : "none"
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #f1f5f9", background: "#fff" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", background: "#f8fafc", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: "6px 6px 6px 14px" }}>
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                style={{ flex: 1, border: "none", background: "transparent", fontSize: 13, outline: "none", color: "#0f172a", padding: "6px 0" }}
              />
              <button onClick={sendMessage}
                style={{ width: 36, height: 36, borderRadius: 12, border: "none", background: newMessage.trim() ? "#16a34a" : "#e2e8f0", color: newMessage.trim() ? "#fff" : "#94a3b8", fontSize: 14, cursor: newMessage.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}>
                ➤
              </button>
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 11, color: "#cbd5e1", textAlign: "center" }}>Press Enter to send</p>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
