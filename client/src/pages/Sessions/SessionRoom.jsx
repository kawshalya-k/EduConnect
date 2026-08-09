import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../../components/Dashboard/DashboardNavbar';
import Footer from '../../components/Footer';
import axiosInstance from '../../services/axiosConfig';

const guidelines = [
  "Keep your microphone muted unless speaking.",
  "Prepare your learning environment before the session.",
  "Ask questions in the chat sidebar anytime.",
  "Review session materials before starting.",
];

export default function SessionRoom() {
  const navigate = useNavigate();
  const [meetingLink, setMeetingLink] = useState('');
  const [submittedLink, setSubmittedLink] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [walletBalance, setWalletBalance] = useState(120);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${String(s).padStart(2, '0')}s`;
  };

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

  const handleSubmitLink = () => {
    if (!meetingLink.trim()) return;
    setSubmittedLink(meetingLink);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8F7] font-['Inter']">
      <DashboardNavbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-6">
        <div className="grid grid-cols-12 gap-5">

          {/* Left Sidebar */}
          <div className="col-span-3 space-y-4">

            {/* Mentor Info */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <img src="https://i.pravatar.cc/48?img=47" alt="mentor"
                    className="w-12 h-12 rounded-xl object-cover" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#10b981] rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0a1628]">Dr. Sarah Mitchell</p>
                  <p className="text-xs text-[#10b981] font-medium">● Online • Your Mentor</p>
                </div>
              </div>
            </div>

            {/* Session Topic */}
            <div className="bg-[#0a1628] rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">Session Topic</p>
              <p className="font-bold text-white text-sm">Python Loops <span className="text-[#10b981]">&</span> Lists</p>
              <p className="text-xs text-gray-400 mt-1">Intermediate Level</p>
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
              <p className="text-gray-400 text-sm mb-2">Get ready! The session is about to begin.</p>
              <p className="text-5xl font-black text-[#10b981] mb-3">{formatTime(timeLeft)}</p>
              <div className="inline-block bg-white/10 rounded-full px-4 py-1.5">
                <p className="text-white text-xs font-bold uppercase tracking-widest">Session Starts In</p>
              </div>
            </div>

            {/* Session Setup - Mentor submits link */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#ecfdf5] rounded-xl flex items-center justify-center text-lg">🔗</div>
                  <div>
                    <p className="font-bold text-sm text-[#0a1628]">Session Setup</p>
                    <p className="text-xs text-gray-500">Share your meeting link with the learner</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">REQUIRED</span>
              </div>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={meetingLink}
                  onChange={e => setMeetingLink(e.target.value)}
                  placeholder="Paste Zoom, Google Meet, or Teams link here..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 transition-all" />
                <button
                  onClick={handleSubmitLink}
                  className="bg-[#10b981] hover:bg-[#059669] text-white font-bold text-sm px-5 py-3 rounded-xl transition-all whitespace-nowrap">
                  Submit Link ▶
                </button>
              </div>
            </div>

            {/* Learner View - Waiting Room / Join */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#ecfdf5] rounded-xl flex items-center justify-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/EduConnect_logo.svg/32px-EduConnect_logo.svg.png"
                    alt="E" className="w-6 h-6"
                    onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-[#10b981] font-black text-lg">E</span>'; }} />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0a1628]">Learner View: Waiting Room</p>
                  <p className="text-xs text-gray-500">Video call access for the learner</p>
                </div>
              </div>

              {submittedLink ? (
                <a href={submittedLink} target="_blank" rel="noreferrer"
                  className="w-full block text-center bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 rounded-xl transition-all text-sm">
                  🎥 Join Video Call
                </a>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200">
                  <p className="text-3xl mb-3">⏳</p>
                  <p className="font-bold text-sm text-[#0a1628]">Waiting for Mentor</p>
                  <p className="text-xs text-gray-500 mt-1">Your mentor is preparing the meeting link...</p>
                </div>
              )}
            </div>
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