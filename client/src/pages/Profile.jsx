import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { User, Mail, Shield, BookOpen, PenTool, Image as ImageIcon, Save } from 'lucide-react';

export default function Profile() {
  const { user, login } = useContext(AuthContext); // we might need to update user role in context
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview or settings
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    avatar: '',
    role: 'Student',
    skillsToTeach: '',
    skillsToLearn: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/users/${user.id}/profile`);
      setProfile(res.data);
      
      const skills = res.data.skills || [];
      const mentorSkills = skills.filter(s => s.Skill_Role === 'Mentor').map(s => s.Skill_Name).join(', ');
      const learnerSkills = skills.filter(s => s.Skill_Role === 'Learner').map(s => s.Skill_Name).join(', ');

      setFormData({
        first_name: res.data.First_Name || '',
        last_name: res.data.Last_Name || '',
        bio: res.data.Bio || '',
        avatar: res.data.Avatar || '',
        role: res.data.Role || 'Student',
        skillsToTeach: mentorSkills,
        skillsToLearn: learnerSkills
      });
    } catch (err) {
      console.error(err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleToggle = async () => {
    const newRole = formData.role === 'Student' ? 'Mentor' : 'Student';
    try {
      await api.put(`/users/${user.id}/role`, { role: newRole });
      setFormData({ ...formData, role: newRole });
      setProfile({ ...profile, Role: newRole });
      // Update local storage/context if needed, but the token has the id, role isn't in token in MVP
      setSuccess(`Role successfully switched to ${newRole}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to switch role');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      // In a real app we'd map string input back to skill IDs, but our userController MVP handles inserting new ones or we can simplify.
      // For this MVP we will pass empty skills array and just update text.
      await api.put(`/users/${user.id}/profile`, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
        avatar: formData.avatar,
        skillsToTeach: [], // Simplification for now
        skillsToLearn: []
      });
      
      setSuccess('Profile updated successfully');
      fetchProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#F6F8F7] flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8F7] font-sans">
      <DashboardNavbar />
      
      <main className="flex-1 w-full max-w-[1024px] mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>

        {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl">{error}</div>}
        {success && <div className="p-4 mb-6 bg-emerald-50 text-emerald-600 rounded-xl">{success}</div>}

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`text-left px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-[#10B981] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`text-left px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-[#10B981] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              Settings
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            
            {activeTab === 'overview' && profile && (
              <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-100 flex-shrink-0">
                    <img 
                      src={profile.Avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.First_Name}&backgroundColor=E2E8F0`}
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{profile.First_Name} {profile.Last_Name}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${profile.Role === 'Mentor' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {profile.Role}
                      </span>
                      <span className="text-sm font-medium text-slate-500">{profile.University}</span>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Email Address</p>
                      <p className="text-sm text-slate-500">{profile.Email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Verification</p>
                      <p className="text-sm text-emerald-600 font-medium">{profile.is_verified ? 'Verified Student (.ac.lk)' : 'Pending'}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#10B981]" /> About Me</h3>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {profile.Bio || "No bio added yet. Go to settings to tell the community about yourself!"}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2"><PenTool className="w-5 h-5 text-[#10B981]" /> Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                          {skill.Skill_Name} <span className="opacity-50 text-xs ml-1">({skill.Skill_Role})</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">No skills listed.</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Role Switcher */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900">Active Role</h3>
                    <p className="text-sm text-slate-500">Switch between taking classes and teaching them.</p>
                  </div>
                  <div className="flex items-center p-1 bg-slate-200 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => formData.role !== 'Student' && handleRoleToggle()}
                      className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${formData.role === 'Student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Learner
                    </button>
                    <button 
                      type="button"
                      onClick={() => formData.role !== 'Mentor' && handleRoleToggle()}
                      className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${formData.role === 'Mentor' ? 'bg-[#10B981] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Mentor
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">First Name</label>
                    <input 
                      type="text" 
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Last Name</label>
                    <input 
                      type="text" 
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-slate-400" /> Avatar Image URL</label>
                  <input 
                    type="url" 
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="https://example.com/my-photo.jpg"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-slate-400">Leave blank to use an auto-generated avatar.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Bio</label>
                  <textarea 
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button 
                    type="submit"
                    className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-100 transition-all"
                  >
                    <Save className="w-5 h-5" /> Save Changes
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
