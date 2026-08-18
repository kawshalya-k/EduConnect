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

    // Admin auth guard
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
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

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const adminName = adminUser.name || 'Super Admin';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const filtered = users.filter(u => {
    const fullName = `${u.First_Name || ''} ${u.Last_Name || ''}`.trim();
    const matchSearch = fullName.toLowerCase().includes(search.toLowerCase()) ||
      (u.Email || '').toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All Roles' || u.Role === roleFilter;
    const matchStatus = statusFilter === 'All Status' || u.Status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  if (loading) return <div style={{ padding: "3rem", textAlign: "center", color: "#10b981" }}>Loading users...</div>;
  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <nav style={{ background: "#fff", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "#10b981", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>E</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#0a1628" }}>EduConnect</span>
          <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: "#10b981", background: "#ecfdf5", padding: "3px 10px", borderRadius: 20, border: "1px solid #a7f3d0" }}>Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="https://i.pravatar.cc/40?img=33" alt="admin" style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #e2e8f0" }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0a1628" }}>{adminName}</span>
        </div>
      </nav>

      <div style={{ display: "flex", flex: 1 }}>

        {/* Sidebar */}
        <div style={{ width: 230, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "1.5rem 1rem", flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 1rem 0.5rem" }}>Main Menu</p>
            {sidebarItems.map(item => (
              <div key={item.label} onClick={() => { setActivePage(item.label); navigate(item.path); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, marginBottom: 4, cursor: "pointer", background: activePage === item.label ? "#ecfdf5" : "transparent", color: activePage === item.label ? "#10b981" : "#64748b", fontWeight: activePage === item.label ? 700 : 500, fontSize: 14, borderLeft: activePage === item.label ? "3px solid #10b981" : "3px solid transparent" }}>
                <span style={{ fontSize: 17 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "1rem", margin: "0 1rem 1rem", background: "#f8fafc", borderRadius: 14, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src="https://i.pravatar.cc/40?img=33" alt="admin" style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #a7f3d0" }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0a1628" }}>{adminName}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Super Administrator</p>
              </div>
              <span onClick={handleLogout} title="Logout" style={{ cursor: "pointer", fontSize: 16, color: "#94a3b8" }}>↪</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {/* Page Header */}
          <div style={{ background: "#fff", padding: "1.25rem 2rem", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0a1628" }}>User Management</h1>
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Manage and audit platform users</p>
            </div>
          </div>

          <div style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Controls Bar */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 13, color: "#0f172a", outline: "none", boxSizing: "border-box", background: "#fff" }}
                />
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>🔍</span>
              </div>
              {[
                { value: roleFilter, setter: setRoleFilter, options: ['All Roles', 'Student', 'Mentor', 'Admin'] },
                { value: statusFilter, setter: setStatusFilter, options: ['All Status', 'Active', 'Inactive', 'Suspended'] },
              ].map((filter, i) => (
                <select key={i} value={filter.value} onChange={e => filter.setter(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: 13, color: "#475569", outline: "none", cursor: "pointer", fontWeight: 500 }}>
                  {filter.options.map(o => <option key={o}>{o}</option>)}
                </select>
              ))}
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
                <div key={user.User_Id || i}
                  style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 2fr 1fr 1fr 1fr", padding: "1rem 1.5rem", borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none", alignItems: "center", transition: "background 0.15s" }}>

                  {/* User */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={user.avatar || 'https://i.pravatar.cc/40'} alt={user.First_Name} style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #e2e8f0", flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{user.First_Name} {user.Last_Name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>ID: {user.User_Id}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <span style={{ fontSize: 13, color: "#475569" }}>{user.Email}</span>

                  {/* Role */}
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: roleColors[user.Role]?.bg || '#f1f5f9', color: roleColors[user.Role]?.color || '#475569', display: "inline-block" }}>{user.Role}</span>

                  {/* University */}
                  <span style={{ fontSize: 13, color: "#475569" }}>{user.University || 'SLIIT'}</span>

                  {/* Coins */}
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>💰 {(user.Wallet_Balance || 0).toLocaleString()}</span>

                  {/* Status */}
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: statusColors[user.Status]?.bg || '#f1f5f9', color: statusColors[user.Status]?.color || '#475569', display: "inline-block" }}>{user.Status}</span>

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