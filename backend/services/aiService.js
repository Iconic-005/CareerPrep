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
 * Generates milestone roadmap for target role & company
 */
export async function generateRoadmap(targetRole, targetCompany) {
  console.log('[DEBUG] Generating roadmap for:', targetRole, 'at', targetCompany);

  if (!genAI) {
    throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY in your .env file.');
  }

  const prompt = `Generate a customized 4-milestone roadmap for transitioning from a general professional into the role of "${targetRole}" at "${targetCompany}".
Also list 2 strategic focus areas.

Provide a valid JSON response strictly matching this schema:
{
  "bannerTitle": "Target Transition",
  "bannerSubtitle": "string (e.g. 'Senior Product Manager @ Google')",
  "bannerMeta": "string (projected timeline, e.g. 'Projected readiness: Next 8-12 weeks')",
  "milestones": [
    {
      "title": "string (milestone title)",
      "desc": "string (milestone description)",
      "time": "Done | In progress | Next up | Scheduled",
      "tone": "mint | blue | violet | slate",
      "done": boolean
    }
  ],
  "focusAreas": [
    {
      "title": "string (focus area title)",
      "text": "string (focus area explanation)"
    }
  ]
}`;

  const model = getModel('You are a professional career growth counselor.');
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' },
  });

  const data = JSON.parse(result.response.text());
  console.log('[DEBUG] Gemini roadmap result:', data);
  return data;
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

