import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const profileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: 'User' },
    email: { type: String, default: '' },
    title: { type: String, default: 'Senior Product Designer' },
    avatarUrl: { type: String, default: '/images/alex_thompson.png' },
    completion: { type: Number, default: 85 },
    about: { type: String, default: '' },
    recruiterSnapshot: { type: String, default: '' },
    experiences: [
      {
        id: String,
        role: String,
        company: String,
        period: String,
        description: String,
        current: Boolean,
      },
    ],
    education: [
      {
        id: String,
        degree: String,
        institution: String,
        period: String,
        description: String,
      },
    ],
    projects: [
      {
        id: String,
        title: String,
        description: String,
        image: String,
      },
    ],
    skills: [{ type: String }],
    skillsActive: [{ type: String }],
    targetRoles: [{ type: String }],
    dreamCompanies: [{ name: String, color: String }],
    aiSuggestion: {
      targetCompany: String,
      title: String,
      description: String,
      buttonLabel: String,
    },
    metrics: [{ label: String, value: String, accent: String }],
    focusAreas: [{ label: String, value: String }],
  },
  { timestamps: true }
);

const analyticsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    codingXP: { type: Number, default: 0 },
    careerReadiness: { type: Number, default: 0 },
    resumeScore: { type: String, default: 'Not Generated' },
    interviewRank: { type: String, default: '--' },
    weeklyActivity: [
      { day: String, count: Number }
    ],
    activityLog: [
      { id: String, title: String, desc: String, time: String, tone: String, createdAt: { type: Date, default: Date.now } }
    ],
    practiceStats: {
      questionsCompleted: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
    },
    streak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const goalSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    done: { type: Boolean, default: false },
    status: { type: String, default: 'Pending' },
  },
  { timestamps: true }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    suggestions: [
      { id: String, title: String, desc: String, accent: String }
    ],
    missingSkills: [{ type: String }],
    resumeText: { type: String, default: '' },
    score: { type: String, default: 'Not Generated' },
    versions: [
      { title: String, date: String, content: String }
    ],
  },
  { timestamps: true }
);

const mockInterviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, default: 'Mock Interview Session' },
    role: { type: String, default: 'Product Manager' },
    targetCompany: { type: String, default: 'Google' },
    difficulty: { type: String, default: 'Mid-Level' },
    score: { type: Number, default: 8.5 },
    maxScore: { type: Number, default: 10 },
    headline: { type: String, default: 'Excellent Performance!' },
    percentileText: { type: String, default: 'You are in the top 5% of candidates for Senior Product Designer roles.' },
    skillsRadar: {
      Technical: { type: Number, default: 88 },
      Communication: { type: Number, default: 82 },
      Grammar: { type: Number, default: 75 },
      Behavioral: { type: Number, default: 85 },
      Confidence: { type: Number, default: 90 },
    },
    strengths: [
      { id: String, title: String, desc: String }
    ],
    improvements: [
      { id: String, title: String, desc: String }
    ],
    nextSteps: [
      { id: String, title: String, text: String, icon: String }
    ],
    interviewDate: { type: Date, default: Date.now },
    status: { type: String, default: 'Upcoming' },
  },
  { timestamps: true }
);

const roadmapSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    bannerTitle: { type: String, default: 'Target Transition' },
    bannerSubtitle: { type: String, default: 'Not Set' },
    bannerMeta: { type: String, default: 'No roadmap generated yet. Generate a roadmap to map your transition.' },
    milestones: [
      { id: String, title: String, desc: String, time: String, tone: String, done: Boolean }
    ],
    focusAreas: [
      { id: String, title: String, text: String }
    ],
  },
  { timestamps: true }
);

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    detail: { type: String, default: '' },
    time: { type: String, default: 'Just now' },
    accent: { type: String, default: 'blue' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const jdAnalysisSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    jobTitle: { type: String, default: 'Target Role Audit' },
    keywordMatch: { type: String, default: '0%' },
    atsScore: { type: String, default: '0%' },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    recommendations: [{ type: String }],
    jobDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

const aiChatHistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    messages: [
      { role: { type: String, enum: ['user', 'assistant'] }, content: String, createdAt: { type: Date, default: Date.now } }
    ],
  },
  { timestamps: true }
);

const practiceHistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    problemId: String,
    title: String,
    type: { type: String, default: 'code' },
    score: Number,
    runtime: String,
    beatsPercent: String,
    accuracy: Number,
  },
  { timestamps: true }
);

const badgeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: String,
    title: String,
    category: String,
    earnedAt: { type: String, default: 'Recently' },
    icon: String,
    description: String,
  },
  { timestamps: true }
);

const userSettingsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    preferences: {
      email: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
      insights: { type: Boolean, default: false },
    },
    theme: { type: String, default: 'Light' },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
export const AnalyticsModel = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);
export const GoalModel = mongoose.models.Goal || mongoose.model('Goal', goalSchema);
export const ResumeModel = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
export const MockInterviewModel = mongoose.models.MockInterview || mongoose.model('MockInterview', mockInterviewSchema);
export const RoadmapModel = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);
export const NotificationModel = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export const JDAnalysisModel = mongoose.models.JDAnalysis || mongoose.model('JDAnalysis', jdAnalysisSchema);
export const AIChatHistoryModel = mongoose.models.AIChatHistory || mongoose.model('AIChatHistory', aiChatHistorySchema);
export const PracticeHistoryModel = mongoose.models.PracticeHistory || mongoose.model('PracticeHistory', practiceHistorySchema);
export const BadgeModel = mongoose.models.Badge || mongoose.model('Badge', badgeSchema);
export const UserSettingsModel = mongoose.models.UserSettings || mongoose.model('UserSettings', userSettingsSchema);
