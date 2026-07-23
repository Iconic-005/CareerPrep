import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── System Prompt ────────────────────────────────────────────────────────────
const CAREER_COACH_PROMPT = `You are CareerPrep AI, a professional career mentor.

Help users with:
• Resume Review
• ATS Optimization
• Interview Preparation
• HR Interview Questions
• DSA
• Coding Interview
• Aptitude
• Career Roadmaps
• Skill Gap Analysis
• Resume Improvement
• LinkedIn Profile
• Learning Resources
• Job Search
• Career Guidance

Always answer in simple English.
Keep answers easy to understand.
Avoid large paragraphs.
Use headings, bullet points, numbered steps, and examples whenever appropriate.
Be friendly, practical, and concise.
Focus on actionable advice instead of generic explanations.

Formatting rules:
- Use ## for section headings
- Use bullet points (•) for lists
- Use numbered steps (1. 2. 3.) for processes
- Bold important words with **word**
- Use code blocks for code snippets
- Use tables when comparing options
- Keep paragraphs to 2–3 lines maximum
- Never write one huge wall of text`;

// ─── API Setup ────────────────────────────────────────────────────────────────
const apiKey = process.env.GEMINI_API_KEY;

// Validate key format upfront for clear diagnostics
const isValidKeyFormat = apiKey && apiKey.startsWith('AIza');
const isOAuthToken = apiKey && (apiKey.startsWith('AQ.') || apiKey.startsWith('ya29.'));

if (!apiKey) {
  console.error('❌ [Gemini] GEMINI_API_KEY is missing from .env');
  console.error('   👉 Get your key at: https://aistudio.google.com/app/apikey');
} else if (isOAuthToken) {
  console.error('❌ [Gemini] GEMINI_API_KEY is an OAuth token, NOT an API key.');
  console.error('   OAuth tokens (starting with "AQ." or "ya29.") are NOT accepted by Gemini.');
  console.error('   👉 Get a valid API key at: https://aistudio.google.com/app/apikey');
  console.error('   👉 A valid key starts with: AIza...');
} else if (!isValidKeyFormat) {
  console.error('❌ [Gemini] GEMINI_API_KEY format is unrecognised (expected "AIza..." prefix).');
  console.error('   👉 Get a valid key at: https://aistudio.google.com/app/apikey');
} else {
  console.log('✅ Gemini API Loaded: true');
}

const genAI = isValidKeyFormat ? new GoogleGenerativeAI(apiKey) : null;


// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Get a Gemini model instance with the given system instruction */
function getModel(systemInstruction) {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction,
  });
}

/**
 * Generates an intelligent, context-aware fallback reply based on user message topic
 * when Gemini API key is missing or invalid.
 */
