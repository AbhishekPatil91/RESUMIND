import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuid } from 'uuid';

const INPUT = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all";

interface Props { data: any[]; onChange: (data: any[]) => void; }

export default function CertificationsForm({ data = [], onChange }: Props) {
  const add = () => onChange([...data, { id: uuid(), name: '', issuer: '', date: '', credentialId: '', url: '' }]);
  const update = (id: string, key: string, value: string) => onChange(data.map(i => i.id === id ? { ...i, [key]: value } : i));
  const remove = (id: string) => onChange(data.filter(i => i.id !== id));

  return (
    <div className="space-y-4">
      {data.map(item => (
        <div key={item.id} className="glass rounded-xl border border-white/8 p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="text-sm font-semibold text-white">{item.name || 'Certification'}</div>
            <button onClick={() => remove(item.id)} className="text-slate-600 hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'name', label: 'Certification Name', placeholder: 'AWS Solutions Architect', cols: 2 },
              { key: 'issuer', label: 'Issuing Organization', placeholder: 'Amazon Web Services' },
              { key: 'date', label: 'Date Earned', placeholder: 'March 2024' },
              { key: 'credentialId', label: 'Credential ID', placeholder: 'ABC-123-XYZ' },
              { key: 'url', label: 'Credential URL', placeholder: 'https://...', cols: 2 },
            ].map(f => (
              <div key={f.key} className={f.cols === 2 ? 'col-span-2' : ''}>
                <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
                <input value={item[f.key] || ''} onChange={e => update(item.id, f.key, e.target.value)} placeholder={f.placeholder} className={INPUT} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-white/10 hover:border-brand-500/30 hover:bg-brand-500/5 text-slate-500 hover:text-slate-300 text-sm font-medium transition-all">
        <Plus className="w-4 h-4" /> Add Certification
      </button>
    </div>
  );
}
