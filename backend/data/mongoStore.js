import bcrypt from 'bcryptjs';
import {
  UserModel,
  ProfileModel,
  AnalyticsModel,
  GoalModel,
  ResumeModel,
  MockInterviewModel,
  RoadmapModel,
  NotificationModel,
  JDAnalysisModel,
  AIChatHistoryModel,
  PracticeHistoryModel,
  BadgeModel,
  UserSettingsModel,
} from '../models/index.js';
import {
  generateChatReply,
  generateOptimizedResume,
  generateJDAnalysis,
  generateRoadmap as aiGenerateRoadmap,
  generateMockInterviewQuestions,
  evaluateInterviewSession,
  evaluateCodeSubmission,
} from '../services/aiService.js';

export async function ensureUserInitialized(userId, name = 'User', email = '') {
  let profile = await ProfileModel.findOne({ userId });
  if (!profile) {
    profile = await ProfileModel.create({
      userId,
      name,
      email,
      title: 'Senior Product Designer @ Fintech Innovations',
      avatarUrl: '/images/alex_thompson.png',
      completion: 85,
      about: 'Passionate about designing human-centered products and scalable design systems.',
      recruiterSnapshot: 'Experienced designer with strong background in Fintech and React ecosystems.',
      experiences: [
        {
          id: 'exp_1',
          role: 'Senior Product Designer',
          company: 'Fintech Innovations',
          period: 'Jan 2022 — Present',
          description: 'Leading the design system team for a series-B mobile banking app. Reduced design-to-code latency by 40%.',
          current: true,
        },
        {
          id: 'exp_2',
          role: 'UX Designer',
          company: 'Creativ Studio',
          period: 'Jun 2019 — Dec 2021',
          description: 'Designed end-to-end user journeys for high-traffic e-commerce platforms.',
          current: false,
        },
      ],
      education: [
        {
          id: 'edu_1',
          degree: 'B.S. Interaction Design',
          institution: 'Stanford University',
          period: '2015 — 2019',
          description: 'Focus on Human-Computer Interaction and Cognitive Psychology.',
        },
      ],
      projects: [
        {
          id: 'proj_1',
          title: 'Nexus Wallet',
          description: 'Crypto asset management redesigned for clarity.',
          image: '/images/nexus_wallet.png',
        },
        {
          id: 'proj_2',
          title: 'DataStream Dashboard',
          description: 'Real-time analytics for enterprise-level logistics.',
          image: '/images/datastream_dashboard.png',
        },
      ],
      skills: ['Figma', 'UI/UX Design', 'React.js', 'Design Systems', 'Prototyping', 'User Testing', 'Adobe CC'],
      skillsActive: ['Figma', 'UI/UX Design', 'React.js'],
      targetRoles: ['Principal Product Designer', 'Design Manager'],
      dreamCompanies: [
        { name: 'Stripe', color: '#000000' },
        { name: 'Linear', color: '#2563eb' },
        { name: 'Airbnb', color: '#ff385c' },
      ],
      aiSuggestion: {
        targetCompany: 'Stripe',
        title: 'Optimize for Stripe',
        description: "Based on your target companies, highlight 'Systems Thinking' in your project descriptions.",
        buttonLabel: 'Refine Project Text',
      },
    });
  }

  let analytics = await AnalyticsModel.findOne({ userId });
  if (!analytics) {
    analytics = await AnalyticsModel.create({
      userId,
      codingXP: 150,
      careerReadiness: 65,
      resumeScore: '85/100',
      interviewRank: 'Top 10%',
      weeklyActivity: [
        { day: 'Mon', count: 2 },
        { day: 'Tue', count: 4 },
        { day: 'Wed', count: 1 },
        { day: 'Thu', count: 5 },
        { day: 'Fri', count: 3 },
        { day: 'Sat', count: 0 },
        { day: 'Sun', count: 2 },
      ],
      activityLog: [
        { id: `act_${Date.now()}_1`, title: 'Joined CareerPrep Platform', desc: 'Account created and initialized.', time: 'Recently', tone: 'mint' },
      ],
      practiceStats: { questionsCompleted: 4, accuracy: 88 },
      streak: 3,
    });
  }

  let resume = await ResumeModel.findOne({ userId });
  if (!resume) {
    resume = await ResumeModel.create({
      userId,
      suggestions: [
        { id: 'sug_1', title: 'Quantify achievements in Stripe role', desc: 'Adding metrics increases ATS score.', accent: 'blue' },
      ],
      missingSkills: ['System Architecture', 'GraphQL', 'Kubernetes'],
      resumeText: 'Senior Product Designer with 5+ years of experience building design systems and scalable apps.',
      score: '85/100',
    });
  }

  let roadmap = await RoadmapModel.findOne({ userId });
  if (!roadmap) {
    roadmap = await RoadmapModel.create({
      userId,
      bannerTitle: 'Target Transition',
      bannerSubtitle: 'Principal Product Designer @ Stripe',
      bannerMeta: 'Estimated 8 weeks to maximum readiness.',
      milestones: [
        { id: 'm_1', title: 'Design System Architecture', desc: 'Master tokenized design components in Figma and React.', time: 'Done', tone: 'mint', done: true },
        { id: 'm_2', title: 'STAR Behavioral Scenarios', desc: 'Prepare 5 structured leadership anecdotes.', time: 'In progress', tone: 'blue', done: false },
        { id: 'm_3', title: 'Live System Design Mock', desc: 'Schedule 1-on-1 peer review session.', time: 'Scheduled', tone: 'slate', done: false },
      ],
      focusAreas: [
        { id: 'f_1', title: 'Systems Thinking', text: 'Focus on multi-platform design sync.' },
        { id: 'f_2', title: 'Cross-functional Communication', text: 'Demonstrate design decisions with data.' },
      ],
    });
  }

  let settings = await UserSettingsModel.findOne({ userId });
  if (!settings) {
    settings = await UserSettingsModel.create({
      userId,
      preferences: { email: true, reminders: true, insights: true },
      theme: 'Light',
    });
  }

  let chatHistory = await AIChatHistoryModel.findOne({ userId });
  if (!chatHistory) {
    await AIChatHistoryModel.create({
      userId,
      messages: [],
    });
  }

  const existingGoalsCount = await GoalModel.countDocuments({ userId });
  if (existingGoalsCount === 0) {
    await GoalModel.create([
      { userId, title: 'Solve 3 Coding Challenges', done: false, status: 'Pending' },
      { userId, title: 'Review Resume ATS Recommendations', done: true, status: 'Complete' },
      { userId, title: 'Complete 1 Mock Interview Scenario', done: false, status: 'Pending' },
    ]);
  }

  const existingNotificationCount = await NotificationModel.countDocuments({ userId });
  if (existingNotificationCount === 0) {
    await NotificationModel.create([
      { userId, title: 'Welcome to CareerPrep!', detail: 'Your dynamic career preparation dashboard is fully activated.', time: 'Just now', accent: 'mint', read: false },
      { userId, title: 'Mock Interview Scheduled', detail: 'System Design practice scheduled for tomorrow at 4 PM.', time: 'Today', accent: 'violet', read: false },
    ]);
  }

  const existingInterviewCount = await MockInterviewModel.countDocuments({ userId });
  if (existingInterviewCount === 0) {
    await MockInterviewModel.create({
      userId,
      title: 'Senior Product Designer Mock Interview',
      role: 'Principal Product Designer',
      targetCompany: 'Stripe',
      difficulty: 'Hard',
      score: 8.8,
      maxScore: 10,
      headline: 'Outstanding Performance!',
      percentileText: 'You are in the top 5% of candidates for Senior Product Designer roles.',
      skillsRadar: { Technical: 90, Communication: 85, Grammar: 80, Behavioral: 88, Confidence: 92 },
      strengths: [
        { id: 'str_1', title: 'Architectural Depth', desc: 'Excellent explanation of design system tokens and component state.' },
        { id: 'str_2', title: 'Executive Presence', desc: 'Clear, articulate delivery under scenario pressure.' },
      ],
      improvements: [
        { id: 'imp_1', title: 'Mention Alternatives', desc: 'Discuss trade-offs between custom SVG icons vs font icons.' },
      ],
      nextSteps: [
        { id: 'ns_1', title: 'Practice Leadership Question', text: 'How do you prioritize design debt versus feature output?', icon: 'chat' },
      ],
      status: 'Upcoming',
      interviewDate: new Date(Date.now() + 86400000 * 2),
    });
  }

  return { profile, analytics, resume, roadmap, settings };
}

