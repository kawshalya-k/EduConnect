import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../../components/Dashboard/DashboardNavbar';
import Footer from '../../components/Footer';

export default function BookingConfirmed() {
  const navigate = useNavigate();
  const session = {
    mentor: "Dr. Sarah Mitchell",
    mentorImg: "https://i.pravatar.cc/80?img=47",
    date: "Oct 24, 2024 • 10:00 AM",
    type: "Online Session",
    coinsDeducted: "200",
    remainingBalance: "1,050",
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8F7] font-['Inter']">
      <DashboardNavbar />
      
      <main className="flex flex-col items-center flex-grow py-10 px-6">
        <div className="w-full max-w-[672px] bg-white border border-[#10B77F]/10 shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[24px] overflow-hidden">
          
          {/* Top Background Gradient */}
          <div className="w-full h-[284px] bg-gradient-to-b from-[#10B77F]/5 to-transparent flex flex-col items-center pt-8 px-8">
            
            {/* Checkmark Icon Container */}
            <div className="mb-6 relative">
              <div className="w-20 h-20 bg-[#10B77F] rounded-full flex items-center justify-center relative z-10">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[30px] h-[30px] text-white">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="absolute inset-0 bg-white/0 shadow-[0_10px_15px_-3px_rgba(16,183,127,0.2),0_4px_6px_-4px_rgba(16,183,127,0.2)] rounded-full z-0"></div>
            </div>

            <div className="text-center mb-2">
              <h1 className="text-[#0F172A] font-bold text-[30px] leading-[36px]">Booking Confirmed!</h1>
            </div>
            
            <div className="text-center max-w-[448px]">
              <p className="text-[#475569] font-normal text-base leading-6">
                Your session with {session.mentor} has been successfully scheduled. We've sent the meeting link and calendar invite to your email.
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="px-8 pb-12 flex flex-col items-center">
            
            <div className="w-full bg-[#F6F8F7] border border-[#10B77F]/5 rounded-[24px] p-6 flex gap-6 mb-8">
              
              {/* Session Details */}
              <div className="flex-1 flex flex-col gap-4">
                <h3 className="text-[#10B77F] font-bold text-xs leading-4 tracking-[0.6px] uppercase">Session Details</h3>
                
                <div className="flex flex-col gap-4">
                  {/* Mentor */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 border-2 border-[#10B77F]/20 rounded-full overflow-hidden shrink-0">
                      <img src={session.mentorImg} alt="mentor" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[#64748B] text-sm leading-5">Mentor</p>
                      <p className="text-[#0F172A] font-semibold text-base leading-6">{session.mentor}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#10B77F]/10 rounded-[16px] flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[20px] text-[#10B77F]">
                        <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM9 14H7V12H9V14ZM13 14H11V12H13V14ZM17 14H15V12H17V14ZM9 18H7V16H9V18ZM13 18H11V16H13V18ZM17 18H15V16H17V18Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#64748B] text-sm leading-5">Date & Time</p>
                      <p className="text-[#0F172A] font-semibold text-base leading-6">{session.date}</p>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#10B77F]/10 rounded-[16px] flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-4 text-[#10B77F]">
                        <path d="M17 10.5V7C17 6.44772 16.5523 6 16 6H4C3.44772 6 3 6.44772 3 7V17C3 17.5523 3.44772 18 4 18H16C16.5523 18 17 17.5523 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#64748B] text-sm leading-5">Type</p>
                      <p className="text-[#0F172A] font-semibold text-base leading-6">{session.type}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="w-px bg-[#10B77F]/10"></div>

              {/* Payment Summary */}
              <div className="flex-1 flex flex-col gap-4">
                <h3 className="text-[#10B77F] font-bold text-xs leading-4 tracking-[0.6px] uppercase">Payment Summary</h3>
                
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center py-2 border-b border-[#10B77F]/5 mb-2">
                    <span className="text-[#475569] text-base leading-6">Skill Wallet Deducted</span>
                    <span className="text-[#EF4444] font-bold text-base leading-6">-{session.coinsDeducted} SC</span>
                  </div>

                  <div className="flex justify-between items-center py-2 mb-2">
                    <span className="text-[#475569] text-base leading-6">Remaining Balance</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 bg-[#10B77F] text-white flex items-center justify-center rounded-full">
                         <svg viewBox="0 0 24 24" fill="none" className="w-2.5 h-2.5">
                           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
                           <path d="M12 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor"/>
                         </svg>
                      </div>
                      <span className="text-[#0F172A] font-bold text-base leading-6">{session.remainingBalance} SC</span>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-[#10B77F]/5 rounded-[16px] p-3 flex gap-2 items-start mt-auto">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#10B77F] mt-0.5 shrink-0">
                      <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                    </svg>
                    <p className="text-[#10B77F] font-medium text-[12px] leading-[16px]">
                      You can cancel or reschedule this session up to 24 hours before the start time for a full refund.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 w-full">
              <button 
                onClick={() => navigate('/my-sessions')}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-[#10B77F] rounded-full text-white font-bold text-base shadow-[0_4px_6px_-1px_rgba(16,183,127,0.2),0_2px_4px_-2px_rgba(16,183,127,0.2)] hover:bg-[#0ea873] transition-colors w-[232px]"
              >
                Go to My Sessions
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <button 
                className="flex items-center justify-center gap-2 px-8 py-3 bg-[#F1F5F9] rounded-full text-[#0F172A] font-bold text-base hover:bg-[#e2e8f0] transition-colors w-[147px]"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#0F172A]">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Receipt
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}