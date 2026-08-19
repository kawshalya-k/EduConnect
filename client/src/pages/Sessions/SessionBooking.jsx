import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardNavbar from '../../components/Dashboard/DashboardNavbar';
import Footer from '../../components/Footer';
import { bookSession } from '../../services/sessionService';
import { fetchMentorProfile } from '../../services/mentorApi';
import axiosInstance from '../../services/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "04:00 PM - 05:00 PM",
];

const convertTo24Hour = (timeRange) => {
  const startTime = timeRange.split(' - ')[0];
  const [time, period] = startTime.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${minutes}:00`;
};

export default function SessionBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const state = location.state || {};
  const mentorId = state.mentorId || 2;
  const initialDate = state.date || '';
  const initialTime = state.time || '';

  const [mentorDetails, setMentorDetails] = useState(null);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime || timeSlots[0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const sessionCost = 50;

  useEffect(() => {
    const loadMentorAndSkills = async () => {
      try {
        const res = await fetchMentorProfile(mentorId);
        const mentorData = res.data?.mentor;
        setMentorDetails(mentorData);
        if (mentorData?.skills && mentorData.skills.length > 0) {
          setSkills(mentorData.skills);
          setSelectedSkill(mentorData.skills[0].name || mentorData.skills[0].Skill_Name);
        }
      } catch (err) {
        console.error('Error fetching mentor profile/skills:', err);
      }
    };

    const fetchWallet = async () => {
      if (!user?.id) return;
      try {
        const res = await axiosInstance.get(`/wallet/${user.id}`);
        setWalletBalance(res.data.balance || 0);
      } catch (err) {
        console.error('Error fetching wallet balance:', err);
        setWalletBalance(user?.coins || 100);
      }
    };

    loadMentorAndSkills();
    fetchWallet();
  }, [mentorId, user]);

  const handleBook = async () => {
    if (!date) { setError('Please select a date.'); return; }
    if (!selectedSkill) { setError('Please select a topic.'); return; }
    if (walletBalance < sessionCost) { setError('Insufficient Skill Coins.'); return; }

    setLoading(true);
    setError('');
    try {
      const matchedSkillId = skills.find(t => (t.name === selectedSkill || t.Skill_Name === selectedSkill))?.id 
                          || skills.find(t => (t.name === selectedSkill || t.Skill_Name === selectedSkill))?.Skill_Id 
                          || 1;

      await bookSession({
        skill_id: matchedSkillId,
        mentor_id: mentorId,
        session_type: "Online-Video",
        date: date,
        time: convertTo24Hour(time),
        duration: 60,
        cost: sessionCost
      });
      navigate('/booking-confirmed', {
        state: {
          mentor: mentorDetails?.name || "Your Mentor",
          mentorAvatar: mentorDetails?.avatar || "",
          date: date,
          time: time,
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

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8F7] font-['Inter']">
      <DashboardNavbar />

      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-8">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0a1628]">Book a Session</h1>
          <p className="text-sm text-gray-500 mt-1">Schedule a one-on-one learning session with your mentor</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left - Booking Form */}
          <div className="lg:col-span-2 space-y-4">

            {/* Mentor Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                {mentorDetails?.avatar ? (
                  <img src={mentorDetails.avatar} alt={mentorDetails.name}
                    className="w-16 h-16 rounded-xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[#E2E8F0] flex items-center justify-center font-bold text-slate-500 text-2xl">
                    {mentorDetails?.name?.slice(0, 1)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-[#0a1628]">{mentorDetails?.name || "Loading..."}</span>
                    <span className="bg-amber-50 text-amber-500 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-300">
                      ⭐ {mentorDetails?.level || "BRONZE"} MENTOR
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{mentorDetails?.title} • {mentorDetails?.university}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-500">⭐ {mentorDetails?.rating && Number(mentorDetails.rating) > 0 ? Number(mentorDetails.rating).toFixed(1) : 'No reviews'}</span>
                    <span className="text-sm text-gray-500">💬 {mentorDetails?.sessionsTaught ?? 0} Sessions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

              {/* Session Topic */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Session Topic</label>
                <div className="relative">
                  <select
                    value={selectedSkill}
                    onChange={e => setSelectedSkill(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0a1628] font-medium focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 transition-all">
                    {skills.length === 0 && <option>No verified skills available for this mentor...</option>}
                    {skills.map(s => (
                      <option key={s.id || s.Skill_Id} value={s.name || s.Skill_Name}>
                        {s.name || s.Skill_Name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▾</div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0a1628] focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Time</label>
                  <div className="relative">
                    <select
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0a1628] font-medium focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 transition-all">
                      {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▾</div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message for Mentor (Optional)</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="What are your learning goals for this session? Share details about topics or questions..."
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0a1628] focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 transition-all resize-none" />
              </div>
            </div>
          </div>

          {/* Right - Payment Summary */}
          <div className="space-y-4">

            {/* SC Payment Card */}
            <div className="bg-[#0a1628] rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-5">Skill Coins Payment</h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Current Wallet Balance</span>
                  <span className="font-bold text-white flex items-center gap-1">{walletBalance} <span className="text-yellow-400">🪙</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Session Cost (60 min)</span>
                  <span className="font-bold text-red-400 flex items-center gap-1">- {sessionCost} <span className="text-yellow-400">🪙</span></span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <span className="font-bold text-white">Remaining Balance</span>
                  <span className="font-bold text-[#10b981] flex items-center gap-1">{walletBalance - sessionCost} <span className="text-yellow-400">🪙</span></span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-white/10 rounded-xl p-3 mb-5">
                <p className="text-xs text-gray-300 leading-relaxed">
                  💡 Meeting links are created automatically upon mentor approval and available inside your Dashboard.
                </p>
              </div>

              {/* Error */}
              {error && <p className="text-red-400 text-xs text-center mb-3">{error}</p>}

              {/* Book Button */}
              <button
                onClick={handleBook}
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all"
                style={{ background: loading ? '#6b7280' : 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}>
                {loading ? 'Booking...' : 'Confirm and Book →'}
              </button>

              <p className="text-center text-xs text-gray-500 mt-3">100% REFUNDABLE UP TO 24H BEFORE SESSION</p>
            </div>

            {/* Booking Bonus */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="text-xs font-bold text-[#10b981] uppercase tracking-wider">Booking Bonus</p>
                <p className="text-sm text-gray-600 mt-0.5">Earn +10 XP for this booking!</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}