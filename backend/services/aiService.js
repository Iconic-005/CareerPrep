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
    model: 'gemini-2.5-flash',
    systemInstruction,
  });
}

/**
 * Handles career coaching chats with conversation history context
 */
export async function generateChatReply(history = [], userMessage) {
  console.log('[DEBUG] Outgoing user message:', userMessage);
  
  if (!genAI) {
    throw new Error('Gemini API is not configured. Please set GEMINI_API_KEY in your .env file.');
  }

  const systemInstruction = `You are CareerPrep AI, an expert career coach.
Help users with:
- Resume Review
- ATS Optimization
- Mock Interviews
- Coding Interviews
- HR Interviews
- Skill Gap Analysis
- Learning Roadmaps
- Career Planning
- LinkedIn Optimization
- Salary Negotiation
- Cover Letters

Always provide personalized, professional, and actionable responses.
Never output placeholder or template replies. Be specific, realistic, and direct.`;

  const model = getModel(systemInstruction);
  
  // Convert chat history format from backend (role: 'user'/'assistant') to Gemini format (role: 'user'/'model')
  const contents = history.map((item) => ({
    role: item.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: item.content }],
  }));

  // Append new user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  const result = await model.generateContent({ contents });
  const reply = result.response.text();

  console.log('[DEBUG] Gemini chat reply:', reply);
  return { reply, model: 'gemini-2.5-flash' };
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
  "score": "string (e.g., '82/100')",
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
  "keywordMatch": "string (e.g. '75%')",
  "atsScore": "string (e.g. '80%')",
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
