import fs from 'node:fs';
import path from 'node:path';

const defaultData = {
  profile: {
    name: 'Jordan Avery',
    title: 'Transitioning into Senior Product Management',
    skills: ['Product Strategy', 'Figma', 'Python Basics', 'SQL', 'Leadership', 'Research Ops'],
    about: 'Product-minded operator with a background in growth, experimentation, and stakeholder leadership. Focused on translating customer insight into measurable business outcomes.',
    metrics: [
      { label: 'Profile Strength', value: '91%', accent: 'blue' },
      { label: 'Recruiter Fit', value: '86%', accent: 'violet' },
    ],
    focusAreas: [
      { label: 'Target role', value: 'Senior Product Manager' },
      { label: 'Target companies', value: 'Google, Stripe, Figma' },
      { label: 'Next milestone', value: 'Complete SQL experimentation module' },
    ],
    recruiterSnapshot: 'Strong product and growth foundation. Add two quantified leadership stories to make your transition narrative more compelling.',
  },
  goals: [
    { id: 'g1', title: '3 Coding Problems', done: false, status: '1 / 3 Done' },
    { id: 'g2', title: 'Review Resume Feedback', done: true, status: 'Complete' },
    { id: 'g3', title: '1 Mock Interview Session for Senior Product Manager', done: false, status: 'Pending' },
  ],
  resume: {
    suggestions: [
      { id: 1, title: 'Quantify achievements in your current role.', desc: 'Specific percentages increase credibility with ATS filters by 22%.', accent: 'blue' },
      { id: 2, title: 'Rewrite summary for a leadership focus.', desc: 'Shift the summary from task-based language to strategic outcomes.', accent: 'violet' },
    ],
    missingSkills: ['Python', 'AWS', 'Kubernetes'],
    resumeText: 'Product Manager with 4+ years of experience leading cross-functional teams, driving roadmap strategy, and optimizing user engagement metrics.',
  },
  roadmap: {
    bannerTitle: 'Target Transition',
    bannerSubtitle: 'Senior Product Manager',
    bannerMeta: 'Projected readiness: Next quarter at your current pace.',
    milestones: [
      { id: 'm1', title: 'Research foundations', desc: 'Completed JTBD and user interview basics.', time: 'Done', tone: 'mint', done: true },
      { id: 'm2', title: 'Analytics fluency', desc: 'Finish SQL + experimentation module.', time: 'In progress', tone: 'blue', done: false },
      { id: 'm3', title: 'Leadership stories', desc: 'Build 3 promotion-ready case studies.', time: 'Next up', tone: 'violet', done: false },
      { id: 'm4', title: 'Mock interview series', desc: 'Complete 5 PM interview simulations.', time: 'Scheduled', tone: 'slate', done: false },
    ],
    focusAreas: [
      { id: 'f1', title: 'Product strategy depth', text: 'Add stronger examples of prioritization and roadmap tradeoff decisions.' },
      { id: 'f2', title: 'Technical fluency', text: 'Ship one analytics mini-project and one API integration case study.' },
      { id: 'f3', title: 'Executive communication', text: 'Practice concise narratives for leadership and stakeholder alignment.' },
    ],
  },
  notifications: [
    { id: 'n1', title: 'Interview reminder', time: 'Today, 4:45 PM', detail: 'Your mock interview prep for Senior Product Manager is ready.', accent: 'blue', read: false },
    { id: 'n2', title: 'Resume suggestion', time: 'Today, 1:12 PM', detail: 'AI found 3 impact metrics to strengthen your profile story.', accent: 'violet', read: false },
    { id: 'n3', title: 'Roadmap milestone', time: 'Yesterday', detail: 'You completed the latest skill milestone ahead of schedule.', accent: 'mint', read: true },
    { id: 'n4', title: 'New report ready', time: 'Today', detail: 'Your latest mock interview confidence report is ready to review.', accent: 'slate', read: true },
  ],
  practiceTracks: [
    {
      id: 'pt1',
      title: 'Coding Arena',
      subtitle: 'Algorithms, system design, frontend debugging, and timed contests.',
      accent: 'blue',
      metric: '17 challenges active',
      items: ['Data Structures Sprint', 'React Bug Bash', 'System Design Drills'],
    },
    {
      id: 'pt2',
      title: 'Aptitude Lab',
      subtitle: 'Quant, logical reasoning, and recruiter-style problem sets for Product Strategy.',
      accent: 'violet',
      metric: '420 questions ready',
      items: ['Quantitative Reasoning', 'Logical Deduction', 'Pattern Analysis'],
    },
  ],
  adminUsers: [
    { id: 'u1', initials: 'JD', name: 'Jordan Avery', email: 'jane.doe@example.com', status: 'Active', statusTone: 'green', subscription: 'Pro Tier', activity: '2h ago', accent: 'blue' },
    { id: 'u2', initials: 'MS', name: 'Michael Smith', email: 'm.smith@dev.co', status: 'Interviewing', statusTone: 'amber', subscription: 'Free', activity: '5m ago', accent: 'violet' },
    { id: 'u3', initials: 'AW', name: 'Alex Wong', email: 'alex.w@uxdesign.com', status: 'Offline', statusTone: 'gray', subscription: 'Enterprise', activity: '1d ago', accent: 'slate' },
  ],
  resourceGroups: [
    { id: 'rg1', title: 'Aptitude Pool', icon: 'brain', tone: 'blue', action: 'Manage All', buttonLabel: '+ Add Category', items: [{ title: 'Quantitative Reasoning', subtitle: '420 Questions' }, { title: 'Logical Deduction', subtitle: '315 Questions' }] },
    { id: 'rg2', title: 'Coding Challenges', icon: 'code', tone: 'violet', action: 'Manage All', buttonLabel: '+ New Challenge', items: [{ title: 'Data Structures', subtitle: 'Expert • 85 Problems' }, { title: 'System Design', subtitle: 'Senior • 42 Case Studies' }] },
  ],
  jdAnalyses: [],
  chatHistory: [],
  settings: {
    preferences: { email: true, reminders: true, insights: false },
    theme: 'Light',
  },
  users: [],
};

