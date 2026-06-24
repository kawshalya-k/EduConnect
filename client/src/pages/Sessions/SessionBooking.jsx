import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../../components/Footer';
import { bookSession } from '../../services/sessionService';
import axiosInstance from '../../services/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import CoinDeductionModal from '../../components/Gamification/CoinDeductionModal';

export default function SessionBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateSkillCoins } = useAuth();

  // Get initial values from location state
  const stateData = location.state || {};
  const mentorId = stateData.mentorId || 2; // fallback

  const [mentor, setMentor] = useState(null);
  const [topics, setTopics] = useState([]);
  const [topicId, setTopicId] = useState('');
  const [topicName, setTopicName] = useState('');
  
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [walletBalance, setWalletBalance] = useState(user?.skillCoins || 0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const sessionCost = 50;

  // 1. Fetch Mentor Details & User Balance
  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const res = await axiosInstance.get(`/mentors/profile/${mentorId}`);
        const mData = res.data?.mentor;
        setMentor(mData);
        if (mData && mData.skills && mData.skills.length > 0) {
          setTopics(mData.skills);
          setTopicId(mData.skills[0].id);
          setTopicName(mData.skills[0].name);
        }
      } catch (err) {
        console.error('Error fetching mentor details:', err);
        setError('Could not load mentor details.');
      }
    };

    const fetchBalance = async () => {
      if (!user?.id) return;
      try {
        const res = await axiosInstance.get(`/wallet/${user.id}`);
        setWalletBalance(res.data.balance);
      } catch (err) {
        console.error('Error fetching wallet balance:', err);
      }
    };

    fetchMentorData();
    fetchBalance();
  }, [mentorId, user?.id]);

  // 2. Fetch Availability when Date changes
  useEffect(() => {
    if (!date) return;
    const fetchSlots = async () => {
      try {
        const res = await axiosInstance.get(`/sessions/availability/${mentorId}`, {
          params: { date }
        });
        const fetchedSlots = res.data.slots || [];
        setSlots(fetchedSlots);
        
        // Auto-select first available slot if any
        const firstAvailable = fetchedSlots.find(s => s.available);
        if (firstAvailable) {
          setSelectedTimeSlot(firstAvailable.value);
        } else {
          setSelectedTimeSlot("");
        }
      } catch (err) {
        console.error('Error fetching availability:', err);
      }
    };
    fetchSlots();
  }, [date, mentorId]);

  const handleBookClick = (e) => {
    e.preventDefault();
    if (!date) {
      setError('Please select a date.');
      return;
    }
    if (!selectedTimeSlot) {
      setError('Please select an available time slot.');
      return;
    }
    setError('');
    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setError('');
    try {
      // Find selected slot label to pass in confirmation
      const activeSlot = slots.find(s => s.value === selectedTimeSlot);
      const slotLabel = activeSlot ? activeSlot.label : selectedTimeSlot;

      const response = await bookSession({
        skill_id: topicId,
        mentor_id: mentorId,
        session_type: "Online-Video",
        date: date,
        time: selectedTimeSlot,
        duration: 60,
        cost: sessionCost
      });

      // Deduct coins locally in AuthContext
      updateSkillCoins(-sessionCost);

      navigate('/booking-confirmed', { 
        state: { 
          mentor: mentor?.name || "Mentor",
          date: date,
          time: slotLabel,
          coinsDeducted: sessionCost,
          remainingBalance: walletBalance - sessionCost
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const levelIcon = mentor?.level === 'GOLD' ? '🏆' : mentor?.level === 'SILVER' ? '⭐' : '🥉';
  const remaining = walletBalance - sessionCost;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f5f6fa", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav style={{ background: "#fff", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, borderBottom: "1px solid #eee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: "#1a7a4a", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>E</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>EduConnect</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Dashboard", "Sessions", "Messages"].map(n => {
            const path = n === "Dashboard" ? "/dashboard" : n === "Sessions" ? "/my-sessions" : "/messages";
            return (
              <span 
                key={n} 
                onClick={() => navigate(path)}
                style={{ cursor: "pointer", fontWeight: n === "Sessions" ? 700 : 400, color: n === "Sessions" ? "#1a7a4a" : "#555", borderBottom: n === "Sessions" ? "2px solid #1a7a4a" : "none", paddingBottom: 4, fontSize: 14 }}
              >
                {n}
              </span>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #ccc", background: "#fff", fontSize: 12, cursor: "pointer" }} onClick={() => navigate('/discovery')}>Find Mentors</button>
          <div style={{ background: "#e8f5ee", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#1a7a4a" }}>💰</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#1a7a4a" }}>{walletBalance} SC</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <img 
              src={user?.avatar || "https://i.pravatar.cc/40?img=12"} 
              alt="profile" 
              style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #e2e8f0" }} 
              onClick={() => navigate('/profile')}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>
        
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Mentor Profile Summary Card */}
          {mentor && (
            <div style={{ background: "#fff", borderRadius: 14, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1.25rem", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <img src={mentor.avatar || "https://i.pravatar.cc/80?img=47"} alt="mentor" style={{ width: 72, height: 72, borderRadius: 10, objectFit: "cover" }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 18 }}>{mentor.name}</span>
                  <span style={{ background: "#fff8e1", color: "#f59e0b", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, border: "1px solid #f59e0b" }}>
                    {levelIcon} {mentor.level?.toUpperCase()} MENTOR
                  </span>
                </div>
                <div style={{ color: "#777", fontSize: 13, marginBottom: 8 }}>{mentor.title} • {mentor.university}</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 13 }}>⭐ <strong>{mentor.rating?.toFixed(1) || '5.0'}</strong></span>
                  <span style={{ fontSize: 13 }}>🎓 {mentor.sessionsTaught || 0} Sessions</span>
                </div>
              </div>
            </div>
          )}

          {/* Booking Form */}
          <div style={{ background: "#fff", borderRadius: 14, padding: "1.5rem", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            {/* Session Topic */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Session Topic</label>
              <div style={{ position: "relative" }}>
                <select 
                  value={topicId} 
                  onChange={e => {
                    setTopicId(e.target.value);
                    const selected = topics.find(t => String(t.id) === String(e.target.value));
                    if (selected) setTopicName(selected.name);
                  }}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #e0e0e0", fontSize: 14, appearance: "none", background: "#fff", cursor: "pointer", outline: "none" }}
                >
                  {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#999" }}>▼</span>
              </div>
            </div>

            {/* Date & Time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Select Date</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>📅</span>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ width: "100%", padding: "12px 12px 12px 36px", borderRadius: 10, border: "1px solid #e0e0e0", fontSize: 14, outline: "none", boxSizing: "border-box" }} 
                  />
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Select Time</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>🕙</span>
                  <select 
                    value={selectedTimeSlot} 
                    onChange={e => setSelectedTimeSlot(e.target.value)}
                    disabled={!date || slots.length === 0}
                    style={{ width: "100%", padding: "12px 12px 12px 36px", borderRadius: 10, border: "1px solid #e0e0e0", fontSize: 14, appearance: "none", background: "#fff", cursor: "pointer", outline: "none", boxSizing: "border-box" }}
                  >
                    {!date ? (
                      <option value="">Choose date first...</option>
                    ) : slots.length === 0 ? (
                      <option value="">No slots available</option>
                    ) : (
                      slots.map(s => (
                        <option key={s.value} value={s.value} disabled={!s.available}>
                          {s.label} {!s.available ? "(Booked)" : ""}
                        </option>
                      ))
                    )}
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
                placeholder="What are your learning goals for this session? Share details about topics or questions..."
                rows={4}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #e0e0e0", fontSize: 14, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} 
              />
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Payment */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ background: "#1a3a2a", borderRadius: 14, padding: "1.5rem", color: "#fff" }}>
            <h3 style={{ margin: "0 0 1.25rem", fontSize: 16, fontWeight: 700 }}>SC Payment</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: 14 }}>
              <span style={{ color: "#aac4b4" }}>Current Wallet Balance</span>
              <span style={{ fontWeight: 700 }}>{walletBalance} 🪙</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: 14 }}>
              <span style={{ color: "#aac4b4" }}>Session Cost (60 min)</span>
              <span style={{ fontWeight: 700, color: "#f87171" }}>- {sessionCost} 🪙</span>
            </div>
            <div style={{ borderTop: "1px solid #2d5a3d", paddingTop: "1rem", display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Remaining Balance</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: remaining < 0 ? '#ef4444' : '#fff' }}>{remaining} 🪙</span>
            </div>
            
            <div style={{ background: "#1e4a32", borderRadius: 10, padding: "0.875rem", marginBottom: "1.25rem", display: "flex", gap: 10 }}>
              <span style={{ flexShrink: 0 }}>ℹ️</span>
              <p style={{ margin: 0, fontSize: 12, color: "#aac4b4", lineHeight: 1.5 }}>
                Meeting links are created automatically upon mentor approval and available inside your Dashboard.
              </p>
            </div>
            
            <button 
              onClick={handleBookClick} 
              disabled={loading || remaining < 0}
              style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: remaining < 0 ? "#475569" : (loading ? "#94a3b8" : "#22c55e"), color: "#fff", fontWeight: 700, fontSize: 15, cursor: (loading || remaining < 0) ? "not-allowed" : "pointer" }}
            >
              {remaining < 0 ? "Insufficient Balance" : (loading ? "Booking..." : "Confirm and Book →")}
            </button>
            
            {error && <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", marginTop: "1rem", marginBottom: 0 }}>{error}</p>}
            <p style={{ textAlign: "center", fontSize: 11, color: "#6b9e7e", margin: "10px 0 0" }}>
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <CoinDeductionModal 
          mentorName={mentor?.name || "Mentor"}
          skill={topicName}
          cost={sessionCost}
          currentBalance={walletBalance}
          onConfirm={handleConfirmBooking}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}
