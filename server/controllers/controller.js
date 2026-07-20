import { createStore } from '../data/store.js';

const store = createStore();

export async function getDashboardData() {
  return {
    greeting: 'Alex',
    readiness: 92,
    stats: [
      { title: 'Resume Score', value: '85 / 100', accent: 'blue', icon: 'document' },
      { title: 'Interview Rank', value: 'Top 5%', accent: 'violet', icon: 'mic' },
      { title: 'Coding XP', value: '2,400 pts', accent: 'slate', icon: 'code' },
    ],
    goals: [
      { title: '3 Coding Problems', done: false, status: '1 / 3 Done' },
      { title: 'Review Resume Feedback', done: true, status: 'Complete' },
      { title: '1 Mock Interview Session', done: false, status: 'Pending' },
    ],
  };
}

export async function getResumeData() {
  return {
    suggestions: [
      { id: 1, title: 'Quantify achievements in your Stripe role.', desc: 'Specific percentages increase credibility with ATS filters by 22%.', accent: 'blue' },
      { id: 2, title: 'Rewrite summary for a leadership focus.', desc: 'Shift the summary from task-based language to strategic outcomes.', accent: 'violet' },
    ],
    missingSkills: ['Python', 'AWS', 'Kubernetes'],
  };
}

export async function getCoachData() {
  return {
    welcome: 'I reviewed your recent job searches. Let’s sharpen your profile for a Senior Product role.',
    starterPrompts: ['Review my resume', 'Prep for Google', 'Find gaps in my skills'],
  };
}

export async function getNotificationsData() {
  return {
    groups: [
      { title: 'Interview reminder', time: 'Today, 4:45 PM', detail: 'Google PM mock interview starts in 15 minutes.', accent: 'blue' },
      { title: 'Resume suggestion', time: 'Today, 1:12 PM', detail: 'AI found 3 impact metrics to strengthen your Stripe case study.', accent: 'violet' },
      { title: 'Roadmap milestone', time: 'Yesterday', detail: 'You completed the Product Strategy module ahead of schedule.', accent: 'mint' },
      { title: 'New report ready', time: 'July 15, 2026', detail: 'Your latest mock interview confidence report is ready to review.', accent: 'slate' },
    ],
  };
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
      Profile: [['Name', state.profile.name], ['Career goal', state.profile.focusAreas[0]?.value || 'Senior Product Manager'], ['Location', 'New York, NY']],
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

export async function getAdminData() {
  return {
    stats: [
      { title: 'Total Users', value: '42,892', icon: 'users', tone: 'blue', change: '+12.5%', trend: 'up', progress: 74 },
      { title: 'Active Interviews', value: '1,402', icon: 'broadcast', tone: 'violet', change: '+8.2%', trend: 'up', progress: 52 },
      { title: 'Monthly Revenue', value: '$128,450', icon: 'wallet', tone: 'slate', change: '-2.4%', trend: 'down', progress: 61 },
      { title: 'Success Rate', value: '76.4%', icon: 'badge', tone: 'sky', change: '98%', trend: 'neutral', progress: 78 },
    ],
    userActivity: [
      { initials: 'JD', name: 'Jane Doe', email: 'jane.doe@example.com', status: 'Active', statusTone: 'green', subscription: 'Pro Tier', activity: '2h ago', accent: 'blue' },
      { initials: 'MS', name: 'Michael Smith', email: 'm.smith@dev.co', status: 'Interviewing', statusTone: 'amber', subscription: 'Free', activity: '5m ago', accent: 'violet' },
      { initials: 'AW', name: 'Alex Wong', email: 'alex.w@uxdesign.com', status: 'Offline', statusTone: 'gray', subscription: 'Enterprise', activity: '1d ago', accent: 'slate' },
    ],
    resourceGroups: [
      { title: 'Aptitude Pool', icon: 'brain', tone: 'blue', action: 'Manage All', buttonLabel: '+ Add Category', items: [{ title: 'Quantitative Reasoning', subtitle: '420 Questions' }, { title: 'Logical Deduction', subtitle: '315 Questions' }] },
      { title: 'Coding Challenges', icon: 'code', tone: 'violet', action: 'Manage All', buttonLabel: '+ New Challenge', items: [{ title: 'Data Structures', subtitle: 'Expert • 85 Problems' }, { title: 'System Design', subtitle: 'Senior • 42 Case Studies' }] },
    ],
    reports: [
      { label: 'Resume Score Avg.', value: 78, tone: 'blue' },
      { label: 'Interview AI Confidence', value: 92, tone: 'violet' },
    ],
    topSkills: ['Python', 'Cloud Arch', 'React', 'LLM Tuning', 'Product Logic'],
    systemHealth: [
      { label: 'API Latency', value: '24ms' },
      { label: 'GPU Load (AI Inference)', value: '62%' },
      { label: 'Error Rate', value: '0.002%', accent: 'mint' },
    ],
  };
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
