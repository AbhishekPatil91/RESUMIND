import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Sparkles, Loader2 } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Props {
  data: any;
  onChange: (data: any) => void;
  token: string;
}

export default function SummaryForm({ data, onChange, token }: Props) {
  const [generating, setGenerating] = useState(false);

  const generateSummary = async () => {
    if (!token) {
      toast.error('Please login to use AI features');
      return;
    }
    setGenerating(true);
    try {
      const jobTitle = data?.personalInfo?.jobTitle || '';
      const experience = data?.experience?.map((e: any) => `${e.position} at ${e.company}`).join(', ') || '';
      const skills = data?.skills?.flatMap((s: any) => s.items || []) || [];
      
      const { data: result } = await axios.post(`${API}/api/ai/generate-summary`, {
        jobTitle,
        experience,
        skills,
      }, { headers: { Authorization: `Bearer ${token}` } });
      onChange({ summary: result.summary });
      toast.success('AI summary generated!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'AI generation failed. Check your OpenAI key.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm text-slate-400">Professional Summary</label>
          <button onClick={generateSummary} disabled={generating}
            className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors disabled:opacity-60">
            {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {generating ? 'Generating...' : 'AI Generate'}
          </button>
        </div>
        <textarea
          value={data?.summary || ''}
          onChange={e => onChange({ summary: e.target.value })}
          rows={6}
          placeholder="Write a compelling professional summary that highlights your key experiences, skills, and career goals..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-slate-600">Tip: 2-3 sentences work best for ATS optimization</p>
          <span className="text-xs text-slate-600">{(data?.summary || '').length}/500</span>
        </div>
      </div>
    </div>
  );
}
