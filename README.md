# 🤖 AI Resume Builder — Full Stack MERN Application

A full-featured AI-powered resume builder with a dark SaaS theme matching the Resumind design language.

## 🗂️ Project Structure

```
ai-resume-builder/
├── frontend/                    # Next.js 14 + Tailwind CSS
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.tsx        # Landing page (hero, features, pricing)
│   │   │   ├── login.tsx        # Authentication
│   │   │   ├── register.tsx     # Sign up
│   │   │   ├── dashboard/
│   │   │   │   └── index.tsx    # User dashboard
│   │   │   └── builder/
│   │   │       └── [id].tsx     # Resume builder (multi-step form + live preview)
│   │   ├── components/
│   │   │   ├── ResumePreview.tsx         # Live resume renderer
│   │   │   └── builder/
│   │   │       ├── PersonalInfoForm.tsx
│   │   │       ├── SummaryForm.tsx       # AI summary generation
│   │   │       ├── ExperienceForm.tsx    # AI description improvement
│   │   │       ├── EducationForm.tsx
│   │   │       ├── SkillsForm.tsx        # AI skill suggestions
│   │   │       ├── ProjectsForm.tsx
│   │   │       └── CertificationsForm.tsx
│   │   ├── store/
│   │   │   └── authStore.ts     # Zustand auth state
│   │   └── styles/
│   │       └── globals.css      # Tailwind + custom design system
│   ├── tailwind.config.js
│   └── next.config.js
│
└── backend/                     # Node.js + Express API
    ├── src/
    │   ├── server.js            # Express app entry point
    │   ├── models/
    │   │   ├── User.js          # MongoDB user schema
    │   │   └── Resume.js        # MongoDB resume schema
    │   ├── routes/
    │   │   ├── auth.js          # Register, login, profile
    │   │   ├── resume.js        # CRUD + share + duplicate
    │   │   ├── ai.js            # OpenAI endpoints
    │   │   └── payment.js       # Stripe subscription
    │   └── middleware/
    │       └── auth.js          # JWT protection middleware
    └── .env.example
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key
- Stripe account (optional)

### Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your MONGODB_URI, JWT_SECRET, OPENAI_API_KEY, etc.
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev
# Runs on http://localhost:3000
```

## ✨ Features

### 🎨 Design System
- **Dark SaaS aesthetic** — deep navy/indigo palette with glassmorphism
- **Bricolage Grotesque** display font + DM Sans body font
- Animated mesh gradients, noise textures, smooth glow effects
- Fully responsive mobile-first layout

### 🤖 AI Features (OpenAI GPT-4o-mini)
- **AI Summary Generator** — creates professional summaries from your experience
- **AI Description Improver** — rewrites job descriptions with action verbs
- **AI Skill Suggestions** — recommends skills based on job title
- **ATS Score Checker** — analyzes resume vs job description, returns score + improvements

### 📄 Resume Builder
- **7-step form** — Personal Info → Summary → Experience → Education → Skills → Projects → Certifications
- **Live preview** — real-time resume rendering as you type
- **5 templates** — Modern, Executive, Creative, Minimal, Tech Pro (10 planned)
- **Auto-save** — debounced saves every 2 seconds
- **PDF Export** — html2canvas + jsPDF
- **Share link** — unique public URL for each resume

### 🔐 Authentication
- JWT-based auth (register/login)
- Google OAuth ready (backend endpoint included)
- Protected routes

### 💳 Payments (Stripe)
- Free / Pro / Enterprise tiers
- Stripe Checkout integration
- Webhook for subscription updates

## 🗄️ Database Schema

### User
```
name, email, password (hashed), googleId, avatar,
plan (free/pro/enterprise), stripeCustomerId, stripeSubscriptionId,
resumeCount, aiUsageCount
```

### Resume
```
user (ref), title, template, colorScheme, isPublic, shareToken, atsScore,
personalInfo { firstName, lastName, email, phone, location, jobTitle, ... },
summary, experience[], education[], skills[], projects[], certifications[],
sectionOrder[]
```

## 🔌 API Endpoints

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/profile

GET    /api/resumes
POST   /api/resumes
GET    /api/resumes/:id
PUT    /api/resumes/:id
DELETE /api/resumes/:id
POST   /api/resumes/:id/share
POST   /api/resumes/:id/duplicate
GET    /api/resumes/public/:token

POST /api/ai/generate-summary
POST /api/ai/improve-description
POST /api/ai/suggest-skills
POST /api/ai/ats-score

POST /api/payment/create-checkout
POST /api/payment/webhook
```

## 🎨 Extending Templates

Add new templates in `ResumePreview.tsx`:

```typescript
const TEMPLATE_THEMES = {
  myTemplate: {
    primary: '#your-color',
    secondary: '#light-tint',
    font: 'Georgia, serif',
  }
};
```

Then add to the `TEMPLATES` array in `builder/[id].tsx`.

## 🌍 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| State | Zustand |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | OpenAI GPT-4o-mini |
| PDF | html2canvas + jsPDF |
| Payments | Stripe |
| Animations | CSS keyframes + Framer Motion |
| Icons | Lucide React |

---

Built with ❤️ — matching the Resumind dark SaaS design system
