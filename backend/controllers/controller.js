import { createStore } from '../data/store.js';
import { generateToken } from '../middleware/authMiddleware.js';

const store = createStore();

export async function getDashboardData(userId) {
  return store.getDashboard(userId);
}

export async function addGoalData(userId, title) {
  return store.addGoal(userId, title);
}

export async function updateGoalData(userId, id, patch) {
  return store.updateGoal(userId, id, patch);
}

export async function deleteGoalData(userId, id) {
  return store.deleteGoal(userId, id);
}

export async function getResumeData(userId) {
  return store.getResume(userId);
}

export async function optimizeResumeData(userId, payload = {}) {
  const { resumeText, targetRole } = payload;
  return store.optimizeResume(userId, resumeText, targetRole);
}

export async function analyzeJobDescriptionData(userId, payload = {}) {
  const { jobDescription } = payload;
  if (!jobDescription || !jobDescription.trim()) {
    throw new Error('Job description text is required for analysis');
  }
  return store.analyzeJD(userId, jobDescription);
}

export async function getCoachData(userId) {
  return store.getCoachData(userId);
}

export async function handleChatRequest(userId, payload = {}) {
  const { message } = payload;
  if (!message || !message.trim()) {
    throw new Error('Message is required');
  }
  return store.handleChat(userId, message);
}

export async function getNotificationsData(userId) {
  const notifications = await store.getNotifications(userId);
  return { groups: notifications };
}

export async function deleteNotificationData(userId, id) {
  return store.deleteNotification(userId, id);
}

export async function getProfileData(userId) {
  return store.getProfile(userId);
}

export async function updateProfileData(userId, profilePatch) {
  return store.updateProfile(userId, profilePatch);
}

export async function getSettingsData(userId) {
  return store.getSettings(userId);
}

export async function updateSettingsData(userId, settingsPatch) {
  return store.updateSettings(userId, settingsPatch);
}

export async function getRoadmapData(userId) {
  return store.getRoadmap(userId);
}

export async function generateRoadmapData(userId, payload = {}) {
  const { targetRole, targetCompany } = payload;
  return store.generateRoadmap(userId, targetRole, targetCompany);
}

export async function updateMilestoneData(userId, id, patch) {
  return store.updateMilestone(userId, id, patch);
}

export async function getPracticeData(userId) {
  return store.getPractice(userId);
}

export async function submitPracticeData(userId, payload = {}) {
  return store.submitPractice(userId, payload);
}

export async function getInterviewReportData(userId) {
  return store.getInterviewReport(userId);
}


export async function getAdminData() {
  return store.getAdminData();
}

export async function getCurrentUser(userId) {
  const profile = await store.getProfile(userId);
  return {
    id: userId,
    email: profile.email,
    name: profile.name || 'User',
    title: profile.title,
  };
}

export async function submitAuthRequest(payload, type = 'login') {
  const { email, password, name } = payload;

  if (!email || !password || (type === 'register' && !name)) {
    throw new Error('Please complete all required fields.');
  }

  if (type === 'register') {
    const user = await store.registerUser({ name, email, password });
    const token = generateToken(user);
    return {
      success: true,
      message: 'Account created successfully.',
      user: { id: user.id, email: user.email, name: user.name },
      token,
    };
  }

  const loginResult = await store.loginUser({ email, password });
  const token = generateToken(loginResult.user);
  return {
    success: true,
    message: 'Signed in successfully.',
    ...loginResult,
    token,
  };
}
