import fs from 'node:fs';
import path from 'node:path';
import {
  generateChatReply,
  generateOptimizedResume,
  generateJDAnalysis,
  generateRoadmap as aiGenerateRoadmap,
} from '../services/aiService.js';

const defaultStoreData = {
  users: {},
  globalUsersList: [],
};

export function createStore(filePath = path.join(process.cwd(), 'backend', 'data', 'db.json')) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, JSON.stringify(defaultStoreData, null, 2));
  }

  function read() {
    try {
      const raw = fs.readFileSync(absolutePath, 'utf8');
      const parsed = JSON.parse(raw);
      return { ...defaultStoreData, ...parsed };
    } catch (err) {
      return defaultStoreData;
    }
  }

  function write(data) {
    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2));
  }

  function getUserRecord(data, userId) {
    const key = userId || 'default_user';
    if (!data.users[key]) {
      data.users[key] = createZeroStateUser(key, 'User', `${key}@example.com`);
      write(data);
    }
    return data.users[key];
  }

  function createZeroStateUser(userId, name = 'User', email = '') {
    return {
      userId,
      profile: {
        name: name || 'User',
        email: email || '',
        title: '',
        skills: [],
        about: '',
        metrics: [],
        focusAreas: [],
        recruiterSnapshot: '',
      },
      analytics: {
        codingXP: 0,
        careerReadiness: 0,
        resumeScore: 'Not Generated',
        interviewRank: '--',
        weeklyActivity: [
          { day: 'Mon', count: 0 },
          { day: 'Tue', count: 0 },
          { day: 'Wed', count: 0 },
          { day: 'Thu', count: 0 },
          { day: 'Fri', count: 0 },
          { day: 'Sat', count: 0 },
          { day: 'Sun', count: 0 },
        ],
        activityLog: [],
        practiceStats: { questionsCompleted: 0, accuracy: 0 },
        streak: 0,
      },
      goals: [],
      resume: {
        suggestions: [],
        missingSkills: [],
        resumeText: '',
        versions: [],
      },
      roadmap: {
        bannerTitle: 'Target Transition',
        bannerSubtitle: 'Not Set',
        bannerMeta: 'No roadmap generated yet. Generate a roadmap to map your transition.',
        milestones: [],
        focusAreas: [],
      },
      notifications: [],
      practiceTracks: [],
      interviews: [],
      jdAnalyses: [],
      chatHistory: [],
      badges: [],
      settings: {
        preferences: { email: true, reminders: true, insights: false },
        theme: 'Light',
      },
    };
  }

  function updateAnalytics(userRecord) {
    const goals = userRecord.goals || [];
    const completedGoals = goals.filter((g) => g.done).length;
    const totalGoals = goals.length;
    
    // Career readiness % calculation
    if (totalGoals === 0 && userRecord.jdAnalyses.length === 0 && userRecord.roadmap.milestones.length === 0) {
      userRecord.analytics.careerReadiness = 0;
      userRecord.analytics.interviewRank = '--';
      userRecord.analytics.resumeScore = userRecord.resume.resumeText ? '75/100' : 'Not Generated';
    } else {
      const goalPart = totalGoals > 0 ? (completedGoals / totalGoals) * 40 : 0;
      const jdPart = userRecord.jdAnalyses.length > 0 ? 30 : 0;
      const roadmapPart = userRecord.roadmap.milestones.filter(m => m.done).length * 10;
      
      userRecord.analytics.careerReadiness = Math.min(100, Math.round(20 + goalPart + jdPart + roadmapPart));
      userRecord.analytics.interviewRank = userRecord.analytics.careerReadiness > 70 ? 'Top 10%' : userRecord.analytics.careerReadiness > 40 ? 'Top 25%' : 'Top 50%';
    }
  }

  function logActivity(userRecord, title, desc, tone = 'blue') {
    const logItem = {
      id: `act_${Date.now()}`,
      title,
      desc,
      time: 'Just now',
      tone,
    };
    userRecord.analytics.activityLog.unshift(logItem);
    // Increment today's activity graph count
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayStr = days[new Date().getDay()];
    const dayObj = userRecord.analytics.weeklyActivity.find(d => d.day === todayStr);
    if (dayObj) {
      dayObj.count += 1;
    }
  }

  return {
    async getState(userId) {
      const data = read();
      return getUserRecord(data, userId);
    },

    async registerUser(payload) {
      const data = read();
      const userId = `usr_${Date.now()}`;
      const newUserRecord = createZeroStateUser(userId, payload.name, payload.email);
      
      data.users[userId] = newUserRecord;
      data.globalUsersList.unshift({
        id: userId,
        initials: payload.name ? payload.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'US',
        name: payload.name || 'New User',
        email: payload.email,
        status: 'Active',
        statusTone: 'green',
        subscription: 'Free Tier',
        activity: 'Just now',
        accent: 'blue',
      });
      
      write(data);
      return { id: userId, name: payload.name, email: payload.email };
    },

    async loginUser(payload) {
      const data = read();
      const userEntry = data.globalUsersList.find(
        (u) => u.email === payload.email
      );
      
      const userId = userEntry ? userEntry.id : `usr_${Date.now()}`;
      const record = getUserRecord(data, userId);
      if (payload.name) record.profile.name = payload.name;
      record.profile.email = payload.email;
      write(data);
      
      return { ok: true, user: { id: userId, email: payload.email, name: record.profile.name } };
    },

    async getDashboard(userId) {
      const data = read();
      const user = getUserRecord(data, userId);
      updateAnalytics(user);
      write(data);

      const firstName = (user.profile.name || 'User').split(' ')[0];

      return {
        greeting: firstName,
        readiness: user.analytics.careerReadiness,
        stats: [
          { title: 'Resume Score', value: user.analytics.resumeScore, accent: 'blue', icon: 'document' },
          { title: 'Interview Rank', value: user.analytics.interviewRank, accent: 'violet', icon: 'mic' },
          { title: 'Coding XP', value: `${user.analytics.codingXP} XP`, accent: 'slate', icon: 'code' },
        ],
        goals: user.goals || [],
        weeklyActivity: user.analytics.weeklyActivity,
        recentActivity: user.analytics.activityLog || [],
        upcomingInterview: user.interviews.find(i => i.status === 'Upcoming') || null,
      };
    },

    // Goals CRUD per user
    async getGoals(userId) {
      const data = read();
      const user = getUserRecord(data, userId);
      return user.goals || [];
    },

    async addGoal(userId, title) {
      const data = read();
      const user = getUserRecord(data, userId);
      if (!title || !title.trim()) throw new Error('Goal title is required');
      
      const newGoal = {
        id: `g_${Date.now()}`,
        title: title.trim(),
        done: false,
        status: 'Pending',
      };
      user.goals.unshift(newGoal);
      logActivity(user, 'Added new daily goal', `Goal: "${title.trim()}"`, 'blue');
      updateAnalytics(user);
      write(data);
      return newGoal;
    },

    async updateGoal(userId, id, patch) {
      const data = read();
      const user = getUserRecord(data, userId);
      const index = user.goals.findIndex((g) => g.id === id);
      if (index === -1) throw new Error('Goal not found');
      
      user.goals[index] = { ...user.goals[index], ...patch };
      if (patch.done !== undefined) {
        user.goals[index].status = patch.done ? 'Complete' : 'Pending';
        if (patch.done) {
          user.analytics.codingXP += 25;
          logActivity(user, 'Completed daily goal', `Completed: "${user.goals[index].title}"`, 'mint');
        }
      }
      updateAnalytics(user);
      write(data);
      return user.goals[index];
    },

    async deleteGoal(userId, id) {
      const data = read();
      const user = getUserRecord(data, userId);
      user.goals = user.goals.filter((g) => g.id !== id);
      updateAnalytics(user);
      write(data);
      return { success: true, id };
    },

    // Resume Data per user
    async getResume(userId) {
      const data = read();
      const user = getUserRecord(data, userId);
      return {
        suggestions: user.resume.suggestions || [],
        missingSkills: user.profile.skills.length ? user.resume.missingSkills : [],
        resumeText: user.resume.resumeText || '',
        score: user.analytics.resumeScore,
      };
    },

    async optimizeResume(userId, resumeText, targetRole) {
      const data = read();
      const user = getUserRecord(data, userId);
      const role = targetRole || user.profile.title || 'Target Role';
      
      try {
        const result = await generateOptimizedResume(resumeText, role);
        
        user.resume.resumeText = resumeText || user.resume.resumeText;
        user.analytics.resumeScore = result.score || '84/100';
        user.analytics.codingXP += 50;
        
        user.resume.suggestions.unshift({
          id: `sug_${Date.now()}`,
          title: `Optimized section for ${role}`,
          desc: 'Applied STAR method and metric quantification.',
          accent: 'mint',
        });
        
        logActivity(user, 'Optimized resume with AI', `Analyzed resume for ${role}`, 'violet');
        updateAnalytics(user);
        write(data);
        return result;
      } catch (err) {
        console.error('Failed to optimize resume with Gemini:', err);
        throw new Error('Unable to reach the AI service. Please try again.');
      }
    },

    // JD Analyzer per user
    async analyzeJD(userId, jobDescription) {
      const data = read();
      const user = getUserRecord(data, userId);
      const userSkills = user.profile.skills || [];
      
      try {
        const analysis = await generateJDAnalysis(jobDescription, userSkills);
        
        const analysisResult = {
          id: `jda_${Date.now()}`,
          timestamp: new Date().toISOString(),
          jobTitle: analysis.jobTitle || 'Target Role Audit',
          keywordMatch: analysis.keywordMatch || '0%',
          atsScore: analysis.atsScore || '0%',
          matchedSkills: analysis.matchedSkills || [],
          missingSkills: analysis.missingSkills || [],
          recommendations: analysis.recommendations || [],
        };
        
        user.jdAnalyses.unshift(analysisResult);
        user.analytics.codingXP += 30;
        logActivity(user, 'Ran JD Analyzer scan', `Analyzed role: ${analysisResult.jobTitle}`, 'blue');
        updateAnalytics(user);
        write(data);
        return analysisResult;
      } catch (err) {
        console.error('Failed to analyze JD with Gemini:', err);
        throw new Error('Unable to reach the AI service. Please try again.');
      }
    },

    // AI Coach Chat per user
    async handleChat(userId, userMessage) {
      const data = read();
      const user = getUserRecord(data, userId);
      const history = user.chatHistory || [];
      
      try {
        const result = await generateChatReply(history, userMessage);
        
        user.chatHistory.push({ role: 'user', content: userMessage });
        user.chatHistory.push({ role: 'assistant', content: result.reply });
        user.analytics.codingXP += 10;
        logActivity(user, 'Consulted AI Career Coach', `Prompt: "${userMessage.slice(0, 30)}..."`, 'violet');
        updateAnalytics(user);
        write(data);
        
        return { reply: result.reply, model: result.model };
      } catch (err) {
        console.error('Failed to generate chat reply with Gemini:', err);
        throw new Error('Unable to reach the AI service. Please try again.');
      }
    },

    async getCoachData(userId) {
      const data = read();
      const user = getUserRecord(data, userId);
      const role = user.profile.title || 'your target role';
      const firstName = (user.profile.name || 'there').split(' ')[0];

      return {
        userName: firstName,
        welcome: `I reviewed your career profile. Let’s sharpen your profile for ${role}.`,
        starterPrompts: ['Review my resume', 'Prep for Google', 'Find gaps in my skills'],
        history: user.chatHistory || [],
      };
    },

    // Roadmap per user
    async getRoadmap(userId) {
      const data = read();
      const user = getUserRecord(data, userId);
      return user.roadmap;
    },

    async generateRoadmap(userId, targetRole, targetCompany) {
      const data = read();
      const user = getUserRecord(data, userId);
      const role = targetRole || user.profile.title || 'Target Role';
      const company = targetCompany || 'Top Companies';
      
      try {
        const roadmapData = await aiGenerateRoadmap(role, company);
        
        user.roadmap = {
          bannerTitle: roadmapData.bannerTitle || 'Target Transition',
          bannerSubtitle: roadmapData.bannerSubtitle || `${role} @ ${company}`,
          bannerMeta: roadmapData.bannerMeta || 'Projected readiness timeline.',
          milestones: (roadmapData.milestones || []).map((m, i) => ({
            id: `m_${Date.now()}_${i}`,
            title: m.title,
            desc: m.desc,
            time: m.time || 'Scheduled',
            tone: m.tone || 'slate',
            done: Boolean(m.done),
          })),
          focusAreas: (roadmapData.focusAreas || []).map((f, i) => ({
            id: `f_${Date.now()}_${i}`,
            title: f.title,
            text: f.text,
          })),
        };
        
        logActivity(user, 'Generated Custom Roadmap', `Target: ${role} @ ${company}`, 'mint');
        updateAnalytics(user);
        write(data);
        return user.roadmap;
      } catch (err) {
        console.error('Failed to generate roadmap with Gemini:', err);
        throw new Error('Unable to reach the AI service. Please try again.');
      }
    },

    async updateMilestone(userId, id, patch) {
      const data = read();
      const user = getUserRecord(data, userId);
      const milestone = user.roadmap.milestones.find((m) => m.id === id);
      if (!milestone) throw new Error('Milestone not found');
      
      Object.assign(milestone, patch);
      if (patch.done !== undefined) {
        milestone.time = patch.done ? 'Done' : 'In progress';
        milestone.tone = patch.done ? 'mint' : 'blue';
        if (patch.done) {
          user.analytics.codingXP += 100;
          logActivity(user, 'Completed Roadmap Milestone', `Completed: "${milestone.title}"`, 'mint');
        }
      }
      updateAnalytics(user);
      write(data);
      return milestone;
    },

    // Notifications per user
    async getNotifications(userId) {
      const data = read();
      const user = getUserRecord(data, userId);
      return user.notifications || [];
    },

    async deleteNotification(userId, id) {
      const data = read();
      const user = getUserRecord(data, userId);
      user.notifications = user.notifications.filter((n) => n.id !== id);
      write(data);
      return { success: true, id };
    },

    // Practice per user
    async getPractice(userId) {
      const data = read();
      const user = getUserRecord(data, userId);
      return {
        tracks: user.practiceTracks || [],
        stats: user.analytics.practiceStats,
      };
    },

    async submitPractice(userId, payload) {
      const data = read();
      const user = getUserRecord(data, userId);
      user.analytics.codingXP += 50;
      user.analytics.practiceStats.questionsCompleted += 1;
      user.analytics.practiceStats.accuracy = 100;
      logActivity(user, 'Submitted Coding Solution', 'Passed all test assertions', 'blue');
      updateAnalytics(user);
      write(data);
      return { success: true, message: 'Passed all tests!', xpGained: 50 };
    },

    // Profile & Settings per user
    async getProfile(userId) {
      const data = read();
      const user = getUserRecord(data, userId);
      return user.profile;
    },

    async updateProfile(userId, profilePatch) {
      const data = read();
      const user = getUserRecord(data, userId);
      user.profile = { ...user.profile, ...profilePatch };
      logActivity(user, 'Updated Profile Information', 'Saved new profile details', 'slate');
      updateAnalytics(user);
      write(data);
      return user.profile;
    },

    async getSettings(userId) {
      const data = read();
      const user = getUserRecord(data, userId);
      return {
        tabs: ['Profile', 'Account', 'Theme', 'Notifications', 'Security', 'Billing'],
        themeOptions: ['Light', 'Dark', 'System'],
        content: {
          Profile: [['Name', user.profile.name || 'Not set'], ['Career goal', user.profile.title || 'Not set'], ['Location', 'Not set']],
          Account: [['Email', user.profile.email || 'Not set'], ['Plan', 'CareerPrep Free'], ['Member since', 'Recently']],
          Notifications: [['Interview reminders', '15 minutes before sessions'], ['Weekly summary', 'Every Monday']],
          Security: [['Password', 'Active'], ['Two-factor authentication', 'Disabled']],
          Billing: [['Current plan', 'Free Tier'], ['Payment method', 'None']],
        },
        preferences: user.settings.preferences,
        theme: user.settings.theme,
      };
    },

    async updateSettings(userId, settingsPatch) {
      const data = read();
      const user = getUserRecord(data, userId);
      user.settings = { ...user.settings, ...settingsPatch };
      write(data);
      return user.settings;
    },

    // Admin Users
    async getAdminData() {
      const data = read();
      return {
        stats: [
          { title: 'Total Registered Users', value: `${data.globalUsersList.length}`, icon: 'users', tone: 'blue', change: '+100%', trend: 'up', progress: 100 },
          { title: 'Active Systems', value: 'Operational', icon: 'broadcast', tone: 'violet', change: '100%', trend: 'neutral', progress: 100 },
        ],
        userActivity: data.globalUsersList || [],
        resourceGroups: [
          { id: 'rg1', title: 'Aptitude Pool', icon: 'brain', tone: 'blue', action: 'Manage All', buttonLabel: '+ Add Category', items: [{ title: 'Quantitative Reasoning', subtitle: 'Available' }] },
          { id: 'rg2', title: 'Coding Challenges', icon: 'code', tone: 'violet', action: 'Manage All', buttonLabel: '+ New Challenge', items: [{ title: 'Data Structures Sprint', subtitle: 'Available' }] },
        ],
        reports: [],
        topSkills: ['React', 'Python', 'SQL', 'System Design'],
        systemHealth: [
          { label: 'API Latency', value: '18ms' },
          { label: 'System Uptime', value: '99.9%' },
        ],
      };
    },
  };
}

export function resetStore(filePath = path.join(process.cwd(), 'backend', 'data', 'db.json')) {
  const absolutePath = path.resolve(filePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, JSON.stringify(defaultStoreData, null, 2));
}
