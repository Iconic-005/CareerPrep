import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const analyticsSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  codingXP: { type: Number, default: 0 },
  careerReadiness: { type: Number, default: 0 },
  resumeScore: { type: String, default: 'Not Generated' },
  interviewRank: { type: String, default: '--' },
  weeklyActivity: [{ day: String, count: Number }],
  activityLog: [{ title: String, desc: String, time: String, tone: String }],
  practiceStats: { questionsCompleted: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
  streak: { type: Number, default: 0 },
}, { timestamps: true });

const profileSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String },
  email: { type: String },
  title: { type: String, default: '' },
  skills: [{ type: String }],
  about: { type: String, default: '' },
  metrics: [{ label: String, value: String, accent: String }],
  focusAreas: [{ label: String, value: String }],
  recruiterSnapshot: { type: String, default: '' },
}, { timestamps: true });

const goalSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

const resumeSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  suggestions: [{ id: String, title: String, desc: String, accent: String }],
  missingSkills: [{ type: String }],
  resumeText: { type: String, default: '' },
  versions: [{ title: String, date: String, content: String }],
}, { timestamps: true });

const mockInterviewSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, default: 'Mock Interview' },
  role: { type: String, default: 'Target Role' },
  difficulty: { type: String, default: 'Medium' },
  overallScore: { type: Number, default: 0 },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  status: { type: String, default: 'Completed' },
}, { timestamps: true });

const roadmapSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  bannerTitle: { type: String, default: 'Target Transition' },
  bannerSubtitle: { type: String, default: 'Not Set' },
  bannerMeta: { type: String, default: 'No roadmap generated yet' },
  milestones: [{ id: String, title: String, desc: String, time: String, tone: String, done: Boolean }],
  focusAreas: [{ id: String, title: String, text: String }],
}, { timestamps: true });

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  time: { type: String, default: 'Just now' },
  detail: { type: String },
  accent: { type: String, default: 'blue' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

const jdAnalysisSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  jobTitle: String,
  keywordMatch: String,
  atsScore: String,
  matchedSkills: [String],
  missingSkills: [String],
  recommendations: [String],
}, { timestamps: true });

const badgeSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: String,
  title: String,
  category: String,
  earnedAt: String,
  icon: String,
  description: String,
}, { timestamps: true });

const userSettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  preferences: { email: { type: Boolean, default: true }, reminders: { type: Boolean, default: true }, insights: { type: Boolean, default: false } },
  theme: { type: String, default: 'Light' },
}, { timestamps: true });

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export const AnalyticsModel = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);
export const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
export const GoalModel = mongoose.models.Goal || mongoose.model('Goal', goalSchema);
export const ResumeModel = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
export const MockInterviewModel = mongoose.models.MockInterview || mongoose.model('MockInterview', mockInterviewSchema);
export const RoadmapModel = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);
export const NotificationModel = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export const JDAnalysisModel = mongoose.models.JDAnalysis || mongoose.model('JDAnalysis', jdAnalysisSchema);
export const BadgeModel = mongoose.models.Badge || mongoose.model('Badge', badgeSchema);
export const UserSettingsModel = mongoose.models.UserSettings || mongoose.model('UserSettings', userSettingsSchema);
