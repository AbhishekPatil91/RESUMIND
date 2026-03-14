import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Resume from '../models/Resume.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/resumes - Get all user resumes
router.get('/', protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select('title template updatedAt atsScore personalInfo.firstName personalInfo.jobTitle');
    res.json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/resumes - Create new resume
router.post('/', protect, async (req, res) => {
  try {
    const resume = await Resume.create({
      user: req.user._id,
      title: req.body.title || 'My Resume',
      template: req.body.template || 'modern',
    });
    res.status(201).json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/resumes/:id - Get single resume
router.get('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/resumes/:id - Update resume
router.put('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, lastAutoSaved: new Date() },
      { new: true, runValidators: true }
    );
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/resumes/:id - Delete resume
router.delete('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/resumes/:id/share - Generate share link
router.post('/:id/share', protect, async (req, res) => {
  try {
    const shareToken = uuidv4();
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isPublic: true, shareToken },
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ success: true, shareToken, shareUrl: `/r/${shareToken}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/resumes/public/:token - View shared resume
router.get('/public/:token', async (req, res) => {
  try {
    const resume = await Resume.findOne({ shareToken: req.params.token, isPublic: true });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/resumes/:id/duplicate
router.post('/:id/duplicate', protect, async (req, res) => {
  try {
    const original = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!original) return res.status(404).json({ message: 'Resume not found' });

    const { _id, createdAt, updatedAt, shareToken, ...data } = original.toObject();
    const duplicate = await Resume.create({
      ...data,
      user: req.user._id,
      title: `${data.title} (Copy)`,
      isPublic: false,
      shareToken: undefined,
    });
    res.status(201).json({ success: true, resume: duplicate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