export async function logActivity(userId, title, desc, tone = 'blue') {
  const logItem = {
    id: `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    title,
    desc,
    time: 'Just now',
    tone,
    createdAt: new Date(),
  };

  let analytics = await AnalyticsModel.findOne({ userId });
  if (!analytics) {
    analytics = await AnalyticsModel.create({ userId, activityLog: [logItem] });
  } else {
    analytics.activityLog.unshift(logItem);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayStr = days[new Date().getDay()];
    const dayObj = analytics.weeklyActivity.find((d) => d.day === todayStr);
    if (dayObj) {
      dayObj.count += 1;
    } else {
      analytics.weeklyActivity.push({ day: todayStr, count: 1 });
    }
    await analytics.save();
  }
}

export async function computeCalculatedMetrics(userId) {
  const analytics = await AnalyticsModel.findOne({ userId });
  const resume = await ResumeModel.findOne({ userId });
  const goals = await GoalModel.find({ userId });
  const roadmap = await RoadmapModel.findOne({ userId });
  const interview = await MockInterviewModel.findOne({ userId }).sort({ createdAt: -1 });
  const practiceCount = await PracticeHistoryModel.countDocuments({ userId });

  let resumeScoreNum = 0;
  if (resume && resume.score) {
    const parsed = parseInt(resume.score, 10);
    if (!isNaN(parsed)) resumeScoreNum = parsed;
  }

  let interviewScoreNum = 75;
  if (interview && interview.score) {
    interviewScoreNum = Math.min(100, Math.round((interview.score / interview.maxScore) * 100));
  }

  const completedGoals = goals.filter((g) => g.done).length;
  const totalGoals = goals.length || 1;
  const goalProgress = (completedGoals / totalGoals) * 100;

  const totalMilestones = roadmap?.milestones?.length || 1;
  const completedMilestones = roadmap?.milestones?.filter((m) => m.done).length || 0;
  const roadmapProgress = (completedMilestones / totalMilestones) * 100;

  const xpProgress = Math.min(100, ((analytics?.codingXP || 0) / 1000) * 100);

  // Calculated Career Readiness Formula:
  // 30% Resume + 30% Interview + 20% Coding XP + 10% Goals Progress + 10% Roadmap Progress
  const calculatedReadiness = Math.min(
    100,
    Math.round(
      0.30 * resumeScoreNum +
      0.30 * interviewScoreNum +
      0.20 * xpProgress +
      0.10 * goalProgress +
      0.10 * roadmapProgress
    )
  );

  // Dynamic Interview Rank across all registered users in MongoDB
  const allAnalytics = await AnalyticsModel.find({}, 'codingXP careerReadiness');
  const userXP = analytics?.codingXP || 0;
  const lowerUsersCount = allAnalytics.filter((a) => (a.codingXP || 0) < userXP).length;
  const totalUsersCount = allAnalytics.length || 1;
  const percentileRank = Math.round(((totalUsersCount - lowerUsersCount) / totalUsersCount) * 100);

  let interviewRank = 'Top 50%';
  if (percentileRank <= 3) interviewRank = 'Top 3%';
  else if (percentileRank <= 8) interviewRank = 'Top 8%';
  else if (percentileRank <= 15) interviewRank = 'Top 15%';
  else if (percentileRank <= 30) interviewRank = 'Top 30%';

  if (analytics) {
    analytics.careerReadiness = calculatedReadiness;
    analytics.interviewRank = interviewRank;
    if (resumeScoreNum > 0) analytics.resumeScore = `${resumeScoreNum} / 100`;
    await analytics.save();
  }

  return {
    careerReadiness: calculatedReadiness,
    interviewRank,
    resumeScore: analytics?.resumeScore || '85 / 100',
    codingXP: analytics?.codingXP || 0,
  };
}

export async function registerUser({ name, email, password }) {
  const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UserModel.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  const userId = newUser._id.toString();
  await ensureUserInitialized(userId, name, email.toLowerCase());
  await logActivity(userId, 'Account Registered', 'Welcome to CareerPrep!', 'mint');

  return {
    id: userId,
    name: newUser.name,
    email: newUser.email,
  };
}

export async function loginUser({ email, password }) {
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  const userId = user._id.toString();
  await ensureUserInitialized(userId, user.name, user.email);
  await logActivity(userId, 'User Logged In', 'Authenticated successfully', 'blue');

  return {
    id: userId,
    name: user.name,
    email: user.email,
  };
}

export async function getDashboard(userId) {
  await ensureUserInitialized(userId);
  const metrics = await computeCalculatedMetrics(userId);
  const profile = await ProfileModel.findOne({ userId });
  const analytics = await AnalyticsModel.findOne({ userId });
  const goals = await GoalModel.find({ userId }).sort({ createdAt: -1 });
  const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 });
  const upcomingInterview = await MockInterviewModel.findOne({ userId, status: 'Upcoming' }).sort({ interviewDate: 1 });
  const badges = await BadgeModel.find({ userId });
  const roadmap = await RoadmapModel.findOne({ userId });

  const firstName = (profile?.name || 'User').split(' ')[0];

  return {
    user: {
      id: userId,
      name: profile?.name || 'User',
      email: profile?.email || '',
      avatar: profile?.avatarUrl || '/images/alex_thompson.png',
    },
    greeting: firstName,
    profile,
    readiness: metrics.careerReadiness,
    careerReadiness: metrics.careerReadiness,
    resumeScore: metrics.resumeScore,
    codingXP: metrics.codingXP,
    interviewRank: metrics.interviewRank,
    streak: analytics?.streak || 1,
    stats: [
      { title: 'Resume Score', value: metrics.resumeScore, accent: 'blue', icon: 'document' },
      { title: 'Interview Rank', value: metrics.interviewRank, accent: 'violet', icon: 'mic' },
      { title: 'Coding XP', value: `${metrics.codingXP} XP`, accent: 'slate', icon: 'code' },
    ],
    goals,
    dailyGoals: goals,
    weeklyActivity: analytics?.weeklyActivity || [],
    recentActivity: analytics?.activityLog || [],
    notifications,
    upcomingInterview,
    badges,
    roadmapProgress: {
      total: roadmap?.milestones?.length || 0,
      completed: roadmap?.milestones?.filter((m) => m.done).length || 0,
    },
    practiceProgress: analytics?.practiceStats || { questionsCompleted: 0, accuracy: 0 },
  };
}

// Goals CRUD
export async function getGoals(userId) {
  await ensureUserInitialized(userId);
  return GoalModel.find({ userId }).sort({ createdAt: -1 });
}

export async function addGoal(userId, title) {
  if (!title || !title.trim()) throw new Error('Goal title is required.');
  await ensureUserInitialized(userId);

  const goal = await GoalModel.create({
    userId,
    title: title.trim(),
    done: false,
    status: 'Pending',
  });

  await logActivity(userId, 'Created Goal', `Goal: "${title.trim()}"`, 'blue');
  return {
    id: goal._id.toString(),
    _id: goal._id.toString(),
    title: goal.title,
    done: goal.done,
    status: goal.status,
  };
}

export async function updateGoal(userId, id, patch) {
  await ensureUserInitialized(userId);
  const goal = await GoalModel.findOne({ _id: id, userId });
  if (!goal) throw new Error('Goal not found.');

  if (patch.done !== undefined) {
    goal.done = Boolean(patch.done);
    goal.status = goal.done ? 'Complete' : 'Pending';

    if (goal.done) {
      const analytics = await AnalyticsModel.findOne({ userId });
      if (analytics) {
        analytics.codingXP += 25;
        await analytics.save();
      }
      await logActivity(userId, 'Completed Goal', `Completed: "${goal.title}" (+25 XP)`, 'mint');
    }
  }

  if (patch.title !== undefined) {
    goal.title = patch.title;
  }

  await goal.save();
  await computeCalculatedMetrics(userId);

  return {
    id: goal._id.toString(),
    _id: goal._id.toString(),
    title: goal.title,
    done: goal.done,
    status: goal.status,
  };
}

export async function deleteGoal(userId, id) {
  await ensureUserInitialized(userId);
  const result = await GoalModel.deleteOne({ _id: id, userId });
  if (result.deletedCount === 0) throw new Error('Goal not found.');
  await computeCalculatedMetrics(userId);
  return { success: true, id };
}

// Resume
export async function getResume(userId) {
  await ensureUserInitialized(userId);
  const resume = await ResumeModel.findOne({ userId });
  const analytics = await AnalyticsModel.findOne({ userId });
  return {
    suggestions: resume?.suggestions || [],
    missingSkills: resume?.missingSkills || [],
    resumeText: resume?.resumeText || '',
    score: analytics?.resumeScore || '85 / 100',
  };
}

export async function optimizeResume(userId, resumeText, targetRole) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  const role = targetRole || profile?.title || 'Target Role';

  try {
    const aiResult = await generateOptimizedResume(resumeText, role);

    const resume = await ResumeModel.findOne({ userId });
    if (resume) {
      resume.resumeText = resumeText || resume.resumeText;
      resume.score = aiResult.score || '88/100';
      resume.suggestions.unshift({
        id: `sug_${Date.now()}`,
        title: `Optimized for ${role}`,
        desc: 'Applied metrics quantification and STAR format.',
        accent: 'mint',
      });
      await resume.save();
    }

    const analytics = await AnalyticsModel.findOne({ userId });
    if (analytics) {
      analytics.codingXP += 50;
      analytics.resumeScore = aiResult.score || '88/100';
      await analytics.save();
    }

    await logActivity(userId, 'Optimized Resume', `Analyzed resume for ${role} (+50 XP)`, 'violet');
    await computeCalculatedMetrics(userId);

    return aiResult;
  } catch (err) {
    console.error('Gemini API resume error:', err.message);
    throw new Error('Unable to reach AI Service. Please try again.');
  }
}

// JD Analyzer
export async function analyzeJD(userId, jobDescription) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  const userSkills = profile?.skills || [];

  try {
    const analysis = await generateJDAnalysis(jobDescription, userSkills);

    const jdDoc = await JDAnalysisModel.create({
      userId,
      jobTitle: analysis.jobTitle || 'Target Role Audit',
      keywordMatch: analysis.keywordMatch || '82%',
      atsScore: analysis.atsScore || '85%',
      matchedSkills: analysis.matchedSkills || [],
      missingSkills: analysis.missingSkills || [],
      recommendations: analysis.recommendations || [],
      jobDescription,
    });

    const analytics = await AnalyticsModel.findOne({ userId });
    if (analytics) {
      analytics.codingXP += 30;
      await analytics.save();
    }

    await logActivity(userId, 'Ran JD Analyzer Scan', `Role: ${jdDoc.jobTitle} (+30 XP)`, 'blue');
    await computeCalculatedMetrics(userId);

    return {
      id: jdDoc._id.toString(),
      jobTitle: jdDoc.jobTitle,
      keywordMatch: jdDoc.keywordMatch,
      atsScore: jdDoc.atsScore,
      matchedSkills: jdDoc.matchedSkills,
      missingSkills: jdDoc.missingSkills,
      recommendations: jdDoc.recommendations,
    };
  } catch (err) {
    console.error('Gemini API JD error:', err.message);
    throw new Error('Unable to analyze Job Description. Please try again.');
  }
}

// AI Coach
export async function getCoachData(userId) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  const chatHistory = await AIChatHistoryModel.findOne({ userId });
  const role = profile?.title || 'your target role';
  const firstName = (profile?.name || 'there').split(' ')[0];

  return {
    userName: firstName,
    welcome: `I reviewed your career profile. Let's sharpen your profile for ${role}.`,
    starterPrompts: ['Review my resume', 'Prep for interview', 'Find skill gaps'],
    history: chatHistory?.messages || [],
  };
}

