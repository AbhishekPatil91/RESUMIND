import Head from 'next/head';
import Link from 'next/link';
import { Palette, ChevronRight, Sparkles } from 'lucide-react';

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

function TemplateMockup({ t }: { t: typeof TEMPLATES[0] }) {
  if (t.layout === 'left-sidebar') return (
    <div className="flex h-full">
      <div className="w-[38%] h-full p-1.5" style={{ background: t.accent }}>
        <div className="w-7 h-7 rounded-full bg-white/30 mx-auto mb-1.5" />
        <div className="h-1.5 w-12 bg-white/60 rounded mx-auto mb-0.5" />
        <div className="h-1 w-8 bg-white/40 rounded mx-auto mb-3" />
        <div className="space-y-1 px-0.5">
          {[...Array(5)].map((_, j) => <div key={j} className="h-0.5 bg-white/25 rounded w-full" />)}
        </div>
        <div className="mt-3 space-y-1 px-0.5">
          <div className="h-1 bg-white/40 rounded w-10" />
          <div className="flex flex-wrap gap-0.5">{['JS', 'TS', 'Py', 'SQL'].map(s => <span key={s} className="text-[4px] px-0.5 rounded bg-white/20 text-white/70 leading-tight">{s}</span>)}</div>
        </div>
      </div>
      <div className="flex-1 p-2 space-y-2">
        <div className="h-1.5 w-12 rounded" style={{ background: t.accent + '50' }} />
        <div className="space-y-0.5">{[...Array(4)].map((_, j) => <div key={j} className={`h-0.5 bg-slate-200 rounded ${j === 3 ? 'w-3/4' : 'w-full'}`} />)}</div>
        <div className="h-1.5 w-10 rounded" style={{ background: t.accent + '50' }} />
        <div className="space-y-0.5">{[...Array(5)].map((_, j) => <div key={j} className={`h-0.5 bg-slate-200 rounded ${j === 4 ? 'w-2/3' : 'w-full'}`} />)}</div>
      </div>
    </div>
  );
  if (t.layout === 'dark-sidebar') return (
    <div className="flex h-full">
      <div className="flex-1 p-2">
        <div className="mb-2 pb-1 border-b-2" style={{ borderColor: t.accent }}>
          <div className="h-2 w-16 bg-slate-800 rounded mb-0.5" />
          <div className="h-1 w-12 rounded" style={{ background: t.accent + '80' }} />
        </div>
        <div className="space-y-0.5">{[...Array(8)].map((_, j) => <div key={j} className={`h-0.5 bg-slate-100 rounded ${j % 3 === 2 ? 'w-2/3' : 'w-full'}`} />)}</div>
      </div>
      <div className="w-[30%] p-1.5" style={{ background: '#1e293b' }}>
        <div className="w-6 h-6 rounded-full mx-auto mb-1.5" style={{ background: t.accent + '40' }} />
        <div className="space-y-0.5">{[...Array(6)].map((_, j) => <div key={j} className="h-0.5 bg-white/20 rounded w-full" />)}</div>
      </div>
    </div>
  );
  if (t.layout === 'split-header') return (
    <>
      <div className="h-8 flex items-center px-2" style={{ background: '#1e293b' }}>
        <div className="w-6 h-6 rounded-full mr-2" style={{ background: `${t.accent}60` }} />
        <div><div className="h-1.5 w-14 bg-white/70 rounded mb-0.5" /><div className="h-1 w-10 rounded" style={{ background: t.accent }} /></div>
      </div>
      <div className="h-3 flex items-center px-2 gap-2" style={{ background: t.accent }}>
        {['email', 'phone', 'loc'].map(x => <div key={x} className="h-0.5 w-8 bg-white/60 rounded" />)}
      </div>
      <div className="flex">
        <div className="flex-1 p-2 space-y-1">{[...Array(8)].map((_, j) => <div key={j} className={`h-0.5 bg-slate-200 rounded ${j === 0 || j === 4 ? 'w-10' : j % 3 === 0 ? 'w-4/5' : 'w-full'}`} style={(j === 0 || j === 4) ? { background: t.accent + '60' } : {}} />)}</div>
        <div className="w-[35%] p-2 bg-slate-50 space-y-1">{[...Array(6)].map((_, j) => <div key={j} className={`h-0.5 bg-slate-200 rounded ${j === 0 ? 'w-8' : 'w-full'}`} style={j === 0 ? { background: t.accent + '60' } : {}} />)}</div>
      </div>
    </>
  );
  if (t.layout === 'centered') return (
    <>
      <div className="pt-3 pb-2 text-center border-b" style={{ borderColor: t.accent + '40' }}>
        <div className="h-2 w-20 bg-slate-800 rounded mx-auto mb-1" />
        <div className="h-1 w-8 rounded mx-auto mb-1" style={{ background: t.accent }} />
        <div className="flex justify-center gap-1.5 mt-1">{[1,2,3].map(x => <div key={x} className="h-0.5 w-6 bg-slate-300 rounded" />)}</div>
      </div>
      <div className="p-2 space-y-1.5">
        {[...Array(10)].map((_, j) => <div key={j} className={`h-0.5 bg-slate-200 rounded ${j === 0 || j === 4 || j === 7 ? 'w-10' : j % 3 === 0 ? 'w-3/4' : 'w-full'}`} style={(j === 0 || j === 4 || j === 7) ? { background: t.accent + '60' } : {}} />)}
      </div>
    </>
  );
  if (t.layout === 'border-top') return (
    <>
      <div className="h-1.5" style={{ background: t.accent }} />
      <div className="p-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full" style={{ background: t.accent + '30' }} />
          <div><div className="h-2 w-16 bg-slate-800 rounded mb-0.5" /><div className="h-1 w-10 rounded" style={{ background: t.accent + '80' }} /></div>
        </div>
        <div className="space-y-1">{[...Array(10)].map((_, j) => <div key={j} className={`h-0.5 bg-slate-200 rounded ${j === 0 || j === 5 ? 'w-10' : j % 3 === 2 ? 'w-3/4' : 'w-full'}`} style={(j === 0 || j === 5) ? { background: t.accent + '50' } : {}} />)}</div>
      </div>
    </>
  );
  return (
    <>
      <div className="h-9 flex items-center px-2 gap-2" style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accent}cc)` }}>
        <div className="w-6 h-6 rounded-full bg-white/30 flex-shrink-0" />
        <div><div className="h-1.5 w-14 bg-white/80 rounded mb-0.5" /><div className="h-1 w-10 bg-white/50 rounded" /></div>
      </div>
      <div className="p-2 space-y-1.5">
        <div className="h-1 w-10 rounded" style={{ background: t.accent + '60' }} />
        <div className="space-y-0.5">{[...Array(3)].map((_, j) => <div key={j} className="h-0.5 bg-slate-200 rounded w-full" />)}</div>
        <div className="h-1 w-12 rounded" style={{ background: t.accent + '60' }} />
        {[...Array(5)].map((_, j) => <div key={j} className={`h-0.5 bg-slate-200 rounded ${j === 4 ? 'w-2/3' : 'w-full'}`} />)}
        <div className="flex gap-1 mt-1">{['React', 'TS', 'Node', 'AWS'].map(s => <span key={s} className="text-[4px] px-1 rounded leading-tight" style={{ background: t.accent + '18', color: t.accent, border: `0.5px solid ${t.accent}40` }}>{s}</span>)}</div>
      </div>
    </>
  );
}

export default function TemplatesPage() {
  return (
    <>
      <Head>
        <title>Templates — RESUMIND</title>
        <meta name="description" content="Browse all resume templates available in RESUMIND." />
      </Head>

      <div className="min-h-screen bg-dark-950 text-slate-100">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-pink-500/8 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-brand-500/8 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
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

            <Link href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 transition-all">
              <Sparkles className="w-4 h-4" />
              Get Started Free
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="text-center mb-14 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/20 bg-pink-500/10 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Palette className="w-3 h-3" />
              10 Templates
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Stunning templates for<br />
              <span className="text-gradient-warm">every industry</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Choose your favorite design and customize it to match your personal brand.
              Each resume is built for ATS and looks great when printed or shared online.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {TEMPLATES.map((t, i) => (
              <Link href="/register" key={t.name} className="group cursor-pointer">
                <div className="relative rounded-xl overflow-hidden border border-white/8 group-hover:border-white/25 group-hover:shadow-xl group-hover:shadow-black/20 transition-all duration-300 aspect-[3/4] mb-3 group-hover:-translate-y-1.5" style={{ background: `linear-gradient(135deg, ${t.accent}12 0%, #0f1629 100%)` }}>
                  <div className="absolute inset-3 bg-white rounded-lg shadow-xl overflow-hidden">
                    <TemplateMockup t={t} />
                  </div>
                  {i === 0 && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-lg" style={{ background: t.accent }}>
                      Most Popular
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <span className="text-white text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm">Use This Template</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="font-semibold text-sm text-white mb-0.5 group-hover:text-brand-300 transition-colors">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.tag}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/register" className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white font-bold text-sm shadow-2xl shadow-brand-500/20 transition-all glow-brand-hover">
              <Sparkles className="w-4 h-4" />
              Start Building Your Resume
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
