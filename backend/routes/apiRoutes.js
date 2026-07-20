import express from 'express';
import {
  addAdminResourceData,
  addAdminUserData,
  addGoalData,
  addNotificationData,
  analyzeJobDescriptionData,
  deleteAdminUserData,
  deleteGoalData,
  deleteNotificationData,
  generateInterviewFeedbackData,
  generateRoadmapData,
  getAdminData,
  getCoachData,
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
  submitContactForm,
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
    message: 'CareerPrep API is running dynamically',
    config: {
      mongodbConfigured: Boolean(process.env.MONGODB_URI),
      aiConfigured: Boolean(process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY),
      model: process.env.OPENAI_MODEL || process.env.GEMINI_MODEL || 'dynamic-career-coach',
    },
  });
});

// Dashboard & Goals
router.get('/dashboard', async (req, res) => {
  try {
    res.json(await getDashboardData());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/goals', async (req, res) => {
  try {
    const result = await addGoalData(req.body.title);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/goals/:id', async (req, res) => {
  try {
    const result = await updateGoalData(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/goals/:id', async (req, res) => {
  try {
    const result = await deleteGoalData(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Resume & Optimizer
router.get('/resume', async (req, res) => {
  res.json(await getResumeData());
});

router.post('/resume/optimize', async (req, res) => {
  try {
    const result = await optimizeResumeData(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// JD Analyzer
router.post('/jd-analyzer', async (req, res) => {
  try {
    const result = await analyzeJobDescriptionData(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/jd/analyze', async (req, res) => {
  try {
    const result = await analyzeJobDescriptionData(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// AI Coach & Chat
router.get('/coach', async (req, res) => {
  res.json(await getCoachData());
});

router.post('/chat', async (req, res) => {
  const { message } = req.body || {};
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && !apiKey.includes('your_')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an elite CareerPrep AI assistant helping job seekers.' },
            { role: 'user', content: message || 'Hello' },
          ],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const reply = data.choices?.[0]?.message?.content?.trim() || 'No response was returned.';
        return res.json({ reply, model: process.env.OPENAI_MODEL || 'gpt-4o-mini' });
      }
    } catch (err) {
      // Fallback to internal coach engine
    }
  }

  // Built-in Dynamic Fallback AI Engine
  try {
    const result = await handleChatRequest(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/mentor/chat', async (req, res) => {
  try {
    const result = await handleChatRequest({ message: req.body.messages?.[req.body.messages.length - 1]?.content || req.body.message });
    res.json({ text: result.reply, isMock: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Roadmap
router.get('/roadmap', async (req, res) => {
  res.json(await getRoadmapData());
});

router.post('/roadmap/generate', async (req, res) => {
  try {
    const result = await generateRoadmapData(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/roadmap/milestones/:id', async (req, res) => {
  try {
    const result = await updateMilestoneData(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Practice
router.get('/practice', async (req, res) => {
  res.json(await getPracticeData());
});

router.post('/practice/submit', async (req, res) => {
  try {
    const result = await submitPracticeData(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Interview Feedback & Reports
router.get('/interview-report', async (req, res) => {
  res.json(await getInterviewReportData());
});

router.post('/interview/feedback', async (req, res) => {
  try {
    const result = await generateInterviewFeedbackData(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Notifications
router.get('/notifications', async (req, res) => {
  res.json(await getNotificationsData());
});

router.post('/notifications', async (req, res) => {
  try {
    const result = await addNotificationData(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/notifications/:id', async (req, res) => {
  try {
    const result = await deleteNotificationData(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Profile & Settings
router.get('/profile', async (req, res) => {
  res.json(await getProfileData());
});

router.put('/profile', async (req, res) => {
  try {
    const result = await updateProfileData(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/settings', async (req, res) => {
  res.json(await getSettingsData());
});

router.put('/settings', async (req, res) => {
  try {
    const result = await updateSettingsData(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin
router.get('/admin', async (req, res) => {
  res.json(await getAdminData());
});

router.post('/admin/users', async (req, res) => {
  try {
    const result = await addAdminUserData(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/admin/users/:id', async (req, res) => {
  try {
    const result = await deleteAdminUserData(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/admin/resources', async (req, res) => {
  try {
    const { groupId, item } = req.body;
    const result = await addAdminResourceData(groupId, item);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Auth & Contact
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

router.post('/contact', async (req, res) => {
  try {
    const result = await submitContactForm(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
