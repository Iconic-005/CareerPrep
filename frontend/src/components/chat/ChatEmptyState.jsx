const capabilities = [
  { icon: '📄', label: 'Resume Review', desc: 'Optimize your resume for ATS' },
  { icon: '🎯', label: 'Interview Preparation', desc: 'Mock interviews & STAR method' },
  { icon: '🗺️', label: 'Career Roadmap', desc: 'Personalized growth plans' },
  { icon: '📊', label: 'Skill Gap Analysis', desc: 'Identify areas to improve' },
  { icon: '🧠', label: 'Aptitude Preparation', desc: 'Quantitative & logical reasoning' },
  { icon: '💼', label: 'Mock Interviews', desc: 'Practice with AI feedback' },
  { icon: '📚', label: 'Learning Resources', desc: 'Curated study materials' },
];

const starterPrompts = [
  { label: 'Review my Resume', prompt: 'Review my resume and suggest improvements for a software engineering role.' },
  { label: 'Prepare for Google Interview', prompt: 'Help me prepare for a Google software engineer interview.' },
  { label: 'Find Skill Gaps', prompt: 'Analyze my skills and identify gaps for a senior developer role.' },
  { label: 'Create Study Plan', prompt: 'Create a 30-day study plan for data structures and algorithms.' },
  { label: 'Improve LinkedIn', prompt: 'Help me optimize my LinkedIn profile for tech recruiter visibility.' },
  { label: 'Practice HR Questions', prompt: 'Give me common HR interview questions with sample answers.' },
];

export function ChatEmptyState({ onSendPrompt }) {
  return (
    <div className="chat-empty">
      <div className="chat-empty__hero">
        <div className="chat-empty__wave">👋</div>
        <h2 className="chat-empty__title">Hi, I'm your Career AI Assistant</h2>
        <p className="chat-empty__subtitle">I can help you with:</p>
      </div>

      <div className="chat-empty__capabilities">
        {capabilities.map((cap) => (
          <div key={cap.label} className="chat-empty__cap-card">
            <span className="chat-empty__cap-icon">{cap.icon}</span>
            <div>
              <div className="chat-empty__cap-label">{cap.label}</div>
              <div className="chat-empty__cap-desc">{cap.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-empty__starters">
        {starterPrompts.map((s) => (
          <button
            key={s.label}
            type="button"
            className="chat-empty__starter-btn"
            onClick={() => onSendPrompt(s.prompt)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