export function createStore(filePath = path.join(process.cwd(), 'backend', 'data', 'db.json')) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, JSON.stringify(defaultData, null, 2));
  }

  function read() {
    const raw = fs.readFileSync(absolutePath, 'utf8');
    const parsed = JSON.parse(raw);
    return { ...defaultData, ...parsed };
  }

  function write(data) {
    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2));
  }

  return {
    async getState() {
      return read();
    },

    async updateProfile(profilePatch) {
      const data = read();
      data.profile = { ...data.profile, ...profilePatch };
      write(data);
      return data.profile;
    },

    async updateSettings(settingsPatch) {
      const data = read();
      data.settings = { ...data.settings, ...settingsPatch };
      write(data);
      return data.settings;
    },

    async registerUser(payload) {
      const data = read();
      const user = { id: Date.now().toString(), ...payload };
      data.users.push(user);
      
      // Update active profile name to the newly registered user
      if (user.name) {
        data.profile = {
          ...data.profile,
          name: user.name,
        };
      }
      
      // Reset goals for the new user profile
      data.goals = [
        { id: `g_${Date.now()}_1`, title: 'Complete onboarding profile setup', done: true, status: 'Complete' },
        { id: `g_${Date.now()}_2`, title: 'Run first JD Analysis scan', done: false, status: 'Pending' },
        { id: `g_${Date.now()}_3`, title: 'Practice STAR interview response with AI Coach', done: false, status: 'Pending' },
      ];

      // Add to admin users list
      data.adminUsers.unshift({
        id: user.id,
        initials: user.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'US',
        name: user.name || 'New User',
        email: user.email,
        status: 'Active',
        statusTone: 'green',
        subscription: 'Free Tier',
        activity: 'Just now',
        accent: 'blue',
      });
      write(data);
      return user;
    },

    async loginUser(payload) {
      const data = read();
      const user = data.users.find((entry) => entry.email === payload.email && entry.password === payload.password);
      if (!user) {
        throw new Error('Invalid email or password');
      }
      if (user.name) {
        data.profile = {
          ...data.profile,
          name: user.name,
        };
      }
      write(data);
      return { ok: true, user: { id: user.id, email: user.email, name: user.name } };
    },

    // Goals CRUD
    async getGoals() {
      const data = read();
      return data.goals || [];
    },

    async addGoal(title) {
      const data = read();
      if (!title || !title.trim()) throw new Error('Goal title is required');
      const newGoal = {
        id: `g_${Date.now()}`,
        title: title.trim(),
        done: false,
        status: 'Pending',
      };
      data.goals.unshift(newGoal);
      write(data);
      return newGoal;
    },

    async updateGoal(id, patch) {
      const data = read();
      const index = data.goals.findIndex((g) => g.id === id);
      if (index === -1) throw new Error('Goal not found');
      data.goals[index] = { ...data.goals[index], ...patch };
      if (patch.done !== undefined) {
        data.goals[index].status = patch.done ? 'Complete' : 'Pending';
      }
      write(data);
      return data.goals[index];
    },

    async deleteGoal(id) {
      const data = read();
      data.goals = data.goals.filter((g) => g.id !== id);
      write(data);
      return { success: true, id };
    },

    // Notifications CRUD
    async getNotifications() {
      const data = read();
      return data.notifications || [];
    },

    async addNotification(payload) {
      const data = read();
      const notif = {
        id: `n_${Date.now()}`,
        title: payload.title || 'New Notification',
        time: 'Just now',
        detail: payload.detail || '',
        accent: payload.accent || 'blue',
        read: false,
      };
      data.notifications.unshift(notif);
      write(data);
      return notif;
    },

    async deleteNotification(id) {
      const data = read();
      data.notifications = data.notifications.filter((n) => n.id !== id);
      write(data);
      return { success: true, id };
    },

    // Roadmap CRUD
    async getRoadmap() {
      const data = read();
      return data.roadmap;
    },

    async updateMilestone(id, patch) {
      const data = read();
      const milestone = data.roadmap.milestones.find((m) => m.id === id);
      if (!milestone) throw new Error('Milestone not found');
      Object.assign(milestone, patch);
      if (patch.done !== undefined) {
        milestone.time = patch.done ? 'Done' : 'In progress';
        milestone.tone = patch.done ? 'mint' : 'blue';
      }
      write(data);
      return milestone;
    },

    async generateRoadmap(targetRole, targetCompany) {
      const data = read();
      const role = targetRole || data.profile?.focusAreas?.[0]?.value || 'Senior Product Manager';
      const company = targetCompany || 'Top Tech Companies';
      
      const newRoadmap = {
        bannerTitle: 'Target Transition',
        bannerSubtitle: `${role} @ ${company}`,
        bannerMeta: 'Projected readiness: Next 8-12 weeks at your current pace.',
        milestones: [
          { id: `m_${Date.now()}_1`, title: 'Skill Baseline & Gap Audit', desc: `Analyze market requirements for ${role}.`, time: 'Done', tone: 'mint', done: true },
          { id: `m_${Date.now()}_2`, title: 'Core Competency Building', desc: `Complete advanced modules tailored for ${role}.`, time: 'In progress', tone: 'blue', done: false },
          { id: `m_${Date.now()}_3`, title: 'System & Case Study Portfolio', desc: `Build 3 high-impact case studies targeting ${company}.`, time: 'Next up', tone: 'violet', done: false },
          { id: `m_${Date.now()}_4`, title: 'Mock Behavioral & Technical Loops', desc: 'Simulate 5 full-length interview rounds.', time: 'Scheduled', tone: 'slate', done: false },
        ],
        focusAreas: [
          { id: `f_${Date.now()}_1`, title: 'Strategic Prioritization', text: `Demonstrate high impact metrics relevant to ${role}.` },
          { id: `f_${Date.now()}_2`, title: 'Technical Execution', text: `Build production-ready mini projects matching ${company} stack.` },
          { id: `f_${Date.now()}_3`, title: 'Leadership Alignment', text: 'Practice STAR stories highlighting ownership and cross-functional impact.' },
        ],
      };
      data.roadmap = newRoadmap;
      write(data);
      return newRoadmap;
    },

    // JD Analyzer
    async analyzeJD(jobDescription, resumeText = '') {
      const data = read();
      const text = (jobDescription || '').toLowerCase();
      const userSkills = data.profile?.skills || ['Product Strategy', 'Figma', 'Python Basics', 'SQL', 'Leadership'];
      
      // Common tech & role skills to extract
      const potentialSkills = [
        'Figma', 'Product Strategy', 'SQL', 'Python', 'React', 'TypeScript',
        'Node.js', 'AWS', 'Docker', 'Kubernetes', 'Design Systems', 'Agile',
        'Data Analysis', 'User Research', 'A/B Testing', 'System Design', 'Leadership'
      ];
      
      const matched = potentialSkills.filter(skill => text.includes(skill.toLowerCase()) && userSkills.some(s => s.toLowerCase() === skill.toLowerCase()));
      const missing = potentialSkills.filter(skill => text.includes(skill.toLowerCase()) && !userSkills.some(s => s.toLowerCase() === skill.toLowerCase()));
      
      const keywordMatchScore = Math.min(98, Math.max(55, 60 + matched.length * 8));
      const atsScore = Math.min(95, Math.max(65, 70 + (matched.length - missing.length) * 4));
      
      const analysisResult = {
        id: `jda_${Date.now()}`,
        timestamp: new Date().toISOString(),
        jobTitle: text.match(/(senior|lead|principal|junior)?\s*(product manager|ux designer|software engineer|data scientist|developer|architect)/i)?.[0] || 'Target Role',
        keywordMatch: `${keywordMatchScore}%`,
        atsScore: `${atsScore}%`,
        matchedSkills: matched.length ? matched : userSkills.slice(0, 3),
        missingSkills: missing.length ? missing : ['Cloud Arch', 'LLM Tuning'],
        recommendations: [
          `Highlight quantifiable metrics for ${matched[0] || 'core competencies'} in your work history.`,
          `Consider adding ${missing[0] || 'industry tools'} to your technical skills section.`,
          'Ensure job title matches standard ATS naming conventions.',
        ],
      };
      
      data.jdAnalyses.unshift(analysisResult);
      write(data);
      return analysisResult;
    },

    // Resume Optimizer
    async optimizeResume(resumeText, targetRole) {
      const data = read();
      const role = targetRole || data.profile?.title || 'Senior Product Manager';
      
      const result = {
        score: 84,
        critique: `Your resume shows strong fundamentals for ${role}. To make it top 5%, replace generic statements with metric-driven Google X-Y-Z achievements.`,
        optimizedText: `### Optimized Experience for ${role}\n• Engineered cross-functional workflow automating project tracking, reducing operational latency by 35%.\n• Spearheaded 4 major product releases with 99.9% uptime, boosting customer retention by 18%.\n• Mentored 5 junior team members and aligned 3 strategic engineering roadmaps.`,
        suggestedSkills: ['A/B Testing', 'System Design', 'Data Pipeline', 'Executive Storytelling'],
      };
      
      data.resume.suggestions.unshift({
        id: Date.now(),
        title: `Optimized section for ${role}`,
        desc: 'Applied STAR method and metric quantification.',
        accent: 'mint',
      });
      write(data);
      return result;
    },

    // Mock Interview Feedback
    async generateInterviewFeedback(role, difficulty, messages) {
      const data = read();
      return {
        overallScore: 88,
        strengths: [
          'Clear STAR structure in response delivery.',
          `Strong domain knowledge demonstrated for ${role || 'target role'}.`,
          'Concise articulation of architectural and strategic tradeoffs.',
        ],
        improvements: [
          'Quantify revenue or efficiency impact more explicitly.',
          'Name specific monitoring and operational tools used.',
          'Conclude behavioral stories with lessons learned.',
        ],
        sampleResponse: `In my previous project, we faced a 25% drop in user conversion (Situation). I spearheaded a root-cause UX audit and led A/B experiment iterations (Action), restoring conversion by 30% and generating $120k incremental ARR (Result).`,
      };
    },

    // Admin Operations
    async addAdminUser(userData) {
      const data = read();
      const newUser = {
        id: `u_${Date.now()}`,
        initials: userData.name ? userData.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'US',
        name: userData.name || 'New User',
        email: userData.email || 'user@example.com',
        status: userData.status || 'Active',
        statusTone: userData.statusTone || 'green',
        subscription: userData.subscription || 'Pro Tier',
        activity: 'Just now',
        accent: userData.accent || 'blue',
      };
      data.adminUsers.unshift(newUser);
      write(data);
      return newUser;
    },

    async deleteAdminUser(id) {
      const data = read();
      data.adminUsers = data.adminUsers.filter((u) => u.id !== id);
      write(data);
      return { success: true, id };
    },

    async addAdminResource(groupId, item) {
      const data = read();
      const group = data.resourceGroups.find((g) => g.id === groupId);
      if (!group) throw new Error('Resource group not found');
      group.items.push(item);
      write(data);
      return group;
    },

    // AI Coach Dynamic Fallback
    async handleChat(userMessage) {
      const data = read();
      const msg = (userMessage || '').toLowerCase();
      const profile = data.profile;
      
      let reply = `Great question! For your focus as a ${profile.title || 'professional'}, focus on demonstrating measurable impact, structured problem solving, and clear communication. What specific topic would you like to explore next?`;
      
      if (msg.includes('resume') || msg.includes('cv')) {
        reply = `To optimize your resume for **${profile.title || 'your target role'}**, use the Google X-Y-Z formula: *"Accomplished [X] as measured by [Y], by doing [Z]"*. Also make sure to highlight key skills like ${profile.skills.slice(0, 3).join(', ')}.`;
      } else if (msg.includes('interview') || msg.includes('mock') || msg.includes('prep')) {
        reply = `For technical and behavioral interviews, structure all your answers using the **STAR method** (Situation, Task, Action, Result). State your specific actions clearly and quantify the business results!`;
      } else if (msg.includes('salary') || msg.includes('negotiat') || msg.includes('pay') || msg.includes('offer')) {
        reply = `Salary negotiation is about data and leverage. Always research market rates on Levels.fyi or Glassdoor for ${profile.focusAreas[0]?.value || 'your role'}. Let the recruiter give the first range, and counter with your value narrative.`;
      } else if (msg.includes('skill') || msg.includes('gap') || msg.includes('learn')) {
        reply = `Based on your profile, your strengths include **${profile.skills.join(', ')}**. To stand out even more, consider adding hands-on experience in **${data.resume.missingSkills.join(', ')}**.`;
      } else if (msg.includes('google') || msg.includes('stripe') || msg.includes('company')) {
        reply = `Prepping for top-tier companies requires deep alignment with their core operating principles. For product and engineering roles, focus on system design architecture, product trade-offs, and customer-centric decision making!`;
      }

      data.chatHistory.push({ role: 'user', content: userMessage });
      data.chatHistory.push({ role: 'assistant', content: reply });
      write(data);
      
      return { reply, model: 'dynamic-career-coach' };
    },
  };
}

export function resetStore(filePath = path.join(process.cwd(), 'backend', 'data', 'db.json')) {
  const absolutePath = path.resolve(filePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, JSON.stringify(defaultData, null, 2));
}