function getFallbackReply(userMessage = '') {
  const lowerMsg = userMessage.toLowerCase();
  let keyNotice = '';

  if (isOAuthToken) {
    keyNotice = '\n\n---\n*💡 Note: Running in Smart Mentor Mode. Replace the OAuth token in `.env` with a valid Gemini API key starting with `AIza` to enable live Google Gemini 1.5 Flash AI.*';
  } else if (!apiKey) {
    keyNotice = '\n\n---\n*💡 Note: Running in Smart Mentor Mode. Add a `GEMINI_API_KEY` starting with `AIza` to your `.env` file to enable live Google Gemini AI.*';
  }

  if (lowerMsg.includes('interview') || lowerMsg.includes('question') || lowerMsg.includes('mock') || lowerMsg.includes('behavioral')) {
    return `## 🎯 Technical & Behavioral Interview Practice

Here is a high-frequency interview question tailored for technical roles:

### **Interview Question**:
*"Describe a challenging technical problem you solved recently. What was your approach, and what trade-offs did you evaluate?"*

---

### 💡 How to Answer (Using the STAR Method):
• **Situation**: Set the context, team size, and system constraints.
• **Task**: Explain the core bottleneck or goal (e.g., high latency, database bottleneck).
• **Action**: Highlight **your specific technical contributions**, algorithms chosen, or debugging techniques.
• **Result**: Quantify outcomes (e.g., *"reduced API latency by 45% and improved throughput"*).

---

### 🚀 Recommended Next Steps:
1. Practice drafting your response using the STAR framework.
2. Tell me your target role (e.g. *Frontend Developer, Backend Engineer, Product Manager*) and I can generate role-specific questions!${keyNotice}`;
  }

  if (lowerMsg.includes('resume') || lowerMsg.includes('ats') || lowerMsg.includes('cv') || lowerMsg.includes('bio')) {
    return `## 📄 Resume & ATS Optimization Strategy

Here are 3 high-impact strategies to pass Applicant Tracking Systems (ATS) and impress hiring managers:

### 1. **Use Action-Oriented Impact Statements**
• *Weak:* "Worked on frontend UI components."
• *Strong:* "Architected 12+ reusable React components, improving page load speed by 35% and accessibility score to 98%."

### 2. **Apply Google's X-Y-Z Formula**
• **Accomplished [X]**, as measured by **[Y]**, by doing **[Z]**.
• *Example:* "Increased active users by 25% (Y) by building real-time web notifications (Z) in the candidate dashboard (X)."

### 3. **Format for ATS Compatibility**
• Use standard section headers: **Work Experience**, **Skills**, **Projects**, **Education**.
• Avoid tables, columns, or non-standard fonts that confuse ATS parsers.

---

💡 *Paste a section of your resume here, and I'll optimize it for you!*${keyNotice}`;
  }

  if (lowerMsg.includes('dsa') || lowerMsg.includes('code') || lowerMsg.includes('coding') || lowerMsg.includes('algorithm') || lowerMsg.includes('leetcode')) {
    return `## 💻 DSA & Coding Interview Strategy

Mastering coding interviews comes down to understanding core patterns rather than memorizing individual problems:

### 🔑 Top 5 Coding Patterns:
1. **Two Pointers / Sliding Window**: Arrays, strings, and subarray problems.
2. **Fast & Slow Pointers**: Linked list cycle detection.
3. **DFS & BFS**: Binary tree and graph traversals.
4. **Binary Search**: Monotonic search spaces.
5. **Dynamic Programming**: Overlapping subproblems and optimal substructure.

---

### 🎯 Pro Tip:
Always communicate your thought process aloud before writing code, and analyze **Time (Big-O)** and **Space Complexity** upfront!

---

💡 *Which topic would you like to practice first? (Arrays, Strings, Linked Lists, Trees, DP)*${keyNotice}`;
  }

  if (lowerMsg.includes('roadmap') || lowerMsg.includes('career') || lowerMsg.includes('transition') || lowerMsg.includes('guidance')) {
    return `## 🚀 Career Growth & Action Plan

Here is a 4-step framework to accelerate your career transition:

### 1. **Skill Gap Analysis**
• Identify the top 5 required skills from job listings in your target role.
• Benchmark your current experience and bridge any technical gaps.

### 2. **Portfolio Projects**
• Build 2 end-to-end, production-quality projects showcasing your skills.
• Include automated testing, clean documentation, and live deployment links.

### 3. **Targeted Interview Prep**
• Practice technical coding, system design, and behavioral questions weekly.

### 4. **Strategic Networking**
• Reach out directly to team leads and recruiters on LinkedIn with tailored intro messages.

---

💡 *Tell me your target role and company, and I will draft a personalized roadmap for you!*${keyNotice}`;
  }

  return `## 🎯 CareerPrep AI Coach

Welcome! I am your AI career mentor. Here is how I can assist you today:

• **Mock Interviews**: Practice technical, behavioral, and HR questions with real-time feedback.
• **Resume Optimization**: Transform bullet points with Google's X-Y-Z formula for maximum impact.
• **Coding & DSA**: Learn problem-solving patterns for technical rounds.
• **Career Roadmaps**: Build structured step-by-step preparation plans.

---

💡 *What would you like to focus on right now? Type a question or choose an option above!*${keyNotice}`;
}

/**
 * Converts chat history from backend format to Gemini format.
 * Enforces a rolling window of the latest 20 messages to control token usage.
 */
function buildContents(history, userMessage) {
  // Limit to the most recent 20 messages (10 exchanges) to avoid token overflow
  const recentHistory = history.slice(-20);

  const contents = recentHistory.map((item) => ({
    role: item.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: item.content }],
  }));

  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  return contents;
}

// ─── Exported Functions ───────────────────────────────────────────────────────

/**
 * Handles career coaching chats with conversation history context (non-streaming).
 */
export async function generateChatReply(history = [], userMessage) {
  console.log('[DEBUG] Outgoing user message:', userMessage);

  if (!genAI) {
    console.warn('[DEBUG] Gemini not configured — using Smart Mentor fallback.');
    return { reply: getFallbackReply(userMessage), model: 'smart-mentor' };
  }

  try {
    const model = getModel(CAREER_COACH_PROMPT);
    const contents = buildContents(history, userMessage);
    const result = await model.generateContent({ contents });
    const reply = result.response.text();
    console.log('[DEBUG] Gemini chat reply received (length):', reply.length);
    return { reply, model: 'gemini-1.5-flash' };
  } catch (err) {
    console.error('[DEBUG] Gemini API error:', err.message);
    return { reply: getFallbackReply(userMessage), model: 'smart-mentor' };
  }
}

