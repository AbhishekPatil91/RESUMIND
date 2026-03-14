import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  FileText, User, BarChart3, LogOut, Save, Loader2, ArrowLeft,
  Mail, Shield, Camera, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function SettingsPage() {
  const router = useRouter();
  const { user, token, logout, isAuthenticated, loadUser } = useAuthStore();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!isAuthenticated && !token) {
      router.push('/login');
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const headers = { Authorization: `Bearer ${token}` };

  const saveProfile = async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      await axios.put(`${API}/api/auth/profile`, { name: name.trim(), avatar }, { headers });
      await loadUser();
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setChangingPassword(true);
    try {
      await axios.put(`${API}/api/auth/change-password`, { currentPassword, newPassword }, { headers });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Head><title>Profile Settings — RESUMIND</title></Head>
      <div className="min-h-screen bg-dark-950">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
        </div>

        {/* Sidebar */}
        <div className="fixed left-0 top-0 bottom-0 w-64 border-r border-white/[0.06] bg-dark-900/60 backdrop-blur-2xl flex flex-col z-20">
          <div className="p-5 border-b border-white/[0.06]">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 via-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-brand-500/25">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                RESUM<span className="text-gradient">IND</span>
              </span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Link href="/dashboard"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] text-sm font-medium transition-all">
              <FileText className="w-4 h-4" />
              My Resumes
            </Link>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-brand-500/15 to-violet-500/10 text-brand-300 text-sm font-medium border border-brand-500/10">
              <User className="w-4 h-4" />
              Profile
            </div>
            <Link href="/pricing"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] text-sm font-medium transition-all">
              <BarChart3 className="w-4 h-4" />
              Upgrade Plan
            </Link>
          </nav>

          <div className="p-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 via-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-brand-500/20">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{user?.name}</div>
                <div className="text-xs text-slate-500 truncate capitalize">{user?.plan || 'Free'} plan</div>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/[0.06] text-sm transition-all">
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="ml-64 p-8 relative">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-4 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="font-display font-bold text-3xl text-white tracking-tight">Profile Settings</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your account details</p>
          </motion.div>

          <div className="max-w-2xl space-y-6">
            {/* Avatar & Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/[0.06] p-6"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <h2 className="font-display font-semibold text-lg text-white mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-400" /> Personal Info
              </h2>

              <div className="flex items-start gap-6 mb-6">
                <div className="relative group">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 via-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                  {avatar && (
                    <button onClick={() => setAvatar('')} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg hover:bg-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  <Mail className="w-3 h-3 inline mr-1" />Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-slate-500 text-sm cursor-not-allowed"
                />
                <p className="text-xs text-slate-600 mt-1">Email cannot be changed</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold capitalize">
                  {user?.plan || 'free'} plan
                </div>
                {user?.plan === 'free' && (
                  <Link href="/pricing" className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
                    Upgrade →
                  </Link>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex justify-end">
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 disabled:opacity-50 transition-all"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </motion.div>

            {/* Change Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/[0.06] p-6"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <h2 className="font-display font-semibold text-lg text-white mb-5 flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-400" /> Change Password
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
                      placeholder="Min 6 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex justify-end">
                <button
                  onClick={changePassword}
                  disabled={changingPassword}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-semibold text-sm border border-white/[0.08] disabled:opacity-50 transition-all"
                >
                  {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  Change Password
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
