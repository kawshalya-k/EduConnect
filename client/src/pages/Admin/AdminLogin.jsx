import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import logo from '../../Assets/educonnect-logo.svg';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/admin/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data.admin));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 440, padding: "0 1.5rem" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
            <img src={logo} alt="EduConnect" style={{ width: 48, height: 48 }} />
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#0a1628" }}>Admin Portal</h1>
          <p style={{ margin: "0.5rem 0 0", fontSize: 14, color: "#64748b" }}>EduConnect Administration Panel</p>
        </div>

        {/* Login Card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
          <h2 style={{ margin: "0 0 1.5rem", fontSize: 18, fontWeight: 700, color: "#0a1628" }}>Sign in to your account</h2>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1rem" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#ef4444", fontWeight: 500 }}>⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@sliit.ac.lk"
                required
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0a1628", outline: "none", boxSizing: "border-box", background: "#f8fafc", transition: "border 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#10b981"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0a1628", outline: "none", boxSizing: "border-box", background: "#f8fafc", transition: "border 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#10b981"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: loading ? "#94a3b8" : "#10b981", color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ margin: "1.5rem 0", borderTop: "1px solid #f1f5f9" }} />

          {/* Info */}
          <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 10, padding: "0.75rem 1rem" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#065f46", lineHeight: 1.6 }}>
              🔒 This portal is restricted to authorized administrators only. Unauthorized access attempts are logged.
            </p>
          </div>
        </div>

        {/* Back link */}
        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: 13, color: "#94a3b8" }}>
          Not an admin?{" "}
          <span
            onClick={() => navigate('/login')}
            style={{ color: "#10b981", fontWeight: 600, cursor: "pointer" }}>
            Return to Student Login
          </span>
        </p>

      

      </div>
    </div>
  );
}