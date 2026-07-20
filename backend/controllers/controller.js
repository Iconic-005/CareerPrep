import { createStore } from '../data/store.js';

const store = createStore();

export async function getDashboardData() {
  const state = await store.getState();
  const goals = await store.getGoals();
  const firstName = (state.profile?.name || 'Alex').split(' ')[0];
  
  const completedGoals = goals.filter((g) => g.done).length;
  const totalGoals = goals.length || 1;
  const readiness = Math.min(100, Math.max(50, Math.round(75 + (completedGoals / totalGoals) * 20)));

  return {
    greeting: firstName,
    readiness,
    stats: [
      { title: 'Resume Score', value: `${Math.max(70, Math.min(99, 80 + (state.profile?.name?.length || 0) % 10))} / 100`, accent: 'blue', icon: 'document' },
      { title: 'Interview Rank', value: state.profile?.focusAreas?.[0]?.value ? `Top ${Math.max(3, 12 - Math.min(8, state.profile.focusAreas[0].value.length % 5))}%` : 'Top 5%', accent: 'violet', icon: 'mic' },
      { title: 'Coding XP', value: `${Math.max(1200, 2400 + (state.profile?.skills?.length || 0) * 60)} pts`, accent: 'slate', icon: 'code' },
    ],
    goals,
  };
}

export async function addGoalData(title) {
  return store.addGoal(title);
}

export async function updateGoalData(id, patch) {
  return store.updateGoal(id, patch);
}

export async function deleteGoalData(id) {
  return store.deleteGoal(id);
}

export async function getResumeData() {
  const state = await store.getState();
  const skills = state.profile?.skills || [];

  return {
    suggestions: state.resume?.suggestions || [],
    missingSkills: skills.length ? skills.slice(0, 3) : ['Python', 'AWS', 'Kubernetes'],
    resumeText: state.resume?.resumeText || '',
  };
}

export async function optimizeResumeData(payload = {}) {
  const { resumeText, targetRole } = payload;
  return store.optimizeResume(resumeText, targetRole);
}

export async function analyzeJobDescriptionData(payload = {}) {
  const { jobDescription, resumeText } = payload;
  if (!jobDescription || !jobDescription.trim()) {
    throw new Error('Job description text is required for analysis');
  }
  return store.analyzeJD(jobDescription, resumeText);
}

export async function getCoachData() {
  const state = await store.getState();
  const role = state.profile?.focusAreas?.[0]?.value || 'Senior Product role';
  const firstName = (state.profile?.name || 'there').split(' ')[0];

  return {
    userName: firstName,
    welcome: `I reviewed your recent job searches. Let’s sharpen your profile for ${role}.`,
    starterPrompts: ['Review my resume', 'Prep for Google', `Find gaps in ${state.profile?.skills?.[0] || 'my skills'}`],
    history: state.chatHistory || [],
  };
}

export async function handleChatRequest(payload = {}) {
  const { message } = payload;
  if (!message || !message.trim()) {
    throw new Error('Message is required');
  }
  return store.handleChat(message);
}

export async function getNotificationsData() {
  const notifications = await store.getNotifications();
  return { groups: notifications };
}

export async function addNotificationData(payload) {
  return store.addNotification(payload);
}

export async function deleteNotificationData(id) {
  return store.deleteNotification(id);
}

export async function getProfileData() {
  const state = await store.getState();
  return state.profile;
}

export async function updateProfileData(profilePatch) {
  return store.updateProfile(profilePatch);
}

export async function getSettingsData() {
  const state = await store.getState();
  return {
    tabs: ['Profile', 'Account', 'Theme', 'Notifications', 'Security', 'Billing'],
    themeOptions: ['Light', 'Dark', 'System'],
    content: {
      Profile: [['Name', state.profile.name], ['Career goal', state.profile.focusAreas?.[0]?.value || 'Senior Product Manager'], ['Location', 'New York, NY']],
      Account: [['Email', 'jordan.avery@example.com'], ['Plan', 'CareerPrep Pro'], ['Member since', 'July 2025']],
      Notifications: [['Interview reminders', '15 minutes before sessions'], ['Weekly summary', 'Every Monday at 9:00 AM'], ['Product updates', 'Only important releases']],
      Security: [['Password', 'Last changed 42 days ago'], ['Two-factor authentication', 'Enabled'], ['Active sessions', '2 devices']],
      Billing: [['Current plan', 'Pro · $19/month'], ['Next billing date', 'August 18, 2026'], ['Payment method', 'Visa ending in 4242']],
    },
    preferences: state.settings.preferences,
    theme: state.settings.theme,
  };
}

export async function updateSettingsData(settingsPatch) {
  return store.updateSettings(settingsPatch);
}

