import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Jordan Avery' },
  title: { type: String, default: 'Transitioning into Senior Product Management' },
  skills: [{ type: String }],
  about: { type: String },
  metrics: [{ label: String, value: String, accent: String }],
  focusAreas: [{ label: String, value: String }],
  recruiterSnapshot: { type: String },
}, { timestamps: true });

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, default: 'Just now' },
  detail: { type: String },
  accent: { type: String, default: 'blue' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String },
  time: { type: String, default: 'In progress' },
  tone: { type: String, default: 'blue' },
  done: { type: Boolean, default: false },
}, { timestamps: true });

const adminUserSchema = new mongoose.Schema({
  initials: String,
  name: String,
  email: String,
  status: String,
  statusTone: String,
  subscription: String,
  activity: String,
  accent: String,
}, { timestamps: true });

const jdAnalysisSchema = new mongoose.Schema({
  jobTitle: String,
  keywordMatch: String,
  atsScore: String,
  matchedSkills: [String],
  missingSkills: [String],
  recommendations: [String],
}, { timestamps: true });

export const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
export const GoalModel = mongoose.models.Goal || mongoose.model('Goal', goalSchema);
export const NotificationModel = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export const MilestoneModel = mongoose.models.Milestone || mongoose.model('Milestone', milestoneSchema);
export const AdminUserModel = mongoose.models.AdminUser || mongoose.model('AdminUser', adminUserSchema);
export const JDAnalysisModel = mongoose.models.JDAnalysis || mongoose.model('JDAnalysis', jdAnalysisSchema);
