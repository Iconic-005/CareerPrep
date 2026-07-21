import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  addGoalData,
  analyzeJobDescriptionData,
  deleteGoalData,
  deleteNotificationData,
  generateRoadmapData,
  getAdminData,
  getCoachData,
  getCurrentUser,
  getDashboardData,
  getInterviewReportData,
  getNotificationsData,
  getPracticeData,
  getProfileData,
  getResumeData,
  getRoadmapData,
  getSettingsData,
  handleChatRequest,
  optimizeResumeData,
  submitAuthRequest,
  submitPracticeData,
  updateGoalData,
  updateMilestoneData,
  updateProfileData,
  updateSettingsData,
} from '../controllers/controller.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    ok: true,
    message: 'CareerPrep API is running with authenticated user session management',
    config: {
      mongodbConfigured: Boolean(process.env.MONGODB_URI),
      aiConfigured: Boolean(process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY),
    },
  });
});

// Auth Routes (Public)
router.post('/auth/login', async (req, res) => {
  try {
    const result = await submitAuthRequest(req.body, 'login');
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/auth/register', async (req, res) => {
  try {
    const result = await submitAuthRequest(req.body, 'register');
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Protect all following routes with authMiddleware
router.use(authMiddleware);

router.get('/auth/me', async (req, res) => {
  try {
    res.json(await getCurrentUser(req.user.id));
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Dashboard & Goals
router.get('/dashboard', async (req, res) => {
  try {
    res.json(await getDashboardData(req.user.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/goals', async (req, res) => {
  try {
    const result = await addGoalData(req.user.id, req.body.title);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/goals/:id', async (req, res) => {
  try {
    const result = await updateGoalData(req.user.id, req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/goals/:id', async (req, res) => {
  try {
    const result = await deleteGoalData(req.user.id, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Resume & Optimizer
router.get('/resume', async (req, res) => {
  res.json(await getResumeData(req.user.id));
});

router.post('/resume/optimize', async (req, res) => {
  try {
    const result = await optimizeResumeData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// JD Analyzer
router.post('/jd-analyzer', async (req, res) => {
  try {
    const result = await analyzeJobDescriptionData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// AI Coach & Chat
router.get('/coach', async (req, res) => {
  res.json(await getCoachData(req.user.id));
});

router.post('/chat', async (req, res) => {
  try {
    const result = await handleChatRequest(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Roadmap
router.get('/roadmap', async (req, res) => {
  res.json(await getRoadmapData(req.user.id));
});

router.post('/roadmap/generate', async (req, res) => {
  try {
    const result = await generateRoadmapData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/roadmap/milestones/:id', async (req, res) => {
  try {
    const result = await updateMilestoneData(req.user.id, req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Practice
router.get('/practice', async (req, res) => {
  res.json(await getPracticeData(req.user.id));
});

router.post('/practice/submit', async (req, res) => {
  try {
    const result = await submitPracticeData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mock Interview Report
router.get('/interview-report', async (req, res) => {
  res.json(await getInterviewReportData(req.user.id));
});


// Notifications
router.get('/notifications', async (req, res) => {
  res.json(await getNotificationsData(req.user.id));
});

router.delete('/notifications/:id', async (req, res) => {
  try {
    const result = await deleteNotificationData(req.user.id, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Profile & Settings
router.get('/profile', async (req, res) => {
  res.json(await getProfileData(req.user.id));
});

router.put('/profile', async (req, res) => {
  try {
    const result = await updateProfileData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/settings', async (req, res) => {
  res.json(await getSettingsData(req.user.id));
});

router.put('/settings', async (req, res) => {
  try {
    const result = await updateSettingsData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin
router.get('/admin', async (req, res) => {
  res.json(await getAdminData());
});

export default router;
