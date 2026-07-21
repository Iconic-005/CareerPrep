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

const defaultProfileData = {
  name: 'Alex Thompson',
  email: 'alex.thompson@example.com',
  title: 'Senior Product Designer @ Fintech Innovations',
  avatarUrl: '/images/alex_thompson.png',
  completion: 85,
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
    description: "Based on your target companies, you should highlight more 'Systems Thinking' in your project descriptions to align with Stripe's design philosophy.",
    buttonLabel: 'Refine Project Text',
  },
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
        codingProblem: {
          id: '142',
          title: 'Linked List Cycle II',
          difficulty: 'Medium',
          description: 'Given the `head` of a linked list, return the node where the cycle begins. If there is no cycle, return `null`.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.',
          examples: [
            {
              id: 'ex_1',
              input: 'head = [3,2,0,-4], pos = 1',
              output: 'tail connects to node index 1',
              explanation: 'There is a cycle in the linked list where tail connects to the second node.',
            },
          ],
          constraints: [
            'The number of nodes in the list is in the range [0, 10^4].',
            '-10^5 <= Node.val <= 10^5',
            'pos is -1 or a valid index in the linked-list.',
          ],
          aiAnalysis: {
            algorithm: "Floyd's Tortoise and Hare",
            text: 'Most candidates use a two-pointer approach here. Focus on the mathematical proof of why the pointers meet at the cycle start.',
          },
          starterCode: `class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # TODO: Initialize slow and fast pointers
        slow = fast = head

        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

            if slow == fast:
                slow = head
                while slow != fast:
                    slow = slow.next
                    fast = fast.next
                return slow

        return None`,
        },
        aptitudeSession: {
          currentQuestionIndex: 5,
          totalQuestions: 20,
          accuracy: 85,
          category: 'Logical Reasoning',
          questionText: "If 'CLARK' is coded as '24-12-1-18-11' in a certain language, how would you code 'MEMBER' using the same logic?",
          options: [
            { label: 'A', text: '13-5-13-2-5-18' },
            { label: 'B', text: '14-6-14-3-6-19', isCorrect: true },
            { label: 'C', text: '12-4-12-1-4-17' },
            { label: 'D', text: '13-6-13-3-6-18' },
          ],
          metrics: {
            avgTime: '42s',
            streak: 12,
            logicMapping: 'High',
            speedControl: 'Medium',
          },
        },
        tracks: user.practiceTracks || [],
        stats: user.analytics.practiceStats,
      };
    },

    async submitPractice(userId, payload = {}) {
      const data = read();
      const user = getUserRecord(data, userId);
      const isCodeSubmit = payload.type === 'code' || payload.code;
      const xpGained = isCodeSubmit ? 50 : 25;
      
      user.analytics.codingXP += xpGained;
      user.analytics.practiceStats.questionsCompleted += 1;
      user.analytics.practiceStats.accuracy = 85;
      logActivity(
        user,
        isCodeSubmit ? 'Submitted Coding Solution' : 'Answered Aptitude Drill',
        isCodeSubmit ? 'Passed all standard test cases (48ms)' : 'Selected option B (Correct)',
        'blue'
      );
      updateAnalytics(user);
      write(data);
      return {
        success: true,
        message: isCodeSubmit
          ? '✓ All standard test cases passed. Run time: 48ms (Beats 92% of Python users)'
          : '✓ Correct Answer! Logic mapping confirmed.',
        xpGained,
        runtime: '48ms',
        beatsPercent: '92%',
      };
    },


    // Mock Interview Report
    async getInterviewReport(userId) {
      const data = read();
      const user = getUserRecord(data, userId);
      return {
        score: 8.5,
        maxScore: 10,
        headline: 'Excellent Performance!',
        percentileText: 'You are in the top 5% of candidates for Senior Product Designer roles.',
        targetCompany: 'Google',
        role: 'Product Manager',
        difficulty: 'Mid-Level',
        skillsRadar: {
          Technical: 88,
          Communication: 82,
          Grammar: 75,
          Behavioral: 85,
          Confidence: 90,
        },
        strengths: [
          {
            id: 'str_1',
            title: 'Strong Domain Expertise',
            desc: 'Your technical explanation of React hooks and system design was precise and architectural.',
          },
          {
            id: 'str_2',
            title: 'Natural Confidence',
            desc: 'Maintained steady eye contact and had very few filler words during the 45-minute session.',
          },
          {
            id: 'str_3',
            title: 'Structured Storytelling',
            desc: 'Successfully used the STAR method for behavioral questions regarding team conflicts.',
          },
        ],
        improvements: [
          {
            id: 'imp_1',
            title: 'Elaborate on Trade-offs',
            desc: 'When discussing the database choice, you jumped to the solution too fast. Mention 1-2 alternatives next time.',
          },
          {
            id: 'imp_2',
            title: 'Grammar Consistency',
            desc: 'Small slip-ups with subject-verb agreement when talking under pressure about previous project timelines.',
          },
          {
            id: 'imp_3',
            title: 'Clarifying Questions',
            desc: 'Try asking more "Why" questions about the constraints before diving into the whiteboard design phase.',
          },
        ],
        nextSteps: [
          {
            id: 'q1',
            title: 'Practice Question 01',
            text: '"How do you handle scope creep when working with multiple high-priority stakeholders?"',
            icon: 'chat',
          },
          {
            id: 'q2',
            title: 'Practice Question 02',
            text: '"Explain the concept of \'Consistency vs Availability\' in distributed systems to a non-technical manager."',
            icon: 'gearSpark',
          },
          {
            id: 'q3',
            title: 'Practice Question 03',
            text: '"Describe a time you had to deliver critical feedback to a senior peer who was underperforming."',
            icon: 'users',
          },
        ],
      };
    },

    // Profile & Settings per user
    async getProfile(userId) {
      const data = read();
      const user = getUserRecord(data, userId);
      const profile = user.profile || {};
      const merged = {
        ...defaultProfileData,
        ...profile,
        name: profile.name && profile.name !== 'User' ? profile.name : defaultProfileData.name,
        title: profile.title || defaultProfileData.title,
        avatarUrl: profile.avatarUrl || defaultProfileData.avatarUrl,
        experiences: profile.experiences?.length ? profile.experiences : defaultProfileData.experiences,
        education: profile.education?.length ? profile.education : defaultProfileData.education,
        projects: profile.projects?.length ? profile.projects : defaultProfileData.projects,
        skills: profile.skills?.length ? profile.skills : defaultProfileData.skills,
        skillsActive: profile.skillsActive?.length ? profile.skillsActive : defaultProfileData.skillsActive,
        targetRoles: profile.targetRoles?.length ? profile.targetRoles : defaultProfileData.targetRoles,
        dreamCompanies: profile.dreamCompanies?.length ? profile.dreamCompanies : defaultProfileData.dreamCompanies,
        aiSuggestion: profile.aiSuggestion || defaultProfileData.aiSuggestion,
      };
      if ((!profile.experiences || !profile.experiences.length) && user) {
        user.profile = merged;
        write(data);
      }
      return merged;
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
