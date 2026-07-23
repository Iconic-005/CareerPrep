import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Retrieve API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('WARNING: Gemini API Key is missing from the environment variables (.env). AI features will fall back to mockup responses.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Helper to get the Gemini model
function getModel(systemInstruction) {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction,
  });
}

function getFallbackReply(userMessage) {
  const msg = (userMessage || '').toLowerCase();
  if (msg.includes('resume')) {
    return `### 📄 Resume Review Tips\n\nHere are 3 key steps to optimize your resume:\n\n• **Use the Google X-Y-Z Formula**: "Accomplished [X] as measured by [Y], by doing [Z]".\n• **Quantify Impact**: Use concrete numbers, percentages, and metrics to prove your achievements.\n• **ATS Optimization**: Match keywords directly from the target job description.\n\n**Quick Tip:** Keep formatting simple — avoid complex tables, columns, or graphics that confuse ATS parsers.\n\nWould you like me to review specific bullet points or your summary section?`;
  }
  if (msg.includes('interview') || msg.includes('google')) {
    return `### 🎯 Interview Preparation Strategy\n\nFollow these 3 core steps for interview success:\n\n• **Master the STAR Framework**: Prepare Situation, Task, Action, and Result for behavioral questions.\n• **Problem Solving**: Practice coding and system design step-by-step out loud.\n• **Company Research**: Understand the company's core products, culture, and engineering values.\n\n**Quick Tip:** Always state assumptions clearly before starting technical problem-solving.\n\nWould you like to practice a mock interview question right now?`;
  }
  if (msg.includes('skill') || msg.includes('gap')) {
    return `### 📊 Skill Gap Analysis\n\nHere is how to identify and bridge your skill gaps:\n\n• **Target Role Benchmark**: Review 5 top job descriptions for your target position.\n• **Hands-On Projects**: Build end-to-end projects implementing missing technical skills.\n• **Structured Practice**: Practice daily coding and architectural challenges.\n\n**Quick Tip:** Depth beats breadth — focus on mastering core fundamentals first.\n\nWould you like me to generate a 30-day learning roadmap tailored to your goals?`;
  }
  return `### 💡 Career Mentor Guidance\n\nHere is actionable advice to boost your career prep:\n\n• **Consistent Practice**: Set aside 30–45 minutes daily for targeted practice.\n• **Portfolio & LinkedIn**: Keep your GitHub and LinkedIn updated with recent projects.\n• **Mock Interviews**: Practice articulating your solutions clearly and concisely.\n\n**Quick Tip:** Focus on incremental daily progress to build strong confidence.\n\nHow else can I assist with your career preparation today?`;
}

/**
 * Converts chat history from backend format to Gemini format
 */
function buildContents(history, userMessage) {
  const contents = history.map((item) => ({
    role: item.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: item.content }],
  }));
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });
  return contents;
}

/**
 * Handles career coaching chats with conversation history context (non-streaming)
 */
export async function generateChatReply(history = [], userMessage) {
  console.log('[DEBUG] Outgoing user message:', userMessage);

  if (genAI) {
    try {
      const model = getModel(CAREER_COACH_PROMPT);
      const contents = buildContents(history, userMessage);
      const result = await model.generateContent({ contents });
      const reply = result.response.text();
      console.log('[DEBUG] Gemini chat reply:', reply);
      return { reply, model: 'gemini-1.5-flash' };
    } catch (err) {
      console.error('[DEBUG] Gemini API error, using fallback:', err.message);
    }
  }

  const fallback = getFallbackReply(userMessage);
  return { reply: fallback, model: 'fallback' };
}

/**
 * Streams career coaching chat responses chunk-by-chunk
 * Returns an async iterable of text chunks
 */
export async function generateChatReplyStream(history = [], userMessage) {
  console.log('[DEBUG] Streaming user message:', userMessage);

  if (genAI) {
    try {
      const model = getModel(CAREER_COACH_PROMPT);
      const contents = buildContents(history, userMessage);
      const result = await model.generateContentStream({ contents });
      return result.stream;
    } catch (err) {
      console.error('[DEBUG] Gemini API Stream error, using fallback stream:', err.message);
    }
  }

  // Fallback stream generator
  const fallbackText = getFallbackReply(userMessage);
  const words = fallbackText.split(' ');
  
  async function* fallbackStream() {
    for (let i = 0; i < words.length; i += 3) {
      const chunk = words.slice(i, i + 3).join(' ') + ' ';
      yield { text: () => chunk };
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
  }

  return fallbackStream();
}

/**
 * Generates 3 follow-up suggestion prompts based on the conversation context
 */
export async function generateFollowUpSuggestions(history = [], lastReply) {
  if (!genAI) {
    return ['Tell me more', 'What should I do next?', 'Can you give an example?'];
  }

  try {
    const model = getModel('You generate exactly 3 short follow-up question suggestions for a career coaching conversation. Return valid JSON only.');
    
    const prompt = `Based on this career coaching conversation, generate exactly 3 short follow-up prompts (max 6 words each) the user might want to ask next. Return as a JSON array of strings.

Last AI response: "${lastReply.slice(0, 300)}"

Example output: ["Practice coding interview", "Improve my resume", "Create study plan"]`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });

    const suggestions = JSON.parse(result.response.text());
    return Array.isArray(suggestions) ? suggestions.slice(0, 3) : ['Tell me more', 'What should I do next?', 'Give me an example'];
  } catch (err) {
    console.error('[DEBUG] Follow-up suggestions error:', err.message);
    return ['Tell me more', 'What should I do next?', 'Give me an example'];
  }
}

/**
 * Analyzes and optimizes a resume for a target role
 */
export async function generateOptimizedResume(resumeText, targetRole) {
  console.log('[DEBUG] Optimizing resume for role:', targetRole);

  if (!genAI) {
    throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY in your .env file.');
  }

  const prompt = `Analyze and optimize this resume for the target role of "${targetRole || 'Software Professional'}".
Ensure suggestions are concrete, and draft an optimized markdown text using the Google X-Y-Z formula ("Accomplished [X] as measured by [Y], by doing [Z]").

Provide a valid JSON response strictly matching this schema:
{
  "score": "string (e.g., '88/100')",
  "critique": "string (detailed resume critique)",
  "optimizedText": "string (polished markdown resume section)",
  "suggestedSkills": ["array of 4 missing skills to add"]
}

Resume Text:
${resumeText}`;

  const model = getModel('You are an expert technical recruiter and resume writer.');
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' },
  });

  const data = JSON.parse(result.response.text());
  console.log('[DEBUG] Gemini resume optimization result:', data);
  return data;
}

