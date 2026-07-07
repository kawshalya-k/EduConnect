import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const RoleSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize role from localStorage, defaulting based on current path if empty
  const [currentRole, setCurrentRole] = useState(() => {
    const savedRole = localStorage.getItem('activeRole');
    if (savedRole) return savedRole;
    return location.pathname.startsWith('/mentor') ? 'mentor' : 'learner';
  });

  // Sync role state if the user manually navigates to a hardcoded dashboard route
  useEffect(() => {
    if (location.pathname === '/mentor-dashboard') {
      setCurrentRole('mentor');
      localStorage.setItem('activeRole', 'mentor');
    } else if (location.pathname === '/learner-dashboard' || location.pathname === '/dashboard') {
      setCurrentRole('learner');
      localStorage.setItem('activeRole', 'learner');
    }
  }, [location.pathname]);

  const { user, setUser } = useAuth();

  const handleRoleChange = async (role) => {
    setCurrentRole(role);
    localStorage.setItem('activeRole', role);
    localStorage.setItem('educonnect_mode', role);

    // Update backend user role if logged in
    if (user && user.id) {
      const backendRole = role === 'mentor' ? 'Mentor' : 'Student';
      try {
        await api.put(`/users/${user.id}/role`, { role: backendRole });
        // update local user object
        setUser({ ...user, role: backendRole });
      } catch (err) {
        console.error('Failed to update role on server', err?.response?.data || err.message);
      }
    }

    if (role === 'mentor') {
      navigate('/mentor-dashboard');
    } else {
      navigate('/learner-dashboard');
    }
  };

  return (
    <div className="flex flex-row items-center p-1 gap-2 bg-[#F1F5F9] rounded-lg h-9">
      <button
        onClick={() => handleRoleChange('mentor')}
        className={`flex flex-col justify-center items-center py-1.5 px-3 rounded-md font-sans font-semibold text-xs leading-4 transition-colors
          ${currentRole === 'mentor'
            ? 'bg-[#10B981] shadow-sm text-white hover:bg-[#059669]'
            : 'text-[#64748B] hover:bg-slate-200'
          }`}
      >
        Mentor Mode
      </button>
      <button
        onClick={() => handleRoleChange('learner')}
        className={`flex flex-row justify-center items-center py-1.5 px-[11px] rounded-md font-sans font-semibold text-xs leading-4 transition-colors
          ${currentRole === 'learner'
            ? 'bg-[#10B981] shadow-sm text-white hover:bg-[#059669]'
            : 'text-[#64748B] hover:bg-slate-200'
          }`}
      >
        Learner Mode
      </button>
    </div>
  );
};

export default RoleSwitcher;