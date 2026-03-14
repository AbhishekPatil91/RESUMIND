import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import {
  Sparkles, FileText, Zap, Shield, Download, ChevronRight,
  Star, Check, ArrowRight, Brain, Target, Palette, BarChart3,
  Users, Menu, X, Github, Twitter, Linkedin
} from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Writing',
    description: 'GPT-4 generates professional summaries, improves job descriptions, and suggests impactful bullet points tailored to your role.',
    color: 'from-violet-500/20 to-violet-500/5',
    iconColor: 'text-violet-400',
    border: 'border-violet-500/20',
  },
  {
    icon: Target,
    title: 'ATS Score Checker',
    description: 'Instantly analyze your resume against job descriptions to maximize your ATS pass-through rate with targeted keyword optimization.',
    color: 'from-cyan-500/20 to-cyan-500/5',
    iconColor: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
  {
    icon: Palette,
    title: '10 Premium Templates',
    description: 'Choose from professionally designed resume templates with customizable colors, fonts, and layouts to match any industry.',
    color: 'from-pink-500/20 to-pink-500/5',
    iconColor: 'text-pink-400',
    border: 'border-pink-500/20',
  },
  {
    icon: Download,
    title: 'One-Click PDF Export',
    description: 'Export your resume as a pixel-perfect PDF or share via a unique link. Your resume, always ready when opportunity knocks.',
    color: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  {
    icon: Zap,
    title: 'Live Preview',
    description: 'See your changes in real-time with our side-by-side editor. Drag and drop sections to create the perfect resume structure.',
    color: 'from-amber-500/20 to-amber-500/5',
    iconColor: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  {
    icon: Shield,
    title: 'Auto-Save & Sync',
    description: 'Never lose your work. Your resume is automatically saved as you type, synced across all your devices securely.',
    color: 'from-brand-500/20 to-brand-500/5',
    iconColor: 'text-brand-400',
    border: 'border-brand-500/20',
  },
];

const TEMPLATES = [
  { name: 'Modern', accent: '#6366f1', tag: 'Most Popular', layout: 'top-header' },
  { name: 'Executive', accent: '#0ea5e9', tag: 'Professional', layout: 'border-top' },
  { name: 'Creative', accent: '#ec4899', tag: 'Design Roles', layout: 'left-sidebar' },
  { name: 'Minimal', accent: '#10b981', tag: 'Clean & Simple', layout: 'centered' },
  { name: 'Tech Pro', accent: '#f59e0b', tag: 'Developers', layout: 'dark-sidebar' },
  { name: 'Professional', accent: '#2563eb', tag: 'Corporate', layout: 'split-header' },
  { name: 'Elegant', accent: '#7c3aed', tag: 'Luxury', layout: 'centered' },
  { name: 'Bold', accent: '#dc2626', tag: 'Impactful', layout: 'top-header' },
  { name: 'Compact', accent: '#0d9488', tag: 'Dense Layout', layout: 'border-top' },
  { name: 'Infographic', accent: '#7c3aed', tag: 'Visual', layout: 'left-sidebar' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer @ Google',
    avatar: 'PS',
    text: 'Got 3 interview calls within a week of using RESUMIND. The ATS checker alone is worth it — went from 20% to 87% match rate.',
    stars: 5,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    name: 'Marcus Chen',
    role: 'Product Manager @ Stripe',
    avatar: 'MC',
    text: 'The AI summary generator is insane. I used to spend hours writing. Now I have a polished resume in under 20 minutes.',
    stars: 5,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'Aisha Okonkwo',
    role: 'UX Designer @ Figma',
    avatar: 'AO',
    text: 'Finally a resume builder that actually looks good. The Creative template made my portfolio stand out from hundreds of applicants.',
    stars: 5,
    gradient: 'from-pink-500 to-rose-600',
  },
];

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect to get started',
    features: ['3 resumes', '2 templates', 'PDF export', 'Basic ATS check', '5 AI suggestions/month'],
    cta: 'Get Started Free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    description: 'For serious job seekers',
    features: ['Unlimited resumes', 'All 10 templates', 'PDF & share link', 'Advanced ATS checker', 'Unlimited AI writing', 'Custom colors', 'Priority support'],
    cta: 'Start Pro — Free 7 Days',
    href: '/register?plan=pro',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: '$29',
    period: 'per month',
    description: 'For teams & agencies',
    features: ['Everything in Pro', 'Team management', 'Bulk PDF export', 'Custom branding', 'API access', 'Dedicated support', 'Analytics dashboard'],
    cta: 'Contact Sales',
    href: '/register?plan=enterprise',
    highlight: false,
  },
];

