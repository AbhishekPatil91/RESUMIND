import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Check, X, Sparkles, Zap, Crown, Palette, ChevronRight, ArrowLeft, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Get started building your first resume',
    icon: Palette,
    color: '#10b981',
    features: [
      { text: '1 resume', included: true },
      { text: '5 templates', included: true },
      { text: 'PDF download', included: true },
      { text: 'Basic ATS check', included: true },
      { text: 'AI rewrite (3/month)', included: true },
      { text: 'Premium templates', included: false },
      { text: 'Unlimited resumes', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    description: 'Perfect for active job seekers',
    icon: Zap,
    color: '#6366f1',
    popular: true,
    features: [
      { text: 'Unlimited resumes', included: true },
      { text: 'All 10 templates', included: true },
      { text: 'PDF download', included: true },
      { text: 'Advanced ATS scoring', included: true },
      { text: 'Unlimited AI rewrites', included: true },
      { text: 'Premium templates', included: true },
      { text: 'Custom color schemes', included: true },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29.99,
    description: 'For teams and power users',
    icon: Crown,
    color: '#f59e0b',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Team management', included: true },
      { text: 'Custom branding', included: true },
      { text: 'API access', included: true },
      { text: 'Unlimited AI rewrites', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom templates', included: true },
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuthStore();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/register');
      }
      return;
    }

    if (!isAuthenticated) {
      toast('Please sign up first to upgrade', { icon: '👋' });
      router.push('/register');
      return;
    }

    if (user?.plan === planId) {
      toast('You are already on this plan', { icon: '✅' });
      return;
    }

    setLoadingPlan(planId);
    try {
      const { data } = await axios.post(
        `${API}/api/payment/create-checkout`,
        { plan: planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Could not start checkout');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to start checkout');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <Head>
        <title>Pricing — RESUMIND</title>
        <meta name="description" content="Choose a plan that works for you." />
      </Head>

      <div className="min-h-screen bg-dark-950 text-slate-100">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-brand-500/8 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-violet-500/6 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
        </div>

        {/* Header */}
        <header className="border-b border-white/5 bg-dark-900/60 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="font-display font-bold text-xl text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Palette className="w-4 h-4 text-white" />
              </span>
              RESUM<span className="text-gradient">IND</span>
            </Link>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Sign in</Link>
                  <Link href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 transition-all">
                    <Sparkles className="w-4 h-4" /> Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Zap className="w-3 h-3" />
              Pricing
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Simple, transparent<br />
              <span className="text-gradient">pricing</span>
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto">
              Start free and upgrade when you need more power. No hidden fees.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => {
              const Icon = plan.icon;
              const isCurrentPlan = user?.plan === plan.id;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-300 ${
                    plan.popular
                      ? 'border-brand-500/30 shadow-xl shadow-brand-500/10'
                      : 'border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                  style={{
                    background: plan.popular
                      ? 'linear-gradient(180deg, rgba(99,102,241,0.06) 0%, rgba(255,255,255,0.02) 100%)'
                      : 'rgba(255,255,255,0.02)',
                  }}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-brand-500 to-violet-500 shadow-lg shadow-brand-500/30">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${plan.color}15`, border: `1px solid ${plan.color}25` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: plan.color }} />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white">{plan.name}</h3>
                    <p className="text-slate-500 text-sm mt-1">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <span className="font-display font-bold text-4xl text-white">
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && <span className="text-slate-500 text-sm">/month</span>}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-center gap-2.5 text-sm">
                        {f.included ? (
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 flex-shrink-0" />
                        )}
                        <span className={f.included ? 'text-slate-300' : 'text-slate-600'}>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrentPlan || loadingPlan === plan.id}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white shadow-lg shadow-brand-500/20'
                        : 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08]'
                    }`}
                  >
                    {loadingPlan === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : plan.price === 0 ? (
                      <>Get Started <ChevronRight className="w-4 h-4" /></>
                    ) : (
                      <>Upgrade to {plan.name} <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-slate-600 text-xs mt-10"
          >
            Payments are securely processed via Stripe. Cancel anytime.
          </motion.p>
        </main>
      </div>
    </>
  );
}