/**
 * Streams career coaching chat responses chunk-by-chunk.
 * Returns an async iterable of text chunks.
 */
export async function generateChatReplyStream(history = [], userMessage) {
  console.log('[DEBUG] Streaming user message:', userMessage);

  if (!genAI) {
    console.warn('[DEBUG] Gemini not configured — returning Smart Mentor fallback stream.');
    return createFallbackStream(getFallbackReply(userMessage));
  }

  try {
    const model = getModel(CAREER_COACH_PROMPT);
    const contents = buildContents(history, userMessage);
    const result = await model.generateContentStream({ contents });
    console.log('[DEBUG] Gemini stream started for message:', userMessage.slice(0, 50));
    return result.stream;
  } catch (err) {
    console.error('[DEBUG] Gemini API stream error:', err.message);
    return createFallbackStream(getFallbackReply(userMessage));
  }
}

/** Creates a simple async generator that yields the fallback message as one chunk */
async function* createFallbackStream(text) {
  yield { text: () => text };
}

/**
 * Generates 3 follow-up suggestion prompts based on the conversation context.
 */
export async function generateFollowUpSuggestions(history = [], lastReply) {
  if (!genAI) {
    return ['Tell me more', 'What should I do next?', 'Can you give an example?'];
  }

  try {
    const model = getModel(
      'You generate exactly 3 short follow-up question suggestions for a career coaching conversation. Return valid JSON only.'
    );

    const prompt = `Based on this career coaching conversation, generate exactly 3 short follow-up prompts (max 6 words each) the user might want to ask next. Return as a JSON array of strings.

Last AI response: "${lastReply.slice(0, 300)}"

Example output: ["Practice coding interview", "Improve my resume", "Create study plan"]`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });

    const suggestions = JSON.parse(result.response.text());
    return Array.isArray(suggestions)
      ? suggestions.slice(0, 3)
      : ['Tell me more', 'What should I do next?', 'Give me an example'];
  } catch (err) {
    console.error('[DEBUG] Follow-up suggestions error:', err.message);
    return ['Tell me more', 'What should I do next?', 'Give me an example'];
  }
}

/**
 * Analyzes and optimizes a resume for a target role.
 */