const STEPS = [
  { num: '01', title: 'Sign Up Free', desc: 'Create your account in seconds. No credit card required.' },
  { num: '02', title: 'Fill Your Details', desc: 'Enter your info using our guided multi-step form builder.' },
  { num: '03', title: 'Let AI Enhance It', desc: 'Our AI rewrites and improves your content automatically.' },
  { num: '04', title: 'Download & Apply', desc: 'Export as PDF and start landing your dream interviews.' },
];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Head>
        <title>RESUMIND — Create Professional Resumes with AI</title>
        <meta name="description" content="Build ATS-optimized resumes with AI in minutes. 10 templates, smart suggestions, PDF export." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-dark-950 text-slate-100 overflow-x-hidden relative">
        {/* Background mesh */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-600/12 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[80px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
          <div className="absolute top-2/3 right-1/3 w-[350px] h-[350px] bg-pink-500/8 rounded-full blur-[90px] animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* NAV */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{ background: 'rgba(3, 7, 18, 0.85)', backdropFilter: 'blur(20px)' }}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-shadow">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">RESUM<span className="text-gradient">IND</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Templates', 'Pricing'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors font-medium px-4 py-2">
                Sign In
              </Link>
              <Link href="/register" className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white transition-all glow-brand-hover shadow-lg shadow-brand-500/20">
                <Sparkles className="w-4 h-4" />
                Get Started Free
              </Link>
            </div>

            <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileOpen && (
            <div className="md:hidden border-t border-white/5 bg-dark-900 px-6 py-4 space-y-3">
              {['Features', 'Templates', 'Pricing'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="block text-slate-400 hover:text-white py-2 font-medium">
                  {item}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/login" className="text-center text-sm text-slate-400 border border-white/10 rounded-xl py-2.5">Sign In</Link>
                <Link href="/register" className="text-center text-sm font-semibold bg-gradient-to-r from-brand-600 to-violet-600 text-white rounded-xl py-2.5">Get Started Free</Link>
              </div>
            </div>
          )}
        </nav>

        {/* HERO */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-medium mb-8 animate-slide-up">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Powered by GPT-4 · 50,000+ resumes created
            </div>

            <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.05] mb-6 text-white">
              Create a Professional<br />
              <span className="text-gradient">Resume in Minutes</span><br />
              <span className="text-slate-400 text-4xl md:text-6xl font-semibold">with AI</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Build ATS-optimized resumes that land interviews. AI writes your content,
              10 premium templates make it look stunning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-bold text-lg shadow-2xl shadow-brand-500/30 hover:shadow-brand-500/50 transition-all glow-brand animate-glow">
                <Sparkles className="w-5 h-5" />
                Build My Resume — Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#templates" className="flex items-center gap-2 px-8 py-4 rounded-2xl glass glass-hover text-slate-300 font-semibold text-lg transition-all">
                <Palette className="w-5 h-5" />
                View Templates
              </a>
            </div>

            <div className="flex flex-wrap gap-6 justify-center mt-10 text-sm text-slate-500">
              {['No credit card required', 'Free forever plan', '5 min to your first resume'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Hero Resume Preview */}
          <div className="max-w-4xl mx-auto mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent z-10 pointer-events-none" style={{ top: '60%' }} />
            <div className="glass rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-brand-500/10">
              {/* Browser chrome */}
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 bg-white/2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white/5 rounded-lg px-3 py-1 text-xs text-slate-500 text-center">
                    resumind.app/builder
                  </div>
                </div>
              </div>
              {/* Resume builder preview mockup */}
              <div className="flex h-64 md:h-80">
                {/* Left panel - form */}
                <div className="w-1/3 border-r border-white/5 p-4 space-y-3">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Personal Info</div>
                  {['Full Name', 'Job Title', 'Email', 'Location'].map(field => (
                    <div key={field} className="space-y-1">
                      <div className="text-xs text-slate-600">{field}</div>
                      <div className="h-7 rounded-lg bg-white/5 border border-white/5" />
                    </div>
                  ))}
                  <div className="pt-2">
                    <div className="h-8 rounded-lg bg-gradient-to-r from-brand-600/50 to-violet-600/50 flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-brand-300" />
                      <span className="text-xs text-brand-300">AI Enhance</span>
                    </div>
                  </div>
                </div>
                {/* Right panel - resume preview */}
                <div className="flex-1 p-5 bg-white/[0.02]">
                  <div className="bg-white rounded-xl h-full p-4 shadow-xl overflow-hidden">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="h-4 bg-slate-800 rounded w-1/2 mb-1" />
                        <div className="h-2.5 bg-slate-200 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-2 space-y-1.5">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className={`h-2 rounded ${i % 4 === 3 ? 'w-3/5' : 'w-full'} bg-slate-100`} />
                      ))}
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <div className="h-2.5 bg-brand-500/70 rounded w-1/4 mb-2" />
                      <div className="flex flex-wrap gap-1">
                        {['React', 'TypeScript', 'Node.js', 'AWS'].map(s => (
                          <span key={s} className="text-[8px] px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded border border-brand-100">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-12 px-6 border-y border-white/5">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Resumes Created' },
              { value: '87%', label: 'Interview Rate Increase' },
              { value: '10', label: 'Premium Templates' },
              { value: '4.9★', label: 'User Rating' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-display font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Zap className="w-3 h-3" />
                Features
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
                Everything you need to<br />
                <span className="text-gradient">land your dream job</span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">From AI writing to ATS optimization, we've packed every tool you need into one beautiful platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((feature) => (
                <div key={feature.title} className={`group relative p-6 rounded-2xl glass glass-hover border ${feature.border} transition-all cursor-default`}>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} border ${feature.border} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 px-6 border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
                From zero to interview-ready<br />
                <span className="text-gradient">in 4 simple steps</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
              {STEPS.map((step, i) => (
                <div key={step.num} className="text-center relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600/30 to-violet-600/30 border border-brand-500/30 flex items-center justify-center mx-auto mb-4">
                    <span className="font-display font-bold text-xl text-gradient">{step.num}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEMPLATES */}
        <section id="templates" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/20 bg-pink-500/10 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Palette className="w-3 h-3" />
                Templates
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
                10 stunning templates for<br />
                <span className="text-gradient-warm">every industry</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
              {TEMPLATES.map((t, i) => (
                <div key={t.name} className="group cursor-pointer">
                  <div className="relative rounded-xl overflow-hidden border border-white/8 group-hover:border-white/25 group-hover:shadow-lg group-hover:shadow-black/20 transition-all duration-300 aspect-[3/4] mb-3 group-hover:-translate-y-1" style={{ background: `linear-gradient(135deg, ${t.accent}12 0%, #0f1629 100%)` }}>
                    {/* Filled resume mockup with sample text */}
                    <div className="absolute inset-3 bg-white rounded-lg shadow-xl overflow-hidden">
                      {t.layout === 'left-sidebar' ? (
                        <div className="flex h-full">
                          <div className="w-[38%] h-full p-1.5" style={{ background: t.accent }}>
                            <div className="w-7 h-7 rounded-full bg-white/30 mx-auto mb-1 flex items-center justify-center text-[5px] font-bold text-white/80">JA</div>
                            <div className="text-center mb-2">
                              <div className="text-[4.5px] font-bold text-white/90 leading-tight">John Anderson</div>
                              <div className="text-[3.5px] text-white/60 leading-tight">UI/UX Designer</div>
                            </div>
                            <div className="mb-1.5">
                              <div className="text-[3.5px] font-bold text-white/70 uppercase tracking-wider mb-0.5">Contact</div>
                              <div className="text-[3px] text-white/50 leading-relaxed">john@email.com<br/>+1 555-0123<br/>San Francisco, CA</div>
                            </div>
                            <div>
                              <div className="text-[3.5px] font-bold text-white/70 uppercase tracking-wider mb-0.5">Skills</div>
                              <div className="flex flex-wrap gap-[2px]">{['Figma', 'Sketch', 'CSS', 'React'].map(s => <span key={s} className="text-[3px] px-[3px] py-[1px] rounded bg-white/20 text-white/70 leading-tight">{s}</span>)}</div>
                            </div>
                          </div>
                          <div className="flex-1 p-2 space-y-1.5">
                            <div>
                              <div className="text-[4px] font-bold uppercase tracking-wider mb-0.5" style={{ color: t.accent }}>Summary</div>
                              <div className="text-[3px] text-slate-500 leading-relaxed">Creative designer with 5+ years of experience crafting user-centered digital products.</div>
                            </div>
                            <div>
                              <div className="text-[4px] font-bold uppercase tracking-wider mb-0.5" style={{ color: t.accent }}>Experience</div>
                              <div className="text-[3.5px] font-semibold text-slate-700">Sr. Designer · Spotify</div>
                              <div className="text-[3px] text-slate-400 mb-0.5">2021 – Present</div>
                              <div className="text-[3px] text-slate-500 leading-relaxed">Led redesign of mobile app experience for 50M+ users.</div>
                            </div>
                            <div>
                              <div className="text-[4px] font-bold uppercase tracking-wider mb-0.5" style={{ color: t.accent }}>Education</div>
                              <div className="text-[3.5px] font-semibold text-slate-700">B.Des · Stanford</div>
                              <div className="text-[3px] text-slate-400">2015 – 2019</div>
                            </div>
                          </div>
                        </div>
                      ) : t.layout === 'dark-sidebar' ? (
                        <div className="flex h-full">
                          <div className="flex-1 p-2">
                            <div className="mb-1.5 pb-1 border-b-2" style={{ borderColor: t.accent }}>
                              <div className="text-[5px] font-bold text-slate-800 leading-tight">Alex Rivera</div>
                              <div className="text-[3.5px] font-medium" style={{ color: t.accent }}>Full Stack Developer</div>
                            </div>
                            <div className="mb-1">
                              <div className="text-[3.5px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">Experience</div>
                              <div className="text-[3px] font-semibold text-slate-700">Software Engineer · Meta</div>
                              <div className="text-[2.5px] text-slate-400">2020 – Present</div>
                              <div className="text-[2.5px] text-slate-500 leading-relaxed">Built scalable APIs serving 1B+ requests daily.</div>
                            </div>
                            <div>
                              <div className="text-[3.5px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">Education</div>
                              <div className="text-[3px] font-semibold text-slate-700">M.S. CS · MIT</div>
                              <div className="text-[2.5px] text-slate-400">2018 – 2020</div>
                            </div>
                          </div>
                          <div className="w-[30%] p-1.5" style={{ background: '#1e293b' }}>
                            <div className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-[4px] font-bold" style={{ background: t.accent + '40', color: t.accent }}>AR</div>
                            <div className="text-[3px] text-white/40 mb-1 text-center leading-relaxed">alex@dev.io<br/>Seattle, WA</div>
                            <div className="text-[3px] font-bold text-white/50 uppercase tracking-wider mb-0.5">Skills</div>
                            <div className="flex flex-wrap gap-[2px]">{['Node', 'Go', 'AWS', 'K8s'].map(s => <span key={s} className="text-[3px] px-[2px] py-[0.5px] rounded bg-white/10 text-white/40 leading-tight">{s}</span>)}</div>
                          </div>
                        </div>
                      ) : t.layout === 'split-header' ? (
                        <>
                          <div className="h-8 flex items-center px-2 gap-1.5" style={{ background: '#1e293b' }}>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[4px] font-bold text-white/80" style={{ background: `${t.accent}60` }}>SK</div>
                            <div>
                              <div className="text-[4.5px] font-bold text-white/90 leading-tight">Sarah Kim</div>
                              <div className="text-[3.5px] font-medium" style={{ color: t.accent }}>Product Manager</div>
                            </div>
                          </div>
                          <div className="h-3 flex items-center px-2 gap-3 text-[3px] text-white/60" style={{ background: t.accent }}>
                            <span>sarah@pm.io</span>
                            <span>NYC</span>
                            <span>linkedin/sarah</span>
                          </div>
                          <div className="flex">
                            <div className="flex-1 p-1.5">
                              <div className="text-[3.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: t.accent }}>Experience</div>
                              <div className="text-[3px] font-semibold text-slate-700">Sr. PM · Stripe</div>
                              <div className="text-[2.5px] text-slate-400 mb-0.5">2021 – Present</div>
                              <div className="text-[2.5px] text-slate-500 leading-relaxed">Drove 40% revenue growth via new payments feature.</div>
                              <div className="text-[3.5px] font-bold uppercase tracking-wider mt-1 mb-0.5" style={{ color: t.accent }}>Education</div>
                              <div className="text-[3px] font-semibold text-slate-700">MBA · Wharton</div>
                            </div>
                            <div className="w-[35%] p-1.5 bg-slate-50">
                              <div className="text-[3.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: t.accent }}>Skills</div>
                              <div className="flex flex-wrap gap-[2px]">{['Agile', 'SQL', 'Jira', 'A/B'].map(s => <span key={s} className="text-[3px] px-[2px] py-[0.5px] rounded bg-slate-200 text-slate-600 leading-tight">{s}</span>)}</div>
                              <div className="text-[3.5px] font-bold uppercase tracking-wider mt-1 mb-0.5" style={{ color: t.accent }}>Certifications</div>
                              <div className="text-[2.5px] text-slate-500">PMP Certified<br/>Scrum Master</div>
                            </div>
                          </div>
                        </>
                      ) : t.layout === 'centered' ? (
                        <>
                          <div className="pt-2.5 pb-1.5 text-center border-b" style={{ borderColor: t.accent + '40' }}>
                            <div className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-[4px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accent}99)` }}>EP</div>
                            <div className="text-[5px] font-bold text-slate-800 leading-tight">Emily Parker</div>
                            <div className="text-[3.5px] font-medium mb-0.5" style={{ color: t.accent }}>Marketing Director</div>
                            <div className="flex justify-center gap-2 text-[2.5px] text-slate-400">
                              <span>emily@mail.com</span>
                              <span>Boston, MA</span>
                            </div>
                          </div>
                          <div className="p-2 space-y-1">
                            <div>
                              <div className="text-[3.5px] font-bold uppercase tracking-wider text-center mb-0.5" style={{ color: t.accent }}>Summary</div>
                              <div className="text-[2.5px] text-slate-500 text-center leading-relaxed">Results-driven marketer with 8+ years leading high-growth campaigns for Fortune 500 brands.</div>
                            </div>
                            <div>
                              <div className="text-[3.5px] font-bold uppercase tracking-wider text-center mb-0.5" style={{ color: t.accent }}>Experience</div>
                              <div className="text-center">
                                <div className="text-[3px] font-semibold text-slate-700">VP Marketing · HubSpot</div>
                                <div className="text-[2.5px] text-slate-400">2019 – Present</div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[3.5px] font-bold uppercase tracking-wider text-center mb-0.5" style={{ color: t.accent }}>Skills</div>
                              <div className="flex justify-center flex-wrap gap-[2px]">{['SEO', 'PPC', 'CRM', 'Analytics'].map(s => <span key={s} className="text-[3px] px-[3px] py-[0.5px] rounded leading-tight" style={{ background: t.accent + '15', color: t.accent }}>{s}</span>)}</div>
                            </div>
                          </div>
                        </>
                      ) : t.layout === 'border-top' ? (
                        <>
                          <div className="h-1.5" style={{ background: t.accent }} />
                          <div className="p-2">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[4px] font-bold text-white" style={{ background: t.accent + '90' }}>MR</div>
                              <div>
                                <div className="text-[5px] font-bold text-slate-800 leading-tight">Michael Ross</div>
                                <div className="text-[3.5px] font-medium" style={{ color: t.accent }}>Data Scientist</div>
                              </div>
                            </div>
                            <div className="mb-1">
                              <div className="text-[3.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: t.accent }}>Experience</div>
                              <div className="text-[3px] font-semibold text-slate-700">Lead Data Scientist · Netflix</div>
                              <div className="text-[2.5px] text-slate-400 mb-0.5">2020 – Present</div>
                              <div className="text-[2.5px] text-slate-500 leading-relaxed">Built ML models improving content recommendations by 35%.</div>
                            </div>
                            <div className="mb-1">
                              <div className="text-[3.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: t.accent }}>Education</div>
                              <div className="text-[3px] font-semibold text-slate-700">Ph.D. Statistics · Berkeley</div>
                              <div className="text-[2.5px] text-slate-400">2016 – 2020</div>
                            </div>
                            <div>
                              <div className="text-[3.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: t.accent }}>Skills</div>
                              <div className="flex flex-wrap gap-[2px]">{['Python', 'TensorFlow', 'SQL', 'Spark'].map(s => <span key={s} className="text-[3px] px-[3px] py-[0.5px] rounded leading-tight" style={{ background: t.accent + '15', color: t.accent }}>{s}</span>)}</div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="h-9 flex items-center px-2 gap-1.5" style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accent}cc)` }}>
                            <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-[4px] font-bold text-white/90 flex-shrink-0">
                              {i === 0 ? 'DP' : i === 7 ? 'LN' : 'JW'}
                            </div>
                            <div>
                              <div className="text-[4.5px] font-bold text-white/90 leading-tight">{i === 0 ? 'David Park' : i === 7 ? 'Lisa Nguyen' : 'James Wilson'}</div>
                              <div className="text-[3.5px] text-white/60 leading-tight">{i === 0 ? 'Software Engineer' : i === 7 ? 'Creative Director' : 'DevOps Engineer'}</div>
                            </div>
                          </div>
                          <div className="p-2 space-y-1">
                            <div>
                              <div className="text-[3.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: t.accent }}>Summary</div>
                              <div className="text-[2.5px] text-slate-500 leading-relaxed">{i === 0 ? 'Passionate engineer with 6+ years building scalable web applications and microservices.' : i === 7 ? 'Award-winning creative leader with a track record of bold brand campaigns.' : 'Infrastructure architect specializing in cloud-native deployments and CI/CD pipelines.'}</div>
                            </div>
                            <div>
                              <div className="text-[3.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: t.accent }}>Experience</div>
                              <div className="text-[3px] font-semibold text-slate-700">{i === 0 ? 'Sr. SWE · Google' : i === 7 ? 'Creative Dir · Nike' : 'Sr. DevOps · AWS'}</div>
                              <div className="text-[2.5px] text-slate-400">2021 – Present</div>
                            </div>
                            <div>
                              <div className="text-[3.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: t.accent }}>Skills</div>
                              <div className="flex flex-wrap gap-[2px]">{(i === 0 ? ['React', 'Go', 'K8s', 'GCP'] : i === 7 ? ['Figma', 'AI', 'Brand', 'Motion'] : ['Docker', 'Terraform', 'CI/CD', 'AWS']).map(s => <span key={s} className="text-[3px] px-[3px] py-[0.5px] rounded leading-tight" style={{ background: t.accent + '18', color: t.accent, border: `0.5px solid ${t.accent}30` }}>{s}</span>)}</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {i === 0 && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-lg" style={{ background: t.accent }}>
                        Popular
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
                      <span className="text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-sm">Use Template</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-sm text-white mb-0.5 group-hover:text-brand-300 transition-colors">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.tag}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/register" className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 font-semibold text-sm">
                Browse all 10 templates <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
                Trusted by <span className="text-gradient">50,000+ job seekers</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="glass rounded-2xl p-6 border border-white/6">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <BarChart3 className="w-3 h-3" />
                Pricing
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
                Simple, transparent<br />
                <span className="text-gradient">pricing</span>
              </h2>
              <p className="text-slate-400">Start free. Upgrade when you need more.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRICING.map((plan) => (
                <div key={plan.name} className={`relative rounded-2xl p-6 transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-brand-600/20 to-brand-600/5 border-2 border-brand-500/50 shadow-2xl shadow-brand-500/20'
                    : 'glass border border-white/8'
                }`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-500 to-violet-600 text-white text-xs font-bold shadow-lg">
                      {plan.badge}
                    </div>
                  )}
                  <div className="mb-5">
                    <h3 className="font-display font-bold text-xl text-white mb-1">{plan.name}</h3>
                    <p className="text-slate-500 text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-bold text-4xl text-white">{plan.price}</span>
                      <span className="text-slate-500 text-sm">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href} className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40'
                      : 'glass glass-hover text-slate-300 border border-white/10'
                  }`}>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative rounded-3xl p-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 50%, rgba(6,182,212,0.1) 100%)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <div className="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-500/40">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
                  Ready to land your<br />dream job?
                </h2>
                <p className="text-slate-400 mb-8 text-lg">Join 50,000+ professionals who built winning resumes with AI.</p>
                <Link href="/register" className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-bold text-lg shadow-2xl shadow-brand-500/40 hover:shadow-brand-500/60 transition-all">
                  <Sparkles className="w-5 h-5" />
                  Create Your Resume — Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/5 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
              <div>
                <Link href="/" className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-xl text-white">RESUM<span className="text-gradient">IND</span></span>
                </Link>
                <p className="text-slate-500 text-sm leading-relaxed">Build professional resumes with the power of AI. Land more interviews.</p>
                <div className="flex gap-3 mt-4">
                  {[Twitter, Github, Linkedin].map((Icon, i) => (
                    <a key={i} href="#" className="w-8 h-8 rounded-lg glass glass-hover flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {[
                { title: 'Product', links: ['Features', 'Templates', 'Pricing', 'Changelog'] },
                { title: 'Resources', links: ['Blog', 'Resume Tips', 'Career Guide', 'API Docs'] },
                { title: 'Company', links: ['About', 'Privacy', 'Terms', 'Contact'] },
              ].map(col => (
                <div key={col.title}>
                  <h4 className="font-semibold text-sm text-white mb-4">{col.title}</h4>
                  <ul className="space-y-2.5">
                    {col.links.map(link => (
                      <li key={link}>
                        <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-600 text-sm">© 2024 RESUMIND. All rights reserved.</p>
              <p className="text-slate-600 text-sm flex items-center gap-1">
                Built with <span className="text-rose-500">♥</span> for job seekers worldwide
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
