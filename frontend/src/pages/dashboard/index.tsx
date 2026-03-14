import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  FileText, Plus, Trash2, Edit3, Share2,
  Copy, MoreVertical, Sparkles, LogOut, User,
  BarChart3, Clock, ChevronRight, FileX, Loader2, Zap,
  Upload, CheckCircle2, AlertTriangle, BookOpen, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Resume {
  _id: string;
  title: string;
  template: string;
  updatedAt: string;
  atsScore: number;
  personalInfo?: { firstName?: string; jobTitle?: string };
}

const TEMPLATE_COLORS: Record<string, { from: string; to: string; accent: string }> = {
  modern:    { from: '#6366f1', to: '#8b5cf6', accent: '#a78bfa' },
  executive: { from: '#0ea5e9', to: '#06b6d4', accent: '#67e8f9' },
  creative:  { from: '#ec4899', to: '#f472b6', accent: '#f9a8d4' },
  minimal:   { from: '#10b981', to: '#34d399', accent: '#6ee7b7' },
  tech:      { from: '#f59e0b', to: '#fbbf24', accent: '#fcd34d' },
  classic:   { from: '#8b5cf6', to: '#a78bfa', accent: '#c4b5fd' },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

const menuVariants = {
  hidden: { opacity: 0, scale: 0.9, y: -4 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: -4, transition: { duration: 0.15 } },
};

const sidebarItemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export default function Dashboard() {
  const router = useRouter();
  const { user, logout, isAuthenticated, loadUser } = useAuthStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasFetched = useRef(false);

  // ATS PDF upload state
  const [showAtsUpload, setShowAtsUpload] = useState(false);
  const [atsFile, setAtsFile] = useState<File | null>(null);
  const [atsForm, setAtsForm] = useState({ jobRole: '', companyName: '', jobDescription: '' });
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResults, setAtsResults] = useState<any>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // On mount & when route changes: hydrate auth, then fetch resumes
  useEffect(() => {
    const init = async () => {
      const storedToken = getToken();
      if (!storedToken) {
        router.push('/login');
        return;
      }
      // Make sure user data is loaded
      if (!isAuthenticated) {
        await loadUser();
      }
      // Check again after loadUser — token may have been cleared if invalid
      const validToken = getToken();
      if (!validToken) {
        router.push('/login');
        return;
      }
      await fetchResumes();
    };
    init();

    // Re-fetch when navigating back to this page
    const handleRouteChange = (url: string) => {
      if (url === '/dashboard' || url === '/dashboard/') {
        fetchResumes();
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchResumes = async () => {
    const activeToken = getToken();
    if (!activeToken) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/api/resumes`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      setResumes(Array.isArray(data.resumes) ? data.resumes : []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const createResume = async () => {
    if (!getToken()) {
      toast.error('Please login to create resume');
      return;
    }
    setCreating(true);
    try {
      const { data } = await axios.post(`${API}/api/resumes`, { title: 'Untitled Resume' }, { headers: { Authorization: `Bearer ${getToken()}` } });
      toast.success('Resume created!');
      router.push(`/builder/${data.resume._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create resume');
    } finally {
      setCreating(false);
    }
  };

  const deleteResume = async (id: string) => {
    if (!confirm('Delete this resume permanently?')) return;
    try {
      await axios.delete(`${API}/api/resumes/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      setResumes(prev => prev.filter(r => r._id !== id));
      toast.success('Resume deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
    setMenuOpen(null);
  };

  const duplicateResume = async (id: string) => {
    try {
      const { data } = await axios.post(`${API}/api/resumes/${id}/duplicate`, {}, { headers: { Authorization: `Bearer ${getToken()}` } });
      setResumes(prev => [data.resume, ...prev]);
      toast.success('Resume duplicated!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to duplicate');
    }
    setMenuOpen(null);
  };

  const shareResume = async (id: string) => {
    try {
      const { data } = await axios.post(`${API}/api/resumes/${id}/share`, {}, { headers: { Authorization: `Bearer ${getToken()}` } });
      const url = `${window.location.origin}${data.shareUrl}`;
      await navigator.clipboard.writeText(url);
      toast.success('Share link copied to clipboard!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate share link');
    }
    setMenuOpen(null);
  };

  // ATS PDF upload handler
  const handleAtsUpload = async () => {
    const activeToken = getToken();
    if (!activeToken) { toast.error('Please login first'); return; }
    if (!atsFile) { toast.error('Please select a PDF file'); return; }
    if (!atsForm.jobDescription.trim()) { toast.error('Please enter a job description'); return; }

    setAtsLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', atsFile);
      formData.append('jobDescription', atsForm.jobDescription);
      formData.append('jobRole', atsForm.jobRole);
      formData.append('companyName', atsForm.companyName);

      const { data } = await axios.post(`${API}/api/ai/ats-score-pdf`, formData, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setAtsResults(data);
      setShowAtsUpload(false);
      toast.success(`ATS Score: ${data.score}%`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'ATS analysis failed');
    } finally {
      setAtsLoading(false);
    }
  };

  const resetAts = () => {
    setAtsResults(null);
    setAtsFile(null);
    setAtsForm({ jobRole: '', companyName: '', jobDescription: '' });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getAtsColor = (score: number) => {
    if (score >= 80) return { bg: 'rgba(16,185,129,0.15)', text: '#10b981', ring: 'rgba(16,185,129,0.3)' };
    if (score >= 60) return { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', ring: 'rgba(245,158,11,0.3)' };
    return { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', ring: 'rgba(239,68,68,0.3)' };
  };

  return (
    <>
      <Head><title>Dashboard — RESUMIND</title></Head>
      <div className="min-h-screen bg-dark-950">
        {/* Animated background orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 left-1/4 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 15, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)' }}
          />
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 bottom-0 w-64 border-r border-white/[0.06] bg-dark-900/60 backdrop-blur-2xl flex flex-col z-20"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-5 border-b border-white/[0.06]"
          >
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 via-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-brand-500/25"
              >
                <FileText className="w-4.5 h-4.5 text-white" />
              </motion.div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                RESUM<span className="text-gradient">IND</span>
              </span>
            </Link>
          </motion.div>

          <motion.nav
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex-1 p-4 space-y-1"
          >
            <motion.div variants={sidebarItemVariants}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-brand-500/15 to-violet-500/10 text-brand-300 text-sm font-medium border border-brand-500/10">
              <FileText className="w-4 h-4" />
              My Resumes
            </motion.div>
            <motion.div variants={sidebarItemVariants}>
              <button onClick={() => { setAtsResults(null); setShowAtsUpload(true); }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] text-sm font-medium transition-all duration-200 w-full text-left">
                <Upload className="w-4 h-4" />
                ATS Score Checker
              </button>
            </motion.div>
            {[
              { href: '/dashboard/settings', icon: User, label: 'Profile' },
              { href: '/pricing', icon: BarChart3, label: 'Upgrade Plan' },
            ].map((item) => (
              <motion.div key={item.label} variants={sidebarItemVariants}>
                <Link href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] text-sm font-medium transition-all duration-200">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 250, damping: 25 }}
            className="p-4 border-t border-white/[0.06]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 via-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-brand-500/20">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-dark-900" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{user?.name}</div>
                <div className="text-xs text-slate-500 truncate capitalize">{user?.plan || 'Free'} plan</div>
              </div>
            </div>
            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/[0.06] text-sm transition-all duration-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Main content */}
        <div className="ml-64 p-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 250, damping: 25 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="font-display font-bold text-3xl text-white mb-1 tracking-tight">
                My Resumes
              </h1>
              <p className="text-slate-500 text-sm">
                {resumes.length} resume{resumes.length !== 1 ? 's' : ''} · <span className="capitalize">{user?.plan}</span> plan
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(99,102,241,0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={createResume}
              disabled={creating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-violet-600 to-brand-600 bg-[length:200%_100%] hover:bg-right text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all duration-500 disabled:opacity-60"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              New Resume
            </motion.button>
          </motion.div>

          {/* Upgrade banner */}
          <AnimatePresence>
            {user?.plan === 'free' && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                className="relative rounded-2xl p-4 mb-6 flex items-center justify-between overflow-hidden border border-brand-500/20"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 50%, rgba(6,182,212,0.04) 100%)' }}
              >
                {/* shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer bg-[length:200%_100%]" />
                <div className="flex items-center gap-3 relative z-10">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/25 to-violet-500/25 flex items-center justify-center border border-brand-500/20"
                  >
                    <Zap className="w-5 h-5 text-brand-400" />
                  </motion.div>
                  <div>
                    <div className="text-sm font-semibold text-white">Unlock the full power of AI</div>
                    <div className="text-xs text-slate-400">Unlimited resumes, premium templates & AI rewrites</div>
                  </div>
                </div>
                <Link href="/pricing"
                  className="relative z-10 flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-lg bg-brand-500/15 text-brand-300 hover:bg-brand-500/25 hover:text-brand-200 transition-all duration-200 border border-brand-500/20">
                  Upgrade <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resume grid */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 gap-4"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-8 h-8 text-brand-500" />
                </motion.div>
                <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-xl" />
              </div>
              <p className="text-slate-500 text-sm animate-pulse">Loading your resumes...</p>
            </motion.div>
          ) : resumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="flex flex-col items-center justify-center h-80 text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/15 to-violet-500/15 flex items-center justify-center mb-5 border border-brand-500/10"
              >
                <FileX className="w-10 h-10 text-brand-400" />
              </motion.div>
              <h3 className="font-display font-bold text-2xl text-white mb-2">No resumes yet</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md">
                Create your first resume and let AI help you craft a professional story that gets interviews.
              </p>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(99,102,241,0.3)' }}
                whileTap={{ scale: 0.97 }}
                onClick={createResume}
                disabled={creating}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-violet-600 to-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/25"
              >
                <Sparkles className="w-4 h-4" />
                Create My First Resume
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {/* Create new card */}
              <motion.button
                variants={cardVariants}
                whileHover={{ scale: 1.02, borderColor: 'rgba(99,102,241,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={createResume}
                disabled={creating}
                className="group relative rounded-2xl border-2 border-dashed border-white/10 bg-transparent p-6 flex flex-col items-center justify-center gap-3 text-center transition-colors aspect-[3/4] cursor-pointer hover:bg-brand-500/[0.03]"
              >
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/10 to-violet-500/10 border border-brand-500/20 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-brand-500/10 transition-shadow"
                >
                  {creating ? <Loader2 className="w-6 h-6 text-brand-400 animate-spin" /> : <Plus className="w-6 h-6 text-brand-400" />}
                </motion.div>
                <div>
                  <div className="font-semibold text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Create New Resume</div>
                  <div className="text-xs text-slate-600 mt-1">Start from scratch with AI</div>
                </div>
              </motion.button>

              {/* Resume cards */}
              <AnimatePresence mode="popLayout">
                {resumes.map((resume) => {
                  const colors = TEMPLATE_COLORS[resume.template] || TEMPLATE_COLORS.modern;
                  const atsColors = resume.atsScore > 0 ? getAtsColor(resume.atsScore) : null;
                  return (
                    <motion.div
                      key={resume._id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="show"
                      layout
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.25 } }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="group relative rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-colors duration-300"
                      style={{ background: 'rgba(255,255,255,0.02)' }}
                    >
                      {/* Hover glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: `radial-gradient(ellipse at 50% 0%, ${colors.from}12 0%, transparent 60%)` }}
                      />

                      {/* Template preview */}
                      <div className="relative h-44 p-4" style={{ background: `linear-gradient(145deg, ${colors.from}10 0%, ${colors.to}05 50%, transparent 100%)` }}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white rounded-xl h-full p-3 shadow-xl shadow-black/10 overflow-hidden relative"
                        >
                          <div className="h-5 rounded-md mb-1.5 flex items-center px-2 gap-1.5" style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}>
                            <div className="w-3.5 h-3.5 rounded-full bg-white/30" />
                            <div>
                              <div className="h-[3px] w-10 bg-white/80 rounded mb-[2px]" />
                              <div className="h-[2px] w-6 bg-white/50 rounded" />
                            </div>
                          </div>
                          {resume.personalInfo?.firstName && (
                            <div className="mb-1">
                              <div className="text-[6px] font-bold text-slate-700 leading-tight truncate">{resume.personalInfo.firstName}</div>
                              {resume.personalInfo.jobTitle && <div className="text-[5px] leading-tight truncate" style={{ color: colors.from }}>{resume.personalInfo.jobTitle}</div>}
                            </div>
                          )}
                          <div className="space-y-1">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="h-1 rounded-full" style={{
                                width: i % 3 === 2 ? '55%' : i % 3 === 1 ? '80%' : '100%',
                                background: i === 0 ? `${colors.from}40` : '#e2e8f0',
                              }} />
                            ))}
                          </div>
                          {/* Overlay edit prompt */}
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <Link href={`/builder/${resume._id}`}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/90 text-gray-900 font-semibold text-xs shadow-lg hover:bg-white transition-colors">
                              <Edit3 className="w-3.5 h-3.5" /> Open Editor
                            </Link>
                          </div>
                        </motion.div>

                        {/* ATS score badge */}
                        {atsColors && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.3 }}
                            className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold border backdrop-blur-md"
                            style={{
                              background: atsColors.bg,
                              color: atsColors.text,
                              borderColor: atsColors.ring,
                            }}
                          >
                            ATS {resume.atsScore}%
                          </motion.div>
                        )}
                      </div>

                      {/* Card info */}
                      <div className="p-4 relative">
                        <div className="flex items-start justify-between mb-2.5">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-white truncate group-hover:text-brand-200 transition-colors duration-300">
                              {resume.title}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              <div className="w-2 h-2 rounded-full" style={{ background: colors.from }} />
                              <span className="text-xs text-slate-500 capitalize">{resume.template}</span>
                            </div>
                          </div>
                          <div className="relative" ref={menuOpen === resume._id ? menuRef : undefined}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setMenuOpen(menuOpen === resume._id ? null : resume._id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-all"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </motion.button>
                            <AnimatePresence>
                              {menuOpen === resume._id && (
                                <motion.div
                                  variants={menuVariants}
                                  initial="hidden"
                                  animate="show"
                                  exit="exit"
                                  className="absolute right-0 top-9 w-48 rounded-xl border border-white/[0.08] shadow-2xl shadow-black/40 z-50 py-1.5 backdrop-blur-xl"
                                  style={{ background: 'rgba(15,22,41,0.95)' }}
                                >
                                  {[
                                    { icon: Edit3, label: 'Edit Resume', onClick: () => { setMenuOpen(null); router.push(`/builder/${resume._id}`); } },
                                    { icon: Copy, label: 'Duplicate', onClick: () => duplicateResume(resume._id) },
                                    { icon: Share2, label: 'Share Link', onClick: () => shareResume(resume._id) },
                                  ].map((item) => (
                                    <motion.button
                                      key={item.label}
                                      whileHover={{ x: 2, backgroundColor: 'rgba(255,255,255,0.04)' }}
                                      onClick={item.onClick}
                                      className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-slate-300 hover:text-white transition-colors"
                                    >
                                      <item.icon className="w-3.5 h-3.5" /> {item.label}
                                    </motion.button>
                                  ))}
                                  <div className="border-t border-white/[0.06] my-1" />
                                  <motion.button
                                    whileHover={{ x: 2, backgroundColor: 'rgba(239,68,68,0.06)' }}
                                    onClick={() => deleteResume(resume._id)}
                                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                  </motion.button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Clock className="w-3 h-3" />
                            {formatDate(resume.updatedAt)}
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteResume(resume._id)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Delete resume"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                            <Link href={`/builder/${resume._id}`}
                              className="flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors group/edit">
                              Edit
                              <motion.span className="inline-block" whileHover={{ x: 2 }}>
                                <ChevronRight className="w-3 h-3" />
                              </motion.span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* ATS PDF Upload Modal */}
      <AnimatePresence>
        {showAtsUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAtsUpload(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-white/[0.08] p-6 shadow-2xl"
              style={{ background: 'rgba(15,22,41,0.97)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">ATS Score Checker</h3>
                    <p className="text-xs text-slate-500">Upload any resume PDF to analyze</p>
                  </div>
                </div>
                <button onClick={() => setShowAtsUpload(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* File upload area */}
              <label className={`flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 mb-4 ${
                atsFile ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10 hover:border-brand-500/40 hover:bg-brand-500/5'
              }`}>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setAtsFile(e.target.files?.[0] || null)}
                />
                {atsFile ? (
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-emerald-400" />
                    <div>
                      <div className="text-sm font-medium text-white">{atsFile.name}</div>
                      <div className="text-xs text-slate-500">{(atsFile.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <div className="text-sm text-slate-400">Click to upload PDF</div>
                    <div className="text-xs text-slate-600">Max 5MB</div>
                  </div>
                )}
              </label>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Job Role (optional)"
                  value={atsForm.jobRole}
                  onChange={(e) => setAtsForm(prev => ({ ...prev, jobRole: e.target.value }))}
                  className="px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/40"
                />
                <input
                  type="text"
                  placeholder="Company (optional)"
                  value={atsForm.companyName}
                  onChange={(e) => setAtsForm(prev => ({ ...prev, companyName: e.target.value }))}
                  className="px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/40"
                />
              </div>

              <textarea
                placeholder="Paste the job description here *"
                rows={4}
                value={atsForm.jobDescription}
                onChange={(e) => setAtsForm(prev => ({ ...prev, jobDescription: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/40 resize-none mb-4"
              />

              <button
                onClick={handleAtsUpload}
                disabled={atsLoading || !atsFile}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {atsLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><CheckCircle2 className="w-4 h-4" /> Check ATS Score</>}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ATS Results Modal */}
      <AnimatePresence>
        {atsResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={resetAts}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/[0.08] p-6 shadow-2xl scrollbar-thin"
              style={{ background: 'rgba(15,22,41,0.97)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-xl text-white">ATS Analysis Results</h3>
                <button onClick={resetAts} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Score circle */}
              <div className="flex items-center gap-6 mb-6 p-4 rounded-xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none"
                      stroke={atsResults.score >= 80 ? '#10b981' : atsResults.score >= 60 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${(atsResults.score / 100) * 264} 264`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display font-bold text-2xl" style={{ color: atsResults.score >= 80 ? '#10b981' : atsResults.score >= 60 ? '#f59e0b' : '#ef4444' }}>
                      {atsResults.score}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-white mb-1">
                    {atsResults.score >= 80 ? 'Excellent Match!' : atsResults.score >= 60 ? 'Good, Needs Improvement' : 'Needs Significant Work'}
                  </div>
                  <div className="text-sm text-slate-400">Your resume was analyzed against the provided job description.</div>
                </div>
              </div>

              {/* Strengths */}
              {atsResults.strengths?.length > 0 && (
                <div className="mb-5">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-2"><CheckCircle2 className="w-4 h-4" /> Strengths</h4>
                  <ul className="space-y-1.5">
                    {atsResults.strengths.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-slate-300 pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-500/60">{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {atsResults.improvements?.length > 0 && (
                <div className="mb-5">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-400 mb-2"><AlertTriangle className="w-4 h-4" /> Improvements Needed</h4>
                  <ul className="space-y-1.5">
                    {atsResults.improvements.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-slate-300 pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-500/60">{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Keywords */}
              {atsResults.keywords_missing?.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-red-400 mb-2">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {atsResults.keywords_missing.map((k: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-300 border border-red-500/20">{k}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Skills */}
              {atsResults.suggested_skills?.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-brand-400 mb-2">Suggested Skills to Add</h4>
                  <div className="flex flex-wrap gap-2">
                    {atsResults.suggested_skills.map((s: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Recommendations */}
              {atsResults.course_recommendations?.length > 0 && (
                <div className="mb-4">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-violet-400 mb-2"><BookOpen className="w-4 h-4" /> Recommended Courses</h4>
                  <div className="space-y-2">
                    {atsResults.course_recommendations.map((c: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="text-sm font-medium text-white">{c.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{c.platform}</div>
                        <div className="text-xs text-slate-400 mt-1">{c.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { resetAts(); setShowAtsUpload(true); }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm font-medium text-slate-300 hover:bg-white/[0.04] transition-colors"
                >
                  Check Another Resume
                </button>
                <button onClick={resetAts}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:from-brand-500 hover:to-violet-500 transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
