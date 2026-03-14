import Head from 'next/head';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Save, Download, Share2, ChevronLeft, ChevronRight,
  Sparkles, Eye, EyeOff, Loader2, Plus, Trash2,
  User, Briefcase, GraduationCap, Code2, FolderOpen, Award,
  CheckCircle2, FileText, Wand2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import PersonalInfoForm from '../../components/builder/PersonalInfoForm';
import SummaryForm from '../../components/builder/SummaryForm';
import ExperienceForm from '../../components/builder/ExperienceForm';
import EducationForm from '../../components/builder/EducationForm';
import SkillsForm from '../../components/builder/SkillsForm';
import ProjectsForm from '../../components/builder/ProjectsForm';
import CertificationsForm from '../../components/builder/CertificationsForm';
import ResumePreview from '../../components/ResumePreview';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const STEPS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'certifications', label: 'Certifications', icon: Award },
];

const TEMPLATES = [
  { id: 'modern', name: 'Modern', color: '#6366f1' },
  { id: 'executive', name: 'Executive', color: '#0ea5e9' },
  { id: 'creative', name: 'Creative', color: '#ec4899' },
  { id: 'minimal', name: 'Minimal', color: '#10b981' },
  { id: 'tech', name: 'Tech Pro', color: '#f59e0b' },
  { id: 'professional', name: 'Professional', color: '#2563eb' },
  { id: 'elegant', name: 'Elegant', color: '#7c3aed' },
  { id: 'bold', name: 'Bold', color: '#dc2626' },
  { id: 'compact', name: 'Compact', color: '#0d9488' },
  { id: 'infographic', name: 'Infographic', color: '#7c3aed' },
];

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export default function BuilderPage() {
  const router = useRouter();
  const { id } = router.query;
  const { loadUser, isAuthenticated } = useAuthStore();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showPreview, setShowPreview] = useState(true);
  const [atsScore, setAtsScore] = useState<any>(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [showAtsResults, setShowAtsResults] = useState(false);
  const [atsForm, setAtsForm] = useState({ jobRole: '', companyName: '', jobDescription: '' });
  const autoSaveTimer = useRef<NodeJS.Timeout>();
  const saveRef = useRef<(data?: any, silent?: boolean) => Promise<void>>();

  // Hydrate user if needed, then fetch resume by id
  useEffect(() => {
    if (!id) return;
    const init = async () => {
      const storedToken = getToken();
      if (!storedToken) {
        router.push('/login');
        return;
      }
      if (!isAuthenticated) {
        await loadUser();
      }
      await fetchResume(id as string);
    };
    init();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchResume = async (resumeId: string) => {
    const t = getToken();
    if (!resumeId || !t) return;
    try {
      const { data } = await axios.get(`${API}/api/resumes/${resumeId}`, { headers: authHeaders() });
      setResume(data.resume);
    } catch {
      toast.error('Resume not found');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async (data?: any, silent = false) => {
    if (!id || !getToken()) return;
    setSaving(true);
    try {
      await axios.put(`${API}/api/resumes/${id}`, data || resume, { headers: authHeaders() });
      if (!silent) toast.success('Resume saved!');
    } catch (err: any) {
      if (!silent) toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Keep saveRef in sync with the latest saveResume so auto-save never uses a stale closure
  useEffect(() => {
    saveRef.current = saveResume;
  });

  const updateResume = useCallback((updates: any) => {
    setResume((prev: any) => {
      const updated = { ...prev, ...updates };
      // Auto-save debounce
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        saveRef.current?.(updated, true);
      }, 2000);
      return updated;
    });
  }, []);

  const openAtsCheck = () => {
    if (!getToken()) { toast.error('Please login to use ATS check'); return; }
    if (!resume) { toast.error('No resume data to check'); return; }
    setShowAtsModal(true);
  };

  const checkATS = async () => {
    if (!atsForm.jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }
    setAtsLoading(true);
    try {
      const jobDescription = `Role: ${atsForm.jobRole}\nCompany: ${atsForm.companyName}\n\n${atsForm.jobDescription}`;
      const { data } = await axios.post(`${API}/api/ai/ats-score`, { resumeData: resume, jobDescription }, { headers: authHeaders() });
      setAtsScore(data);
      updateResume({ atsScore: data.score });
      setShowAtsModal(false);
      setShowAtsResults(true);
      toast.success(`ATS Score: ${data.score}%`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'ATS check failed. Check your AI settings.');
    } finally {
      setAtsLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!resume) {
      toast.error('No resume to download');
      return;
    }
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      
      // Use the hidden full-size element for crisp PDF
      const source = document.getElementById('resume-pdf-source');
      if (!source) return toast.error('Preview not available');
      
      // Temporarily make visible for capture
      source.style.display = 'block';
      
      const canvas = await html2canvas(source, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 816,
        windowWidth: 816,
        logging: false,
      });
      
      source.style.display = 'none';
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Handle multi-page
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${resume?.title || 'resume'}.pdf`);
      toast.success('PDF downloaded!');
    } catch (err: any) {
      toast.error(err.message || 'PDF generation failed');
    }
  };

  const shareResume = async () => {
    if (!getToken()) {
      toast.error('Please login to share resume');
      return;
    }
    try {
      const { data } = await axios.post(`${API}/api/resumes/${id}/share`, {}, { headers: authHeaders() });
      const url = `${window.location.origin}${data.shareUrl}`;
      await navigator.clipboard.writeText(url);
      toast.success('Share link copied!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate share link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  const renderStepForm = () => {
    switch (STEPS[activeStep].id) {
      case 'personal': return <PersonalInfoForm data={resume?.personalInfo} onChange={(v: any) => updateResume({ personalInfo: v })} />;
      case 'summary': return <SummaryForm data={resume} onChange={updateResume} token={getToken()!} />;
      case 'experience': return <ExperienceForm data={resume?.experience} onChange={(v: any) => updateResume({ experience: v })} token={getToken()!} />;
      case 'education': return <EducationForm data={resume?.education} onChange={(v: any) => updateResume({ education: v })} />;
      case 'skills': return <SkillsForm data={resume?.skills} personalInfo={resume?.personalInfo} onChange={(v: any) => updateResume({ skills: v })} token={getToken()!} />;
      case 'projects': return <ProjectsForm data={resume?.projects} onChange={(v: any) => updateResume({ projects: v })} />;
      case 'certifications': return <CertificationsForm data={resume?.certifications} onChange={(v: any) => updateResume({ certifications: v })} />;
      default: return null;
    }
  };

  return (
    <>
      <Head><title>{resume?.title || 'Resume Builder'} — RESUMIND</title></Head>
      <div className="min-h-screen bg-dark-950 flex flex-col">
        {/* Top bar */}
        <div className="h-14 border-b border-white/5 bg-dark-900/80 backdrop-blur-xl flex items-center px-4 gap-3 sticky top-0 z-50 flex-shrink-0">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-slate-500 hover:text-white text-sm transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </button>

          <div className="h-5 w-px bg-white/10" />

          <input
            value={resume?.title || ''}
            onChange={e => updateResume({ title: e.target.value })}
            className="bg-transparent text-white font-semibold text-sm focus:outline-none border-b border-transparent focus:border-brand-500/50 px-1 py-0.5 w-48"
            placeholder="Resume Title"
          />

          <div className="flex-1" />

          {/* Template picker */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto max-w-[480px] scrollbar-thin">
            {TEMPLATES.map(t => (
              <button key={t.id}
                onClick={() => updateResume({ template: t.id })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                  resume?.template === t.id
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.color }} />
                {t.name}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-white/10 hidden md:block" />

          {/* ATS Check */}
          <button onClick={openAtsCheck} disabled={atsLoading}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass glass-hover text-slate-300 text-xs font-medium transition-all disabled:opacity-60">
            {atsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            ATS Check
            {resume?.atsScore > 0 && <span className="ml-1 font-bold" style={{ color: resume.atsScore >= 70 ? '#10b981' : '#f59e0b' }}>{resume.atsScore}%</span>}
          </button>

          {/* Preview toggle */}
          <button onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass glass-hover text-slate-300 text-xs font-medium transition-all">
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">Preview</span>
          </button>

          {/* Save */}
          <button onClick={() => saveResume()} disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass glass-hover text-slate-300 text-xs font-medium transition-all disabled:opacity-60">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Saving...' : 'Save'}
          </button>

          <button onClick={shareResume} className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass glass-hover text-slate-300 text-xs font-medium transition-all">
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>

          <button onClick={downloadPDF} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white text-xs font-semibold transition-all shadow-lg shadow-brand-500/20">
            <Download className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Steps sidebar */}
          <div className="w-52 border-r border-white/5 bg-dark-900/40 flex-shrink-0 p-3 overflow-y-auto">
            <div className="space-y-1">
              {STEPS.map((step, i) => (
                <button key={step.id}
                  onClick={() => setActiveStep(i)}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    activeStep === i
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}>
                  <step.icon className="w-4 h-4 flex-shrink-0" />
                  {step.label}
                </button>
              ))}
            </div>

            {/* ATS score display */}
            {atsScore && (
              <div className="mt-4 p-3 glass rounded-xl border border-white/8">
                <div className="text-xs font-semibold text-slate-400 mb-2">ATS Score</div>
                <div className="text-2xl font-display font-bold mb-1"
                  style={{ color: atsScore.score >= 80 ? '#10b981' : atsScore.score >= 60 ? '#f59e0b' : '#ef4444' }}>
                  {atsScore.score}%
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${atsScore.score}%`,
                      background: atsScore.score >= 80 ? '#10b981' : atsScore.score >= 60 ? '#f59e0b' : '#ef4444'
                    }} />
                </div>
                {atsScore.improvements?.slice(0, 2).map((tip: string, i: number) => (
                  <div key={i} className="text-xs text-slate-500 mb-1 flex gap-1">
                    <span className="text-amber-500 flex-shrink-0">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
                <button onClick={() => setShowAtsResults(true)} className="mt-2 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
                  View Full Report →
                </button>
              </div>
            )}
          </div>

          {/* Form area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  {(() => { const S = STEPS[activeStep]; return <S.icon className="w-5 h-5 text-brand-400" />; })()}
                  {STEPS[activeStep].label}
                </h2>
                <div className="text-xs text-slate-600">{activeStep + 1} / {STEPS.length}</div>
              </div>

              {renderStepForm()}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                  disabled={activeStep === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass glass-hover text-slate-400 text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                {activeStep < STEPS.length - 1 ? (
                  <button
                    onClick={() => setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1))}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white text-sm font-semibold transition-all">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={downloadPDF}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold transition-all">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preview panel */}
          {showPreview && (
            <div className="w-[420px] border-l border-white/5 bg-dark-900/30 flex-shrink-0 overflow-y-auto p-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                Live Preview
              </div>
              <div id="resume-preview-content" className="scale-[0.55] origin-top-left" style={{ width: '181.8%' }}>
                <ResumePreview resume={resume} />
              </div>
            </div>
          )}
        </div>

        {/* Hidden full-size PDF source for crisp export */}
        <div id="resume-pdf-source" style={{ display: 'none', position: 'absolute', left: '-9999px', top: 0, width: '816px', background: '#fff' }}>
          <ResumePreview resume={resume} />
        </div>

        {/* ATS Check Modal */}
        {showAtsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-dark-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ATS Score Check
                </h3>
                <button onClick={() => setShowAtsModal(false)} className="text-slate-500 hover:text-white transition-colors text-xl leading-none">&times;</button>
              </div>
              <p className="text-xs text-slate-400 mb-4">Enter the job details to check how well your resume matches the position.</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Job Role *</label>
                    <input
                      value={atsForm.jobRole}
                      onChange={e => setAtsForm(prev => ({ ...prev, jobRole: e.target.value }))}
                      placeholder="e.g. Frontend Developer"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Company Name</label>
                    <input
                      value={atsForm.companyName}
                      onChange={e => setAtsForm(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="e.g. Google"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Job Description *</label>
                  <textarea
                    value={atsForm.jobDescription}
                    onChange={e => setAtsForm(prev => ({ ...prev, jobDescription: e.target.value }))}
                    rows={6}
                    placeholder="Paste the full job description here..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button onClick={() => setShowAtsModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm transition-colors">
                  Cancel
                </button>
                <button
                  onClick={checkATS}
                  disabled={atsLoading || !atsForm.jobDescription.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {atsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {atsLoading ? 'Analyzing...' : 'Check ATS Score'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ATS Results Modal */}
        {showAtsResults && atsScore && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ATS Analysis Report
                </h3>
                <button onClick={() => setShowAtsResults(false)} className="text-slate-500 hover:text-white transition-colors text-xl leading-none">&times;</button>
              </div>
              <div className="p-6 pt-4 overflow-y-auto space-y-5">
                {/* Score */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center border-2" style={{
                    borderColor: atsScore.score >= 80 ? '#10b981' : atsScore.score >= 60 ? '#f59e0b' : '#ef4444',
                    background: (atsScore.score >= 80 ? '#10b981' : atsScore.score >= 60 ? '#f59e0b' : '#ef4444') + '15'
                  }}>
                    <span className="text-2xl font-display font-bold" style={{ color: atsScore.score >= 80 ? '#10b981' : atsScore.score >= 60 ? '#f59e0b' : '#ef4444' }}>{atsScore.score}%</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">ATS Compatibility Score</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {atsScore.score >= 80 ? 'Excellent match! Your resume is well-optimized.' : atsScore.score >= 60 ? 'Good match, but there\'s room for improvement.' : 'Needs improvement to pass ATS filters.'}
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                {atsScore.strengths?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1.5">✓ Strengths</h4>
                    <div className="space-y-1.5">
                      {atsScore.strengths.map((s: string, i: number) => (
                        <div key={i} className="text-xs text-slate-300 flex gap-2 items-start">
                          <span className="text-emerald-500 flex-shrink-0 mt-0.5">•</span>{s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvements */}
                {atsScore.improvements?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1.5">⚡ Suggested Improvements</h4>
                    <div className="space-y-1.5">
                      {atsScore.improvements.map((s: string, i: number) => (
                        <div key={i} className="text-xs text-slate-300 flex gap-2 items-start">
                          <span className="text-amber-500 flex-shrink-0 mt-0.5">•</span>{s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Keywords */}
                {atsScore.keywords_missing?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2 flex items-center gap-1.5">🔑 Missing Keywords</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {atsScore.keywords_missing.map((kw: string, i: number) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Skills */}
                {atsScore.suggested_skills?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-2 flex items-center gap-1.5">🎯 Recommended Skills to Add</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {atsScore.suggested_skills.map((skill: string, i: number) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-300 border border-brand-500/20">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Course Recommendations */}
                {atsScore.course_recommendations?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-2 flex items-center gap-1.5">📚 Recommended Courses</h4>
                    <div className="space-y-2">
                      {atsScore.course_recommendations.map((course: any, i: number) => (
                        <div key={i} className="glass rounded-xl p-3 border border-white/8">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-sm font-semibold text-white">{course.title}</div>
                              <div className="text-xs text-violet-400 mt-0.5">{course.platform}</div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">{course.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-white/5 flex justify-end">
                <button onClick={() => setShowAtsResults(false)}
                  className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-all">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
