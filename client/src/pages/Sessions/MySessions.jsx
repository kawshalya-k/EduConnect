import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../services/axiosConfig';
import DashboardNavbar from '../../components/Dashboard/DashboardNavbar';
import Footer from '../../components/Footer';
import LearnerSidebar from '../../components/LearnerSidebar';
import '../Mentor/MentorDashboard.css';

export default function MySessions() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?.id) return;
      try {
        const res = await axiosInstance.get('/sessions/my');
        const rawData = res.data;

        const mapped = rawData.map(s => {
          const start = new Date(s.Date);
          const yy = start.getFullYear();
          const mm = start.getMonth();
          const dd = start.getDate();
          const tStr = s.Time || '00:00:00';
          const [hh, min, sec] = tStr.split(':').map(Number);
          const localStart = new Date(yy, mm, dd, hh || 0, min || 0, sec || 0);

          const duration = s.Duration || 60;
          const localEnd = new Date(localStart.getTime() + duration * 60 * 1000);

          const now = new Date();
          const isPast = now > localEnd;

          let displayStatus = s.Status;
          if (isPast && s.Status !== 'Cancelled') {
            displayStatus = 'Completed';
          }

          return {
            id: s.Session_Id,
            mentor: s.Mentor_Name || 'Mentor',
            mentorId: s.Mentor_Id,
            skill: s.Skill_Name || 'General Mentorship',
            date: localStart.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }) + ' • ' + localStart.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            rawStatus: s.Status,
            status: displayStatus.toUpperCase(),
            image: s.Mentor_Avatar || '/default-avatar.svg',
            meetingLink: s.Meeting_Link || '',
            isPast,
            rawDate: s.Date,
            rawTime: s.Time,
            _start: localStart,
            _end: localEnd
          };
        });

        setSessions(mapped);
      } catch (err) {
        console.error('Error fetching sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user?.id]);

  if (loading) return <div style={{ padding: "3rem", textAlign: "center", color: "#16a34a" }}>Loading sessions...</div>;
  return (
    <div className="flex flex-col relative w-full min-h-screen bg-[#F6F8F7]">
      <DashboardNavbar />

      <div className="dash-layout">
        <LearnerSidebar />

        <div className="dash-content" style={{ display: 'block', width: '100%' }}>
          {/* Breadcrumbs */}
          <div className="flex flex-row items-center pt-2 pb-4 gap-2 w-full">
            <Link to="/dashboard" className="font-sans font-normal text-sm leading-5 text-[#64748B] hover:underline">Dashboard</Link>
            <svg viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[3.7px] h-1.5 text-[#64748B]">
              <path d="M1 1L3 3L1 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-sans font-medium text-sm leading-5 text-[#0F172A]">My Sessions</span>
          </div>

          {/* Main Content */}
          <main className="flex flex-col items-start gap-8 w-full">
            {/* Title & Desc */}
            <div className="flex flex-col items-start gap-2 w-full">
              <h1 className="font-sans font-bold text-[30px] leading-9 text-[#0F172A]">My Sessions</h1>
              <p className="font-sans font-normal text-base text-[#64748B]">Manage your learning journey and upcoming meetings.</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-row items-start w-full border-b border-[#10B77F]/10 h-[55px]">
              <button
                className={`box-border flex flex-col justify-center items-center py-4 px-8 h-[54px] transition-colors ${activeTab === 'upcoming' ? 'border-b-2 border-[#10B77F] text-[#10B77F]' : 'text-[#94A3B8] hover:text-[#64748B]'}`}
                onClick={() => setActiveTab('upcoming')}
              >
                <span className="font-sans font-bold text-sm leading-5 text-center">Upcoming Sessions</span>
              </button>
              <button
                className={`box-border flex flex-col justify-center items-center py-4 px-8 h-[54px] transition-colors ${activeTab === 'past' ? 'border-b-2 border-[#10B77F] text-[#10B77F]' : 'text-[#94A3B8] hover:text-[#64748B]'}`}
                onClick={() => setActiveTab('past')}
              >
                <span className="font-sans font-bold text-sm leading-5 text-center">Past Sessions</span>
              </button>
            </div>

            {/* Content List */}
            <div className="flex flex-col items-start gap-6 w-full max-w-[960px]">

              {activeTab === 'upcoming' && sessions.filter(s => !s.isPast && s.rawStatus !== 'Completed' && s.rawStatus !== 'Cancelled').map(session => (
                <div key={session.id} className="box-border flex flex-col items-start w-full bg-white border border-[#10B77F]/10 shadow-sm rounded-3xl overflow-hidden h-[198px]">
                  <div className="flex flex-row w-full h-[196px]">
                    <div className="w-[224px] h-[196px] overflow-hidden flex-shrink-0">
                      <img src={session.image} alt={session.mentor} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-between p-6 flex-1 h-[196px]">
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="bg-[#10B77F]/10 rounded-full px-2 py-0.5">
                                <span className="text-[#10B77F] font-bold text-[10px] leading-[15px] tracking-[0.5px] uppercase">{session.status}</span>
                              </div>
                              <span className="text-[#94A3B8] font-medium text-xs leading-4">{session.skill}</span>
                            </div>
                            <h3 className="text-[#0F172A] font-bold text-xl leading-7">{session.mentor}</h3>
                            <p className="text-[#64748B] font-normal text-sm leading-5">{session.topic}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[#0F172A] font-bold text-sm leading-5">{session.date}</span>
                            <span className="text-[#64748B] font-normal text-xs leading-4">{session.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-[#10B77F]/5 w-full">
                        <div className="flex items-center gap-2">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[15px] h-[12px] text-[#10B77F]"><path d="M17 10.5V7C17 6.44772 16.5523 6 16 6H4C3.44772 6 3 6.44772 3 7V17C3 17.5523 3.44772 18 4 18H16C16.5523 18 17 17.5523 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="currentColor" /></svg>
                          <span className="text-[#10B77F] font-medium text-sm leading-5">{session.meetingType}</span>
                        </div>
                        <Link to={`/session-room?id=${session.id}`} className="bg-[#10B77F] text-white font-bold text-sm leading-5 py-2.5 px-6 rounded-2xl shadow-[0_10px_15px_-3px_rgba(16,183,127,0.2),0_4px_6px_-4px_rgba(16,183,127,0.2)] hover:bg-[#0ea873] transition-colors flex items-center justify-center">
                          Join Meeting
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {activeTab === 'upcoming' && (
                <div className="pt-8 pb-4 w-full">
                  <h2 className="text-[#94A3B8] font-bold text-xs leading-4 tracking-[1.2px] uppercase">Past Sessions Preview</h2>
                </div>
              )}

              {(activeTab === 'past' || activeTab === 'upcoming') && sessions.filter(s => s.isPast || s.rawStatus === 'Completed' || s.rawStatus === 'Cancelled').map(session => {
                const isCompleted = session.rawStatus === 'Completed';
                const containerClasses = isCompleted
                  ? "bg-[#F8FAFC] border-[#10B77F]/5"
                  : "bg-[#F8FAFC] border-[#FEE2E2]";
                const badgeBg = isCompleted ? "bg-[#E2E8F0]" : "bg-[#FEE2E2]";
                const badgeText = isCompleted ? "text-[#475569]" : "text-[#DC2626]";
                const btnClasses = isCompleted
                  ? "border-[#10B77F]/40 text-[#10B77F] hover:bg-[#10B77F]/5"
                  : "border-[#CBD5E1] text-[#94A3B8] hover:bg-slate-100";

                return (
                  <div key={session.id} className={`box-border flex flex-col items-start w-full border rounded-3xl overflow-hidden h-[172px] opacity-90 ${containerClasses}`}>
                    <div className="flex flex-row w-full h-[170px] opacity-80">
                      <div className="w-[192px] h-[170px] overflow-hidden flex-shrink-0 bg-white">
                        <img src={session.image} alt={session.mentor} className="w-full h-full object-cover mix-blend-luminosity opacity-90" />
                      </div>
                      <div className="flex flex-row justify-between items-center p-5 flex-1">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2 mb-[3.5px]">
                            <div className={`${badgeBg} rounded-full px-2 py-0.5`}>
                              <span className={`${badgeText} font-bold text-[9px] leading-[14px] tracking-[0.45px] uppercase`}>{session.status}</span>
                            </div>
                            <span className="text-[#94A3B8] font-medium text-xs leading-4">{session.skill}</span>
                          </div>
                          <h3 className="text-[#334155] font-bold text-lg leading-7">{session.mentor}</h3>
                          <p className="text-[#64748B] font-normal text-xs leading-4 mt-0.5">{session.date}</p>
                        </div>
                        <button
                          className={`border font-bold text-xs leading-4 py-1.5 px-4 rounded-2xl transition-colors ${btnClasses}`}
                          onClick={() => isCompleted ? navigate('/session-feedback', { state: { sessionId: session.id, mentorName: session.mentor || 'Your Mentor' } }) : null}                        >
                          {isCompleted ? "Rate Mentor" : "Feedback"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