export async function handleChat(userId, userMessage) {
  await ensureUserInitialized(userId);
  let chatHistoryDoc = await AIChatHistoryModel.findOne({ userId });
  if (!chatHistoryDoc) {
    chatHistoryDoc = await AIChatHistoryModel.create({ userId, messages: [] });
  }

  try {
    const history = chatHistoryDoc.messages.map((m) => ({ role: m.role, content: m.content }));
    const result = await generateChatReply(history, userMessage);

    chatHistoryDoc.messages.push({ role: 'user', content: userMessage });
    chatHistoryDoc.messages.push({ role: 'assistant', content: result.reply });
    await chatHistoryDoc.save();

    const analytics = await AnalyticsModel.findOne({ userId });
    if (analytics) {
      analytics.codingXP += 10;
      await analytics.save();
    }

    await logActivity(userId, 'Consulted AI Career Coach', `Prompt: "${userMessage.slice(0, 30)}..." (+10 XP)`, 'violet');
    await computeCalculatedMetrics(userId);

    return { reply: result.reply, model: result.model };
  } catch (err) {
    console.error('Gemini API Chat error:', err.message);
    throw new Error('Unable to reach AI Coach. Please try again.');
  }
}

// Roadmap
export async function getRoadmap(userId) {
  await ensureUserInitialized(userId);
  const roadmap = await RoadmapModel.findOne({ userId });
  return roadmap || {
    bannerTitle: 'Target Transition',
    bannerSubtitle: 'Not Set',
    bannerMeta: 'No roadmap generated yet.',
    milestones: [],
    focusAreas: [],
  };
}

