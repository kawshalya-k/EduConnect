import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyNotifications, markAllAsRead, markAsRead, deleteNotification } from '../services/notificationService';
import Footer from '../components/Footer';

const typeConfig = {
  session: { icon: "📅", bg: "#ecfdf5", color: "#10b981", label: "Session" },
  payment: { icon: "💰", bg: "#fffbeb", color: "#f59e0b", label: "Payment" },
  achievement: { icon: "🏆", bg: "#f5f3ff", color: "#8b5cf6", label: "Achievement" },
  system: { icon: "🔔", bg: "#eff6ff", color: "#3b82f6", label: "System" },
  admin: { icon: "⚙️", bg: "#fef2f2", color: "#ef4444", label: "Admin" },
};

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      fetchNotifications();
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'Unread') return !n.Is_Read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.Is_Read).length;

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <nav style={{ background: "#fff", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "#10b981", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>E</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#0a1628" }}>EduConnect</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Dashboard", "Sessions", "Messages"].map(n => (
            <span key={n} style={{ cursor: "pointer", fontWeight: 500, color: "#64748b", fontSize: 14 }}>{n}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 20, cursor: "pointer" }}>🔔</span>
            {unreadCount > 0 && (
              <div style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, background: "#ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>{unreadCount}</div>
            )}
          </div>
          <img src="https://i.pravatar.cc/40?img=12" alt="avatar" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #e2e8f0" }} />
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ flex: 1, maxWidth: 800, width: "100%", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ margin: "0 0 0.25rem", fontSize: 28, fontWeight: 900, color: "#0a1628" }}>Notifications</h1>
            <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Stay updated with your learning progress</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {unreadCount > 0 && (
              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 20, padding: "4px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, background: "#10b981", borderRadius: "50%" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#065f46" }}>{unreadCount} unread</span>
              </div>
            )}
            <button onClick={handleMarkAllRead}
              style={{ padding: "8px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#10b981", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              ✓ Mark all as read
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 12, padding: 4, marginBottom: "1.5rem", width: "fit-content" }}>
          {['All', 'Unread'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: "8px 20px", borderRadius: 10, border: "none", background: activeTab === tab ? "#fff" : "transparent", color: activeTab === tab ? "#0a1628" : "#64748b", fontWeight: activeTab === tab ? 700 : 500, fontSize: 13, cursor: "pointer", boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}>
              {tab}
              {tab === 'Unread' && unreadCount > 0 && (
                <span style={{ marginLeft: 6, background: "#10b981", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 10 }}>{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#10b981" }}>
            <div style={{ fontSize: 32, marginBottom: "1rem" }}>⏳</div>
            <p style={{ fontSize: 14, color: "#64748b" }}>Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>🔔</div>
            <h3 style={{ margin: "0 0 0.5rem", fontSize: 18, fontWeight: 700, color: "#0a1628" }}>No notifications yet</h3>
            <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filteredNotifications.map((notif, i) => {
              const config = typeConfig[notif.Type] || typeConfig.system;
              return (
                <div key={notif.Notification_Id || i}
                  style={{ background: "#fff", borderRadius: 16, padding: "1.25rem 1.5rem", display: "flex", alignItems: "flex-start", gap: "1rem", boxShadow: notif.Is_Read ? "0 1px 3px rgba(0,0,0,0.04)" : "0 2px 8px rgba(16,185,129,0.1)", border: notif.Is_Read ? "1px solid #e2e8f0" : "1px solid #a7f3d0", transition: "all 0.2s", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>

                  {/* Icon */}
                  <div style={{ width: 48, height: 48, background: config.bg, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.375rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <h4 style={{ margin: 0, fontSize: 14, fontWeight: notif.Is_Read ? 600 : 700, color: "#0a1628" }}>{notif.Title}</h4>
                        {!notif.Is_Read && (
                          <div style={{ width: 8, height: 8, background: "#10b981", borderRadius: "50%", flexShrink: 0 }} />
                        )}
                      </div>
                      <span style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", marginLeft: 8 }}>{formatTime(notif.Created_At)}</span>
                    </div>
                    <p style={{ margin: "0 0 0.75rem", fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{notif.Message}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: config.bg, color: config.color }}>{config.label}</span>
                      {!notif.Is_Read && (
                        <button onClick={() => handleMarkRead(notif.Notification_Id)}
                          style={{ fontSize: 11, fontWeight: 600, color: "#10b981", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                          Mark as read
                        </button>
                      )}
                      <button onClick={() => handleDelete(notif.Notification_Id)}
                        style={{ fontSize: 11, fontWeight: 600, color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: "auto" }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
