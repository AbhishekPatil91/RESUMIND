import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Loader2, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { v4 as uuid } from 'uuid';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Props {
  data: any[];
  personalInfo: any;
  onChange: (data: any[]) => void;
  token: string;
}

export default function SkillsForm({ data = [], personalInfo, onChange, token }: Props) {
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<Record<string, string>>({});

  const addGroup = () => {
    onChange([...data, { id: uuid(), category: 'Technical', items: [] }]);
  };

  const updateGroup = (id: string, key: string, value: any) => {
    onChange(data.map(g => g.id === id ? { ...g, [key]: value } : g));
  };

  const removeGroup = (id: string) => onChange(data.filter(g => g.id !== id));

  const addSkill = (groupId: string) => {
    const val = newSkill[groupId]?.trim();
    if (!val) return;
    const group = data.find(g => g.id === groupId);
    if (!group) return;
    updateGroup(groupId, 'items', [...(group.items || []), val]);
    setNewSkill(prev => ({ ...prev, [groupId]: '' }));
  };

  const removeSkill = (groupId: string, idx: number) => {
    const group = data.find(g => g.id === groupId);
    if (!group) return;
    updateGroup(groupId, 'items', group.items.filter((_: any, i: number) => i !== idx));
  };

  const suggestSkills = async () => {
    if (!token) {
      toast.error('Please login to use AI features');
      return;
    }
    setSuggesting(true);
    try {
      const existing = data.flatMap(g => g.items || []);
      const { data: result } = await axios.post(`${API}/api/ai/suggest-skills`, {
        jobTitle: personalInfo?.jobTitle || 'Software Developer',
        existingSkills: existing,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuggestions(result.skills || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Skill suggestions failed');
    } finally {
      setSuggesting(false);
    }
  };

  const addSuggestion = (skill: string) => {
    if (data.length === 0) {
      onChange([{ id: uuid(), category: 'Technical', items: [skill] }]);
    } else {
      const lastGroup = data[data.length - 1];
      updateGroup(lastGroup.id, 'items', [...(lastGroup.items || []), skill]);
    }
    setSuggestions(prev => prev.filter(s => s !== skill));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={suggestSkills} disabled={suggesting}
          className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors disabled:opacity-60">
          {suggesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          AI Suggest Skills
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="glass rounded-xl p-3 border border-brand-500/20">
          <div className="text-xs text-slate-400 mb-2 font-semibold">Suggested skills — click to add:</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button key={s} onClick={() => addSuggestion(s)}
                className="text-xs px-2.5 py-1 rounded-lg bg-brand-500/15 text-brand-300 hover:bg-brand-500/30 border border-brand-500/20 transition-colors">
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {data.map(group => (
        <div key={group.id} className="glass rounded-xl border border-white/8 p-4">
          <div className="flex items-center gap-3 mb-3">
            <input value={group.category || ''} onChange={e => updateGroup(group.id, 'category', e.target.value)}
              placeholder="Category (e.g. Frontend)"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500/50 transition-all" />
            <button onClick={() => removeGroup(group.id)} className="text-slate-600 hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {(group.items || []).map((skill: string, i: number) => (
              <span key={i} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-white/8 text-slate-300 border border-white/10">
                {skill}
                <button onClick={() => removeSkill(group.id, i)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newSkill[group.id] || ''}
              onChange={e => setNewSkill(prev => ({ ...prev, [group.id]: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && addSkill(group.id)}
              placeholder="Add skill and press Enter"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-brand-500/50 transition-all" />
            <button onClick={() => addSkill(group.id)}
              className="px-3 py-2 rounded-lg bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 transition-colors text-xs font-medium">
              Add
            </button>
          </div>
        </div>
      ))}

      <button onClick={addGroup} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-white/10 hover:border-brand-500/30 hover:bg-brand-500/5 text-slate-500 hover:text-slate-300 text-sm font-medium transition-all">
        <Plus className="w-4 h-4" /> Add Skill Category
      </button>
    </div>
  );
}
