import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Dummy user for local dev — replace with real auth later
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
    // Load from localStorage
    const savedMode = localStorage.getItem('educonnect_mode') || 'mentor';
    const savedUser = localStorage.getItem('educonnect_user');

    setMode(savedMode);

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(DUMMY_USER);
        localStorage.setItem('educonnect_user', JSON.stringify(DUMMY_USER));
      }
    } else {
      // Auto-login with dummy user in dev
      setUser(DUMMY_USER);
      localStorage.setItem('educonnect_user', JSON.stringify(DUMMY_USER));
    }

    setLoading(false);
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'mentor' ? 'learner' : 'mentor';
    setMode(newMode);
    localStorage.setItem('educonnect_mode', newMode);
  };

  const updateSkillCoins = (amount) => {
    setUser((prev) => {
      const updated = { ...prev, skillCoins: prev.skillCoins + amount };
      localStorage.setItem('educonnect_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, mode, loading, toggleMode, updateSkillCoins, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}