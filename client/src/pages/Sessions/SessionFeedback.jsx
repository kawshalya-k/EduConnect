import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const tags = [
  "Clear Communication",
  "Actionable Advice",
  "Deep Expertise",
  "Encouraging",
];

export default function SessionFeedback() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    alert('Feedback submitted! Thank you 🎉');
    navigate('/');
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
      <div style={{ maxWidth: 500, margin: "3rem auto", padding: "0 1.5rem" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "2.5rem 2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", textAlign: "center" }}>

          {/* Mentor Avatar */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: "1rem" }}>
            <img src="https://i.pravatar.cc/80?img=47" alt="mentor"
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #e2e8f0" }} />
            <div style={{ position: "absolute", bottom: 4, right: 4, width: 16, height: 16, background: "#22c55e", borderRadius: "50%", border: "2px solid #fff" }} />
          </div>

          {/* Mentor Info */}
          <h2 style={{ margin: "0 0 0.25rem", fontSize: 20, fontWeight: 700, color: "#1e293b" }}>Dr. Sarah Mitchell</h2>
          <p style={{ margin: "0 0 0.25rem", fontSize: 14, color: "#22c55e", fontWeight: 600 }}>UX Strategy Expert</p>
          <p style={{ margin: "0 0 1.5rem", fontSize: 12, color: "#94a3b8" }}>Mentored for 45 mins on Oct 24, 2023</p>

          {/* Rating */}
          <h3 style={{ margin: "0 0 0.5rem", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>How was your session?</h3>
          <p style={{ margin: "0 0 1rem", fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
            Your feedback helps Sarah improve and helps others find the right mentor.
          </p>

          {/* Stars */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: "0.5rem" }}>
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                style={{ fontSize: 32, cursor: "pointer", color: star <= (hovered || rating) ? "#f59e0b" : "#e2e8f0", transition: "color 0.1s" }}>
                ★
              </span>
            ))}
          </div>
          {rating > 0 && (
            <p style={{ margin: "0 0 1.5rem", fontSize: 12, color: "#22c55e", fontWeight: 600 }}>
              {rating === 1 ? "Poor session" : rating === 2 ? "Fair session" : rating === 3 ? "Good session" : rating === 4 ? "Great session!" : "Excellent session! 🎉"}
            </p>
          )}

          {/* Feedback Textarea */}
          <div style={{ textAlign: "left", marginBottom: "1.25rem" }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 8 }}>
              Would you like to share more details? (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="What did you learn? How can Sarah improve?"
              rows={4}
              style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#475569" }}
            />
          </div>

          {/* Tags */}
          <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 10 }}>
              What did Sarah excel at?
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tags.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)}
                  style={{
                    padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    border: selectedTags.includes(tag) ? "2px solid #1a7a4a" : "2px solid #e2e8f0",
                    background: selectedTags.includes(tag) ? "#e8f5ee" : "#fff",
                    color: selectedTags.includes(tag) ? "#1a7a4a" : "#475569",
                    transition: "all 0.2s"
                  }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button onClick={handleSubmit}
            style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
            Submit Feedback →
          </button>

          <p style={{ margin: "10px 0 0", fontSize: 11, color: "#94a3b8" }}>
            By submitting, you agree to our <span style={{ color: "#1a7a4a", cursor: "pointer" }}>Community Guidelines</span>
          </p>

        </div>
      </div>
    </div>
  );
}