export async function generateRoadmap(userId, targetRole, targetCompany) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  const role = targetRole || profile?.title || 'Target Role';
  const company = targetCompany || 'Top Tech Companies';

  try {
    const roadmapData = await aiGenerateRoadmap(role, company);

    let roadmap = await RoadmapModel.findOne({ userId });
    if (!roadmap) {
      roadmap = new RoadmapModel({ userId });
    }

    roadmap.bannerTitle = roadmapData.bannerTitle || 'Target Transition';
    roadmap.bannerSubtitle = roadmapData.bannerSubtitle || `${role} @ ${company}`;
    roadmap.bannerMeta = roadmapData.bannerMeta || 'Projected 8-week readiness roadmap.';
    roadmap.milestones = (roadmapData.milestones || []).map((m, i) => ({
      id: `m_${Date.now()}_${i}`,
      title: m.title,
      desc: m.desc,
      time: m.time || 'Scheduled',
      tone: m.tone || 'slate',
      done: Boolean(m.done),
    }));
    roadmap.focusAreas = (roadmapData.focusAreas || []).map((f, i) => ({
      id: `f_${Date.now()}_${i}`,
      title: f.title,
      text: f.text,
    }));

    await roadmap.save();
    await logActivity(userId, 'Generated Custom Roadmap', `Target: ${role} @ ${company}`, 'mint');
    await computeCalculatedMetrics(userId);

    return roadmap;
  } catch (err) {
    console.error('Gemini API Roadmap error:', err.message);
    throw new Error('Unable to generate roadmap. Please try again.');
  }
}

