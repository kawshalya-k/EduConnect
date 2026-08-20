import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardNavbar from '../../components/Dashboard/DashboardNavbar';
import Footer from '../../components/Footer';
import axiosInstance from '../../services/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const guidelines = [
  "Keep your microphone muted unless speaking.",
  "Prepare your learning environment before the session.",
  "Ask questions in the chat sidebar anytime.",
  "Review session materials before starting.",
];

export default function SessionRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('id');
  const { user } = useAuth();

  const [sessionDetails, setSessionDetails] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [submittedLink, setSubmittedLink] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const chatEndRef = useRef(null);

  const getSessionStart = () => {
    if (!sessionDetails?.Date || !sessionDetails?.Time) return null;
    try {
      const dStr = sessionDetails.Date.includes('T') 
        ? sessionDetails.Date.split('T')[0] 
        : sessionDetails.Date;
      const tStr = sessionDetails.Time;
      const [yy, mm, dd] = dStr.split('-').map(Number);
      const [hh, min, sec] = tStr.split(':').map(Number);
      return new Date(yy, mm - 1, dd, hh || 0, min || 0, sec || 0);
    } catch (e) {
      console.error("Error parsing session start date:", e);
      return null;
    }
  };

  const statusUpdatingRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!sessionDetails) return;

      const sessionStart = getSessionStart();
      if (!sessionStart) return;

      const now = new Date();
      const durationMs = (sessionDetails.Duration || 60) * 60 * 1000;
      const startTime = sessionStart.getTime();
      const endTime = startTime + durationMs;
      const nowTime = now.getTime();

      if (nowTime < startTime) {
        setTimeLeft(Math.max(0, Math.floor((startTime - nowTime) / 1000)));
      } else if (nowTime >= startTime && nowTime < endTime) {
        setTimeLeft(Math.max(0, Math.floor((endTime - nowTime) / 1000)));
        if (sessionDetails.Status !== 'In-Session' && sessionDetails.Status !== 'Completed' && sessionDetails.Status !== 'Cancelled' && !statusUpdatingRef.current) {
          statusUpdatingRef.current = true;
          setSessionDetails(prev => ({ ...prev, Status: 'In-Session' }));
          axiosInstance.put(`/sessions/${sessionDetails.Session_Id}/status`, { status: 'In-Session' })
            .catch(err => console.error("Error setting session to In-Session:", err))
            .finally(() => { statusUpdatingRef.current = false; });
        }
      } else {
        setTimeLeft(0);
        if (sessionDetails.Status !== 'Completed' && sessionDetails.Status !== 'Cancelled' && !statusUpdatingRef.current) {
          statusUpdatingRef.current = true;
          setSessionDetails(prev => ({ ...prev, Status: 'Completed' }));
          axiosInstance.put(`/sessions/${sessionDetails.Session_Id}/status`, { status: 'Completed' })
            .catch(err => console.error("Error setting session to Completed:", err))
            .finally(() => { statusUpdatingRef.current = false; });
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionDetails]);

  useEffect(() => {
    let activeSessionId = sessionId;

    const fetchSessionData = async () => {
      try {
        if (!activeSessionId) {
          // Fallback: Fetch last upcoming session
          const resMy = await axiosInstance.get('/sessions/my');
          const upcoming = resMy.data.filter(s => s.status !== 'Completed' && s.status !== 'Rated');
          if (upcoming.length > 0) {
            activeSessionId = upcoming[0].id;
          }
        }

        if (activeSessionId) {
          const res = await axiosInstance.get(`/sessions/${activeSessionId}`);
          setSessionDetails(res.data);
          if (res.data.Meeting_Link) {
            setSubmittedLink(res.data.Meeting_Link);
            setMeetingLink(prev => {
              if (!prev || prev === submittedLink) {
                return res.data.Meeting_Link;
              }
              return prev;
            });
          } else {
            setSubmittedLink('');
          }
        }
      } catch (err) {
        console.error('Error fetching session data:', err);
      }
    };

    const fetchWallet = async () => {
      if (!user?.id) return;
      try {
        const res = await axiosInstance.get(`/wallet/${user.id}`);
        setWalletBalance(res.data.balance || 0);
      } catch (err) {
        console.error('Error fetching wallet:', err);
        setWalletBalance(user?.coins || 100);
      }
    };

    fetchSessionData();
    fetchWallet();

    const interval = setInterval(fetchSessionData, 5000);
    return () => clearInterval(interval);
  }, [sessionId, user, submittedLink]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return '00m 00s';
    const d = Math.floor(seconds / (24 * 3600));
    const h = Math.floor((seconds % (24 * 3600)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    let res = '';
    if (d > 0) res += `${d}d `;
    if (h > 0 || d > 0) res += `${h}h `;
    res += `${m}m ${String(s).padStart(2, '0')}s`;
    return res;
  };

  const getSessionTimerState = () => {
    if (!sessionDetails) return { label: 'Session Starts In', text: 'Get ready! The session is about to begin.', color: 'text-[#10b981]' };

    const sessionStart = getSessionStart();
    if (!sessionStart) return { label: 'Session Starts In', text: 'Get ready! The session is about to begin.', color: 'text-[#10b981]' };

    const now = new Date();
    const durationMs = (sessionDetails.Duration || 60) * 60 * 1000;
    const startTime = sessionStart.getTime();
    const endTime = startTime + durationMs;
    const nowTime = now.getTime();

    if (nowTime < startTime) {
      return {
        label: 'Session Starts In',
        text: `Get ready! The session begins on ${new Date(startTime).toLocaleDateString()} at ${new Date(startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
        color: 'text-[#10b981]'
      };
    } else if (nowTime >= startTime && nowTime < endTime) {
      return {
        label: 'Session Ends In',
        text: 'The session is live! Interact with your peer.',
        color: 'text-amber-500'
      };
    } else {
      return {
        label: 'Session Completed',
        text: 'The session has ended.',
        color: 'text-gray-400'
      };
    }
  };

  const timerState = getSessionTimerState();

  const isLearner = user?.id && sessionDetails?.Learner_Id && String(user.id) === String(sessionDetails.Learner_Id);
  const isMentor = user?.id && sessionDetails?.Mentor_Id && String(user.id) === String(sessionDetails.Mentor_Id);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: newMessage,
      sender: 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage('');
  };

  const handleSubmitLink = async () => {
    if (!meetingLink.trim()) return;
    const targetSessionId = sessionId || sessionDetails?.Session_Id;
    if (!targetSessionId) return;

    let formattedLink = meetingLink.trim();
    if (formattedLink && !/^https?:\/\//i.test(formattedLink)) {
      formattedLink = 'https://' + formattedLink;
    }

    try {
      await axiosInstance.put(`/sessions/${targetSessionId}/meeting-link`, {
        meeting_link: formattedLink
      });
      setSubmittedLink(formattedLink);
      setMeetingLink(formattedLink);
      alert('Meeting link updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit meeting link');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8F7] font-['Inter']">
      <DashboardNavbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-6">
        <div className="grid grid-cols-12 gap-5">

          {/* Left Sidebar */}
          <div className="col-span-3 space-y-4">

            {/* Participant Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-xl">
                    {isLearner 
                      ? sessionDetails?.Mentor_First?.slice(0, 1) 
                      : sessionDetails?.Learner_First?.slice(0, 1) || "?"}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#10b981] rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0a1628]">
                    {isLearner
                      ? `${sessionDetails?.Mentor_First} ${sessionDetails?.Mentor_Last}`
                      : `${sessionDetails?.Learner_First} ${sessionDetails?.Learner_Last}`}
                  </p>
                  <p className="text-xs text-[#10b981] font-medium">
                    ● Online • {isLearner ? "Your Mentor" : "Your Learner"}
                  </p>
                </div>
              </div>
            </div>

            {/* Session Topic */}
            <div className="bg-[#0a1628] rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">Session Topic</p>
              <p className="font-bold text-white text-sm">{sessionDetails?.Skill_Name || "Loading Topic..."}</p>
              <p className="text-xs text-gray-400 mt-1">{sessionDetails?.Session_Type || "Online-Video"}</p>
            </div>

            {/* Wallet Balance */}
            <div className="bg-[#10b981] rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-white/70 uppercase tracking-wider font-bold mb-1">💰 Balance</p>
              <p className="font-bold text-white text-2xl">{walletBalance} <span className="text-sm font-medium">SC</span></p>
              <p className="text-xs text-white/70 mt-1">SC available</p>
            </div>

            {/* Guidelines */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">📋 Guidelines</p>
              <div className="space-y-2.5">
                {guidelines.map((g, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#ecfdf5] text-[#10b981] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                    <p className="text-xs text-gray-600 leading-relaxed">{g}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-6 space-y-4">

            {/* Countdown Timer */}
            <div className="bg-[#0a1628] rounded-2xl p-8 text-center shadow-sm" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%)' }}>
              <p className="text-gray-400 text-sm mb-2">{timerState.text}</p>
              <p className={`text-5xl font-black ${timerState.color} mb-3`}>{formatTime(timeLeft)}</p>
              <div className="inline-block bg-white/10 rounded-full px-4 py-1.5">
                <p className="text-white text-xs font-bold uppercase tracking-widest">{timerState.label}</p>
              </div>
            </div>

            {/* Unified Video Call Access Component (visible to both Mentor and Learner) */}
            {(isMentor || isLearner) && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ecfdf5] rounded-xl flex items-center justify-center text-lg">🎥</div>
                    <div>
                      <p className="font-bold text-sm text-[#0a1628]">Video Call Access</p>
                      <p className="text-xs text-gray-500">Join the live video call or set/update the meeting link</p>
                    </div>
                  </div>
                  {submittedLink ? (
                    <span className="text-xs font-bold text-[#10b981] bg-[#ecfdf5] px-3 py-1 rounded-full border border-emerald-200">LINK READY</span>
                  ) : (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">LINK REQUIRED</span>
                  )}
                </div>

                {submittedLink ? (
                  <div className="mb-4">
                    <a
                      href={submittedLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full block text-center bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-[0_4px_12px_rgba(16,183,127,0.2)]"
                    >
                      🎥 Join Video Call (Opens External Page)
                    </a>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-center border border-dashed border-gray-200 mb-4">
                    <p className="text-2xl mb-2">⏳</p>
                    <p className="font-bold text-sm text-[#0a1628]">Waiting for Meeting Link</p>
                    <p className="text-xs text-gray-500 mt-1">Please enter a meeting link below to generate the join button.</p>
                  </div>
                )}

                {/* Paste Meeting Link Input */}
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Paste Zoom, Google Meet, or Teams link here:</p>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={meetingLink}
                      onChange={e => setMeetingLink(e.target.value)}
                      placeholder="Paste Zoom, Google Meet, or Teams link here..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 transition-all"
                    />
                    <button
                      onClick={handleSubmitLink}
                      className="bg-[#0a1628] hover:bg-[#1e3a5f] text-white font-bold text-sm px-5 py-3 rounded-xl transition-all whitespace-nowrap"
                    >
                      Submit Link
                    </button>
                  </div>
                </div>
              </div>
            )}
            </div>

          {/* Right - Chat */}
          <div className="col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full" style={{ minHeight: '560px' }}>

              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[#0a1628]">Session Chat</p>
                  <p className="text-xs text-[#10b981] font-medium">● Live</p>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{messages.length} msgs</span>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="text-4xl mb-3">💬</div>
                    <p className="text-sm font-medium text-gray-500">No messages yet</p>
                    <p className="text-xs text-gray-400 mt-1">Start the conversation with your mentor or learner!</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className="flex flex-col items-end">
                      <div className="bg-[#10b981] text-white text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-[85%]">
                        {msg.text}
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#10b981] transition-all" />
                  <button
                    onClick={handleSendMessage}
                    className="w-8 h-8 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0">
                    ➤
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}