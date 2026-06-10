import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const DUMMY_USER = {
  id: 1,
  name: 'Alex Rivera',
  email: 'alex@example.com',
  avatar: null,
  department: 'Computer Science',
  skillCoins: 100,
  mentorId: 1,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('mentor'); // 'mentor' | 'learner'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem('educonnect_mode') || 'mentor';
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
      // Auto-login with dummy user 
      setUser(DUMMY_USER);
      localStorage.setItem('educonnect_user', JSON.stringify(DUMMY_USER));
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