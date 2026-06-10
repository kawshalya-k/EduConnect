import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUserStatus, deleteUser } from '../../services/adminService';

const users = [
  { id: "482109", name: "Sarah Jenkins", email: "s.jenkins@stanford.edu", role: "Mentor", university: "Stanford University", coins: 2450, status: "ACTIVE", avatar: "https://i.pravatar.cc/40?img=47" },
  { id: "482110", name: "Alex Rivera", email: "arivera@mit.edu", role: "Learner", university: "MIT", coins: 890, status: "ACTIVE", avatar: "https://i.pravatar.cc/40?img=11" },
  { id: "482115", name: "Jordan Lee", email: "j.lee@oxford.ac.uk", role: "Learner", university: "Oxford University", coins: 120, status: "SUSPENDED", avatar: "https://i.pravatar.cc/40?img=25" },
  { id: "482118", name: "Marcus Chen", email: "mchen@ethz.ch", role: "Mentor", university: "ETH Zurich", coins: 5100, status: "PENDING", avatar: "https://i.pravatar.cc/40?img=13" },
  { id: "482122", name: "Elena Petrova", email: "epetrova@educonnect.com", role: "Admin", university: "Corporate", coins: 0, status: "ACTIVE", avatar: "https://i.pravatar.cc/40?img=32" },
];

const statusColors = {
  ACTIVE: { bg: "#f0fdf4", color: "#10b981" },
  SUSPENDED: { bg: "#fef2f2", color: "#ef4444" },
  PENDING: { bg: "#fffbeb", color: "#d97706" },
};

const roleColors = {
  Mentor: { bg: "#eff6ff", color: "#3b82f6" },
  Learner: { bg: "#f5f3ff", color: "#8b5cf6" },
  Admin: { bg: "#0f172a", color: "#fff" },
};

