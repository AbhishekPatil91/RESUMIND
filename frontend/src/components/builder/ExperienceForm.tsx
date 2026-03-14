import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { v4 as uuid } from 'uuid';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const INPUT = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all";

interface Props {
  data: any[];
  onChange: (data: any[]) => void;
  token: string;
}

export default function ExperienceForm({ data = [], onChange, token }: Props) {
  const [open, setOpen] = useState<string | null>(data[0]?.id || null);
  const [improving, setImproving] = useState<string | null>(null);

  const addItem = () => {
    const id = uuid();
    const newItem = { id, company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '', achievements: [''] };
    onChange([...data, newItem]);
    setOpen(id);
  };

  const updateItem = (id: string, key: string, value: any) => {
    onChange(data.map(item => item.id === id ? { ...item, [key]: value } : item));
  };

  const removeItem = (id: string) => {
    onChange(data.filter(item => item.id !== id));
  };

  const addAchievement = (id: string) => {
    const item = data.find(i => i.id === id);
    if (!item) return;
    updateItem(id, 'achievements', [...(item.achievements || []), '']);
  };

  const updateAchievement = (id: string, idx: number, val: string) => {
    const item = data.find(i => i.id === id);
    if (!item) return;
    const achievements = [...(item.achievements || [])];
    achievements[idx] = val;
    updateItem(id, 'achievements', achievements);
  };

  const removeAchievement = (id: string, idx: number) => {
    const item = data.find(i => i.id === id);
    if (!item) return;
    updateItem(id, 'achievements', (item.achievements || []).filter((_: any, i: number) => i !== idx));
  };

  const improveDescription = async (item: any) => {
    if (!token) {
      toast.error('Please login to use AI features');
      return;
    }
    if (!item.description) {
      toast.error('Please enter a description first');
      return;
    }
    setImproving(item.id);
    try {
      const { data: result } = await axios.post(`${API}/api/ai/improve-description`, {
        description: item.description,
        position: item.position,
        company: item.company,
      }, { headers: { Authorization: `Bearer ${token}` } });
      updateItem(item.id, 'description', result.improved);
      toast.success('Description improved by AI!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'AI improvement failed');
    } finally {
      setImproving(null);
    }
  };

  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={item.id} className="glass rounded-xl border border-white/8 overflow-hidden">
          <button
            onClick={() => setOpen(open === item.id ? null : item.id)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/3 transition-colors">
            <div>
              <div className="text-sm font-semibold text-white">{item.position || 'Position Title'}</div>
              <div className="text-xs text-slate-500">{item.company || 'Company Name'}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} className="p-1 text-slate-600 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {open === item.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </div>
          </button>

          {open === item.id && (
            <div className="px-4 pb-4 space-y-3 border-t border-white/5">
              <div className="grid grid-cols-2 gap-3 pt-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Job Title *</label>
                  <input value={item.position || ''} onChange={e => updateItem(item.id, 'position', e.target.value)} placeholder="Software Engineer" className={INPUT} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Company *</label>
                  <input value={item.company || ''} onChange={e => updateItem(item.id, 'company', e.target.value)} placeholder="Google" className={INPUT} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Start Date</label>
                  <input value={item.startDate || ''} onChange={e => updateItem(item.id, 'startDate', e.target.value)} placeholder="Jan 2022" className={INPUT} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">End Date</label>
                  <input value={item.endDate || ''} onChange={e => updateItem(item.id, 'endDate', e.target.value)} placeholder="Dec 2023" disabled={item.current} className={INPUT} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 mb-1 block">Location</label>
                  <input value={item.location || ''} onChange={e => updateItem(item.id, 'location', e.target.value)} placeholder="San Francisco, CA" className={INPUT} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id={`current-${item.id}`} checked={item.current || false} onChange={e => updateItem(item.id, 'current', e.target.checked)} className="accent-brand-500" />
                <label htmlFor={`current-${item.id}`} className="text-xs text-slate-400">Currently working here</label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-400">Job Description</label>
                  <button onClick={() => improveDescription(item)} disabled={improving === item.id}
                    className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 disabled:opacity-50">
                    {improving === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    AI Improve
                  </button>
                </div>
                <textarea value={item.description || ''} onChange={e => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and impact..." rows={3}
                  className={`${INPUT} resize-none`} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-slate-400">Key Achievements</label>
                  <button onClick={() => addAchievement(item.id)} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                {(item.achievements || []).map((ach: string, i: number) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={ach} onChange={e => updateAchievement(item.id, i, e.target.value)}
                      placeholder="Increased revenue by 40% through..." className={`${INPUT} flex-1`} />
                    <button onClick={() => removeAchievement(item.id, i)} className="text-slate-600 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <button onClick={addItem} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-white/10 hover:border-brand-500/30 hover:bg-brand-500/5 text-slate-500 hover:text-slate-300 text-sm font-medium transition-all">
        <Plus className="w-4 h-4" />
        Add Work Experience
      </button>
    </div>
  );
}
