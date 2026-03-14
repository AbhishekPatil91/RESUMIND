import React from "react";

interface ResumePreviewProps {
  resume: any;
}

const TEMPLATE_THEMES: Record<
  string,
  { primary: string; secondary: string; font: string }
> = {
  modern: { primary: "#6366f1", secondary: "#e0e7ff", font: "system-ui" },
  executive: { primary: "#0ea5e9", secondary: "#e0f2fe", font: "Georgia, serif" },
  creative: { primary: "#ec4899", secondary: "#fce7f3", font: "system-ui" },
  minimal: { primary: "#10b981", secondary: "#d1fae5", font: "system-ui" },
  tech: { primary: "#f59e0b", secondary: "#fef3c7", font: '"Courier New", monospace' },
  professional: { primary: "#2563eb", secondary: "#dbeafe", font: "system-ui" },
  elegant: { primary: "#7c3aed", secondary: "#ede9fe", font: '"Playfair Display", Georgia, serif' },
  bold: { primary: "#dc2626", secondary: "#fee2e2", font: "system-ui" },
  compact: { primary: "#0d9488", secondary: "#ccfbf1", font: "system-ui" },
  infographic: { primary: "#7c3aed", secondary: "#f3e8ff", font: "system-ui" },
};

/* ---------- FIXED PROFILE PHOTO COMPONENT ---------- */

function ProfilePhoto({
  src,
  initials,
  size = 64,
  className = "",
  style = {},
}: {
  src?: string;
  initials: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    ...style,
  };

  return src ? (
    <img
      src={src}
      alt="Profile"
      className={className}
      style={{ ...baseStyle, objectFit: "cover" }}
    />
  ) : (
    <div
      className={className}
      style={{
        ...baseStyle,
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  );
}

/* ---------- MAIN COMPONENT ---------- */

export default function ResumePreview({ resume }: ResumePreviewProps) {
  if (!resume)
    return (
      <div className="bg-white rounded-xl shadow-2xl p-8 min-h-[1056px] flex items-center justify-center">
        <p className="text-gray-400 text-sm">
          Start filling in your details to see the preview
        </p>
      </div>
    );

  const theme = TEMPLATE_THEMES[resume.template] || TEMPLATE_THEMES.modern;
  const color = theme.primary;

  const {
    personalInfo: pi,
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
  } = resume;

  const initials = `${(pi?.firstName?.[0] || "U").toUpperCase()}${(
    pi?.lastName?.[0] || ""
  ).toUpperCase()}`;

  const fullName = `${pi?.firstName || "Your"} ${pi?.lastName || "Name"}`;

  return (
    <div
      className="bg-white shadow-2xl overflow-hidden"
      style={{ fontFamily: "system-ui", minHeight: "1056px", width: "816px" }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        }}
        className="px-10 py-8 text-white"
      >
        <div className="flex items-center gap-5">
          <ProfilePhoto
            src={pi?.profilePhoto}
            initials={initials}
            size={72}
            className="border-2 border-white/30 shadow-lg"
          />

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{fullName}</h1>
            <p className="text-sm opacity-90">
              {pi?.jobTitle || "Your Job Title"}
            </p>

            <div className="flex flex-wrap gap-3 text-xs mt-2 opacity-80">
              {pi?.email && <span>✉ {pi.email}</span>}
              {pi?.phone && <span>✆ {pi.phone}</span>}
              {pi?.location && <span>⚲ {pi.location}</span>}
              {pi?.linkedin && <span>in {pi.linkedin}</span>}
              {pi?.github && <span>⌘ {pi.github}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-7">
        {summary && (
          <SectionBlock title="Summary" color={color}>
            <p className="text-sm text-gray-600">{summary}</p>
          </SectionBlock>
        )}

        {experience.length > 0 && (
          <SectionBlock title="Experience" color={color}>
            {experience.map((exp: any, i: number) => (
              <ExpBlock key={i} exp={exp} color={color} />
            ))}
          </SectionBlock>
        )}

        {education.length > 0 && (
          <SectionBlock title="Education" color={color}>
            {education.map((edu: any, i: number) => (
              <EduBlock key={i} edu={edu} color={color} />
            ))}
          </SectionBlock>
        )}

        {skills.length > 0 && (
          <SectionBlock title="Skills" color={color}>
            <SkillsBlock skills={skills} color={color} />
          </SectionBlock>
        )}
      </div>
    </div>
  );
}

/* ---------- SUB COMPONENTS ---------- */

function SectionBlock({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs font-bold uppercase" style={{ color }}>
          {title}
        </h3>
        <div className="flex-1 h-[1px]" style={{ background: color }} />
      </div>
      {children}
    </div>
  );
}

function ExpBlock({ exp, color }: { exp: any; color: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">{exp.position}</div>
          <div className="text-xs" style={{ color }}>
            {exp.company}
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {exp.startDate} - {exp.current ? "Present" : exp.endDate}
        </div>
      </div>

      {exp.description && (
        <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
      )}
    </div>
  );
}

function EduBlock({ edu }: { edu: any; color: string }) {
  return (
    <div className="mb-3">
      <div className="font-semibold text-sm">
        {edu.degree} {edu.field && `in ${edu.field}`}
      </div>
      <div className="text-xs text-gray-500">{edu.institution}</div>
    </div>
  );
}

function SkillsBlock({ skills, color }: { skills: any[]; color: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.flatMap((g: any) =>
        (g.items || []).map((s: string, i: number) => (
          <span
            key={i}
            className="text-xs px-2 py-1 rounded"
            style={{ background: `${color}20`, color }}
          >
            {s}
          </span>
        ))
      )}
    </div>
  );
}