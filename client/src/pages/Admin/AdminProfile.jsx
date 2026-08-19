import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminProfile, updateAdminProfile, changeAdminPassword, uploadAdminAvatar } from '../../services/adminService';

const sidebarItems = [
  { icon: "📊", label: "Dashboard",          path: "/admin/dashboard" },
  { icon: "👥", label: "User Management",    path: "/admin/users" },
  { icon: "✅", label: "Skill Verifications", path: "/admin/verifications" },
  { icon: "📈", label: "Analytics",          path: "/admin/analytics" },
  { icon: "⚙️", label: "Settings",           path: "/admin/settings" },
];

const TABS = ["Profile Info", "Security"];

// ── Helper: resolve avatar URL ────────────────────────────
// avatarUrl may be a relative path like /uploads/avatars/xxx.jpg
const resolveAvatar = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const base = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : (import.meta.env.PROD ? 'https://educonnect-production-c0d9.up.railway.app' : 'http://localhost:5000');
  return `${base}${url}`;
};

// ── Helper: sync avatar into localStorage so all pages see it ──
const syncAvatarToStorage = (avatarUrl) => {
  const cached = JSON.parse(localStorage.getItem('adminUser') || '{}');
  localStorage.setItem('adminUser', JSON.stringify({ ...cached, avatar: avatarUrl }));
};

