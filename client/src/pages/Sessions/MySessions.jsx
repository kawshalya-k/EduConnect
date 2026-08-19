import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../services/axiosConfig';
import DashboardNavbar from '../../components/Dashboard/DashboardNavbar';
import Footer from '../../components/Footer';



const SidebarItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex flex-row items-center p-3 gap-3 w-full h-11 rounded-3xl cursor-pointer transition-colors ${active
      ? 'bg-[#10B77F] shadow-[0_10px_15px_-3px_rgba(16,183,127,0.2),0_4px_6px_-4px_rgba(16,183,127,0.2)]'
      : 'hover:bg-[#10B77F]/5'
      }`}
  >
    <div className={`w-5 h-5 flex items-center justify-center ${active ? 'text-white' : 'text-[#475569]'}`}>
      {icon}
    </div>
    <span className={`font-sans font-medium text-sm leading-5 ${active ? 'text-white' : 'text-[#475569]'}`}>
      {label}
    </span>
  </div>
);

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
        const learnerSessions = (rawData || []).filter(s => String(s.Learner_Id) === String(user.id));
        const transformed = learnerSessions.map(s => {
          let sessionStart = null;
          try {
            if (s.Date) {
              const localDate = new Date(s.Date);
              const yy = localDate.getFullYear();
              const mm = localDate.getMonth();
              const dd = localDate.getDate();
              const tStr = s.Time || '00:00:00';
              const [hh, min, sec] = tStr.split(':').map(Number);
              sessionStart = new Date(yy, mm, dd, hh || 0, min || 0, sec || 0);
            }
          } catch (e) {
            sessionStart = null;
          }

          const durationMs = (s.Duration || 60) * 60 * 1000;
          const endTime = sessionStart ? sessionStart.getTime() + durationMs : 0;
          const isPast = endTime ? Date.now() > endTime : false;

          const dateLabel = sessionStart 
            ? sessionStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'TBD';

          const timeLabel = sessionStart
            ? sessionStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : 'TBD';

          return {
            id: s.Session_Id,
            mentor: `${s.Mentor_First || ''} ${s.Mentor_Last || ''}`.trim(),
            image: s.Mentor_Avatar || '/default-avatar.svg',
            skill: s.Skill_Name || 'Mentoring',
            topic: s.Skill_Name || 'Session',
            date: dateLabel,
            time: timeLabel,
            status: s.Status || 'Scheduled',
            meetingType: s.Meeting_Link ? 'Online' : 'In-Person',
            isPast,
            rawStatus: s.Status
          };
        });
        setSessions(transformed);
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user?.id]);

  const statusColors = {
    SCHEDULED: "#22c55e",
    COMPLETED: "#3b82f6",
    CANCELLED: "#ef4444",
  };

  if (loading) return <div style={{ padding: "3rem", textAlign: "center", color: "#16a34a" }}>Loading sessions...</div>;
  return (
    <div className="flex flex-col relative w-full min-h-screen bg-[#F6F8F7]">
      <DashboardNavbar />

      <div className="flex flex-col items-start w-full max-w-[1280px] mx-auto z-0 flex-1">
        {/* Breadcrumbs */}
        <div className="flex flex-row items-center pt-[30px] pb-[10px] pl-[80px] gap-2 w-full h-[60px]">
          <span className="font-sans font-normal text-sm leading-5 text-[#64748B]">Dashboard</span>
          <svg viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[3.7px] h-1.5 text-[#64748B]">
            <path d="M1 1L3 3L1 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-sans font-medium text-sm leading-5 text-[#0F172A]">My Sessions</span>
        </div>

        {/* Content Container */}
        <div className="flex flex-row items-start w-full h-full">

          {/* Sidebar */}
          <aside className="hidden md:flex flex-col items-start p-6 gap-6 w-[256px] bg-white border-r border-[#10B77F]/10 min-h-[1154px]">
            <div className="flex flex-col items-start gap-1 w-full">
              <SidebarItem
                icon={<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]"><path d="M3 13H10V3H3V13ZM3 21H10V15H3V21ZM12 21H21V11H12V21ZM12 3V9H21V3H12Z" fill="currentColor" /></svg>}
                label="Dashboard"
                active={false}
                onClick={() => navigate('/dashboard')}
              />
              <SidebarItem
                icon={<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" /></svg>}
                label="Mentors"
                active={false}
                onClick={() => navigate('/find-mentor')}
              />
              <SidebarItem
                icon={<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]"><path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="currentColor" /></svg>}
                label="My Sessions"
                active={true}
                onClick={() => { }}
              />
              <SidebarItem
                icon={<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]"><path d="M12 15L17.29 18.27L15.87 12.24L20.61 8.24L14.45 7.73L12 2L9.55 7.73L3.39 8.24L8.13 12.24L6.71 18.27L12 15Z" fill="currentColor" /></svg>}
                label="Badges and Achievements"
                active={false}
                onClick={() => navigate('/badges')}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex flex-col items-start p-8 gap-8 w-full max-w-[1024px]">
            {/* Title & Desc */}
            <div className="flex flex-col items-start gap-2 w-full max-w-[960px]">
              <h1 className="font-sans font-bold text-[30px] leading-9 text-[#0F172A]">My Sessions</h1>
              <p className="font-sans font-normal text-base text-[#64748B]">Manage your learning journey and upcoming meetings.</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-row items-start w-full max-w-[960px] border-b border-[#10B77F]/10 h-[55px]">
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