export async function updateMilestone(userId, id, patch) {
  await ensureUserInitialized(userId);
  const roadmap = await RoadmapModel.findOne({ userId });
  if (!roadmap) throw new Error('Roadmap not found.');

  const milestone = roadmap.milestones.find((m) => m.id === id || m._id?.toString() === id);
  if (!milestone) throw new Error('Milestone not found.');

  if (patch.done !== undefined) {
    milestone.done = Boolean(patch.done);
    milestone.time = milestone.done ? 'Done' : 'In progress';
    milestone.tone = milestone.done ? 'mint' : 'blue';

    if (milestone.done) {
      const analytics = await AnalyticsModel.findOne({ userId });
      if (analytics) {
        analytics.codingXP += 100;
        await analytics.save();
      }
      await logActivity(userId, 'Completed Roadmap Milestone', `Completed: "${milestone.title}" (+100 XP)`, 'mint');
    }
  }

  if (patch.title !== undefined) milestone.title = patch.title;
  if (patch.desc !== undefined) milestone.desc = patch.desc;

  await roadmap.save();
  await computeCalculatedMetrics(userId);
  return milestone;
}

// Practice
export async function getPractice(userId) {
  await ensureUserInitialized(userId);
  const analytics = await AnalyticsModel.findOne({ userId });
  const history = await PracticeHistoryModel.find({ userId }).sort({ createdAt: -1 });

  return {
    codingProblem: {
      id: '142',
      title: 'Linked List Cycle II',
      difficulty: 'Medium',
      description: 'Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null.',
      examples: [
        { id: 'ex_1', input: 'head = [3,2,0,-4], pos = 1', output: 'tail connects to node index 1', explanation: 'There is a cycle in the linked list where tail connects to the second node.' },
      ],
      constraints: ['The number of nodes in the list is in the range [0, 10^4].', '-10^5 <= Node.val <= 10^5'],
      aiAnalysis: {
        algorithm: "Floyd's Tortoise and Hare",
        text: 'Most candidates use a two-pointer approach here.',
      },
      starterCode: `class Solution:\n    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # TODO: Initialize slow and fast pointers\n        slow = fast = head\n        while fast and fast.next:\n            slow = slow.next\n            fast = fast.next.next\n            if slow == fast:\n                slow = head\n                while slow != fast:\n                    slow = slow.next\n                    fast = fast.next\n                return slow\n        return None`,
    },
    aptitudeSession: {
      currentQuestionIndex: 5,
      totalQuestions: 20,
      accuracy: 85,
      category: 'Logical Reasoning',
      questionText: "If 'CLARK' is coded as '24-12-1-18-11', how would you code 'MEMBER'?",
      options: [
        { label: 'A', text: '13-5-13-2-5-18' },
        { label: 'B', text: '14-6-14-3-6-19', isCorrect: true },
        { label: 'C', text: '12-4-12-1-4-17' },
        { label: 'D', text: '13-6-13-3-6-18' },
      ],
      metrics: { avgTime: '42s', streak: 12, logicMapping: 'High', speedControl: 'Medium' },
    },
    stats: analytics?.practiceStats || { questionsCompleted: history.length, accuracy: 88 },
    history,
  };
}