/**
 * Compares Job Description against user skills to check ATS compatibility
 */
export async function generateJDAnalysis(jobDescription, userSkills = []) {
  console.log('[DEBUG] Analyzing Job Description...');

  if (!genAI) {
    throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY in your .env file.');
  }

  const prompt = `Analyze this Job Description and compare it against the candidate's skills list: ${JSON.stringify(userSkills)}.
Determine the target role title, calculate keyword match score, calculate overall ATS match score, identify matched skills, identify missing skills, and give 3 actionable recommendations.

Provide a valid JSON response strictly matching this schema:
{
  "jobTitle": "string (e.g. 'Senior Product Manager')",
  "keywordMatch": "string (e.g. '82%')",
  "atsScore": "string (e.g. '88%')",
  "matchedSkills": ["array of strings"],
  "missingSkills": ["array of strings"],
  "recommendations": ["array of 3 recommendation strings"]
}

Job Description:
${jobDescription}`;

  const model = getModel('You are an ATS parser and recruitment consultant.');
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' },
  });

  const data = JSON.parse(result.response.text());
  console.log('[DEBUG] Gemini JD analysis result:', data);
  return data;
}

/**
 * Generates a comprehensive career roadmap for a target role & company.
 * Includes 15-25 milestones, timeline phases, resources, interview strategy, and skill priorities.
 * Falls back to role-category-specific template data when Gemini API is unavailable.
 */
