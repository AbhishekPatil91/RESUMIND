import React from 'react';

interface ResumePreviewProps {
  resume: any;
}

const TEMPLATE_THEMES: Record<string, { primary: string; secondary: string; font: string }> = {
  modern: { primary: '#6366f1', secondary: '#e0e7ff', font: 'system-ui' },
  executive: { primary: '#0ea5e9', secondary: '#e0f2fe', font: 'Georgia, serif' },
  creative: { primary: '#ec4899', secondary: '#fce7f3', font: 'system-ui' },
  minimal: { primary: '#10b981', secondary: '#d1fae5', font: 'system-ui' },
  tech: { primary: '#f59e0b', secondary: '#fef3c7', font: '"Courier New", monospace' },
  professional: { primary: '#2563eb', secondary: '#dbeafe', font: 'system-ui' },
  elegant: { primary: '#7c3aed', secondary: '#ede9fe', font: '"Playfair Display", Georgia, serif' },
  bold: { primary: '#dc2626', secondary: '#fee2e2', font: 'system-ui' },
  compact: { primary: '#0d9488', secondary: '#ccfbf1', font: 'system-ui' },
  infographic: { primary: '#7c3aed', secondary: '#f3e8ff', font: 'system-ui' },
};

function ProfilePhoto({ src, initials, size = 64, className = '' }: { src?: string; initials: string; size?: number; className?: string }) {
  return src ? (
    <img src={src} alt="Profile" className={className} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />
  ) : (
    <div className={className} style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  if (!resume) return (
    <div className="bg-white rounded-xl shadow-2xl p-8 min-h-[1056px] flex items-center justify-center">
      <p className="text-gray-400 text-sm">Start filling in your details to see the preview</p>
    </div>
  );

  const theme = TEMPLATE_THEMES[resume.template] || TEMPLATE_THEMES.modern;
  const color = theme.primary;
  const { personalInfo: pi, summary, experience = [], education = [], skills = [], projects = [], certifications = [] } = resume;
  const template = resume.template || 'modern';
  const initials = `${(pi?.firstName?.[0] || 'U').toUpperCase()}${(pi?.lastName?.[0] || '').toUpperCase()}`;
  const fullName = `${pi?.firstName || 'Your Name'} ${pi?.lastName || ''}`.trim();

  // --- MODERN TEMPLATE ---
  if (template === 'modern') {
    return (
      <div className="bg-white shadow-2xl overflow-hidden" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '1056px', width: '816px' }}>
        <div style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }} className="px-10 py-8 text-white">
          <div className="flex items-center gap-5">
            {(pi?.profilePhoto || true) && <ProfilePhoto src={pi?.profilePhoto} initials={initials} size={72} className="border-2 border-white/30 shadow-lg" />}
            <div className="flex-1">
              <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '4px' }}>{fullName}</h1>
              <p style={{ fontSize: '14px', opacity: 0.92, marginBottom: '10px', fontWeight: 500 }}>{pi?.jobTitle || 'Your Job Title'}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11px', opacity: 0.85 }}>
                {pi?.email && <span>✉ {pi.email}</span>}
                {pi?.phone && <span>✆ {pi.phone}</span>}
                {pi?.location && <span>⚲ {pi.location}</span>}
                {pi?.linkedin && <span>in {pi.linkedin}</span>}
                {pi?.github && <span>⌘ {pi.github}</span>}
                {pi?.website && <span>◎ {pi.website}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="px-10 py-7">
          {summary && <SectionBlock title="Professional Summary" color={color}><p style={{ color: '#4b5563', fontSize: '12px', lineHeight: 1.7 }}>{summary}</p></SectionBlock>}
          {experience.length > 0 && <SectionBlock title="Work Experience" color={color}>{experience.map((exp: any, i: number) => <ExpBlock key={exp.id||i} exp={exp} color={color} />)}</SectionBlock>}
          {education.length > 0 && <SectionBlock title="Education" color={color}>{education.map((edu: any, i: number) => <EduBlock key={edu.id||i} edu={edu} color={color} />)}</SectionBlock>}
          {skills.length > 0 && <SectionBlock title="Skills" color={color}><SkillsBlock skills={skills} color={color} /></SectionBlock>}
          {projects.length > 0 && <SectionBlock title="Projects" color={color}>{projects.map((p: any, i: number) => <ProjBlock key={p.id||i} proj={p} color={color} />)}</SectionBlock>}
          {certifications.length > 0 && <SectionBlock title="Certifications" color={color}>{certifications.map((c: any, i: number) => <CertBlock key={c.id||i} cert={c} color={color} />)}</SectionBlock>}
        </div>
      </div>
    );
  }

  // --- EXECUTIVE TEMPLATE ---
  if (template === 'executive') {
    return (
      <div className="bg-white shadow-2xl overflow-hidden" style={{ fontFamily: 'Georgia, "Times New Roman", serif', minHeight: '1056px', width: '816px' }}>
        <div className="px-10 py-7 border-b-4" style={{ borderColor: color }}>
          <div className="flex items-center gap-5">
            <ProfilePhoto src={pi?.profilePhoto} initials={initials} size={64} />
            <div className="flex-1">
              <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>{fullName}</h1>
              <p style={{ fontSize: '14px', marginTop: '2px', color }}>{pi?.jobTitle || 'Your Job Title'}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '11px', color: '#6b7280', marginTop: '8px' }}>
                {pi?.email && <span>{pi.email}</span>}
                {pi?.phone && <span>{pi.phone}</span>}
                {pi?.location && <span>{pi.location}</span>}
                {pi?.linkedin && <span>{pi.linkedin}</span>}
                {pi?.github && <span>{pi.github}</span>}
                {pi?.website && <span>{pi.website}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex-1 px-10 py-7">
            {summary && <SectionBlock title="Summary" color={color}><p style={{ color: '#4b5563', fontSize: '12px', lineHeight: 1.7, fontStyle: 'italic' }}>{summary}</p></SectionBlock>}
            {experience.length > 0 && <SectionBlock title="Experience" color={color}>{experience.map((exp: any, i: number) => <ExpBlock key={exp.id||i} exp={exp} color={color} />)}</SectionBlock>}
            {projects.length > 0 && <SectionBlock title="Projects" color={color}>{projects.map((p: any, i: number) => <ProjBlock key={p.id||i} proj={p} color={color} />)}</SectionBlock>}
          </div>
          <div style={{ width: '230px', padding: '28px 32px 28px 20px', borderLeft: `1px solid ${color}25`, background: `${color}06` }}>
            {education.length > 0 && <SectionBlock title="Education" color={color}>{education.map((edu: any, i: number) => <EduBlock key={edu.id||i} edu={edu} color={color} />)}</SectionBlock>}
            {skills.length > 0 && <SectionBlock title="Skills" color={color}><SkillsBlock skills={skills} color={color} /></SectionBlock>}
            {certifications.length > 0 && <SectionBlock title="Certifications" color={color}>{certifications.map((c: any, i: number) => <CertBlock key={c.id||i} cert={c} color={color} />)}</SectionBlock>}
          </div>
        </div>
      </div>
    );
  }

  // --- CREATIVE TEMPLATE ---
  if (template === 'creative') {
    return (
      <div className="bg-white shadow-2xl overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif', minHeight: '1056px', width: '816px', display: 'flex' }}>
        <div style={{ width: '260px', flexShrink: 0, background: `linear-gradient(180deg, ${color}, ${color}cc)`, color: '#fff', padding: '32px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <ProfilePhoto src={pi?.profilePhoto} initials={initials} size={88} className="mx-auto border-3 border-white/30" />
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 800, textAlign: 'center', marginBottom: '2px' }}>{pi?.firstName || 'Your'} {pi?.lastName || 'Name'}</h1>
          <p style={{ fontSize: '11px', textAlign: 'center', opacity: 0.85, marginBottom: '20px' }}>{pi?.jobTitle || 'Your Title'}</p>
          <div style={{ fontSize: '11px', opacity: 0.85, marginBottom: '24px' }}>
            {pi?.email && <div style={{ marginBottom: '6px' }}>✉ {pi.email}</div>}
            {pi?.phone && <div style={{ marginBottom: '6px' }}>✆ {pi.phone}</div>}
            {pi?.location && <div style={{ marginBottom: '6px' }}>⚲ {pi.location}</div>}
            {pi?.linkedin && <div style={{ marginBottom: '6px' }}>in {pi.linkedin}</div>}
            {pi?.github && <div style={{ marginBottom: '6px' }}>⌘ {pi.github}</div>}
            {pi?.website && <div style={{ marginBottom: '6px' }}>◎ {pi.website}</div>}
          </div>
          {skills.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', opacity: 0.92 }}>Skills</h3>
              {skills.map((sg: any, i: number) => (
                <div key={sg.id||i} style={{ marginBottom: '10px' }}>
                  {sg.category && <div style={{ fontSize: '10px', fontWeight: 600, opacity: 0.75, marginBottom: '4px' }}>{sg.category}</div>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {(sg.items||[]).map((s: string, j: number) => (
                      <span key={j} style={{ fontSize: '9px', padding: '2px 7px', borderRadius: '4px', background: 'rgba(255,255,255,0.2)' }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {certifications.length > 0 && (
            <div>
              <h3 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', opacity: 0.92 }}>Certifications</h3>
              {certifications.map((c: any, i: number) => (
                <div key={c.id||i} style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: '9px', opacity: 0.7 }}>{c.issuer} {c.date && `· ${c.date}`}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1, padding: '32px 28px' }}>
          {summary && <SectionBlock title="About Me" color={color}><p style={{ color: '#4b5563', fontSize: '12px', lineHeight: 1.7 }}>{summary}</p></SectionBlock>}
          {experience.length > 0 && <SectionBlock title="Experience" color={color}>{experience.map((exp: any, i: number) => <ExpBlock key={exp.id||i} exp={exp} color={color} />)}</SectionBlock>}
          {education.length > 0 && <SectionBlock title="Education" color={color}>{education.map((edu: any, i: number) => <EduBlock key={edu.id||i} edu={edu} color={color} />)}</SectionBlock>}
          {projects.length > 0 && <SectionBlock title="Projects" color={color}>{projects.map((p: any, i: number) => <ProjBlock key={p.id||i} proj={p} color={color} />)}</SectionBlock>}
        </div>
      </div>
    );
  }

  // --- MINIMAL TEMPLATE ---
  if (template === 'minimal') {
    return (
      <div className="bg-white shadow-2xl overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif', minHeight: '1056px', width: '816px' }}>
        <div style={{ padding: '36px 40px', textAlign: 'center', borderBottom: `2px solid ${color}30` }}>
          {pi?.profilePhoto && <ProfilePhoto src={pi.profilePhoto} initials={initials} size={60} className="mx-auto" style={{ marginBottom: '12px' }} />}
          <h1 style={{ fontSize: '26px', fontWeight: 300, color: '#111827', letterSpacing: '0.05em' }}>{fullName}</h1>
          <p style={{ fontSize: '13px', marginTop: '4px', color, fontWeight: 500 }}>{pi?.jobTitle || 'Your Job Title'}</p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '11px', color: '#9ca3af', marginTop: '12px' }}>
            {pi?.email && <span>{pi.email}</span>}
            {pi?.phone && <span>· {pi.phone}</span>}
            {pi?.location && <span>· {pi.location}</span>}
            {pi?.linkedin && <span>· {pi.linkedin}</span>}
            {pi?.github && <span>· {pi.github}</span>}
            {pi?.website && <span>· {pi.website}</span>}
          </div>
        </div>
        <div style={{ padding: '28px 40px' }}>
          {summary && <MinimalSection title="Summary" color={color}><p style={{ color: '#4b5563', fontSize: '12px', lineHeight: 1.7 }}>{summary}</p></MinimalSection>}
          {experience.length > 0 && <MinimalSection title="Experience" color={color}>{experience.map((exp: any, i: number) => <ExpBlock key={exp.id||i} exp={exp} color={color} />)}</MinimalSection>}
          {education.length > 0 && <MinimalSection title="Education" color={color}>{education.map((edu: any, i: number) => <EduBlock key={edu.id||i} edu={edu} color={color} />)}</MinimalSection>}
          {skills.length > 0 && <MinimalSection title="Skills" color={color}><SkillsBlock skills={skills} color={color} /></MinimalSection>}
          {projects.length > 0 && <MinimalSection title="Projects" color={color}>{projects.map((p: any, i: number) => <ProjBlock key={p.id||i} proj={p} color={color} />)}</MinimalSection>}
          {certifications.length > 0 && <MinimalSection title="Certifications" color={color}>{certifications.map((c: any, i: number) => <CertBlock key={c.id||i} cert={c} color={color} />)}</MinimalSection>}
        </div>
      </div>
    );
  }

  // --- TECH TEMPLATE ---
  if (template === 'tech') {
    return (
      <div className="bg-white shadow-2xl overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif', minHeight: '1056px', width: '816px', display: 'flex' }}>
        <div style={{ flex: 1, padding: '28px' }}>
          <div style={{ marginBottom: '22px', paddingBottom: '16px', borderBottom: `3px solid ${color}` }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', fontFamily: '"Courier New", monospace' }}>{fullName}</h1>
            <p style={{ fontSize: '14px', marginTop: '4px', color, fontFamily: '"Courier New", monospace' }}>{`< ${pi?.jobTitle || 'Developer'} />`}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '11px', color: '#6b7280', marginTop: '8px', fontFamily: '"Courier New", monospace' }}>
              {pi?.email && <span>{pi.email}</span>}
              {pi?.phone && <span>{pi.phone}</span>}
              {pi?.location && <span>{pi.location}</span>}
            </div>
          </div>
          {summary && <SectionBlock title="// Summary" color={color}><p style={{ color: '#4b5563', fontSize: '12px', lineHeight: 1.7 }}>{summary}</p></SectionBlock>}
          {experience.length > 0 && <SectionBlock title="// Experience" color={color}>{experience.map((exp: any, i: number) => <ExpBlock key={exp.id||i} exp={exp} color={color} />)}</SectionBlock>}
          {projects.length > 0 && <SectionBlock title="// Projects" color={color}>{projects.map((p: any, i: number) => <ProjBlock key={p.id||i} proj={p} color={color} />)}</SectionBlock>}
          {education.length > 0 && <SectionBlock title="// Education" color={color}>{education.map((edu: any, i: number) => <EduBlock key={edu.id||i} edu={edu} color={color} />)}</SectionBlock>}
        </div>
        <div style={{ width: '210px', padding: '28px 20px', color: '#fff', flexShrink: 0, background: '#1e293b' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <ProfilePhoto src={pi?.profilePhoto} initials={initials} size={60} />
          </div>
          <div style={{ marginBottom: '22px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', color }}>Links</h3>
            <div style={{ fontSize: '10px', opacity: 0.8 }}>
              {pi?.linkedin && <div style={{ marginBottom: '4px' }}>{pi.linkedin}</div>}
              {pi?.github && <div style={{ marginBottom: '4px' }}>{pi.github}</div>}
              {pi?.website && <div style={{ marginBottom: '4px' }}>{pi.website}</div>}
            </div>
          </div>
          {skills.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', color }}>Skills</h3>
              {skills.map((sg: any, i: number) => (
                <div key={sg.id||i} style={{ marginBottom: '8px' }}>
                  {sg.category && <div style={{ fontSize: '9px', fontWeight: 600, opacity: 0.6, marginBottom: '4px' }}>{sg.category}</div>}
                  {(sg.items||[]).map((s: string, j: number) => (
                    <div key={j} style={{ fontSize: '11px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <span style={{ color }}>▸</span> {s}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {certifications.length > 0 && (
            <div>
              <h3 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', color }}>Certs</h3>
              {certifications.map((c: any, i: number) => (
                <div key={c.id||i} style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: '9px', opacity: 0.6 }}>{c.issuer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- PROFESSIONAL TEMPLATE (clean two-column with timeline) ---
  if (template === 'professional') {
    return (
      <div className="bg-white shadow-2xl overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif', minHeight: '1056px', width: '816px' }}>
        <div style={{ background: '#1e293b', padding: '32px 40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <ProfilePhoto src={pi?.profilePhoto} initials={initials} size={72} className="border-2 border-white/20" />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{fullName}</h1>
            <p style={{ fontSize: '14px', color, marginTop: '2px', fontWeight: 600 }}>{pi?.jobTitle || 'Your Job Title'}</p>
          </div>
        </div>
        <div style={{ background: color, padding: '10px 40px', display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '11px', color: '#fff' }}>
          {pi?.email && <span>✉ {pi.email}</span>}
          {pi?.phone && <span>✆ {pi.phone}</span>}
          {pi?.location && <span>⚲ {pi.location}</span>}
          {pi?.linkedin && <span>in {pi.linkedin}</span>}
          {pi?.github && <span>⌘ {pi.github}</span>}
          {pi?.website && <span>◎ {pi.website}</span>}
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, padding: '28px 28px 28px 40px' }}>
            {summary && <SectionBlock title="Profile" color={color}><p style={{ color: '#4b5563', fontSize: '12px', lineHeight: 1.7 }}>{summary}</p></SectionBlock>}
            {experience.length > 0 && <SectionBlock title="Experience" color={color}>
              {experience.map((exp: any, i: number) => (
                <div key={exp.id||i} style={{ marginBottom: '16px', paddingLeft: '16px', borderLeft: `2px solid ${color}40` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                    <div><div style={{ fontSize: '13px', fontWeight: 700, color: '#1f2937' }}>{exp.position}</div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color }}>{exp.company}{exp.location && ` · ${exp.location}`}</div></div>
                    <div style={{ fontSize: '10px', color: '#9ca3af', flexShrink: 0, marginLeft: '12px' }}>{exp.startDate}{exp.startDate && (exp.endDate || exp.current) && ' – '}{exp.current ? 'Present' : exp.endDate}</div>
                  </div>
                  {exp.description && <p style={{ color: '#4b5563', fontSize: '11px', lineHeight: 1.6, marginTop: '4px' }}>{exp.description}</p>}
                  {exp.achievements?.filter(Boolean).length > 0 && (
                    <ul style={{ marginTop: '4px' }}>
                      {exp.achievements.filter(Boolean).map((a: string, j: number) => (
                        <li key={j} style={{ fontSize: '11px', color: '#4b5563', display: 'flex', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ color, flexShrink: 0 }}>▸</span>{a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </SectionBlock>}
            {projects.length > 0 && <SectionBlock title="Projects" color={color}>{projects.map((p: any, i: number) => <ProjBlock key={p.id||i} proj={p} color={color} />)}</SectionBlock>}
          </div>
          <div style={{ width: '240px', padding: '28px 40px 28px 20px', background: '#f8fafc' }}>
            {education.length > 0 && <SectionBlock title="Education" color={color}>{education.map((edu: any, i: number) => <EduBlock key={edu.id||i} edu={edu} color={color} />)}</SectionBlock>}
            {skills.length > 0 && <SectionBlock title="Skills" color={color}><SkillsBlock skills={skills} color={color} /></SectionBlock>}
            {certifications.length > 0 && <SectionBlock title="Certifications" color={color}>{certifications.map((c: any, i: number) => <CertBlock key={c.id||i} cert={c} color={color} />)}</SectionBlock>}
          </div>
        </div>
      </div>
    );
  }

  // --- ELEGANT TEMPLATE (serif, decorative) ---
  if (template === 'elegant') {
    return (
      <div className="bg-white shadow-2xl overflow-hidden" style={{ fontFamily: 'Georgia, "Times New Roman", serif', minHeight: '1056px', width: '816px' }}>
        <div style={{ padding: '40px 48px 30px', borderBottom: `1px solid ${color}20`, textAlign: 'center' }}>
          {(pi?.profilePhoto) && <ProfilePhoto src={pi.profilePhoto} initials={initials} size={80} className="mx-auto" style={{ marginBottom: '14px', border: `3px solid ${color}40` }} />}
          <h1 style={{ fontSize: '32px', fontWeight: 400, color: '#111827', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{fullName}</h1>
          <div style={{ width: '60px', height: '2px', background: color, margin: '10px auto' }} />
          <p style={{ fontSize: '14px', color, fontStyle: 'italic', marginBottom: '12px' }}>{pi?.jobTitle || 'Your Job Title'}</p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '11px', color: '#6b7280' }}>
            {pi?.email && <span>{pi.email}</span>}
            {pi?.phone && <span>|  {pi.phone}</span>}
            {pi?.location && <span>|  {pi.location}</span>}
            {pi?.linkedin && <span>|  {pi.linkedin}</span>}
          </div>
        </div>
        <div style={{ padding: '28px 48px' }}>
          {summary && <ElegantSection title="Summary" color={color}><p style={{ color: '#4b5563', fontSize: '12px', lineHeight: 1.8, fontStyle: 'italic' }}>{summary}</p></ElegantSection>}
          {experience.length > 0 && <ElegantSection title="Professional Experience" color={color}>{experience.map((exp: any, i: number) => <ExpBlock key={exp.id||i} exp={exp} color={color} />)}</ElegantSection>}
          {education.length > 0 && <ElegantSection title="Education" color={color}>{education.map((edu: any, i: number) => <EduBlock key={edu.id||i} edu={edu} color={color} />)}</ElegantSection>}
          {skills.length > 0 && <ElegantSection title="Skills" color={color}><SkillsBlock skills={skills} color={color} /></ElegantSection>}
          {projects.length > 0 && <ElegantSection title="Projects" color={color}>{projects.map((p: any, i: number) => <ProjBlock key={p.id||i} proj={p} color={color} />)}</ElegantSection>}
          {certifications.length > 0 && <ElegantSection title="Certifications" color={color}>{certifications.map((c: any, i: number) => <CertBlock key={c.id||i} cert={c} color={color} />)}</ElegantSection>}
        </div>
      </div>
    );
  }

  // --- BOLD TEMPLATE (large headers, accent colors, striking) ---
  if (template === 'bold') {
    return (
      <div className="bg-white shadow-2xl overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif', minHeight: '1056px', width: '816px' }}>
        <div style={{ background: color, padding: '36px 40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <ProfilePhoto src={pi?.profilePhoto} initials={initials} size={80} className="border-3 border-white/40 shadow-xl" />
          <div>
            <h1 style={{ fontSize: '34px', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{fullName}</h1>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', marginTop: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{pi?.jobTitle || 'Your Job Title'}</p>
          </div>
        </div>
        <div style={{ background: '#1f2937', padding: '8px 40px', display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '11px', color: '#d1d5db' }}>
          {pi?.email && <span>{pi.email}</span>}
          {pi?.phone && <span>{pi.phone}</span>}
          {pi?.location && <span>{pi.location}</span>}
          {pi?.linkedin && <span>{pi.linkedin}</span>}
          {pi?.github && <span>{pi.github}</span>}
          {pi?.website && <span>{pi.website}</span>}
        </div>
        <div style={{ padding: '28px 40px' }}>
          {summary && <BoldSection title="ABOUT" color={color}><p style={{ color: '#4b5563', fontSize: '12px', lineHeight: 1.7 }}>{summary}</p></BoldSection>}
          {experience.length > 0 && <BoldSection title="EXPERIENCE" color={color}>{experience.map((exp: any, i: number) => <ExpBlock key={exp.id||i} exp={exp} color={color} />)}</BoldSection>}
          {education.length > 0 && <BoldSection title="EDUCATION" color={color}>{education.map((edu: any, i: number) => <EduBlock key={edu.id||i} edu={edu} color={color} />)}</BoldSection>}
          {skills.length > 0 && <BoldSection title="SKILLS" color={color}><SkillsBlock skills={skills} color={color} /></BoldSection>}
          {projects.length > 0 && <BoldSection title="PROJECTS" color={color}>{projects.map((p: any, i: number) => <ProjBlock key={p.id||i} proj={p} color={color} />)}</BoldSection>}
          {certifications.length > 0 && <BoldSection title="CERTIFICATIONS" color={color}>{certifications.map((c: any, i: number) => <CertBlock key={c.id||i} cert={c} color={color} />)}</BoldSection>}
        </div>
      </div>
    );
  }

  // --- COMPACT TEMPLATE (dense, maximized content) ---
  if (template === 'compact') {
    return (
      <div className="bg-white shadow-2xl overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif', minHeight: '1056px', width: '816px' }}>
        <div style={{ padding: '24px 32px', borderBottom: `3px solid ${color}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ProfilePhoto src={pi?.profilePhoto} initials={initials} size={52} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827' }}>{fullName}</h1>
              <span style={{ fontSize: '12px', color, fontWeight: 600 }}>{pi?.jobTitle || ''}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>
              {pi?.email && <span>{pi.email}</span>}
              {pi?.phone && <span>{pi.phone}</span>}
              {pi?.location && <span>{pi.location}</span>}
              {pi?.linkedin && <span>{pi.linkedin}</span>}
              {pi?.github && <span>{pi.github}</span>}
              {pi?.website && <span>{pi.website}</span>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, padding: '20px 24px 20px 32px' }}>
            {summary && <CompactSection title="Summary" color={color}><p style={{ color: '#4b5563', fontSize: '11px', lineHeight: 1.6 }}>{summary}</p></CompactSection>}
            {experience.length > 0 && <CompactSection title="Experience" color={color}>{experience.map((exp: any, i: number) => <ExpBlock key={exp.id||i} exp={exp} color={color} />)}</CompactSection>}
            {projects.length > 0 && <CompactSection title="Projects" color={color}>{projects.map((p: any, i: number) => <ProjBlock key={p.id||i} proj={p} color={color} />)}</CompactSection>}
          </div>
          <div style={{ width: '260px', padding: '20px 32px 20px 16px', borderLeft: `1px solid #e5e7eb` }}>
            {skills.length > 0 && <CompactSection title="Skills" color={color}><SkillsBlock skills={skills} color={color} /></CompactSection>}
            {education.length > 0 && <CompactSection title="Education" color={color}>{education.map((edu: any, i: number) => <EduBlock key={edu.id||i} edu={edu} color={color} />)}</CompactSection>}
            {certifications.length > 0 && <CompactSection title="Certifications" color={color}>{certifications.map((c: any, i: number) => <CertBlock key={c.id||i} cert={c} color={color} />)}</CompactSection>}
          </div>
        </div>
      </div>
    );
  }

  // --- INFOGRAPHIC TEMPLATE (visual skill bars, icons, colorful) ---
  if (template === 'infographic') {
    return (
      <div className="bg-white shadow-2xl overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif', minHeight: '1056px', width: '816px', display: 'flex' }}>
        <div style={{ width: '280px', flexShrink: 0, background: `linear-gradient(180deg, ${color}18 0%, #f8fafc 100%)`, padding: '32px 24px', borderRight: `1px solid ${color}20` }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <ProfilePhoto src={pi?.profilePhoto} initials={initials} size={90} className="mx-auto" />
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginTop: '14px' }}>{fullName}</h1>
            <p style={{ fontSize: '12px', color, fontWeight: 600, marginTop: '2px' }}>{pi?.jobTitle || 'Your Title'}</p>
          </div>
          <div style={{ marginBottom: '22px' }}>
            <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color, marginBottom: '10px' }}>Contact</h3>
            <div style={{ fontSize: '10px', color: '#4b5563' }}>
              {pi?.email && <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color, fontWeight: 700 }}>@</span> {pi.email}</div>}
              {pi?.phone && <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color, fontWeight: 700 }}>✆</span> {pi.phone}</div>}
              {pi?.location && <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color, fontWeight: 700 }}>⚲</span> {pi.location}</div>}
              {pi?.linkedin && <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color, fontWeight: 700 }}>in</span> {pi.linkedin}</div>}
              {pi?.github && <div style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color, fontWeight: 700 }}>⌘</span> {pi.github}</div>}
            </div>
          </div>
          {skills.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color, marginBottom: '10px' }}>Skills</h3>
              {skills.map((sg: any, i: number) => (
                <div key={sg.id||i} style={{ marginBottom: '12px' }}>
                  {sg.category && <div style={{ fontSize: '10px', fontWeight: 700, color: '#1f2937', marginBottom: '6px' }}>{sg.category}</div>}
                  {(sg.items||[]).map((s: string, j: number) => (
                    <div key={j} style={{ marginBottom: '5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#374151', marginBottom: '2px' }}><span>{s}</span></div>
                      <div style={{ height: '4px', background: `${color}20`, borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${70 + Math.random() * 30}%`, background: color, borderRadius: '2px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {certifications.length > 0 && (
            <div>
              <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color, marginBottom: '10px' }}>Certifications</h3>
              {certifications.map((c: any, i: number) => (
                <div key={c.id||i} style={{ marginBottom: '8px', padding: '6px 8px', background: `${color}10`, borderRadius: '6px', borderLeft: `3px solid ${color}` }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#1f2937' }}>{c.name}</div>
                  <div style={{ fontSize: '9px', color: '#6b7280' }}>{c.issuer} {c.date && `· ${c.date}`}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1, padding: '32px 28px' }}>
          {summary && <SectionBlock title="About Me" color={color}><p style={{ color: '#4b5563', fontSize: '12px', lineHeight: 1.7 }}>{summary}</p></SectionBlock>}
          {experience.length > 0 && <SectionBlock title="Experience" color={color}>
            {experience.map((exp: any, i: number) => (
              <div key={exp.id||i} style={{ marginBottom: '16px', paddingLeft: '14px', borderLeft: `2px solid ${color}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div><div style={{ fontSize: '13px', fontWeight: 700, color: '#1f2937' }}>{exp.position}</div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color }}>{exp.company}{exp.location && ` · ${exp.location}`}</div></div>
                  <div style={{ fontSize: '10px', color: '#9ca3af', flexShrink: 0, marginLeft: '12px', background: `${color}10`, padding: '2px 8px', borderRadius: '10px' }}>{exp.startDate}{exp.startDate && (exp.endDate || exp.current) && ' – '}{exp.current ? 'Present' : exp.endDate}</div>
                </div>
                {exp.description && <p style={{ color: '#4b5563', fontSize: '11px', lineHeight: 1.6, marginTop: '4px' }}>{exp.description}</p>}
                {exp.achievements?.filter(Boolean).length > 0 && (
                  <ul style={{ marginTop: '4px' }}>
                    {exp.achievements.filter(Boolean).map((a: string, j: number) => (
                      <li key={j} style={{ fontSize: '11px', color: '#4b5563', display: 'flex', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ color, flexShrink: 0 }}>●</span>{a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </SectionBlock>}
          {education.length > 0 && <SectionBlock title="Education" color={color}>{education.map((edu: any, i: number) => <EduBlock key={edu.id||i} edu={edu} color={color} />)}</SectionBlock>}
          {projects.length > 0 && <SectionBlock title="Projects" color={color}>{projects.map((p: any, i: number) => <ProjBlock key={p.id||i} proj={p} color={color} />)}</SectionBlock>}
        </div>
      </div>
    );
  }

  // --- DEFAULT fallback (same as modern) ---
  return (
    <div className="bg-white shadow-2xl overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif', minHeight: '1056px', width: '816px' }}>
      <div style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)`, padding: '32px 40px', color: '#fff', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <ProfilePhoto src={pi?.profilePhoto} initials={initials} size={72} className="border-2 border-white/30" />
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800 }}>{fullName}</h1>
          <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '2px' }}>{pi?.jobTitle || 'Your Job Title'}</p>
        </div>
      </div>
      <div style={{ padding: '28px 40px' }}>
        {summary && <SectionBlock title="Summary" color={color}><p style={{ color: '#4b5563', fontSize: '12px', lineHeight: 1.7 }}>{summary}</p></SectionBlock>}
        {experience.length > 0 && <SectionBlock title="Experience" color={color}>{experience.map((exp: any, i: number) => <ExpBlock key={exp.id||i} exp={exp} color={color} />)}</SectionBlock>}
        {education.length > 0 && <SectionBlock title="Education" color={color}>{education.map((edu: any, i: number) => <EduBlock key={edu.id||i} edu={edu} color={color} />)}</SectionBlock>}
        {skills.length > 0 && <SectionBlock title="Skills" color={color}><SkillsBlock skills={skills} color={color} /></SectionBlock>}
        {projects.length > 0 && <SectionBlock title="Projects" color={color}>{projects.map((p: any, i: number) => <ProjBlock key={p.id||i} proj={p} color={color} />)}</SectionBlock>}
        {certifications.length > 0 && <SectionBlock title="Certifications" color={color}>{certifications.map((c: any, i: number) => <CertBlock key={c.id||i} cert={c} color={color} />)}</SectionBlock>}
      </div>
    </div>
  );
}

// --- Shared sub-components ---

function SectionBlock({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <h3 style={{ color, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{title}</h3>
        <div style={{ flex: 1, height: '1px', background: `${color}35` }} />
      </div>
      {children}
    </div>
  );
}

function MinimalSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color, marginBottom: '8px', paddingBottom: '4px', borderBottom: `1px solid ${color}25` }}>{title}</h3>
      {children}
    </div>
  );
}

function ElegantSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#374151', display: 'inline-block' }}>{title}</h3>
        <div style={{ width: '40px', height: '1.5px', background: color, margin: '4px auto 0' }} />
      </div>
      {children}
    </div>
  );
}

function BoldSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '4px', height: '20px', background: color, borderRadius: '2px' }} />
        <h3 style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '0.08em', color: '#111827' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function CompactSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color, marginBottom: '6px', paddingBottom: '3px', borderBottom: `2px solid ${color}` }}>{title}</h3>
      {children}
    </div>
  );
}

function ExpBlock({ exp, color }: { exp: any; color: string }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1f2937' }}>{exp.position}</div>
          <div style={{ fontSize: '11px', fontWeight: 600, color }}>{exp.company}{exp.location && ` · ${exp.location}`}</div>
        </div>
        <div style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
          {exp.startDate}{exp.startDate && (exp.endDate || exp.current) && ' – '}{exp.current ? 'Present' : exp.endDate}
        </div>
      </div>
      {exp.description && <p style={{ color: '#4b5563', fontSize: '11px', lineHeight: 1.6, marginTop: '4px' }}>{exp.description}</p>}
      {exp.achievements?.filter(Boolean).length > 0 && (
        <ul style={{ marginTop: '4px' }}>
          {exp.achievements.filter(Boolean).map((a: string, j: number) => (
            <li key={j} style={{ fontSize: '11px', color: '#4b5563', display: 'flex', gap: '6px', marginBottom: '2px' }}>
              <span style={{ color, flexShrink: 0, marginTop: '2px' }}>▸</span>{a}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EduBlock({ edu, color }: { edu: any; color: string }) {
  return (
    <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1f2937' }}>{edu.degree}{edu.field && ` in ${edu.field}`}</div>
        <div style={{ fontSize: '11px', fontWeight: 600, color }}>{edu.institution}</div>
        {edu.gpa && <div style={{ fontSize: '10px', color: '#9ca3af' }}>GPA: {edu.gpa}</div>}
      </div>
      <div style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
        {edu.startDate}{edu.startDate && edu.endDate && ' – '}{edu.endDate}
      </div>
    </div>
  );
}

function SkillsBlock({ skills, color }: { skills: any[]; color: string }) {
  return (
    <>
      {skills.map((sg: any, i: number) => (
        <div key={sg.id||i} style={{ marginBottom: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {sg.category && <span style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563', width: '90px', flexShrink: 0 }}>{sg.category}:</span>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {(sg.items||[]).map((s: string, j: number) => (
              <span key={j} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: `${color}15`, color, border: `1px solid ${color}30` }}>{s}</span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function ProjBlock({ proj, color }: { proj: any; color: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1f2937' }}>{proj.name}</div>
        {(proj.link || proj.github) && <div style={{ fontSize: '10px', color }}>{proj.link || proj.github}</div>}
      </div>
      {proj.technologies?.length > 0 && <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '3px' }}>{proj.technologies.join(' · ')}</div>}
      {proj.description && <p style={{ fontSize: '11px', color: '#4b5563', lineHeight: 1.6 }}>{proj.description}</p>}
    </div>
  );
}

function CertBlock({ cert, color }: { cert: any; color: string }) {
  return (
    <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937' }}>{cert.name}</div>
        <div style={{ fontSize: '10px', color }}>{cert.issuer}</div>
      </div>
      <div style={{ fontSize: '10px', color: '#9ca3af' }}>{cert.date}</div>
    </div>
  );
}
