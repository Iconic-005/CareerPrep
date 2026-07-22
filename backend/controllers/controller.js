import * as mongoStore from '../data/mongoStore.js';
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

export async function deleteNotificationData(userId, id) {
  return mongoStore.deleteNotification(userId, id);
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