export async function generateRoadmap(targetRole, targetCompany) {
  console.log('[ROADMAP] Generating roadmap for:', targetRole, 'at', targetCompany);

  const prompt = `Generate a detailed career roadmap for a candidate targeting the role of "${targetRole}" at "${targetCompany}". Return:
1. Strategic Focus Areas (5-8 areas critical for this specific role and company).
2. A week-by-week and month-by-month timeline with 6 phases (Week 1-2, Week 3-4, Month 2, Month 3, Month 4+, Final Interview Preparation).
3. 15-25 actionable milestones the candidate must complete, ordered by priority. Each milestone should have a clear title, detailed description, a time phase, and a tone color.
4. Learning resources: recommended courses, books, practice platforms, YouTube channels, and documentation links (10-15 resources).
5. Interview preparation strategy with 4-6 specific strategies tailored to ${targetCompany}.
6. Estimated total preparation duration as a string.
7. Skill priorities in order of importance for this role (8-12 skills).

Provide a valid JSON response strictly matching this schema:
{
  "bannerTitle": "Target Transition",
  "bannerSubtitle": "string (e.g. '${targetRole} @ ${targetCompany}')",
  "bannerMeta": "string (projected timeline, e.g. 'Projected readiness: 4-6 months of focused preparation')",
  "estimatedDuration": "string (e.g. '4-6 months')",
  "focusAreas": [
    {
      "title": "string (focus area name)",
      "text": "string (why this area matters for the role)"
    }
  ],
  "timeline": [
    {
      "phase": "string (e.g. 'Week 1-2')",
      "title": "string (phase title)",
      "description": "string (what to accomplish in this phase)",
      "weeks": "string (e.g. '1-2')"
    }
  ],
  "milestones": [
    {
      "title": "string (milestone title)",
      "desc": "string (detailed milestone description)",
      "time": "string (one of: 'Week 1-2', 'Week 3-4', 'Month 2', 'Month 3', 'Month 4+', 'Final Prep')",
      "tone": "string (one of: 'mint', 'blue', 'violet', 'slate', 'amber', 'rose')",
      "done": false
    }
  ],
  "resources": [
    {
      "category": "string (one of: 'Course', 'Book', 'Platform', 'YouTube', 'Documentation')",
      "title": "string (resource name)",
      "url": "string (URL or 'N/A')",
      "type": "string (free or paid)"
    }
  ],
  "interviewStrategy": [
    {
      "title": "string (strategy title)",
      "description": "string (detailed strategy description)"
    }
  ],
  "skillPriority": ["array of skill names in order of importance"]
}`;

  // Attempt AI generation with multi-model fallback
  if (genAI) {
    const candidateModels = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro'];
    for (const modelName of candidateModels) {
      try {
        console.log(`[ROADMAP] Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: 'You are a world-class career counselor and interview preparation strategist. Generate highly specific, actionable career roadmaps tailored to the exact role and company requested. Never use generic advice.',
        });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        });
        const resultText = result.response.text();
        if (resultText) {
          const data = JSON.parse(resultText);
          console.log('[ROADMAP] Gemini roadmap generated successfully via', modelName);
          return data;
        }
      } catch (e) {
        console.warn(`[ROADMAP] Model ${modelName} failed:`, e.message);
      }
    }
    console.warn('[ROADMAP] All Gemini models failed. Using fallback.');
  }

  // ── Comprehensive fallback based on role category ──
  return generateFallbackRoadmap(targetRole, targetCompany);
}

/**
 * Generates a rich fallback roadmap when Gemini API is unavailable.
 * Uses role-category detection to produce relevant content.
 */
function generateFallbackRoadmap(targetRole, targetCompany) {
  console.log('[ROADMAP] Generating fallback roadmap for:', targetRole);
  const role = (targetRole || '').toLowerCase();

  let focusAreas, milestones, resources, skillPriority, interviewStrategy, timeline;

  if (role.includes('data') && (role.includes('scien') || role.includes('analy') || role.includes('ml') || role.includes('machine'))) {
    // ── Data Science / ML / Analytics ──
    focusAreas = [
      { title: 'Python & Libraries', text: 'Master NumPy, Pandas, Scikit-learn, and TensorFlow/PyTorch for production ML.' },
      { title: 'Statistics & Probability', text: 'Deep understanding of hypothesis testing, distributions, and Bayesian methods.' },
      { title: 'Machine Learning', text: 'Supervised/unsupervised learning, model selection, feature engineering, and evaluation metrics.' },
      { title: 'SQL & Data Pipelines', text: 'Complex queries, window functions, ETL processes, and data warehousing concepts.' },
      { title: 'Deep Learning', text: 'Neural networks, CNNs, RNNs, transformers, and transfer learning techniques.' },
      { title: 'Business Acumen & Case Studies', text: 'Translate business problems into data solutions with measurable impact.' },
    ];
    skillPriority = ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Deep Learning', 'Data Visualization', 'Feature Engineering', 'A/B Testing', 'NLP', 'Cloud ML Services'];
    milestones = [
      { title: 'Master Python for Data Science', desc: 'Complete comprehensive Python course covering NumPy, Pandas, and Matplotlib. Build 3 data analysis projects.', time: 'Week 1-2', tone: 'blue', done: false },
      { title: 'Statistics Foundations', desc: 'Study probability distributions, hypothesis testing, confidence intervals, and p-values. Solve 20 statistics problems.', time: 'Week 1-2', tone: 'blue', done: false },
      { title: 'SQL Mastery', desc: 'Master complex SQL queries including joins, subqueries, window functions, and CTEs. Complete 50 SQL challenges.', time: 'Week 1-2', tone: 'blue', done: false },
      { title: 'Exploratory Data Analysis Projects', desc: 'Complete 3 end-to-end EDA projects with real datasets. Document findings and visualizations.', time: 'Week 3-4', tone: 'violet', done: false },
      { title: 'Machine Learning Fundamentals', desc: 'Study linear/logistic regression, decision trees, random forests, SVMs, and k-means clustering.', time: 'Week 3-4', tone: 'violet', done: false },
      { title: 'Feature Engineering Techniques', desc: 'Learn feature selection, encoding, normalization, and handling missing data. Apply to 3 datasets.', time: 'Week 3-4', tone: 'violet', done: false },
      { title: 'Model Evaluation & Validation', desc: 'Master cross-validation, ROC curves, precision-recall, and hyperparameter tuning techniques.', time: 'Month 2', tone: 'amber', done: false },
      { title: 'Deep Learning Foundations', desc: 'Build neural networks with TensorFlow/PyTorch. Complete image classification and NLP projects.', time: 'Month 2', tone: 'amber', done: false },
      { title: 'A/B Testing & Experimentation', desc: 'Learn experimental design, statistical significance, and how to design and analyze A/B tests.', time: 'Month 2', tone: 'amber', done: false },
      { title: 'Data Visualization Portfolio', desc: 'Create 5 publication-quality visualizations using Matplotlib, Seaborn, and Plotly.', time: 'Month 2', tone: 'amber', done: false },
      { title: 'End-to-End ML Pipeline Project', desc: 'Build a complete ML pipeline: data collection, cleaning, modeling, evaluation, and deployment.', time: 'Month 3', tone: 'rose', done: false },
      { title: 'Case Study Practice', desc: 'Solve 10 business case studies translating business problems into data science solutions.', time: 'Month 3', tone: 'rose', done: false },
      { title: 'Cloud ML Services', desc: 'Deploy models on AWS SageMaker or Google Cloud AI Platform. Learn MLOps basics.', time: 'Month 3', tone: 'rose', done: false },
      { title: 'Kaggle Competitions', desc: 'Participate in 3 Kaggle competitions. Achieve top 20% in at least one competition.', time: 'Month 4+', tone: 'slate', done: false },
      { title: 'Portfolio & Resume Optimization', desc: 'Build a data science portfolio website with 5+ projects. Tailor resume to target role.', time: 'Month 4+', tone: 'slate', done: false },
      { title: 'Mock Technical Interviews', desc: 'Practice 10 mock data science interviews covering coding, statistics, and ML system design.', time: 'Month 4+', tone: 'slate', done: false },
      { title: 'Behavioral Interview Prep', desc: 'Prepare STAR-format answers for leadership, teamwork, and failure scenarios.', time: 'Final Prep', tone: 'mint', done: false },
      { title: 'Company-Specific Research', desc: `Deep-dive into ${targetCompany}'s data products, ML infrastructure, and recent publications.`, time: 'Final Prep', tone: 'mint', done: false },
    ];
    resources = [
      { category: 'Course', title: 'Andrew Ng — Machine Learning Specialization', url: 'https://www.coursera.org/specializations/machine-learning-introduction', type: 'free' },
      { category: 'Course', title: 'fast.ai — Practical Deep Learning', url: 'https://course.fast.ai/', type: 'free' },
      { category: 'Book', title: 'Hands-On Machine Learning (Aurélien Géron)', url: 'N/A', type: 'paid' },
      { category: 'Book', title: 'Python for Data Analysis (Wes McKinney)', url: 'N/A', type: 'paid' },
      { category: 'Platform', title: 'Kaggle', url: 'https://www.kaggle.com/', type: 'free' },
      { category: 'Platform', title: 'LeetCode (SQL & Python)', url: 'https://leetcode.com/', type: 'free' },
      { category: 'Platform', title: 'StrataScratch', url: 'https://www.stratascratch.com/', type: 'free' },
      { category: 'YouTube', title: 'StatQuest with Josh Starmer', url: 'https://www.youtube.com/@statquest', type: 'free' },
      { category: 'YouTube', title: '3Blue1Brown — Neural Networks', url: 'https://www.youtube.com/@3blue1brown', type: 'free' },
      { category: 'Documentation', title: 'Scikit-learn Official Docs', url: 'https://scikit-learn.org/stable/', type: 'free' },
    ];
    interviewStrategy = [
      { title: 'Technical Coding Round', description: 'Practice Python coding problems focused on data manipulation, algorithms, and SQL queries.' },
      { title: 'Statistics & Probability Deep Dive', description: 'Be ready to explain statistical concepts and solve probability puzzles on the whiteboard.' },
      { title: 'ML System Design', description: 'Practice designing end-to-end ML systems: data pipelines, feature stores, model serving.' },
      { title: 'Business Case Presentation', description: 'Prepare to present how you would solve a real business problem using data science.' },
      { title: 'Behavioral & Culture Fit', description: `Research ${targetCompany}'s values. Prepare STAR stories about impact-driven projects.` },
    ];
  } else if (role.includes('devops') || role.includes('sre') || role.includes('platform') || role.includes('infrastructure') || role.includes('cloud')) {
    // ── DevOps / SRE / Cloud Engineer ──
    focusAreas = [
      { title: 'Linux & Networking', text: 'Deep Linux administration, networking protocols, DNS, load balancing, and firewalls.' },
      { title: 'Containers & Orchestration', text: 'Docker containerization, Kubernetes orchestration, Helm charts, and service mesh.' },
      { title: 'CI/CD Pipelines', text: 'Jenkins, GitHub Actions, GitLab CI, ArgoCD — automated build, test, and deployment.' },
      { title: 'Cloud Platforms', text: 'AWS/Azure/GCP services: compute, storage, networking, IAM, and managed services.' },
      { title: 'Infrastructure as Code', text: 'Terraform, Ansible, CloudFormation for reproducible infrastructure provisioning.' },
      { title: 'Monitoring & Observability', text: 'Prometheus, Grafana, ELK stack, distributed tracing, and SLO/SLI management.' },
    ];
    skillPriority = ['Linux', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'AWS/Azure/GCP', 'Python/Bash', 'Networking', 'Monitoring', 'Security'];
    milestones = [
      { title: 'Linux Administration Deep Dive', desc: 'Master shell scripting, process management, file systems, permissions, and systemd services.', time: 'Week 1-2', tone: 'blue', done: false },
      { title: 'Networking Fundamentals', desc: 'Study TCP/IP, DNS, HTTP/HTTPS, load balancing, firewalls, and VPNs. Set up a home lab.', time: 'Week 1-2', tone: 'blue', done: false },
      { title: 'Docker Mastery', desc: 'Learn Dockerfile best practices, multi-stage builds, Docker Compose, and container networking.', time: 'Week 1-2', tone: 'blue', done: false },
      { title: 'Kubernetes Fundamentals', desc: 'Deploy applications on K8s. Learn pods, services, deployments, ConfigMaps, and secrets.', time: 'Week 3-4', tone: 'violet', done: false },
      { title: 'Advanced Kubernetes', desc: 'Master Helm charts, Ingress controllers, RBAC, HPA, and StatefulSets.', time: 'Week 3-4', tone: 'violet', done: false },
      { title: 'CI/CD Pipeline Setup', desc: 'Build end-to-end CI/CD pipelines using GitHub Actions and ArgoCD for GitOps deployment.', time: 'Week 3-4', tone: 'violet', done: false },
      { title: 'Cloud Platform Certification Path', desc: 'Study for AWS Solutions Architect / Azure Administrator / GCP Associate Cloud Engineer.', time: 'Month 2', tone: 'amber', done: false },
      { title: 'Terraform & Infrastructure as Code', desc: 'Write Terraform modules for multi-environment infrastructure. Learn state management.', time: 'Month 2', tone: 'amber', done: false },
      { title: 'Configuration Management', desc: 'Use Ansible for configuration management. Write playbooks for automated server setup.', time: 'Month 2', tone: 'amber', done: false },
      { title: 'Monitoring & Alerting Stack', desc: 'Set up Prometheus + Grafana monitoring. Create dashboards and alerting rules.', time: 'Month 3', tone: 'rose', done: false },
      { title: 'Log Management & Observability', desc: 'Deploy ELK/EFK stack. Implement structured logging and distributed tracing.', time: 'Month 3', tone: 'rose', done: false },
      { title: 'Security & Compliance', desc: 'Learn DevSecOps practices: container scanning, secret management, network policies.', time: 'Month 3', tone: 'rose', done: false },
      { title: 'Full Production Project', desc: 'Deploy a microservices application with K8s, CI/CD, monitoring, and IaC from scratch.', time: 'Month 4+', tone: 'slate', done: false },
      { title: 'Incident Response Practice', desc: 'Practice incident management, postmortems, and on-call scenarios.', time: 'Month 4+', tone: 'slate', done: false },
      { title: 'System Design for DevOps', desc: 'Practice designing scalable, highly available infrastructure for distributed systems.', time: 'Month 4+', tone: 'slate', done: false },
      { title: 'Mock Interviews & Scenarios', desc: 'Practice 10 mock DevOps interviews with troubleshooting scenarios and system design.', time: 'Final Prep', tone: 'mint', done: false },
      { title: 'Company-Specific Preparation', desc: `Research ${targetCompany}'s infrastructure stack, deployment practices, and SRE culture.`, time: 'Final Prep', tone: 'mint', done: false },
    ];
    resources = [
      { category: 'Course', title: 'KodeKloud — DevOps Learning Path', url: 'https://kodekloud.com/', type: 'paid' },
      { category: 'Course', title: 'Kubernetes CKA Prep (Mumshad)', url: 'https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/', type: 'paid' },
      { category: 'Book', title: 'The Phoenix Project', url: 'N/A', type: 'paid' },
      { category: 'Book', title: 'Site Reliability Engineering (Google)', url: 'https://sre.google/sre-book/table-of-contents/', type: 'free' },
      { category: 'Platform', title: 'KillerCoda (Interactive Labs)', url: 'https://killercoda.com/', type: 'free' },
      { category: 'Platform', title: 'A Cloud Guru', url: 'https://acloudguru.com/', type: 'paid' },
      { category: 'YouTube', title: 'TechWorld with Nana', url: 'https://www.youtube.com/@TechWorldwithNana', type: 'free' },
      { category: 'YouTube', title: 'NetworkChuck', url: 'https://www.youtube.com/@NetworkChuck', type: 'free' },
      { category: 'Documentation', title: 'Kubernetes Official Docs', url: 'https://kubernetes.io/docs/', type: 'free' },
      { category: 'Documentation', title: 'Terraform Registry', url: 'https://registry.terraform.io/', type: 'free' },
    ];
    interviewStrategy = [
      { title: 'Troubleshooting Scenarios', description: 'Practice diagnosing production issues: high CPU, memory leaks, network failures.' },
      { title: 'System Design for Infrastructure', description: 'Design scalable, fault-tolerant architectures. Focus on load balancing, caching, and CDNs.' },
      { title: 'Coding & Scripting Round', description: 'Practice Python/Bash scripting for automation tasks and infrastructure management.' },
      { title: 'CI/CD Pipeline Design', description: 'Be ready to design a complete CI/CD pipeline from code commit to production deployment.' },
      { title: 'Behavioral & On-Call Scenarios', description: `Prepare stories about handling incidents, postmortems, and working under pressure at ${targetCompany}.` },
    ];
  } else if (role.includes('product') && role.includes('manag')) {
    // ── Product Manager ──
    focusAreas = [
      { title: 'Product Strategy & Vision', text: 'Develop product vision, roadmaps, and strategic frameworks for product growth.' },
      { title: 'User Research & Analytics', text: 'Conduct user interviews, analyze metrics, and make data-driven product decisions.' },
      { title: 'Technical Fluency', text: 'Understand engineering trade-offs, API design, and system architecture basics.' },
      { title: 'Stakeholder Management', text: 'Master cross-functional communication, prioritization frameworks, and executive presentations.' },
      { title: 'Market Analysis & Competitive Intelligence', text: 'Analyze market trends, competitor products, and identify differentiation opportunities.' },
      { title: 'Agile & Execution', text: 'Sprint planning, backlog management, feature specification, and launch coordination.' },
    ];
    skillPriority = ['Product Strategy', 'User Research', 'Data Analysis', 'SQL', 'A/B Testing', 'Roadmap Planning', 'Stakeholder Management', 'Technical Communication', 'Market Analysis', 'Agile/Scrum'];
    milestones = [
      { title: 'Product Management Foundations', desc: 'Complete a comprehensive PM course. Learn frameworks: RICE, MoSCoW, Jobs-to-be-Done.', time: 'Week 1-2', tone: 'blue', done: false },
      { title: 'SQL & Data Analytics', desc: 'Master SQL for product analytics. Practice writing queries to derive product insights.', time: 'Week 1-2', tone: 'blue', done: false },
      { title: 'User Research Methods', desc: 'Learn user interview techniques, surveys, usability testing, and persona creation.', time: 'Week 1-2', tone: 'blue', done: false },
      { title: 'Product Metrics & KPIs', desc: 'Study North Star metrics, funnel analysis, cohort analysis, and retention metrics.', time: 'Week 3-4', tone: 'violet', done: false },
      { title: 'Product Sense Questions', desc: 'Practice 20 product sense interview questions: improve product X, design for Y.', time: 'Week 3-4', tone: 'violet', done: false },
      { title: 'Competitive Analysis Framework', desc: 'Analyze 5 competing products. Build competitive matrices and identify opportunities.', time: 'Week 3-4', tone: 'violet', done: false },
      { title: 'Technical Architecture Basics', desc: 'Understand APIs, databases, frontend/backend, and common system architecture patterns.', time: 'Month 2', tone: 'amber', done: false },
      { title: 'A/B Testing & Experimentation', desc: 'Design experiments, analyze results, and make statistically sound product decisions.', time: 'Month 2', tone: 'amber', done: false },
      { title: 'PRD Writing Practice', desc: 'Write 5 Product Requirements Documents for different product features and improvements.', time: 'Month 2', tone: 'amber', done: false },
      { title: 'Product Strategy Case Studies', desc: 'Analyze 10 product strategy cases from top tech companies. Document learnings.', time: 'Month 3', tone: 'rose', done: false },
      { title: 'Estimation & Analytical Questions', desc: 'Practice market sizing, estimation, and analytical interview questions (20+ problems).', time: 'Month 3', tone: 'rose', done: false },
      { title: 'Stakeholder Communication', desc: 'Practice executive presentations, roadmap reviews, and cross-functional alignment meetings.', time: 'Month 3', tone: 'rose', done: false },
      { title: 'Mock PM Interviews', desc: 'Conduct 10 mock PM interviews covering product sense, analytical, and execution questions.', time: 'Month 4+', tone: 'slate', done: false },
      { title: 'Portfolio & Case Study Deck', desc: 'Build a PM portfolio with 3 detailed case studies showing impact and decision-making.', time: 'Month 4+', tone: 'slate', done: false },
      { title: 'Company Deep Dive', desc: `Research ${targetCompany}'s products, organizational structure, PM culture, and recent launches.`, time: 'Final Prep', tone: 'mint', done: false },
      { title: 'Behavioral Interview Prep', desc: 'Prepare STAR stories for leadership, disagreements, failure, and cross-functional collaboration.', time: 'Final Prep', tone: 'mint', done: false },
    ];
    resources = [
      { category: 'Course', title: 'Product School — Product Management', url: 'https://www.productschool.com/', type: 'paid' },
      { category: 'Course', title: 'Exponent — PM Interview Prep', url: 'https://www.tryexponent.com/', type: 'paid' },
      { category: 'Book', title: 'Inspired by Marty Cagan', url: 'N/A', type: 'paid' },
      { category: 'Book', title: 'Cracking the PM Interview', url: 'N/A', type: 'paid' },
      { category: 'Platform', title: 'Product Hunt', url: 'https://www.producthunt.com/', type: 'free' },
      { category: 'Platform', title: 'Lenny\'s Newsletter', url: 'https://www.lennysnewsletter.com/', type: 'free' },
      { category: 'YouTube', title: 'Exponent PM Channel', url: 'https://www.youtube.com/@tryexponent', type: 'free' },
      { category: 'Documentation', title: 'Google Product Management Guide', url: 'https://www.productplan.com/', type: 'free' },
    ];
    interviewStrategy = [
      { title: 'Product Sense Round', description: 'Practice designing products, improving existing features, and identifying user pain points.' },
      { title: 'Analytical Round', description: 'Practice metric definition, root cause analysis, and data-driven decision frameworks.' },
      { title: 'Execution Round', description: 'Practice roadmap prioritization, trade-off discussions, and technical execution planning.' },
      { title: 'Leadership & Drive', description: `Prepare stories demonstrating ownership, influence without authority, and alignment with ${targetCompany}'s values.` },
    ];
  } else {
    // ── Default: Software Engineer ──
    focusAreas = [
      { title: 'Data Structures & Algorithms', text: 'Master arrays, trees, graphs, dynamic programming, and algorithmic problem-solving.' },
      { title: 'System Design', text: 'Design scalable distributed systems covering load balancing, caching, databases, and microservices.' },
      { title: 'Backend Development', text: 'APIs, authentication, databases, server architecture, and performance optimization.' },
      { title: 'Frontend Development', text: 'React/Vue, state management, responsive design, accessibility, and performance.' },
      { title: 'Databases & SQL', text: 'Relational databases, NoSQL, query optimization, indexing, and data modeling.' },
      { title: 'Cloud & DevOps', text: 'AWS/GCP/Azure services, containerization, CI/CD, and infrastructure basics.' },
      { title: 'Behavioral Interviews', text: 'STAR framework, leadership principles, conflict resolution, and growth mindset.' },
    ];
    skillPriority = ['Data Structures', 'Algorithms', 'System Design', 'JavaScript/Python', 'SQL', 'REST APIs', 'React', 'Node.js', 'Git', 'Cloud Services', 'Testing'];
    milestones = [
      { title: 'Complete Arrays & Strings Mastery', desc: 'Solve 30 array/string problems covering two pointers, sliding window, and prefix sums.', time: 'Week 1-2', tone: 'blue', done: false },
      { title: 'Linked Lists & Stacks/Queues', desc: 'Master linked list manipulation, stack-based problems, and queue implementations. Solve 20 problems.', time: 'Week 1-2', tone: 'blue', done: false },
      { title: 'Hash Maps & Sets', desc: 'Solve 20 hashing problems including frequency counting, two-sum variants, and anagram detection.', time: 'Week 1-2', tone: 'blue', done: false },
      { title: 'Trees & Binary Search Trees', desc: 'Master tree traversals, BST operations, and tree-based algorithms. Solve 25 problems.', time: 'Week 3-4', tone: 'violet', done: false },
      { title: 'Graph Algorithms', desc: 'Learn BFS, DFS, topological sort, shortest path, and union-find. Solve 20 graph problems.', time: 'Week 3-4', tone: 'violet', done: false },
      { title: 'Dynamic Programming Foundations', desc: 'Master 1D/2D DP patterns: fibonacci, knapsack, LCS, LIS. Solve 25 DP problems.', time: 'Week 3-4', tone: 'violet', done: false },
      { title: 'Solve 50 LeetCode Easy Problems', desc: 'Build confidence and speed with easy-level problems across all data structure categories.', time: 'Month 2', tone: 'amber', done: false },
      { title: 'Solve 100 LeetCode Medium Problems', desc: 'Focus on medium-difficulty problems commonly asked at top tech companies.', time: 'Month 2', tone: 'amber', done: false },
      { title: 'Learn OOP Design Patterns', desc: 'Study SOLID principles, Factory, Observer, Strategy, and Singleton patterns.', time: 'Month 2', tone: 'amber', done: false },
      { title: 'Complete SQL Mastery', desc: 'Master complex joins, window functions, CTEs, and query optimization. Solve 30 SQL challenges.', time: 'Month 2', tone: 'amber', done: false },
      { title: 'Build 2 Full-Stack Projects', desc: 'Create two portfolio-worthy projects using React + Node.js with authentication and deployment.', time: 'Month 3', tone: 'rose', done: false },
      { title: 'REST API Design & Implementation', desc: 'Build production-grade REST APIs with proper error handling, validation, and documentation.', time: 'Month 3', tone: 'rose', done: false },
      { title: 'System Design Fundamentals', desc: 'Study load balancers, CDNs, databases, caching, message queues, and microservices patterns.', time: 'Month 3', tone: 'rose', done: false },
      { title: 'Practice 5 System Design Questions', desc: 'Design: URL shortener, chat system, news feed, rate limiter, and notification service.', time: 'Month 4+', tone: 'slate', done: false },
      { title: 'Solve 30 LeetCode Hard Problems', desc: 'Tackle hard-level problems to prepare for senior-level interview rounds.', time: 'Month 4+', tone: 'slate', done: false },
      { title: 'Git & Collaboration Workflow', desc: 'Master branching strategies, code reviews, PR workflows, and collaborative development.', time: 'Month 4+', tone: 'slate', done: false },
      { title: 'Practice 10 Mock Interviews', desc: 'Conduct timed mock interviews practicing problem-solving communication and coding on whiteboard.', time: 'Month 4+', tone: 'slate', done: false },
      { title: 'Prepare Behavioral Questions (STAR)', desc: 'Write STAR stories for: leadership, conflict, failure, teamwork, and ambiguity. Practice aloud.', time: 'Final Prep', tone: 'mint', done: false },
      { title: 'Company-Specific Preparation', desc: `Research ${targetCompany}'s engineering blog, tech stack, interview process, and culture values.`, time: 'Final Prep', tone: 'mint', done: false },
      { title: 'Final Revision & Confidence Building', desc: 'Review top 50 most-asked problems. Time yourself. Focus on weak areas identified in mocks.', time: 'Final Prep', tone: 'mint', done: false },
    ];
    resources = [
      { category: 'Course', title: 'NeetCode — DSA Roadmap', url: 'https://neetcode.io/', type: 'free' },
      { category: 'Course', title: 'Grokking the System Design Interview', url: 'https://www.designgurus.io/', type: 'paid' },
      { category: 'Book', title: 'Cracking the Coding Interview', url: 'N/A', type: 'paid' },
      { category: 'Book', title: 'Designing Data-Intensive Applications', url: 'N/A', type: 'paid' },
      { category: 'Book', title: 'System Design Interview by Alex Xu', url: 'N/A', type: 'paid' },
      { category: 'Platform', title: 'LeetCode', url: 'https://leetcode.com/', type: 'free' },
      { category: 'Platform', title: 'HackerRank', url: 'https://www.hackerrank.com/', type: 'free' },
      { category: 'Platform', title: 'CodeSignal', url: 'https://codesignal.com/', type: 'free' },
      { category: 'YouTube', title: 'NeetCode', url: 'https://www.youtube.com/@NeetCode', type: 'free' },
      { category: 'YouTube', title: 'Gaurav Sen — System Design', url: 'https://www.youtube.com/@gaborsen', type: 'free' },
      { category: 'YouTube', title: 'Tech Interview Pro', url: 'https://www.youtube.com/@TechLead', type: 'free' },
      { category: 'Documentation', title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', type: 'free' },
      { category: 'Documentation', title: 'Node.js Official Docs', url: 'https://nodejs.org/docs/', type: 'free' },
    ];
    interviewStrategy = [
      { title: 'Coding Round Strategy', description: 'Think aloud, clarify constraints, write brute-force first, then optimize. Always discuss time/space complexity.' },
      { title: 'System Design Approach', description: 'Start with requirements, estimate scale, design high-level architecture, then deep-dive into components.' },
      { title: 'Behavioral Round Prep', description: `Use STAR framework. Align answers with ${targetCompany}'s leadership principles and engineering values.` },
      { title: 'Technical Deep Dive', description: 'Be ready to discuss past projects in detail: architecture decisions, trade-offs, and what you would improve.' },
      { title: 'Final Tips', description: 'Ask thoughtful questions about team culture, tech challenges, and growth opportunities.' },
    ];
  }

  timeline = [
    { phase: 'Week 1-2', title: 'Foundation Building', description: 'Master core fundamentals and build a strong base.', weeks: '1-2' },
    { phase: 'Week 3-4', title: 'Intermediate Skills', description: 'Deepen knowledge and tackle more complex topics.', weeks: '3-4' },
    { phase: 'Month 2', title: 'Advanced Practice', description: 'Apply knowledge through projects and advanced problem-solving.', weeks: '5-8' },
    { phase: 'Month 3', title: 'Project Building', description: 'Build portfolio projects and system design skills.', weeks: '9-12' },
    { phase: 'Month 4+', title: 'Interview Preparation', description: 'Mock interviews, hard problems, and targeted practice.', weeks: '13-16' },
    { phase: 'Final Prep', title: 'Final Interview Readiness', description: 'Company research, behavioral prep, and confidence building.', weeks: '17-20' },
  ];

  return {
    bannerTitle: 'Target Transition',
    bannerSubtitle: `${targetRole} @ ${targetCompany}`,
    bannerMeta: 'Projected readiness: 4-5 months of focused, consistent preparation.',
    estimatedDuration: '4-5 months',
    focusAreas,
    timeline,
    milestones,
    resources,
    interviewStrategy,
    skillPriority,
  };
}

/**
 * Generates dynamic mock interview questions based on role, company, difficulty & category
 */
export async function generateMockInterviewQuestions(role, company, difficulty, category) {
  console.log('[DEBUG] Generating mock interview questions for:', role, company, category);

  if (!genAI) {
    throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY in your .env file.');
  }

  const prompt = `Generate 4 realistic interview questions for a candidate interviewing for the position of "${role}" at "${company}" (${difficulty} level, category: "${category}").

Provide a valid JSON response strictly matching this schema:
{
  "questions": [
    {
      "id": "string (e.g. 'q1')",
      "question": "string (interview question text)",
      "category": "string (e.g. 'System Design' or 'Behavioral')",
      "hint": "string (brief hint for candidate)"
    }
  ]
}`;

  const model = getModel('You are a Principal Hiring Manager conducting interviews.');
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' },
  });

  const data = JSON.parse(result.response.text());
  return data.questions || [];
}

/**
 * Evaluates candidate responses from a full mock interview session
 */
export async function evaluateInterviewSession(role, company, difficulty, qnaList = []) {
  console.log('[DEBUG] Evaluating mock interview session for:', role, company);

  if (!genAI) {
    throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY in your .env file.');
  }

  const prompt = `Evaluate this completed mock interview session for a candidate applying for "${role}" at "${company}" (${difficulty} level).
Analyze the candidate's answers for technical accuracy, communication skills, STAR framework usage, and confidence.

Q&A Transcript:
${JSON.stringify(qnaList, null, 2)}

Provide a valid JSON response strictly matching this schema:
{
  "score": number (out of 10, e.g. 8.5),
  "maxScore": 10,
  "headline": "string (e.g. 'Strong Performance with Technical Depth')",
  "percentileText": "string (e.g. 'Top 10% of candidate pool')",
  "skillsRadar": {
    "Technical": number (0-100),
    "Communication": number (0-100),
    "Grammar": number (0-100),
    "Behavioral": number (0-100),
    "Confidence": number (0-100)
  },
  "strengths": [
    {
      "title": "string",
      "desc": "string"
    }
  ],
  "improvements": [
    {
      "title": "string",
      "desc": "string"
    }
  ],
  "nextSteps": [
    {
      "title": "string",
      "text": "string"
    }
  ]
}`;

  const model = getModel('You are a Senior Bar Raiser & Hiring Director evaluating interview performance.');
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' },
  });

  const data = JSON.parse(result.response.text());
  console.log('[DEBUG] Gemini interview evaluation result:', data);
  return data;
}

