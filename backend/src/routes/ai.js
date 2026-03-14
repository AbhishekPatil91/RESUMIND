import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Multer config: store in memory, only accept PDFs, max 5MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

const MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];

const generateWithFallback = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  for (const modelName of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      return response.text.trim();
    } catch (err) {
      const msg = err.message || '';
      if ((msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('404')) && modelName !== MODELS[MODELS.length - 1]) {
        console.log(`Model ${modelName} unavailable, trying next...`);
        continue;
      }
      throw err;
    }
  }
};

// POST /api/ai/generate-summary
router.post('/generate-summary', protect, async (req, res) => {
  try {
    const { jobTitle, experience, skills } = req.body;

    const prompt = `You are a professional resume writer. Write a concise, impactful professional summary in 2-3 sentences for a ${jobTitle} with experience in: ${experience}. Skills: ${skills?.join(', ')}. Return only the summary text, no extra formatting.`;

    const summary = await generateWithFallback(prompt);
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/ai/improve-description
router.post('/improve-description', protect, async (req, res) => {
  try {
    const { description, position, company } = req.body;

    const prompt = `You are a professional resume writer. Improve this job description to be more impactful using strong action verbs and quantifiable achievements. Return only the improved description, no extra formatting.\n\nJob: ${position} at ${company}\nOriginal description: "${description}"`;

    const improved = await generateWithFallback(prompt);
    res.json({ success: true, improved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/ai/suggest-skills
router.post('/suggest-skills', protect, async (req, res) => {
  try {
    const { jobTitle, existingSkills } = req.body;

    const prompt = `You are a career advisor. Suggest 10 relevant skills for a ${jobTitle}. Existing skills: ${existingSkills?.join(', ')}. Return ONLY a valid JSON object with a "skills" key containing an array of skill strings. Example: {"skills": ["React", "Node.js"]}`;

    let text = await generateWithFallback(prompt);
    text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const content = JSON.parse(text);
    const skills = content.skills || content.suggested_skills || [];
    res.json({ success: true, skills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/ai/ats-score
router.post('/ats-score', protect, async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    const resumeText = JSON.stringify(resumeData);

    const prompt = `You are an ATS expert and career coach. Analyze this resume against the job description and return ONLY a valid JSON object with these keys:
- "score" (number 0-100)
- "strengths" (array of strings - what the resume does well)
- "improvements" (array of strings - specific actionable suggestions to improve the resume)
- "keywords_missing" (array of strings - important keywords from the job description missing in the resume)
- "suggested_skills" (array of strings - skills the candidate should add based on the job description)
- "course_recommendations" (array of objects with "title", "platform", and "reason" keys - recommend 3-5 relevant courses/certifications to strengthen the resume for this role)

Resume: ${resumeText}
Job Description: ${jobDescription || 'General software engineer role'}`;

    let text = await generateWithFallback(prompt);
    text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(text);
    res.json({ success: true, ...parsed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/ai/ats-score-pdf — Upload a PDF resume and get ATS analysis
router.post('/ats-score-pdf', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a PDF file' });

    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: req.file.buffer });
    const result = await parser.getText();
    const resumeText = result.text || '';

    if (!resumeText.trim() || resumeText.trim().length < 50) {
      return res.status(400).json({ message: 'Could not extract enough text from the PDF. Make sure it is not a scanned image.' });
    }

    const jobDescription = req.body.jobDescription || 'General professional role';
    const jobRole = req.body.jobRole || '';
    const companyName = req.body.companyName || '';

    const jdBlock = `Role: ${jobRole}\nCompany: ${companyName}\n\n${jobDescription}`;

    const prompt = `You are an ATS expert and career coach. Analyze this resume text against the job description and return ONLY a valid JSON object with these keys:
- "score" (number 0-100)
- "strengths" (array of strings - what the resume does well)
- "improvements" (array of strings - specific actionable suggestions to improve the resume)
- "keywords_missing" (array of strings - important keywords from the job description missing in the resume)
- "suggested_skills" (array of strings - skills the candidate should add based on the job description)
- "course_recommendations" (array of objects with "title", "platform", and "reason" keys - recommend 3-5 relevant courses/certifications to strengthen the resume for this role)

Resume Text:
${resumeText.substring(0, 8000)}

Job Description:
${jdBlock}`;

    let text = await generateWithFallback(prompt);
    text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(text);
    res.json({ success: true, ...parsed });
  } catch (error) {
    if (error.message === 'Only PDF files are allowed') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
