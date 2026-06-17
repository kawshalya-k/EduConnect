import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const DUMMY_USER = {
  id: 3,
  name: 'Sarah Chen',
  email: 'sarah.c@test.ac.lk',
  avatar: null,
  department: 'Design',
  role: 'Mentor',
  skillCoins: 0,
  mentorId: 3,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('learner'); // 'mentor' | 'learner'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem('educonnect_mode') || 'learner';
    const savedUser = localStorage.getItem('educonnect_user');
    const token = localStorage.getItem('token');

    setMode(savedMode);

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(DUMMY_USER);
        localStorage.setItem('educonnect_user', JSON.stringify(DUMMY_USER));
      }
    } else if (!token) {
      // Auto-login with dummy user but first fetch a dev JWT synchronously
      (async () => {
        try {
          const res = await fetch('http://localhost:5000/dev/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: DUMMY_USER.id })
          });
          const data = await res.json();
          if (data?.token) {
            localStorage.setItem('token', data.token);
          }
        } catch (e) {
          // ignore
        }

        setUser(DUMMY_USER);
        localStorage.setItem('educonnect_user', JSON.stringify(DUMMY_USER));
      })();
    }

    setLoading(false);
  }, []);

  // Real login
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('educonnect_user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  // Logout 
  const logout = () => {
    setUser(null);
    localStorage.removeItem('educonnect_user');
    localStorage.removeItem('token');
    localStorage.removeItem('educonnect_mode');
  };

  // Toggle mentor/learner mode 
  const toggleMode = () => {
    const newMode = mode === 'mentor' ? 'learner' : 'mentor';
    setMode(newMode);
    localStorage.setItem('educonnect_mode', newMode);
  };

  //Update skill coins balance 
  const updateSkillCoins = (amount) => {
    setUser((prev) => {
      const updated = { ...prev, skillCoins: prev.skillCoins + amount };
      localStorage.setItem('educonnect_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, mode, loading, login, logout, toggleMode, updateSkillCoins, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}