const sidebarItems = [
  { icon: "⊞", label: "Dashboard", path: "/admin/dashboard" },
  { icon: "👥", label: "User Management", path: "/admin/users" },
  { icon: "✅", label: "Skill Verifications", path: "/admin/verifications" },
  { icon: "📊", label: "Analytics", path: "/admin/analytics" },
  { icon: "⚙️", label: "Settings", path: "/admin/settings" },
];

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [activePage, setActivePage] = useState('User Management');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, status) => {
    try {
      await updateUserStatus(userId, status);
      fetchUsers();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All Roles' || u.role === roleFilter;
    const matchStatus = statusFilter === 'All Status' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  if (loading) return <div style={{ padding: "3rem", textAlign: "center", color: "#10b981" }}>Loading users...</div>;
  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Top Bar */}
      <div style={{ background: "#0f172a", padding: "0.6rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>Admin - User Management</span>
        <span style={{ color: "#94a3b8", fontSize: 12 }}>EduConnect Admin Panel v2.0</span>
      </div>

      <div style={{ display: "flex", flex: 1 }}>

        {/* Sidebar */}
        <div style={{ width: 220, background: "#fff", borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", minHeight: "calc(100vh - 40px)", flexShrink: 0 }}>
          <div style={{ padding: "1.25rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#10b981", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>E</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>EduConnect</span>
          </div>
          <div style={{ padding: "1rem 0.75rem", flex: 1 }}>
            {sidebarItems.map(item => (
              <div key={item.label} onClick={() => { setActivePage(item.label); navigate(item.path); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 4, cursor: "pointer", background: activePage === item.label ? "#f0fdf4" : "transparent", color: activePage === item.label ? "#10b981" : "#64748b", fontWeight: activePage === item.label ? 700 : 500, fontSize: 14, borderLeft: activePage === item.label ? "3px solid #10b981" : "3px solid transparent" }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
            <img src="https://i.pravatar.cc/40?img=33" alt="admin" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #bbf7d0" }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Super Admin</p>
              <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Administrator</p>
            </div>
            <span style={{ cursor: "pointer", fontSize: 16, color: "#94a3b8" }}>↪</span>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {/* Header */}
          <div style={{ background: "#fff", padding: "1.25rem 2rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>User Management</h1>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Manage and audit platform users</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: "#10b981", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(22,163,74,0.3)" }}>
                👤+ Add New User
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src="https://i.pravatar.cc/40?img=33" alt="admin" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #e2e8f0" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Alex Rivera</span>
              </div>
            </div>
          </div>

          <div style={{ padding: "1.5rem 2rem", flex: 1 }}>

            {/* Filters */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "1.25rem", marginBottom: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", display: "flex", gap: "0.875rem", alignItems: "center" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f8fafc" }}>
                <span style={{ fontSize: 16 }}>🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, email or ID..."
                  style={{ flex: 1, padding: "10px 0", border: "none", background: "transparent", fontSize: 13, outline: "none", color: "#0f172a" }}
                />
              </div>
              {[
                { value: roleFilter, setter: setRoleFilter, options: ['All Roles', 'Mentor', 'Learner', 'Admin'] },
                { value: statusFilter, setter: setStatusFilter, options: ['All Status', 'ACTIVE', 'SUSPENDED', 'PENDING'] },
              ].map((filter, i) => (
                <select key={i} value={filter.value} onChange={e => filter.setter(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: 13, color: "#475569", outline: "none", cursor: "pointer", fontWeight: 500 }}>
                  {filter.options.map(o => <option key={o}>{o}</option>)}
                </select>
              ))}
              <button style={{ padding: "10px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: 16, cursor: "pointer" }}>⚙️</button>
            </div>

            {/* Table */}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
              {/* Table Header */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 2fr 1fr 1fr 1fr", padding: "1rem 1.5rem", background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                {["USER", "EMAIL", "ROLE", "UNIVERSITY", "SKILL COINS", "STATUS", "ACTIONS"].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1 }}>{h}</span>
                ))}
              </div>

              {/* Table Rows */}
              {filtered.map((user, i) => (
                <div key={User_Id}
                  style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 2fr 1fr 1fr 1fr", padding: "1rem 1.5rem", borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none", alignItems: "center", transition: "background 0.15s", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>

                  {/* User */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
  <img src={user.avatar || 'https://i.pravatar.cc/40'} alt={user.First_Name} style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #e2e8f0", flexShrink: 0 }} />
  <div>
    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{user.First_Name} {user.Last_Name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>ID: {User_Id}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <span style={{ fontSize: 13, color: "#475569" }}>{user.Email}</span>

                  {/* Role */}
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: roleColors[user.Role]?.bg, color: roleColors[user.Role]?.color, display: "inline-block" }}>{user.Role}</span>

                  {/* University */}
                  <span style={{ fontSize: 13, color: "#475569" }}>{user.University}</span>

                  {/* Coins */}
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>💰 {(user.Wallet_Balance || 0).toLocaleString()}</span>

                  {/* Status */}
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: statusColors[user.status]?.bg, color: statusColors[user.Status]?.color, display: "inline-block" }}>{user.Status}</span>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button 
  onClick={() => handleStatusUpdate(user.User_Id, user.Status === 'Suspended' ? 'Active' : 'Suspended')}
  style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", fontSize: 12, cursor: "pointer", color: "#ef4444", fontWeight: 600 }}>
  {user.Status === 'Suspended' ? 'Restore' : 'Suspend'}
</button>
<button
  onClick={() => handleDelete(user.User_Id)}
  style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", fontSize: 12, cursor: "pointer", color: "#ef4444", fontWeight: 600 }}>
  Delete
</button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>Showing 1 to {filtered.length} of 12,482 users</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {['←', '1', '2', '3', '...', '2497', '→'].map((p, i) => (
                    <button key={i} style={{ width: 32, height: 32, borderRadius: 8, border: p === '1' ? "none" : "1px solid #e2e8f0", background: p === '1' ? "#10b981" : "#fff", color: p === '1' ? "#fff" : "#475569", fontSize: 13, fontWeight: p === '1' ? 700 : 400, cursor: "pointer" }}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
       {/* Simple Admin Footer */}
          <div style={{ background: "#022C22", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>© 2026 EduConnect. All rights reserved.</span>
          <span style={{ fontSize: 12, color: "#64748b", cursor: "pointer" }}>Help Center</span>
        </div>
    </div>
  );
}