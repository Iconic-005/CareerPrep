import * as mongoStore from '../data/mongoStore.js';
import { generateChatReplyStream, generateFollowUpSuggestions } from '../services/aiService.js';
import { generateToken } from '../middleware/authMiddleware.js';

export async function getDashboardData(userId) {
  return mongoStore.getDashboard(userId);
}

export async function addGoalData(userId, title) {
  return mongoStore.addGoal(userId, title);
}

export async function updateGoalData(userId, id, patch) {
  return mongoStore.updateGoal(userId, id, patch);
}

export async function deleteGoalData(userId, id) {
  return mongoStore.deleteGoal(userId, id);
}

export async function getResumeData(userId) {
  return mongoStore.getResume(userId);
}

export async function buildResumeData(userId) {
  return mongoStore.buildResumeWithAI(userId);
}

export async function updateResumeData(userId, payload = {}) {
  return mongoStore.updateResume(userId, payload);
}

export async function restoreResumeVersionData(userId, payload = {}) {
  const { versionId } = payload;
  return mongoStore.restoreResumeVersion(userId, versionId);
}

export async function optimizeResumeData(userId, payload = {}) {
  const { resumeText, targetRole } = payload;
  return mongoStore.optimizeResume(userId, resumeText, targetRole);
}

export async function analyzeJobDescriptionData(userId, payload = {}) {
  const { jobDescription } = payload;
  if (!jobDescription || !jobDescription.trim()) {
    throw new Error('Job description text is required for analysis');
  }
  return mongoStore.analyzeJD(userId, jobDescription);
}

export async function getLatestJDAnalysisData(userId) {
  return mongoStore.getLatestJDAnalysis(userId);
}

export async function getCoachData(userId) {
  return mongoStore.getCoachData(userId);
}

export async function handleChatRequest(userId, payload = {}) {
  const { message } = payload;
  if (!message || !message.trim()) {
    throw new Error('Message is required');
  }
  return mongoStore.handleChat(userId, message);
}

export async function getNotificationsData(userId) {
  const notifications = await mongoStore.getNotifications(userId);
  return { groups: notifications };
}

export async function markNotificationReadData(userId, id) {
  return mongoStore.markNotificationRead(userId, id);
}

export async function markAllNotificationsReadData(userId) {
  return mongoStore.markAllNotificationsRead(userId);
}

export async function deleteNotificationData(userId, id) {
  return mongoStore.deleteNotification(userId, id);
}

export async function clearAllNotificationsData(userId) {
  return mongoStore.clearAllNotifications(userId);
}

export async function getActivityData(userId, params) {
  return mongoStore.getActivityLog(userId, params);
}

export async function getProfileData(userId) {
  return mongoStore.getProfile(userId);
}

export async function updateProfileData(userId, profilePatch) {
  return mongoStore.updateProfile(userId, profilePatch);
}

export async function getSettingsData(userId) {
  return mongoStore.getSettings(userId);
}

export async function updateSettingsData(userId, settingsPatch) {
  return mongoStore.updateSettings(userId, settingsPatch);
}

export async function getRoadmapData(userId) {
  return mongoStore.getRoadmap(userId);
}

export async function generateRoadmapData(userId, payload = {}) {
  const { targetRole, targetCompany } = payload;
  return mongoStore.generateRoadmap(userId, targetRole, targetCompany);
}

export async function updateMilestoneData(userId, id, patch) {
  return mongoStore.updateMilestone(userId, id, patch);
}

export async function getPracticeData(userId) {
  return mongoStore.getPractice(userId);
}

export async function submitPracticeData(userId, payload = {}) {
  return mongoStore.submitPractice(userId, payload);
}

export async function updateCareerTrackData(userId, careerTrack) {
  return mongoStore.updateCareerTrack(userId, careerTrack);
}

export async function getCodingQuestionsData(userId, query) {
  return mongoStore.getCodingQuestions(userId, query);
}

export async function getCodingTopicsData(career) {
  return mongoStore.getCodingTopics(career);
}

export async function getCodingHistoryData(userId) {
  return mongoStore.getCodingHistory(userId);
}

export async function getUserPracticeStatsData(userId) {
  return mongoStore.getUserPracticeStats(userId);
}

export async function getRandomCodingQuestionData(userId, query) {
  return mongoStore.getRandomCodingQuestion(userId, query);
}

export async function getRandomAptitudeQuestionData(query) {
  return mongoStore.getRandomAptitudeQuestion(query);
}

export async function getAptitudeQuestionsData(query) {
  return mongoStore.getAptitudeQuestions(query);
}


export async function getInterviewReportData(userId) {
  return mongoStore.getInterviewReport(userId);
}

export async function startInterviewSession(userId, payload = {}) {
  return mongoStore.startMockInterview(userId, payload);
}

export async function evaluateInterviewSessionData(userId, payload = {}) {
  return mongoStore.evaluateMockInterview(userId, payload);
}

export async function clearCoachHistoryData(userId) {
  return mongoStore.clearChatHistory(userId);
}

export async function handleChatStreamRequest(userId, payload, res) {
  const { message } = payload;
  if (!message || !message.trim()) {
    throw new Error('Message is required');
  }

  // Get chat history
  const history = await mongoStore.getChatHistory(userId);

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  let fullReply = '';

  try {
    const stream = await generateChatReplyStream(history, message);

    for await (const chunk of stream) {
      const text = chunk.text();
      if (text) {
        fullReply += text;
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: text })}\n\n`);
      }
    }

    // Save messages to DB after streaming completes
    await mongoStore.saveChatMessages(userId, message, fullReply);

    // Generate and send follow-up suggestions
    try {
      const suggestions = await generateFollowUpSuggestions(history, fullReply);
      res.write(`data: ${JSON.stringify({ type: 'suggestions', suggestions })}\n\n`);
    } catch (e) {
      // Non-critical — silently skip suggestions
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (err) {
    console.error('Stream error:', err.message);
    res.write(`data: ${JSON.stringify({ type: 'error', message: 'Unable to reach AI Coach. Please try again.' })}\n\n`);
    res.end();
  }
}

export async function getAdminData() {
  return mongoStore.getAdminData();
}

export async function getCurrentUser(userId) {
  const profile = await mongoStore.getProfile(userId);
  return {
    id: userId,
    email: profile?.email || 'user@example.com',
    name: profile?.name || 'User',
    title: profile?.title || '',
    avatar: profile?.avatarUrl || '/images/alex_thompson.png',
  };
}

export async function submitAuthRequest(payload, type = 'login') {
  const { email, password, name } = payload;

  if (!email || !password || (type === 'register' && !name)) {
    throw new Error('Please complete all required fields.');
  }

  if (type === 'register') {
    const user = await mongoStore.registerUser({ name, email, password });
    const token = generateToken(user);
    return {
      success: true,
      message: 'Account created successfully in MongoDB.',
      user: { id: user.id, email: user.email, name: user.name },
      token,
    };
  }

  const loginResult = await mongoStore.loginUser({ email, password });
  const token = generateToken(loginResult);
  return {
    success: true,
    message: 'Signed in successfully via MongoDB.',
    user: loginResult,
    token,
  };
}