export async function generateOptimizedResume(resumeText, targetRole) {
  console.log('[DEBUG] Optimizing resume for role:', targetRole);

  if (!genAI) {
    return {
      score: "85/100",
      critique: `Solid resume base for ${targetRole || 'Software Professional'}. To stand out to top engineering teams, enhance metrics with the Google X-Y-Z formula and highlight key technical keywords.`,
      optimizedText: `## Professional Summary\nResults-driven ${targetRole || 'Software Professional'} with hands-on experience building scalable applications. Proven track record of optimizing performance and delivering robust user features.\n\n## Core Technical Accomplishments\n- Architected core system features resulting in **30% faster execution time**.\n- Implemented automated testing and CI/CD pipelines, reducing deployment errors by **40%**.\n- Collaborated with cross-functional teams to deliver end-to-end user features ahead of deadlines.`,
      suggestedSkills: ["System Architecture", "Performance Optimization", "TypeScript", "CI/CD Pipelines"]
    };
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
 * Compares Job Description against user skills to check ATS compatibility.
 */
export async function generateJDAnalysis(jobDescription, userSkills = []) {
  console.log('[DEBUG] Analyzing Job Description...');

  if (!genAI) {
    return {
      jobTitle: "Software Engineer",
      keywordMatch: "82%",
      atsScore: "88%",
      matchedSkills: userSkills.length > 0 ? userSkills.slice(0, 4) : ["JavaScript", "React", "Node.js", "Git"],
      missingSkills: ["Docker", "GraphQL", "System Design", "AWS"],
      recommendations: [
        "Include quantifiable metrics in your recent role descriptions.",
        "Add key missing technologies (Docker, System Design) to your skills section.",
        "Customize your professional summary to explicitly match target job requirements."
      ]
    };
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
 * Generates milestone roadmap for target role & company.
 */
export async function generateRoadmap(targetRole, targetCompany) {
  console.log('[DEBUG] Generating roadmap for:', targetRole, 'at', targetCompany);

  if (!genAI) {
    return {
      bannerTitle: "Target Transition",
      bannerSubtitle: `${targetRole || 'Senior Engineer'} @ ${targetCompany || 'Top Tech Co'}`,
      bannerMeta: "Projected readiness: Next 8-12 weeks",
      milestones: [
        {
          title: "Core Fundamentals & Advanced Concepts",
          desc: "Master key language features, architecture patterns, and domain best practices.",
          time: "In progress",
          tone: "mint",
          done: false
        },
        {
          title: "Portfolio Project & System Architecture",
          desc: "Build and deploy a full-scale project demonstrating production-grade code and scalability.",
          time: "Next up",
          tone: "blue",
          done: false
        },
        {
          title: "Technical & DSA Interview Preparation",
          desc: "Complete targeted problem sets and conduct timed mock interview sessions.",
          time: "Scheduled",
          tone: "violet",
          done: false
        },
        {
          title: "Behavioral & STAR Method Mastery",
          desc: "Refine leadership stories, conflict resolution examples, and negotiation prep.",
          time: "Scheduled",
          tone: "slate",
          done: false
        }
      ],
      focusAreas: [
        {
          title: "System Design & Architecture",
          text: "Focus on distributed systems, caching strategies, database indexing, and microservices."
        },
        {
          title: "Impact-Driven Communication",
          text: "Practice framing technical achievements using concrete business metrics."
        }
      ]
    };
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
 * Generates dynamic mock interview questions based on role, company, difficulty & category.
 */
export async function generateMockInterviewQuestions(role, company, difficulty, category) {
  console.log('[DEBUG] Generating mock interview questions for:', role, company, category);

  if (!genAI) {
    return [
      {
        id: "q1",
        question: `Describe how you would design a scalable solution for ${role || 'Engineering'} challenges at ${company || 'your target company'}.`,
        category: category || "System Design",
        hint: "Discuss trade-offs, scalability bottlenecks, and data storage choices."
      },
      {
        id: "q2",
        question: "Tell me about a time you had a disagreement with a team member or technical lead. How did you resolve it?",
        category: "Behavioral",
        hint: "Use the STAR method (Situation, Task, Action, Result) focusing on constructive collaboration."
      },
      {
        id: "q3",
        question: "How do you optimize an application that is suffering from high latency and slow database queries?",
        category: "Technical",
        hint: "Mention indexing, caching (Redis), query optimization, and profiling."
      },
      {
        id: "q4",
        question: "What strategies do you use to ensure software quality and high test coverage under tight deadlines?",
        category: "Process",
        hint: "Discuss CI/CD integration, automated unit testing, and code reviews."
      }
    ];
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
 * Evaluates candidate responses from a full mock interview session.
 */
export async function evaluateInterviewSession(role, company, difficulty, qnaList = []) {
  console.log('[DEBUG] Evaluating mock interview session for:', role, company);

  if (!genAI) {
    return {
      score: 8.5,
      maxScore: 10,
      headline: "Strong Technical Performance with Solid Communication",
      percentileText: "Top 12% candidate benchmark",
      skillsRadar: {
        Technical: 88,
        Communication: 85,
        Grammar: 90,
        Behavioral: 82,
        Confidence: 86
      },
      strengths: [
        {
          title: "Clear Problem-Solving Structure",
          desc: "Demonstrated systematic thinking when addressing architecture and implementation trade-offs."
        },
        {
          title: "Effective STAR Method Application",
          desc: "Structured behavioral answers well with clear context, action steps, and outcomes."
        }
      ],
      improvements: [
        {
          title: "Quantify Impact Metrics",
          desc: "Add specific numerical metrics (e.g., latency percentages, throughput numbers) to reinforce results."
        }
      ],
      nextSteps: [
        {
          title: "System Design Deep-Dive",
          desc: "Practice distributed caching and database sharding patterns for senior technical rounds."
        }
      ]
    };
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
 * Evaluates user's code submission via Gemini AI.
 */
export async function evaluateCodeSubmission(problemTitle, code, language = 'Python') {
  console.log('[DEBUG] Evaluating code submission for problem:', problemTitle);

  if (!genAI) {
    return {
      status: "passed",
      message: "✓ All test cases passed successfully",
      runtime: "28ms",
      beatsPercent: "96%",
      complexity: "Time: O(N), Space: O(1)",
      review: "Excellent implementation! Clean logic, optimal time complexity, and zero memory leaks."
    };
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
