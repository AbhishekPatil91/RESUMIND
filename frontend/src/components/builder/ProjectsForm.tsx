// ProjectsForm.tsx
import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { v4 as uuid } from 'uuid';

const INPUT = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all";

interface Props { data: any[]; onChange: (data: any[]) => void; }

export default function ProjectsForm({ data = [], onChange }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const [techInput, setTechInput] = useState<Record<string, string>>({});

  const add = () => { const id = uuid(); onChange([...data, { id, name: '', description: '', technologies: [], link: '', github: '' }]); setOpen(id); };
  const update = (id: string, key: string, value: any) => onChange(data.map(i => i.id === id ? { ...i, [key]: value } : i));
  const remove = (id: string) => onChange(data.filter(i => i.id !== id));

  const addTech = (id: string) => {
    const val = techInput[id]?.trim();
    if (!val) return;
    const item = data.find(i => i.id === id);
    if (!item) return;
    update(id, 'technologies', [...(item.technologies || []), val]);
    setTechInput(prev => ({ ...prev, [id]: '' }));
  };

  const removeTech = (id: string, idx: number) => {
    const item = data.find(i => i.id === id);
    if (!item) return;
    update(id, 'technologies', item.technologies.filter((_: any, i: number) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {data.map(item => (
        <div key={item.id} className="glass rounded-xl border border-white/8 overflow-hidden">
          <button onClick={() => setOpen(open === item.id ? null : item.id)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/3 transition-colors">
            <div className="text-sm font-semibold text-white">{item.name || 'Project Name'}</div>
            <div className="flex items-center gap-2">
              <button onClick={e => { e.stopPropagation(); remove(item.id); }} className="p-1 text-slate-600 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {open === item.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </div>
          </button>
          {open === item.id && (
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Project Name</label>
                <input value={item.name || ''} onChange={e => update(item.id, 'name', e.target.value)} placeholder="My Awesome Project" className={INPUT} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Live Link</label>
                  <input value={item.link || ''} onChange={e => update(item.id, 'link', e.target.value)} placeholder="https://myproject.com" className={INPUT} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">GitHub</label>
                  <input value={item.github || ''} onChange={e => update(item.id, 'github', e.target.value)} placeholder="github.com/..." className={INPUT} />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Technologies</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(item.technologies || []).map((tech: string, i: number) => (
                    <span key={i} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-white/8 text-slate-300 border border-white/10">
                      {tech}
                      <button onClick={() => removeTech(item.id, i)} className="text-slate-500 hover:text-red-400"><X className="w-2.5 h-2.5" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={techInput[item.id] || ''} onChange={e => setTechInput(prev => ({ ...prev, [item.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addTech(item.id)} placeholder="React, Node.js..." className={`${INPUT} text-xs`} />
                  <button onClick={() => addTech(item.id)} className="px-3 py-2 rounded-lg bg-brand-500/20 text-brand-400 text-xs">Add</button>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Description</label>
                <textarea value={item.description || ''} onChange={e => update(item.id, 'description', e.target.value)}
                  placeholder="Describe what you built and the impact..." rows={3} className={`${INPUT} resize-none`} />
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-white/10 hover:border-brand-500/30 hover:bg-brand-500/5 text-slate-500 hover:text-slate-300 text-sm font-medium transition-all">
        <Plus className="w-4 h-4" /> Add Project
      </button>
    </div>
  );
}