/**
 * Evaluates user's code submission via Gemini AI
 */
export async function evaluateCodeSubmission(problemTitle, code, language = 'Python') {
  console.log('[DEBUG] Evaluating code submission for problem:', problemTitle);

  if (!genAI) {
    throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY in your .env file.');
  }

  const prompt = `Evaluate this code submission for the problem "${problemTitle || 'Coding Challenge'}" written in ${language}.
Check for syntax errors, algorithm correctness, edge case handling, and Big O time/space complexity.

Code Submission:
${code}

Provide a valid JSON response strictly matching this schema:
{
  "status": "passed | failed",
  "message": "string (e.g. '✓ All test cases passed successfully')",
  "runtime": "string (e.g. '34ms')",
  "beatsPercent": "string (e.g. '94%')",
  "complexity": "string (e.g. 'Time: O(N), Space: O(1)')",
  "review": "string (constructive code review feedback)"
}`;

  const model = getModel('You are a Principal Software Engineer evaluating code submissions.');
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' },
  });

  const data = JSON.parse(result.response.text());
  console.log('[DEBUG] Gemini code evaluation result:', data);
  return data;
}

/**
 * Builds a complete ATS-friendly resume from user's full MongoDB profile using Gemini API
 */
export async function generateBuildResumeFromProfile(profileData = {}) {
  console.log('[DEBUG] Building resume with AI for candidate:', profileData.name);

  const title = profileData.title || 'Software Engineer';

  const defaultExperiences = [
    {
      id: `exp_${Date.now()}_1`,
      role: `Senior ${title}`,
      company: 'TechInnovate Corp',
      period: '2022 — Present',
      location: 'San Francisco, CA',
      description: 'Led cross-functional team building core application architecture and scalable microservices.',
      bulletPoints: [
        'Architected and deployed high-throughput production API microservices, reducing server response times by 38% for over 250,000 active monthly users.',
        'Spearheaded modern web app migration using React, Node.js, and MongoDB, boosting overall web vital performance score by 45%.',
        'Implemented automated CI/CD deployment pipelines with zero downtime, cutting release cycles from 2 weeks to 3 days.'
      ]
    },
    {
      id: `exp_${Date.now()}_2`,
      role: title,
      company: 'NextGen Solutions',
      period: '2020 — 2022',
      location: 'San Jose, CA',
      description: 'Developed responsive web components and backend integration pipelines.',
      bulletPoints: [
        'Designed and developed 25+ reusable UI components with 100% unit test coverage, standardizing component design system across 4 products.',
        'Optimized database queries and indexing strategies in MongoDB, improving search query execution speed by 52%.'
      ]
    }
  ];

  const defaultEducation = [
    {
      id: `edu_${Date.now()}_1`,
      degree: 'B.S. in Computer Science & Engineering',
      institution: 'University of California, Berkeley',
      period: '2016 — 2020',
      description: 'Specialization in Software Architecture, Distributed Systems, and Data Structures.',
      gpa: '3.8/4.0'
    }
  ];

  const defaultProjects = [
    {
      id: `proj_${Date.now()}_1`,
      title: 'Real-Time Analytics Dashboard',
      description: 'Full-stack enterprise telemetry platform visualizing real-time metrics with live data streaming.',
      techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Chart.js']
    },
    {
      id: `proj_${Date.now()}_2`,
      title: 'AI Resume Optimization Engine',
      description: 'Automated candidate screening tool leveraging NLP algorithms to evaluate ATS keyword compatibility.',
      techStack: ['Python', 'FastAPI', 'React', 'TailwindCSS']
    }
  ];

  const experience = (profileData.experiences && profileData.experiences.length > 0)
    ? profileData.experiences.map((exp, i) => ({
        id: exp.id || `exp_${Date.now()}_${i}`,
        role: exp.role || title,
        company: exp.company || 'Tech Company',
        period: exp.period || '2022 — Present',
        location: exp.location || 'San Francisco, CA',
        description: exp.description || '',
        bulletPoints: exp.description ? [
          exp.description,
          `Spearheaded key technical initiatives at ${exp.company || 'the organization'}, boosting system reliability and team output by 35%.`,
          `Collaborated across engineering and product teams to deliver high-priority features ahead of schedule.`
        ] : [
          `Architected scalable features for ${exp.company || 'enterprise platforms'}, improving system throughput by 40%.`,
          `Led automated unit and integration testing, ensuring zero critical bugs during major production releases.`
        ]
      }))
    : defaultExperiences;

  const education = (profileData.education && profileData.education.length > 0)
    ? profileData.education.map((edu, i) => ({
        id: edu.id || `edu_${Date.now()}_${i}`,
        degree: edu.degree || 'B.S. Computer Science',
        institution: edu.institution || 'University',
        period: edu.period || '2018 — 2022',
        description: edu.description || 'Focus on Software Engineering and Algorithms.',
        gpa: edu.gpa || '3.8/4.0'
      }))
    : defaultEducation;

  const projects = (profileData.projects && profileData.projects.length > 0)
    ? profileData.projects.map((proj, i) => ({
        id: proj.id || `proj_${Date.now()}_${i}`,
        title: proj.title || 'Web Project',
        description: proj.description || 'Full-stack application built with modern architecture.',
        techStack: proj.techStack?.length ? proj.techStack : ['React', 'Node.js', 'MongoDB']
      }))
    : defaultProjects;

  const skills = (profileData.skills && profileData.skills.length > 0)
    ? profileData.skills
    : ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git', 'HTML5', 'CSS3', 'Agile/Scrum', 'CI/CD'];

  const fallbackResume = {
    summary: profileData.about || profileData.careerObjective || `Results-driven ${title} with hands-on experience building scalable applications, managing component libraries, and optimizing backend performance. Committed to engineering excellence and delivering measurable business impact.`,
    experience,
    education,
    projects,
    skills,
    certifications: profileData.certifications?.length ? profileData.certifications : [
      { id: `cert_${Date.now()}_1`, name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' }
    ],
    achievements: (profileData.achievements && profileData.achievements.length > 0)
      ? profileData.achievements.map(a => typeof a === 'string' ? a : a.title || a.description || '')
      : ['Awarded Top Engineering Contributor for delivering zero-downtime database migration.', 'Published technical article on Microservices performance optimization with 10k+ reads.'],
    languages: profileData.languages?.length ? profileData.languages : ['English', 'Spanish'],
    interests: profileData.interests?.length ? profileData.interests : ['Open Source', 'System Design', 'Cloud Architecture'],
    missingSkills: ['Cloud Architecture (AWS/GCP)', 'Docker & Kubernetes Containerization', 'System Microservices Design'],
    suggestions: [
      {
        id: `sug_${Date.now()}_1`,
        title: 'Quantify achievements with concrete metrics',
        desc: 'Incorporate revenue percentages and performance benchmarks (e.g. 40% latency reduction) into experience bullet points.',
        type: 'blue',
        icon: 'trendUp'
      },
      {
        id: `sug_${Date.now()}_2`,
        title: 'Add ATS-targeted cloud certification',
        desc: 'Highlight AWS or GCP certifications to boost recruiter keyword matching scores.',
        type: 'purple',
        icon: 'spark'
      }
    ]
  };

  if (!genAI) {
    console.warn('[DEBUG] Gemini API key not found. Using structured profile fallback.');
    return fallbackResume;
  }

  try {
    const prompt = `You are a world-class ATS resume builder and executive career coach.
Generate a comprehensive, ATS-optimized, high-impact resume in valid JSON based strictly on the candidate's profile information provided below.

Rules:
1. Use strong action verbs and Google X-Y-Z formula ("Accomplished [X] as measured by [Y], by doing [Z]").
2. Quantify achievements with metrics wherever appropriate.
3. Keep formatting clean, concise, and recruiter-ready.
4. Output valid JSON strictly matching the specified JSON schema. No extra commentary.

Candidate Profile Data:
${JSON.stringify(profileData, null, 2)}

Output JSON Schema:
{
  "summary": "string (3-4 sentence professional summary)",
  "experience": [
    {
      "id": "string",
      "role": "string",
      "company": "string",
      "period": "string",
      "location": "string",
      "description": "string",
      "bulletPoints": ["array of 2-4 quantified bullet points using X-Y-Z formula"]
    }
  ],
  "education": [
    {
      "id": "string",
      "degree": "string",
      "institution": "string",
      "period": "string",
      "description": "string",
      "gpa": "string"
    }
  ],
  "projects": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "techStack": ["array of strings"]
    }
  ],
  "skills": ["array of candidate skills"],
  "certifications": [
    {
      "id": "string",
      "name": "string",
      "issuer": "string",
      "year": "string"
    }
  ],
  "achievements": ["array of achievement strings"],
  "languages": ["array of language strings"],
  "interests": ["array of interest strings"],
  "atsScore": number (80-98),
  "skillMatchScore": number (75-98),
  "completenessScore": number (85-100),
  "missingSkills": ["array of 3-4 recommended technical skills for target role"],
  "suggestions": [
    {
      "id": "string",
      "title": "string",
      "desc": "string",
      "type": "blue | purple | mint",
      "icon": "trendUp | spark | check"
    }
  ]
}`;

    const candidateModels = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash', 'gemini-1.5-pro'];
    let resultText = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: 'You are an expert ATS resume writer and executive recruiter.',
        });
        const res = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        });
        resultText = res.response.text();
        if (resultText) break;
      } catch (e) {
        console.warn(`[DEBUG] Gemini model ${modelName} unavailable:`, e.message);
      }
    }

    if (!resultText) {
      console.warn('[DEBUG] All Gemini model candidates failed. Returning structured profile fallback.');
      return fallbackResume;
    }

    const parsed = JSON.parse(resultText);
    console.log('[DEBUG] Gemini build resume result generated successfully.');
    return {
      ...fallbackResume,
      ...parsed,
    };
  } catch (err) {
    console.error('[DEBUG] Gemini Build Resume error, using fallback:', err.message);
    return fallbackResume;
  }
}

