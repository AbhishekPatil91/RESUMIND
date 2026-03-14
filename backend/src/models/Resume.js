import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },
  template: { type: String, default: 'modern' },
  colorScheme: { type: String, default: '#6366f1' },
  isPublic: { type: Boolean, default: false },
  shareToken: { type: String },
  atsScore: { type: Number, default: 0 },

  personalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    location: String,
    website: String,
    linkedin: String,
    github: String,
    jobTitle: String,
    profilePhoto: String,
  },

  summary: { type: String },

  experience: [{
    id: String,
    company: String,
    position: String,
    location: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String,
    achievements: [String],
    order: Number,
  }],

  education: [{
    id: String,
    institution: String,
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    gpa: String,
    achievements: [String],
    order: Number,
  }],

  skills: [{
    id: String,
    category: String,
    items: [String],
    order: Number,
  }],

  projects: [{
    id: String,
    name: String,
    description: String,
    technologies: [String],
    link: String,
    github: String,
    startDate: String,
    endDate: String,
    order: Number,
  }],

  certifications: [{
    id: String,
    name: String,
    issuer: String,
    date: String,
    credentialId: String,
    url: String,
    order: Number,
  }],

  sectionOrder: {
    type: [String],
    default: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications']
  },

  lastAutoSaved: { type: Date },
}, {
  timestamps: true
});

resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ shareToken: 1 });

export default mongoose.model('Resume', resumeSchema);