export default function AdminProfile() {
  const navigate = useNavigate();
  const adminUserCache = JSON.parse(localStorage.getItem('adminUser') || '{}');

  // ── nav dropdown ──────────────────────────────────────────
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) navigate('/admin/login');
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // ── profile state ─────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("Profile Info");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // avatar upload
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);

  // edit form
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', university: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveError, setSaveError] = useState('');

  // password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAdminProfile();
        setProfile(data);
        setForm({
          firstName:  data.firstName  || '',
          lastName:   data.lastName   || '',
          university: data.university || '',
          bio:        data.bio        || '',
        });
        // If they already had an avatar in DB, sync it to localStorage too
        if (data.avatar) syncAvatarToStorage(data.avatar);
      } catch (err) {
        setFetchError('Could not load profile. Please refresh.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Avatar upload ─────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // local preview
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
    handleAvatarUpload(file);
  };

  const handleAvatarUpload = async (file) => {
    setAvatarUploading(true);
    setAvatarMsg('');
    setAvatarError('');
    try {
      const { avatarUrl } = await uploadAdminAvatar(file);
      const resolved = resolveAvatar(avatarUrl);
      // update profile state
      setProfile(prev => ({ ...prev, avatar: avatarUrl }));
      setAvatarPreview(resolved);
      // persist so every admin page sees it immediately
      syncAvatarToStorage(avatarUrl);
      setAvatarMsg('Profile picture updated.');
      setTimeout(() => setAvatarMsg(''), 3500);
    } catch (err) {
      setAvatarError(err.message || 'Upload failed. Try again.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg('');
    setSaveError('');
    try {
      const updated = await updateAdminProfile(form);
      setProfile(prev => ({ ...prev, ...updated }));
      const cached = JSON.parse(localStorage.getItem('adminUser') || '{}');
      localStorage.setItem('adminUser', JSON.stringify({ ...cached, name: updated.name }));
      setEditMode(false);
      setSaveMsg('Profile updated successfully.');
      setTimeout(() => setSaveMsg(''), 3500);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwMsg('');
    setPwError('');
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('New passwords do not match.'); return; }
    if (pwForm.newPassword.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    setPwSaving(true);
    try {
      await changeAdminPassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg('Password changed successfully.');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwMsg(''), 4000);
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setSaveError('');
    if (profile) setForm({ firstName: profile.firstName || '', lastName: profile.lastName || '', university: profile.university || '', bio: profile.bio || '' });
  };

  // current avatar to display (preview > profile > localStorage cache)
  const currentAvatarUrl = avatarPreview || resolveAvatar(profile?.avatar) || resolveAvatar(adminUserCache.avatar);

  const initials = profile
    ? `${(profile.firstName || '?')[0]}${(profile.lastName || '?')[0]}`.toUpperCase()
    : (adminUserCache.name || 'AD').slice(0, 2).toUpperCase();

  const pwStrength = (() => {
    const p = pwForm.newPassword;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8)  score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: 'Weak',   color: '#ef4444', width: '25%'  };
    if (score <= 3) return { label: 'Medium', color: '#f59e0b', width: '60%'  };
    return               { label: 'Strong',  color: '#10b981', width: '100%' };
  })();

  const inputStyle = (focused) => ({
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: `1.5px solid ${focused ? '#10b981' : '#e2e8f0'}`,
    fontSize: 14, color: '#0a1628', outline: 'none',
    boxSizing: 'border-box', background: '#f8fafc', transition: 'border 0.2s',
  });
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 };
  const fieldRow   = { marginBottom: '1.25rem' };

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav style={{ background: '#fff', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/src/Assets/EduConnect_Logo.png" alt="EduConnect" style={{ height: 36, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: 18, color: '#0a1628' }}>EduConnect</span>
          <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: '#10b981', background: '#ecfdf5', padding: '3px 10px', borderRadius: 20, border: '1px solid #a7f3d0' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 10, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <AdminAvatarImg url={currentAvatarUrl} initials={initials} size={36} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#0a1628' }}>{profile?.name || adminUserCache.name || 'Admin'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {dropdownOpen && (
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 200, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', overflow: 'hidden', zIndex: 100 }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0a1628' }}>{profile?.name || adminUserCache.name || 'Admin'}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>{profile?.role || adminUserCache.role || 'Administrator'}</p>
                </div>
                <button onClick={() => { setDropdownOpen(false); navigate('/admin/profile'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', background: '#ecfdf5', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#10b981', textAlign: 'left' }}>
                  <span>👤</span> Admin Profile
                </button>
                <div style={{ height: 1, background: '#f1f5f9', margin: '0 12px' }} />
                <button onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#ef4444', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  <span>↪</span> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1 }}>

        {/* ── Sidebar ──────────────────────────────────── */}
        <div style={{ width: 230, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '1.5rem 1rem', flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 1rem 0.5rem' }}>Main Menu</p>
            {sidebarItems.map(item => (
              <div key={item.label} onClick={() => navigate(item.path)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, marginBottom: 4, cursor: 'pointer', color: '#64748b', fontWeight: 500, fontSize: 14, borderLeft: '3px solid transparent', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0a1628'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
                <span style={{ fontSize: 17 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '1rem', margin: '0 1rem 1rem', background: '#f8fafc', borderRadius: 14, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AdminAvatarImg url={currentAvatarUrl} initials={initials} size={38} border="2px solid #a7f3d0" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0a1628', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.name || adminUserCache.name || 'Super Admin'}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>{profile?.role || adminUserCache.role || 'Administrator'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content ─────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '2rem', maxWidth: 860, margin: '0 auto' }}>

            <p style={{ margin: '0 0 0.5rem', fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>ADMIN / <span style={{ color: '#10b981' }}>PROFILE</span></p>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ margin: '0 0 0.25rem', fontSize: 28, fontWeight: 900, color: '#0a1628' }}>Admin Profile</h1>
              <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>Manage your personal information and account security.</p>
            </div>

            {fetchError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: 14, color: '#ef4444' }}>⚠️ {fetchError}</p>
              </div>
            )}

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: '#10b981', fontSize: 15 }}>
                <div style={{ width: 36, height: 36, border: '3px solid #a7f3d0', borderTop: '3px solid #10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginRight: 12 }} />
                Loading profile...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                {/* ── Profile Hero Card ──────────────────── */}
                <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', marginBottom: '1.5rem', overflow: 'hidden' }}>
                  <div style={{ height: 90, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
                  </div>

                  <div style={{ padding: '0 2rem 1.75rem', position: 'relative' }}>
                    {/* Avatar + upload trigger */}
                    <div style={{ position: 'relative', display: 'inline-block', marginTop: -44 }}>
                      <div style={{ width: 88, height: 88, borderRadius: '50%', border: '4px solid #fff', background: currentAvatarUrl ? 'transparent' : 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.12)', position: 'relative' }}>
                        {currentAvatarUrl
                          ? <img src={currentAvatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{initials}</span>
                        }
                        {/* Hover overlay */}
                        <div
                          onClick={() => avatarInputRef.current?.click()}
                          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s', borderRadius: '50%' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 1}
                          onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                          <span style={{ fontSize: 18 }}>📷</span>
                          <span style={{ fontSize: 9, color: '#fff', fontWeight: 700, marginTop: 2 }}>CHANGE</span>
                        </div>
                      </div>
                      {/* Online dot */}
                      <div style={{ position: 'absolute', bottom: 5, right: 5, width: 14, height: 14, background: '#10b981', border: '2px solid #fff', borderRadius: '50%' }} />
                      {avatarUploading && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: 22, height: 22, border: '3px solid #a7f3d0', borderTop: '3px solid #10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        </div>
                      )}
                    </div>

                    {/* Hidden file input */}
                    <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: 'none' }} onChange={handleAvatarChange} />

                    {/* Upload feedback */}
                    {avatarMsg && <p style={{ margin: '8px 0 0', fontSize: 12, color: '#059669', fontWeight: 600 }}>✓ {avatarMsg}</p>}
                    {avatarError && <p style={{ margin: '8px 0 0', fontSize: 12, color: '#ef4444', fontWeight: 600 }}>⚠️ {avatarError}</p>}

                    {/* Upload button (alternative to hover) */}
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={avatarUploading}
                      style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: 12, fontWeight: 700, cursor: avatarUploading ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { if (!avatarUploading) e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}>
                      📷 {avatarUploading ? 'Uploading...' : 'Change Photo'}
                    </button>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>JPG, PNG, WebP — max 3 MB</p>

                    {/* Name + badges */}
                    <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 900, color: '#0a1628' }}>{profile?.name || '—'}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981', background: '#ecfdf5', padding: '3px 10px', borderRadius: 20, border: '1px solid #a7f3d0' }}>🛡️ {profile?.role || 'Administrator'}</span>
                          <span style={{ fontSize: 12, color: '#64748b' }}>#{profile?.adminId || profile?.id || '—'}</span>
                          {profile?.university && <span style={{ fontSize: 12, color: '#64748b' }}>🏫 {profile.university}</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        {[{ label: 'Role', value: profile?.role || 'Administrator' }, { label: 'Status', value: 'Active' }, { label: 'Access', value: 'Full' }].map(s => (
                          <div key={s.label} style={{ textAlign: 'center', minWidth: 64 }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#0a1628' }}>{s.value}</p>
                            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {profile?.bio && <p style={{ margin: '14px 0 0', fontSize: 14, color: '#475569', lineHeight: 1.6, maxWidth: 560 }}>{profile.bio}</p>}
                  </div>
                </div>

                {/* ── Tabs ──────────────────────────────── */}
                <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', background: '#fff', borderRadius: 14, padding: 6, border: '1px solid #e2e8f0', width: 'fit-content' }}>
                  {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      style={{ padding: '8px 22px', borderRadius: 10, border: 'none', background: activeTab === tab ? '#10b981' : 'transparent', color: activeTab === tab ? '#fff' : '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {tab}
                    </button>
                  ))}
                </div>

                {/* ── Profile Info Tab ──────────────────── */}
                {activeTab === 'Profile Info' && (
                  <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: '#0a1628' }}>Personal Information</h3>
                        <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>Update your name, institution, and bio.</p>
                      </div>
                      {!editMode
                        ? <button onClick={() => setEditMode(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, border: '1.5px solid #10b981', background: '#fff', color: '#10b981', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#ecfdf5'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                            ✏️ Edit Profile
                          </button>
                        : <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={cancelEdit} style={{ padding: '9px 18px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleSaveProfile} disabled={saving}
                              style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: saving ? '#94a3b8' : '#10b981', color: '#fff', fontWeight: 700, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer' }}>
                              {saving ? 'Saving...' : '✓ Save Changes'}
                            </button>
                          </div>
                      }
                    </div>

                    {saveMsg  && <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '10px 14px', marginBottom: '1.25rem' }}><span style={{ color: '#059669', fontSize: 13, fontWeight: 600 }}>✓ {saveMsg}</span></div>}
                    {saveError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: '1.25rem' }}><span style={{ color: '#ef4444', fontSize: 13, fontWeight: 600 }}>⚠️ {saveError}</span></div>}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                      <div style={fieldRow}>
                        <label style={labelStyle}>First Name</label>
                        {editMode ? <FocusInput value={form.firstName} onChange={v => setForm(f => ({ ...f, firstName: v }))} placeholder="First name" inputStyle={inputStyle} /> : <ReadField value={profile?.firstName} />}
                      </div>
                      <div style={fieldRow}>
                        <label style={labelStyle}>Last Name</label>
                        {editMode ? <FocusInput value={form.lastName} onChange={v => setForm(f => ({ ...f, lastName: v }))} placeholder="Last name" inputStyle={inputStyle} /> : <ReadField value={profile?.lastName} />}
                      </div>
                      <div style={fieldRow}>
                        <label style={labelStyle}>Email Address</label>
                        <ReadField value={profile?.email} suffix={<span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', background: '#ecfdf5', padding: '2px 8px', borderRadius: 12, marginLeft: 8 }}>Verified</span>} />
                      </div>
                      <div style={fieldRow}>
                        <label style={labelStyle}>Admin Role</label>
                        <ReadField value={profile?.role || 'Administrator'} />
                      </div>
                      <div style={{ ...fieldRow, gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Institution / University</label>
                        {editMode ? <FocusInput value={form.university} onChange={v => setForm(f => ({ ...f, university: v }))} placeholder="e.g. SLIIT" inputStyle={inputStyle} /> : <ReadField value={profile?.university || '—'} />}
                      </div>
                      <div style={{ ...fieldRow, gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Bio</label>
                        {editMode ? <FocusTextarea value={form.bio} onChange={v => setForm(f => ({ ...f, bio: v }))} placeholder="A short description about yourself..." inputStyle={inputStyle} /> : <ReadField value={profile?.bio || '—'} />}
                      </div>
                    </div>
                    <div style={{ marginTop: '0.5rem', padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>ℹ️</span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>Email and admin role can only be changed by the system administrator.</span>
                    </div>
                  </div>
                )}

                {/* ── Security Tab ──────────────────────── */}
                {activeTab === 'Security' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', padding: '2rem' }}>
                      <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: '#0a1628' }}>Change Password</h3>
                      <p style={{ margin: '0 0 1.75rem', fontSize: 13, color: '#94a3b8' }}>Use a strong password you don't use elsewhere.</p>

                      {pwMsg  && <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '10px 14px', marginBottom: '1.25rem' }}><span style={{ color: '#059669', fontSize: 13, fontWeight: 600 }}>✓ {pwMsg}</span></div>}
                      {pwError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: '1.25rem' }}><span style={{ color: '#ef4444', fontSize: 13, fontWeight: 600 }}>⚠️ {pwError}</span></div>}

                      <div style={{ maxWidth: 480 }}>
                        <div style={fieldRow}>
                          <label style={labelStyle}>Current Password</label>
                          <PasswordInput value={pwForm.currentPassword} onChange={v => setPwForm(f => ({ ...f, currentPassword: v }))} show={showCurrent} onToggle={() => setShowCurrent(s => !s)} placeholder="Enter current password" inputStyle={inputStyle} />
                        </div>
                        <div style={fieldRow}>
                          <label style={labelStyle}>New Password</label>
                          <PasswordInput value={pwForm.newPassword} onChange={v => setPwForm(f => ({ ...f, newPassword: v }))} show={showNew} onToggle={() => setShowNew(s => !s)} placeholder="Min. 8 characters" inputStyle={inputStyle} />
                          {pwStrength && (
                            <div style={{ marginTop: 8 }}>
                              <div style={{ height: 4, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: pwStrength.width, background: pwStrength.color, borderRadius: 4, transition: 'width 0.3s' }} />
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, color: pwStrength.color, marginTop: 4, display: 'block' }}>{pwStrength.label}</span>
                            </div>
                          )}
                        </div>
                        <div style={fieldRow}>
                          <label style={labelStyle}>Confirm New Password</label>
                          <PasswordInput value={pwForm.confirmPassword} onChange={v => setPwForm(f => ({ ...f, confirmPassword: v }))} show={showConfirm} onToggle={() => setShowConfirm(s => !s)} placeholder="Repeat new password" inputStyle={inputStyle} />
                          {pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, marginTop: 4, display: 'block' }}>Passwords do not match</span>}
                          {pwForm.confirmPassword && pwForm.newPassword === pwForm.confirmPassword && pwForm.confirmPassword.length > 0 && <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600, marginTop: 4, display: 'block' }}>✓ Passwords match</span>}
                        </div>
                        <button onClick={handleChangePassword} disabled={pwSaving}
                          style={{ padding: '11px 28px', borderRadius: 11, border: 'none', background: pwSaving ? '#94a3b8' : '#10b981', color: '#fff', fontWeight: 700, fontSize: 14, cursor: pwSaving ? 'not-allowed' : 'pointer' }}>
                          {pwSaving ? 'Updating...' : '🔒 Update Password'}
                        </button>
                      </div>
                    </div>

                    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', padding: '2rem' }}>
                      <h3 style={{ margin: '0 0 1.25rem', fontSize: 16, fontWeight: 800, color: '#0a1628' }}>Session & Access</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                          { icon: '🟢', label: 'Current Session', value: 'Active — Admin Portal' },
                          { icon: '🛡️', label: 'Access Level',    value: 'Full Administrative Access' },
                          { icon: '🔑', label: 'Authentication',  value: 'JWT Token (24h expiry)' },
                          { icon: '📧', label: 'Account Email',   value: profile?.email || '—' },
                        ].map(row => (
                          <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ fontSize: 18 }}>{row.icon}</span>
                              <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{row.label}</span>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#0a1628' }}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                        <button onClick={handleLogout}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 11, border: '1.5px solid #fecaca', background: '#fff', color: '#ef4444', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                          ↪ Sign Out of Admin Portal
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────

// Renders avatar image or green initials fallback — used in navbar + sidebar
export function AdminAvatarImg({ url, initials, size = 36, border = '2px solid #e2e8f0' }) {
  const [imgErr, setImgErr] = useState(false);
  if (url && !imgErr) {
    return <img src={url} alt="admin" onError={() => setImgErr(true)} style={{ width: size, height: size, borderRadius: '50%', border, objectFit: 'cover', flexShrink: 0 }} />;
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', border, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: size * 0.36, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{initials || 'A'}</span>
    </div>
  );
}

function ReadField({ value, suffix }) {
  return (
    <div style={{ padding: '11px 14px', borderRadius: 10, background: '#f8fafc', border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0a1628', display: 'flex', alignItems: 'center' }}>
      <span style={{ flex: 1 }}>{value || '—'}</span>
      {suffix}
    </div>
  );
}

function FocusInput({ value, onChange, placeholder, inputStyle }) {
  const [focused, setFocused] = useState(false);
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle(focused)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />;
}

function FocusTextarea({ value, onChange, placeholder, inputStyle }) {
  const [focused, setFocused] = useState(false);
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...inputStyle(focused), resize: 'vertical', fontFamily: 'inherit' }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />;
}

function PasswordInput({ value, onChange, show, onToggle, placeholder, inputStyle }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...inputStyle(focused), paddingRight: 44 }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      <button type="button" onClick={onToggle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#94a3b8', padding: 2 }}>
        {show ? '🙈' : '👁'}
      </button>
    </div>
  );
}
