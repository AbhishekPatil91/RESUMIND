import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';

const INPUT_CLASS = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all";
const LABEL_CLASS = "text-sm text-slate-400 mb-1.5 block";

interface Props {
  data: any;
  onChange: (data: any) => void;
}

const FIELDS = [
  [{ key: 'firstName', label: 'First Name', placeholder: 'Jane' }, { key: 'lastName', label: 'Last Name', placeholder: 'Doe' }],
  [{ key: 'email', label: 'Email', placeholder: 'jane@example.com' }, { key: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000' }],
  [{ key: 'jobTitle', label: 'Job Title', placeholder: 'Senior Software Engineer' }, { key: 'location', label: 'Location', placeholder: 'San Francisco, CA' }],
  [{ key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/jane' }, { key: 'github', label: 'GitHub', placeholder: 'github.com/jane' }],
  [{ key: 'website', label: 'Website / Portfolio', placeholder: 'janedoe.dev' }],
];

export default function PersonalInfoForm({ data = {}, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (key: string, value: string) => {
    onChange({ ...data, [key]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({ ...data, profilePhoto: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    onChange({ ...data, profilePhoto: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-5">
      {/* Profile Photo Upload */}
      <div className="flex items-center gap-5">
        <div className="relative group">
          {data.profilePhoto ? (
            <div className="relative">
              <img src={data.profilePhoto} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-brand-500/40 shadow-lg shadow-brand-500/10" />
              <button onClick={removePhoto} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-400 transition-colors shadow-md">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 hover:border-brand-500/50 flex flex-col items-center justify-center text-slate-500 hover:text-brand-400 transition-all bg-white/5 hover:bg-brand-500/5"
            >
              <Camera className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">Photo</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white mb-1">Profile Photo</div>
          <p className="text-xs text-slate-500">Upload a professional headshot. PNG, JPG up to 2MB.</p>
          {!data.profilePhoto && (
            <button onClick={() => fileInputRef.current?.click()} className="mt-2 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Upload Photo
            </button>
          )}
        </div>
      </div>

      {/* Form Fields */}
      {FIELDS.map((row, i) => (
        <div key={i} className={`grid gap-4 ${row.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {row.map(field => (
            <div key={field.key}>
              <label className={LABEL_CLASS}>{field.label}</label>
              <input
                type="text"
                value={data[field.key] || ''}
                onChange={e => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={INPUT_CLASS}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
