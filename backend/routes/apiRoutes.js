import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  addGoalData,
  analyzeJobDescriptionData,
  buildResumeData,
  clearAllNotificationsData,
  clearCoachHistoryData,
  deleteGoalData,
  deleteNotificationData,
  evaluateInterviewSessionData,
  generateRoadmapData,
  getActivityData,
  getAdminData,
  getCoachData,
  getChatSessionsData,
  createChatSessionData,
  updateChatSessionData,
  deleteChatSessionData,
  getCurrentUser,
  getDashboardData,
  getInterviewReportData,
  getLatestJDAnalysisData,
  getNotificationsData,
  getPracticeData,
  submitPracticeData,
  updateCareerTrackData,
  getCodingQuestionsData,
  getCodingTopicsData,
  getCodingHistoryData,
  getAptitudeQuestionsData,
  getUserPracticeStatsData,
  getRandomCodingQuestionData,
  getRandomAptitudeQuestionData,
  getProfileData,
  getResumeData,
  getRoadmapData,
  getSettingsData,
  handleChatRequest,
  handleChatStreamRequest,
  markAllNotificationsReadData,
  markNotificationReadData,
  optimizeResumeData,
  restoreResumeVersionData,
  startInterviewSession,
  submitAuthRequest,
  updateGoalData,
  updateMilestoneData,
  updateProfileData,
  updateResumeData,
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

// Resume & AI Builder
router.get('/resume', async (req, res) => {
  try {
    res.json(await getResumeData(req.user.id));
  } catch (error) {
    console.error('[GET /resume error]:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/resume/build', async (req, res) => {
  try {
    const result = await buildResumeData(req.user.id);
    res.json(result);
  } catch (error) {
    console.error('[POST /resume/build error]:', error);
    res.status(400).json({ error: error.message });
  }
});

router.put('/resume', async (req, res) => {
  try {
    const result = await updateResumeData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    console.error('[PUT /resume error]:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/resume/restore-version', async (req, res) => {
  try {
    const result = await restoreResumeVersionData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    console.error('[POST /resume/restore-version error]:', error);
    res.status(400).json({ error: error.message });
  }
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
router.get('/jd-analyzer', async (req, res) => {
  try {
    const result = await getLatestJDAnalysisData(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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
  try {
    const { sessionId } = req.query;
    res.json(await getCoachData(req.user.id, sessionId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/chat/sessions', async (req, res) => {
  try {
    res.json(await getChatSessionsData(req.user.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/chat/sessions', async (req, res) => {
  try {
    res.json(await createChatSessionData(req.user.id, req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/chat/sessions/:id', async (req, res) => {
  try {
    res.json(await updateChatSessionData(req.user.id, req.params.id, req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/chat/sessions/:id', async (req, res) => {
  try {
    res.json(await deleteChatSessionData(req.user.id, req.params.id));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const result = await handleChatRequest(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/chat/stream', async (req, res) => {
  try {
    await handleChatStreamRequest(req.user.id, req.body, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
      res.end();
    }
  }
});

router.delete('/chat/clear', async (req, res) => {
  try {
    const result = await clearCoachHistoryData(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// File Upload & Specialized Analysis
router.post('/upload', async (req, res) => {
  try {
    const { name, type, size, base64, extractedText } = req.body;
    if (!name || !type) throw new Error('File name and type are required.');
    if (size && size > 20 * 1024 * 1024) throw new Error('File size exceeds maximum limit of 20MB.');

    const fileObj = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      type,
      size: size || 0,
      mimeType: type,
      base64: base64 || null,
      extractedText: extractedText || '',
      uploadedAt: new Date(),
    };

    res.json({ success: true, file: fileObj });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/resume-review', async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    const prompt = `Review this resume for the role "${targetRole || 'Software Engineer'}". Critique bullet points using the Google X-Y-Z formula and identify missing technical skills.`;
    const result = await handleChatRequest(req.user.id, { message: prompt, attachments: resumeText ? [{ name: 'Resume.txt', extractedText: resumeText }] : [] });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/document-analysis', async (req, res) => {
  try {
    const { documentName, documentContent } = req.body;
    const prompt = `Analyze this document "${documentName || 'Document'}": summarize key takeaways, extract core technical concepts, and provide actionable next steps.`;
    const result = await handleChatRequest(req.user.id, { message: prompt, attachments: [{ name: documentName || 'Doc', extractedText: documentContent }] });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/certificate-analysis', async (req, res) => {
  try {
    const { certificateName, issuer, base64, mimeType } = req.body;
    const prompt = `Analyze this certification "${certificateName || 'Certificate'}" issued by ${issuer || 'issuing body'}. Verify its industry relevance, skills validated, and how to showcase it on LinkedIn/Resume.`;
    const attachments = base64 ? [{ name: certificateName || 'Cert', base64, mimeType: mimeType || 'image/png' }] : [];
    const result = await handleChatRequest(req.user.id, { message: prompt, attachments });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/image-analysis', async (req, res) => {
  try {
    const { imageName, base64, mimeType, userQuery } = req.body;
    const prompt = userQuery || `Analyze this image "${imageName || 'Screenshot'}". Perform OCR, explain diagrams or code snippets shown, and provide actionable insights.`;
    const attachments = base64 ? [{ name: imageName || 'Image', base64, mimeType: mimeType || 'image/png' }] : [];
    const result = await handleChatRequest(req.user.id, { message: prompt, attachments });
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

// Practice & User Stats
router.get('/user/practice-stats', async (req, res) => {
  try {
    const stats = await getUserPracticeStatsData(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/practice', async (req, res) => {
  res.json(await getPracticeData(req.user.id));
});

router.put('/practice/career', async (req, res) => {
  try {
    const { careerTrack } = req.body;
    const result = await updateCareerTrackData(req.user.id, careerTrack);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/practice/coding', async (req, res) => {
  try {
    const { career, topic, difficulty, search } = req.query;
    const result = await getCodingQuestionsData(req.user.id, { career, topic, difficulty, search });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/practice/coding/random', async (req, res) => {
  try {
    const { career, topic, difficulty } = req.query;
    const result = await getRandomCodingQuestionData(req.user.id, { career, topic, difficulty });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/practice/coding/topics', async (req, res) => {
  try {
    const { career } = req.query;
    const topics = await getCodingTopicsData(career);
    res.json({ topics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/practice/coding/history', async (req, res) => {
  try {
    const history = await getCodingHistoryData(req.user.id);
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/practice/aptitude', async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const result = await getAptitudeQuestionsData({ category, difficulty });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/practice/aptitude/random', async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const result = await getRandomAptitudeQuestionData({ category, difficulty });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/practice/submit', async (req, res) => {
  try {
    const result = await submitPracticeData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mock Interview Session & Report
router.get('/interview-report', async (req, res) => {
  res.json(await getInterviewReportData(req.user.id));
});

router.post('/interview/start', async (req, res) => {
  try {
    const result = await startInterviewSession(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/interview/evaluate', async (req, res) => {
  try {
    const result = await evaluateInterviewSessionData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Activity Log
router.get('/activity', async (req, res) => {
  try {
    const { search, category, page, limit } = req.query;
    const result = await getActivityData(req.user.id, { search, category, page, limit });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notifications
router.get('/notifications', async (req, res) => {
  res.json(await getNotificationsData(req.user.id));
});

router.patch('/notifications/read-all', async (req, res) => {
  try {
    const result = await markAllNotificationsReadData(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const result = await markNotificationReadData(req.user.id, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/notifications', async (req, res) => {
  try {
    const result = await clearAllNotificationsData(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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
