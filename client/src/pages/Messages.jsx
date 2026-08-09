import React, { useState, useRef, useEffect } from 'react';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import PageLayout from '../components/Layout/PageLayout';

const Bubble = ({ msg }) => {
  const isMe = msg.from === 'me';
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isMe
            ? 'bg-[#10B981] text-white rounded-br-sm'
            : 'bg-white text-[#0F172A] rounded-bl-sm shadow-sm border border-slate-100'
        }`}
      >
        <p>{msg.text}</p>
        <p className={`text-[10px] mt-1 ${isMe ? 'text-white/70 text-right' : 'text-slate-400'}`}>
          {msg.time}
        </p>
      </div>
    </div>
  );
};

// ─── Empty state for the conversation list sidebar ────────────────────────────

const EmptyConversationList = () => (
  <div className="flex flex-col items-center justify-center flex-1 px-6 text-center py-12">
    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </div>
    <p className="text-sm font-medium text-slate-600">No conversations yet</p>
    <p className="text-xs text-slate-400 mt-1">Your messages will appear here once a session is booked.</p>
  </div>
);

// ─── Empty state for the thread panel (no contact selected) ──────────────────

const NoThreadSelected = () => (
  <div className="flex flex-col items-center justify-center flex-1 text-center px-8">
    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
      <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </div>
    <p className="text-sm font-medium text-slate-600">Select a conversation</p>
    <p className="text-xs text-slate-400 mt-1">Choose someone from the left to start chatting.</p>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const Messages = () => {
  // contacts will be populated by your real data source (API / context)
  const [contacts, setContacts] = useState([]);
  const [threads, setThreads] = useState({});   // { [contactId]: Message[] }
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'thread'

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const activeContact = contacts.find((c) => c.id === activeId) ?? null;
  const messages = activeId ? (threads[activeId] ?? []) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, threads]);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.role ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !activeId) return;

    const newMsg = {
      id: Date.now(),
      from: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setThreads((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), newMsg],
    }));

    // Update the contact's lastMessage preview
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, lastMessage: text, lastTime: newMsg.time }
          : c,
      ),
    );

    setDraft('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectContact = (id) => {
    setActiveId(id);
    setMobileView('thread');
    // Clear unread badge when opening a thread
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    );
  };

  const unreadCount = contacts.filter((c) => c.unread > 0).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <DashboardNavbar />

      <div className="flex-1 flex max-w-[1216px] w-full mx-auto px-4 sm:px-8 py-6 gap-5 min-h-0" style={{ height: 'calc(100vh - 64px)' }}>

        {/* ── Sidebar ───────────────────────────────────────────── */}
        <aside
          className={`${
            mobileView === 'thread' ? 'hidden' : 'flex'
          } md:flex flex-col w-full md:w-[320px] flex-shrink-0 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden`}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex-shrink-0">
            <h2 className="font-sans font-bold text-lg text-[#0F172A]">Messages</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread` : 'No unread messages'}
            </p>
          </div>

          {/* Search — only shown when there are contacts */}
          {contacts.length > 0 && (
            <div className="px-4 py-3 flex-shrink-0">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations…"
                  className="bg-transparent text-sm text-[#0F172A] placeholder-slate-400 outline-none flex-1 min-w-0"
                />
              </div>
            </div>
          )}

          {/* Contact list / empty state */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 flex flex-col">
            {contacts.length === 0 ? (
              <EmptyConversationList />
            ) : filteredContacts.length === 0 ? (
              <p className="text-center text-sm text-slate-400 mt-8">No conversations match your search.</p>
            ) : (
              filteredContacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectContact(c.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                    c.id === activeId
                      ? 'bg-[#10B981]/10 border border-[#10B981]/20'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-sm flex-shrink-0 relative"
                    style={{ backgroundColor: c.color ?? '#94A3B8' }}
                  >
                    {c.initials ?? c.name.slice(0, 2).toUpperCase()}
                    {c.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-sans font-semibold text-sm text-[#0F172A] truncate">{c.name}</span>
                      {c.lastTime && (
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{c.lastTime}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-xs text-slate-500 truncate">
                        {c.lastMessage ?? 'No messages yet'}
                      </span>
                      {c.unread > 0 && (
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#10B981] text-white text-[10px] font-bold flex items-center justify-center">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* ── Thread panel ──────────────────────────────────────── */}
        <main
          className={`${
            mobileView === 'list' ? 'hidden' : 'flex'
          } md:flex flex-col flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden min-h-0`}
        >
          {!activeContact ? (
            <NoThreadSelected />
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 flex-shrink-0">
                <button
                  onClick={() => setMobileView('list')}
                  className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                  aria-label="Back to conversations"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-white text-sm flex-shrink-0 relative"
                  style={{ backgroundColor: activeContact.color ?? '#94A3B8' }}
                >
                  {activeContact.initials ?? activeContact.name.slice(0, 2).toUpperCase()}
                  {activeContact.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-sm text-[#0F172A]">{activeContact.name}</p>
                  {activeContact.role && (
                    <p className="text-xs text-slate-400 mt-0.5">{activeContact.role}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors" aria-label="Video call">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors" aria-label="More options">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-5 py-5 bg-slate-50/40">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-3 text-white font-bold"
                      style={{ backgroundColor: activeContact.color ?? '#94A3B8' }}
                    >
                      {activeContact.initials ?? activeContact.name.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      Start a conversation with {activeContact.name}
                    </p>
                    {activeContact.role && (
                      <p className="text-xs text-slate-400 mt-1">{activeContact.role}</p>
                    )}
                  </div>
                ) : (
                  messages.map((msg) => <Bubble key={msg.id} msg={msg} />)
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input area */}
              <div className="px-4 py-3 border-t border-slate-100 flex-shrink-0">
                <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-[#10B981] focus-within:ring-2 focus-within:ring-[#10B981]/20 transition-all">
                  <textarea
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder={`Message ${activeContact.name}…`}
                    className="flex-1 bg-transparent text-sm text-[#0F172A] placeholder-slate-400 outline-none resize-none min-h-[20px] max-h-32"
                    style={{ lineHeight: '1.5' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!draft.trim()}
                    className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      draft.trim()
                        ? 'bg-[#10B981] text-white hover:bg-[#059669] shadow-sm'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                    aria-label="Send message"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
                  Press Enter to send · Shift+Enter for new line
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Messages;