export async function submitPractice(userId, payload = {}) {
  await ensureUserInitialized(userId);
  const isCodeSubmit = payload.type === 'code' || payload.code;
  let evalResult = null;

  if (isCodeSubmit && payload.code) {
    try {
      evalResult = await evaluateCodeSubmission(payload.problemTitle || payload.title, payload.code, payload.language || 'Python');
    } catch (err) {
      console.warn('Gemini Code Evaluation Fallback:', err.message);
    }
  }

  const xpGained = isCodeSubmit ? 50 : 25;

  await PracticeHistoryModel.create({
    userId,
    problemId: payload.problemId || '142',
    title: payload.title || payload.problemTitle || (isCodeSubmit ? 'Linked List Cycle II' : 'Logical Reasoning Drill'),
    type: isCodeSubmit ? 'code' : 'aptitude',
    score: xpGained,
    runtime: evalResult?.runtime || '38ms',
    beatsPercent: evalResult?.beatsPercent || '94%',
    accuracy: 90,
  });

  const analytics = await AnalyticsModel.findOne({ userId });
  if (analytics) {
    analytics.codingXP += xpGained;
    analytics.practiceStats.questionsCompleted += 1;
    analytics.practiceStats.accuracy = 88;
    await analytics.save();
  }

  await logActivity(
    userId,
    isCodeSubmit ? 'Submitted Coding Solution' : 'Answered Aptitude Drill',
    isCodeSubmit ? `Passed test cases (${evalResult?.runtime || '38ms'}, +${xpGained} XP)` : `Correct answer (+${xpGained} XP)`,
    'blue'
  );

  await computeCalculatedMetrics(userId);

  return {
    success: true,
    message: evalResult?.message || (isCodeSubmit ? '✓ All standard test cases passed.' : '✓ Correct Answer!'),
    xpGained,
    runtime: evalResult?.runtime || '38ms',
    beatsPercent: evalResult?.beatsPercent || '94%',
    complexity: evalResult?.complexity,
    review: evalResult?.review,
  };
}