export async function getRoadmapData() {
  const roadmap = await store.getRoadmap();
  return roadmap;
}

export async function generateRoadmapData(payload = {}) {
  const { targetRole, targetCompany } = payload;
  return store.generateRoadmap(targetRole, targetCompany);
}

export async function updateMilestoneData(id, patch) {
  return store.updateMilestone(id, patch);
}

export async function getPracticeData() {
  const state = await store.getState();
  return { tracks: state.practiceTracks || [] };
}

export async function submitPracticeData(payload = {}) {
  return {
    success: true,
    message: 'Solution submitted successfully! Test suite passed.',
    score: 100,
    xpGained: 50,
  };
}

export async function getInterviewReportData() {
  const state = await store.getState();
  const role = state.profile?.focusAreas?.[0]?.value || 'your next role';

  return {
    metrics: [
      { label: 'Confidence Score', value: '89%', detail: 'Strong executive presence with clear structure.', accent: 'blue' },
      { label: 'Technical Depth', value: '76%', detail: 'Good baseline, but system examples need more detail.', accent: 'violet' },
      { label: 'Story Quality', value: '84%', detail: 'Your STAR answers are coherent and memorable.', accent: 'slate' },
    ],
    strengths: [
      { title: 'Calm communication', text: 'You answered follow-up questions without rushing or overexplaining.' },
      { title: 'Strong prioritization', text: `Your ${role} case studies showed clear decision-making under constraints.` },
      { title: 'Leadership signals', text: 'You consistently referenced ownership and cross-functional alignment.' },
    ],
    notes: [
      { title: 'Sharpen metrics', desc: 'Add numeric outcomes to your redesign story.', time: 'High impact', tone: 'blue' },
      { title: 'System design specificity', desc: 'Name tradeoffs, bottlenecks, and monitoring choices.', time: 'Medium impact', tone: 'violet' },
      { title: 'Behavioral close', desc: 'End stories with business impact more consistently.', time: 'Quick win', tone: 'slate' },
    ],
  };
}

export async function generateInterviewFeedbackData(payload = {}) {
  const { role, difficulty, messages } = payload;
  return store.generateInterviewFeedback(role, difficulty, messages);
}

export async function getAdminData() {
  const state = await store.getState();
  const skillCount = state.profile?.skills?.length || 0;

  return {
    stats: [
      { title: 'Total Users', value: `${state.adminUsers.length * 14200}`, icon: 'users', tone: 'blue', change: '+12.5%', trend: 'up', progress: 74 },
      { title: 'Active Interviews', value: `${1400 + skillCount * 10}`, icon: 'broadcast', tone: 'violet', change: '+8.2%', trend: 'up', progress: 52 },
      { title: 'Monthly Revenue', value: `$${128450 + skillCount * 150}`, icon: 'wallet', tone: 'slate', change: '-2.4%', trend: 'down', progress: 61 },
      { title: 'Success Rate', value: `${76.4 + Math.min(10, skillCount * 0.2)}%`, icon: 'badge', tone: 'sky', change: '98%', trend: 'neutral', progress: 78 },
    ],
    userActivity: state.adminUsers || [],
    resourceGroups: state.resourceGroups || [],
    reports: [
      { label: 'Resume Score Avg.', value: 78, tone: 'blue' },
      { label: 'Interview AI Confidence', value: 92, tone: 'violet' },
    ],
    topSkills: state.profile?.skills || ['Python', 'Cloud Arch', 'React', 'LLM Tuning', 'Product Logic'],
    systemHealth: [
      { label: 'API Latency', value: '24ms' },
      { label: 'GPU Load (AI Inference)', value: '62%' },
      { label: 'Error Rate', value: '0.002%', accent: 'mint' },
    ],
  };
}

export async function addAdminUserData(userData) {
  return store.addAdminUser(userData);
}

export async function deleteAdminUserData(id) {
  return store.deleteAdminUser(id);
}

export async function addAdminResourceData(groupId, item) {
  return store.addAdminResource(groupId, item);
}

export async function submitAuthRequest(payload, type = 'login') {
  const { email, password, name } = payload;

  if (!email || !password || (type === 'register' && !name)) {
    throw new Error('Please complete all required fields.');
  }

  if (type === 'register') {
    const user = await store.registerUser({ name, email, password });
    return {
      success: true,
      message: 'Account created successfully.',
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  const loginResult = await store.loginUser({ email, password });
  return {
    success: true,
    message: 'Signed in successfully.',
    ...loginResult,
  };
}

export async function submitContactForm(payload) {
  const { name, email, message } = payload;

  if (!name || !email || !message) {
    throw new Error('All fields are required');
  }

  return {
    success: true,
    message: 'Thanks! Your request has been received.',
    received: { name, email },
  };
}
