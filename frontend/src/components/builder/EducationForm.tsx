// EducationForm
import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuid } from 'uuid';

const INPUT = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all";

interface Props { data: any[]; onChange: (data: any[]) => void; }

export default function EducationForm({ data = [], onChange }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  const add = () => {
    const id = uuid();
    onChange([...data, { id, institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }]);
    setOpen(id);
  };

  const update = (id: string, key: string, value: string) => onChange(data.map(i => i.id === id ? { ...i, [key]: value } : i));
  const remove = (id: string) => onChange(data.filter(i => i.id !== id));

  return (
    <div className="space-y-3">
      {data.map(item => (
        <div key={item.id} className="glass rounded-xl border border-white/8 overflow-hidden">
          <button onClick={() => setOpen(open === item.id ? null : item.id)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/3 transition-colors">
            <div>
              <div className="text-sm font-semibold text-white">{item.degree || 'Degree'}{item.field && ` in ${item.field}`}</div>
              <div className="text-xs text-slate-500">{item.institution || 'Institution'}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={e => { e.stopPropagation(); remove(item.id); }} className="p-1 text-slate-600 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {open === item.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </div>
          </button>
          {open === item.id && (
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'institution', label: 'Institution', placeholder: 'MIT', cols: 2 },
                  { key: 'degree', label: 'Degree', placeholder: 'Bachelor of Science' },
                  { key: 'field', label: 'Field of Study', placeholder: 'Computer Science' },
                  { key: 'startDate', label: 'Start Date', placeholder: '2018' },
                  { key: 'endDate', label: 'End Date', placeholder: '2022' },
                  { key: 'gpa', label: 'GPA (optional)', placeholder: '3.9/4.0' },
                ].map(f => (
                  <div key={f.key} className={f.cols === 2 ? 'col-span-2' : ''}>
                    <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
                    <input value={item[f.key] || ''} onChange={e => update(item.id, f.key, e.target.value)} placeholder={f.placeholder} className={INPUT} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-white/10 hover:border-brand-500/30 hover:bg-brand-500/5 text-slate-500 hover:text-slate-300 text-sm font-medium transition-all">
        <Plus className="w-4 h-4" /> Add Education
      </button>
    </div>
  );
}