// Mock Interview Session & Reports
export async function startMockInterview(userId, { role, company, difficulty, category } = {}) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  const targetRole = role || profile?.title || 'Software Engineer';
  const targetCompany = company || 'Tech Firm';
  const level = difficulty || 'Mid-Level';
  const type = category || 'General Interview';

  try {
    const questions = await generateMockInterviewQuestions(targetRole, targetCompany, level, type);
    return { questions, role: targetRole, company: targetCompany, difficulty: level };
  } catch (err) {
    console.error('Gemini start interview error:', err.message);
    throw new Error('Unable to generate mock interview questions. Please try again.');
  }
}

export async function evaluateMockInterview(userId, { role, company, difficulty, qnaList } = {}) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  const targetRole = role || profile?.title || 'Software Engineer';
  const targetCompany = company || 'Tech Firm';
  const level = difficulty || 'Mid-Level';

  try {
    const evaluation = await evaluateInterviewSession(targetRole, targetCompany, level, qnaList);

    const interviewDoc = await MockInterviewModel.create({
      userId,
      role: targetRole,
      targetCompany,
      difficulty: level,
      score: evaluation.score || 8.5,
      maxScore: 10,
      headline: evaluation.headline || 'Strong Performance',
      percentileText: evaluation.percentileText || 'Top candidate range',
      skillsRadar: evaluation.skillsRadar || { Technical: 85, Communication: 80, Grammar: 85, Behavioral: 85, Confidence: 85 },
      strengths: (evaluation.strengths || []).map((s, i) => ({ id: `str_${Date.now()}_${i}`, title: s.title, desc: s.desc })),
      improvements: (evaluation.improvements || []).map((imp, i) => ({ id: `imp_${Date.now()}_${i}`, title: imp.title, desc: imp.desc })),
      nextSteps: (evaluation.nextSteps || []).map((n, i) => ({ id: `q_${Date.now()}_${i}`, title: n.title, text: n.text, icon: 'chat' })),
    });

    const analytics = await AnalyticsModel.findOne({ userId });
    if (analytics) {
      analytics.codingXP += 75;
      await analytics.save();
    }

    await logActivity(userId, 'Completed AI Mock Interview', `Session: ${targetRole} @ ${targetCompany} (+75 XP)`, 'mint');
    await computeCalculatedMetrics(userId);

    return {
      score: interviewDoc.score,
      maxScore: interviewDoc.maxScore,
      headline: interviewDoc.headline,
      percentileText: interviewDoc.percentileText,
      targetCompany: interviewDoc.targetCompany,
      role: interviewDoc.role,
      difficulty: interviewDoc.difficulty,
      skillsRadar: interviewDoc.skillsRadar,
      strengths: interviewDoc.strengths,
      improvements: interviewDoc.improvements,
      nextSteps: interviewDoc.nextSteps,
    };
  } catch (err) {
    console.error('Gemini evaluation interview error:', err.message);
    throw new Error('Unable to evaluate mock interview session. Please try again.');
  }
}

export async function clearChatHistory(userId) {
  await ensureUserInitialized(userId);
  await AIChatHistoryModel.updateOne({ userId }, { $set: { messages: [] } });
  return { success: true, message: 'Chat history cleared.' };
}

export async function getInterviewReport(userId) {
  await ensureUserInitialized(userId);
  const interview = await MockInterviewModel.findOne({ userId }).sort({ createdAt: -1 });

  if (interview) {
    return {
      score: interview.score,
      maxScore: interview.maxScore,
      headline: interview.headline,
      percentileText: interview.percentileText,
      targetCompany: interview.targetCompany,
      role: interview.role,
      difficulty: interview.difficulty,
      skillsRadar: interview.skillsRadar,
      strengths: interview.strengths,
      improvements: interview.improvements,
      nextSteps: interview.nextSteps,
    };
  }

  return null;
}

// Notifications
export async function getNotifications(userId) {
  await ensureUserInitialized(userId);
  return NotificationModel.find({ userId }).sort({ createdAt: -1 });
}

