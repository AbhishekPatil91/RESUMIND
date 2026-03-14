import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FileText, Eye, EyeOff, Loader2, Sparkles, Check, Shield, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

const FEATURES = [
  { icon: Sparkles, text: '3 free AI-powered resumes', color: '#818cf8' },
  { icon: Zap, text: 'Instant ATS score analysis', color: '#f59e0b' },
  { icon: Shield, text: 'PDF export & secure sharing', color: '#10b981' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!form.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await register(form.name.trim(), form.email.trim().toLowerCase(), form.password);
      toast.success('Account created! Let\'s build your resume 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (err?.code === 'ERR_NETWORK' ? 'Cannot connect to server. Please ensure the backend is running.' : 'Registration failed. Please try again.');
      toast.error(message);
    }
  };

  const passwordStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981'];
  const strengthBg = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'];
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

  return (
    <>
      <Head><title>Create Account — RESUMIND</title></Head>
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-12 overflow-hidden">
        {/* Animated background orbs */}
        <div className="fixed inset-0 pointer-events-none">
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 w-[350px] h-[350px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="relative w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.05 }}
            className="text-center mb-8"
          >
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 via-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-brand-500/30"
              >
                <FileText className="w-5 h-5 text-white" />
              </motion.div>
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                RESUM<span className="text-gradient">IND</span>
              </span>
            </Link>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25, delay: 0.1 }}
            className="relative rounded-2xl p-8 border border-white/[0.08] overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(20px)' }}
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={itemVariants} className="mb-6 text-center">
                <h1 className="font-display font-bold text-2xl text-white mb-1.5 tracking-tight">Create your account</h1>
                <p className="text-slate-400 text-sm">Free forever · No credit card needed</p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div variants={itemVariants}>
                  <label className="text-sm text-slate-400 mb-1.5 block font-medium">Full name</label>
                  <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'name' ? 'ring-2 ring-brand-500/25 shadow-lg shadow-brand-500/5' : ''}`}>
                    <input name="name" type="text" value={form.name} onChange={handleChange} required placeholder="Jane Doe"
                      onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/40 transition-colors" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="text-sm text-slate-400 mb-1.5 block font-medium">Email address</label>
                  <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-brand-500/25 shadow-lg shadow-brand-500/5' : ''}`}>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                      onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/40 transition-colors" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="text-sm text-slate-400 mb-1.5 block font-medium">Password</label>
                  <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-brand-500/25 shadow-lg shadow-brand-500/5' : ''}`}>
                    <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} required placeholder="Min 6 characters"
                      onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/40 transition-colors" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {form.password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2.5 flex items-center gap-2.5"
                      >
                        <div className="flex-1 flex gap-1">
                          {[1, 2, 3].map(i => (
                            <motion.div
                              key={i}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                              className={`h-1.5 flex-1 rounded-full origin-left ${i <= passwordStrength ? strengthBg[passwordStrength] : 'bg-white/[0.06]'} transition-colors duration-300`}
                            />
                          ))}
                        </div>
                        <motion.span
                          key={passwordStrength}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs font-medium"
                          style={{ color: strengthColors[passwordStrength] }}
                        >
                          {strengthLabels[passwordStrength]}
                        </motion.span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(99,102,241,0.35)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-violet-600 to-brand-600 bg-[length:200%_100%] hover:bg-right text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all duration-500 disabled:opacity-60 group"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {isLoading ? 'Creating account...' : 'Create Free Account'}
                    {!isLoading && <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />}
                  </motion.button>
                </motion.div>
              </form>

              {/* Feature list */}
              <motion.div variants={itemVariants} className="mt-5 pt-5 border-t border-white/[0.06]">
                <div className="flex flex-col gap-2.5">
                  {FEATURES.map((f, i) => (
                    <motion.div
                      key={f.text}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 300 }}
                      className="flex items-center gap-2.5 text-xs text-slate-400"
                    >
                      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ background: `${f.color}15` }}>
                        <f.icon className="w-3 h-3" style={{ color: f.color }} />
                      </div>
                      {f.text}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
                  Sign in
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
