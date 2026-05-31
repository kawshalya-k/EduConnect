import React, { useState } from 'react';



const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const LightbulbIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const CoinIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const BookIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const allNotifications = [
  {
    id: 1,
    title: 'Session confirmed',
    description: 'Your tutoring session with Dr. Smith is confirmed for 4 PM today.',
    time: '2m ago',
    isUnread: true,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-500',
    icon: <CalendarIcon />,
  },
  {
    id: 2,
    title: 'Reminder: Homework Due',
    description: 'Advanced Algebra Module 4 homework is due in 3 hours.',
    time: '45m ago',
    isUnread: false,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-400',
    icon: <ClockIcon />,
  },
  {
    id: 3,
    title: 'New Badge Earned!',
    description: 'Congratulations! You\'ve earned the "Consistent Learner" badge for a 7-day streak.',
    time: '3h ago',
    isUnread: false,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-400',
    icon: <LightbulbIcon />,
  },
  {
    id: 4,
    title: 'EduCoins Received',
    description: "You've just received 50 EduCoins for completing the Physics Quiz with 100% score.",
    time: 'Yesterday',
    isUnread: false,
    iconBg: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
    icon: <CoinIcon />,
  },
  {
    id: 5,
    title: 'Course Update',
    description: 'Introduction to UI Design has been updated with new video lessons.',
    time: '2 days ago',
    isUnread: false,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    icon: <BookIcon />,
  },
];

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('All');

  const filteredNotifications = allNotifications.filter((n) => {
    if (activeTab === 'Unread') return n.isUnread;
    if (activeTab === 'Archived') return false; // No archived items in this demo
    return true;
  });

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 min-h-[calc(100vh-400px)]">
      {/* Title Section */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Notifications</h1>
          <p className="text-slate-500 text-lg">Stay updated with your learning progress</p>
        </div>
        <button className="bg-emerald-50 text-[#004231] font-semibold py-2.5 px-6 rounded-full text-sm hover:bg-emerald-100 transition-colors border border-teal-100">
          Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-8">
        {(['All', 'Unread', 'Archived']).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm transition ${
              activeTab === tab
                ? 'active-tab'
                : 'text-slate-500 hover:text-slate-700 font-medium'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg font-medium">No notifications here</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white p-5 rounded-2xl flex items-start gap-4 border border-gray-50 shadow-sm relative notification-card transition-all cursor-pointer"
            >
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${notification.iconBg} ${notification.iconColor}`}
              >
                {notification.icon}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-800">{notification.title}</h3>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400 mb-2">{notification.time}</span>
                    {notification.isUnread && (
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-slate-500 text-sm mt-0.5">{notification.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Older Button */}
      <div className="mt-10 text-center">
        <button className="inline-flex items-center gap-2 text-[#00c38b] font-semibold hover:text-[#004231] transition-colors">
          View older notifications
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 9l-7 7-7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    </main>
  );
};

export default Notifications;