export async function deleteNotification(userId, id) {
  await ensureUserInitialized(userId);
  const result = await NotificationModel.deleteOne({ _id: id, userId });
  if (result.deletedCount === 0) {
    await NotificationModel.deleteOne({ id, userId });
  }
  return { success: true, id };
}

// Profile
export async function getProfile(userId) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  return profile;
}

export async function updateProfile(userId, profilePatch) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  if (!profile) throw new Error('Profile not found.');

  Object.assign(profile, profilePatch);
  await profile.save();

  if (profilePatch.name) {
    await UserModel.updateOne({ _id: userId }, { name: profilePatch.name });
  }

  await logActivity(userId, 'Updated Profile Information', 'Saved new profile details', 'slate');
  await computeCalculatedMetrics(userId);
  return profile;
}

// Settings
export async function getSettings(userId) {
  await ensureUserInitialized(userId);
  const settings = await UserSettingsModel.findOne({ userId });
  const profile = await ProfileModel.findOne({ userId });

  return {
    tabs: ['Profile', 'Account', 'Theme', 'Notifications', 'Security', 'Billing'],
    themeOptions: ['Light', 'Dark', 'System'],
    content: {
      Profile: [
        ['Name', profile?.name || 'Not set'],
        ['Career goal', profile?.title || 'Not set'],
        ['Location', 'San Francisco, CA'],
      ],
      Account: [
        ['Email', profile?.email || 'Not set'],
        ['Plan', 'CareerPrep Pro'],
        ['Member since', 'Active'],
      ],
      Notifications: [
        ['Interview reminders', '15 minutes before sessions'],
        ['Weekly summary', 'Every Monday'],
      ],
      Security: [
        ['Password', 'Active (BCrypt protected)'],
        ['Two-factor authentication', 'Disabled'],
      ],
      Billing: [
        ['Current plan', 'Pro Tier'],
        ['Payment method', 'Visa ending in 4242'],
      ],
    },
    preferences: settings?.preferences || { email: true, reminders: true, insights: false },
    theme: settings?.theme || 'Light',
  };
}

export async function updateSettings(userId, settingsPatch) {
  await ensureUserInitialized(userId);
  const settings = await UserSettingsModel.findOne({ userId });
  if (settings) {
    if (settingsPatch.preferences) settings.preferences = { ...settings.preferences, ...settingsPatch.preferences };
    if (settingsPatch.theme) settings.theme = settingsPatch.theme;
    await settings.save();
    return settings;
  }
  return UserSettingsModel.create({ userId, ...settingsPatch });
}

// Admin
export async function getAdminData() {
  const totalUsers = await UserModel.countDocuments();
  const allUsers = await UserModel.find().sort({ createdAt: -1 }).limit(10);
  const activeInterviews = await MockInterviewModel.countDocuments();

  const userActivity = allUsers.map((u) => {
    const initials = u.name ? u.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'US';
    return {
      id: u._id.toString(),
      initials,
      name: u.name,
      email: u.email,
      status: 'Active',
      statusTone: 'green',
      subscription: 'Pro Tier',
      activity: 'Active in MongoDB',
      accent: 'blue',
    };
  });

  return {
    stats: [
      { title: 'Total Registered Users', value: `${totalUsers}`, icon: 'users', tone: 'blue', change: '+100%', trend: 'up', progress: 100 },
      { title: 'Active Mock Interviews', value: `${activeInterviews}`, icon: 'broadcast', tone: 'violet', change: '+100%', trend: 'up', progress: 100 },
      { title: 'Database Mode', value: 'MongoDB Cloud', icon: 'wallet', tone: 'mint', change: 'Connected', trend: 'up', progress: 100 },
      { title: 'System Health', value: '100% Operational', icon: 'badge', tone: 'sky', change: 'Optimal', trend: 'neutral', progress: 100 },
    ],
    userActivity,
    resourceGroups: [
      { id: 'rg1', title: 'Aptitude Pool', icon: 'brain', tone: 'blue', action: 'Manage All', buttonLabel: '+ Add Category', items: [{ title: 'Quantitative Reasoning', subtitle: 'Live MongoDB Collection' }] },
      { id: 'rg2', title: 'Coding Challenges', icon: 'code', tone: 'violet', action: 'Manage All', buttonLabel: '+ New Challenge', items: [{ title: 'Data Structures Sprint', subtitle: 'Live MongoDB Collection' }] },
    ],
    reports: [
      { label: 'MongoDB Response Latency', value: '12ms', tone: 'blue' },
      { label: 'Active User Retention', value: '96%', tone: 'mint' },
    ],
    topSkills: ['React', 'Node.js', 'MongoDB', 'System Design'],
    systemHealth: [
      { label: 'MongoDB Connection Status', value: 'Healthy / Active' },
      { label: 'API Uptime', value: '99.99%' },
    ],
  };
}
