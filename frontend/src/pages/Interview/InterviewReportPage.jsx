import { useAuth } from '../../context/AuthContext.jsx';
import { useInterview } from '../../hooks/useInterview.js';
import { Icon } from '../../components/Icon.jsx';
import { SidebarShell } from '../../components/Layout/Sidebar.jsx';
import { MobileNav } from '../../components/Layout/MobileNav.jsx';
import { AppFooter } from '../../components/Layout/AppFooter.jsx';
import { RouteLink } from '../../components/Common/RouteLink.jsx';

export default function InterviewReportPage() {
  const { user } = useAuth();
  const {
    view, setView,
    targetCompany, setTargetCompany,
    targetRole, setTargetRole,
    difficulty, setDifficulty,
    toastMsg,
    handleStartSession,
    handleDownloadPDF,
  } = useInterview();

  const avatarUrl = user?.avatarUrl || '/images/alex_thompson.png';
  const userName = user?.name || 'Alex Thompson';

  if (view === 'config') {
    return (
      <div className="interview-config-wrapper">
        {/* TOP CONFIG HEADER */}
        <header className="config-header-bar">
          <div className="config-header-brand header-brand-container">
            <img src="/logo.png" alt="CareerPrep Logo" className="brand-logo-img" />
            <div>
              <h1 className="brand-header-logo">CareerPrep</h1>
              <span className="config-header-sub">Mock Interview Session</span>
            </div>
          </div>

          <div className="privacy-badge-chip">
            <Icon name="shieldCheck" />
            <span>Privacy Mode On</span>
          </div>
        </header>

        {toastMsg ? (
          <div className="profile-toast">
            <Icon name="checkCircle" />
            <span>{toastMsg}</span>
          </div>
        ) : null}

        {/* CENTERED INTERVIEW CONFIGURATION CARD */}
        <main className="config-centered-main">
          <div className="interview-config-card">
            <h2>Interview Configuration</h2>
            <p className="config-subtitle">Set your preferences to start an AI-powered simulation.</p>

            <form onSubmit={handleStartSession} className="config-form">
              <div className="config-form-grid">
                <label className="config-field">
                  <div className="field-label-row">
                    <Icon name="building" />
                    <span>Target Company</span>
                  </div>
                  <div className="select-dropdown-wrap">
                    <select
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      className="config-select-input"
                    >
                      <option value="Google">Google</option>
                      <option value="Meta">Meta</option>
                      <option value="Apple">Apple</option>
                      <option value="Stripe">Stripe</option>
                      <option value="Amazon">Amazon</option>
                      <option value="Microsoft">Microsoft</option>
                    </select>
                  </div>
                </label>

                <label className="config-field">
                  <div className="field-label-row">
                    <Icon name="user" />
                    <span>Role</span>
                  </div>
                  <div className="select-dropdown-wrap">
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="config-select-input"
                    >
                      <option value="Product Manager">Product Manager</option>
                      <option value="Senior Product Designer">Senior Product Designer</option>
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Data Scientist">Data Scientist</option>
                    </select>
                  </div>
                </label>
              </div>

              <div className="difficulty-selection-box">
                <label className="field-label-row">Difficulty Level</label>
                <div className="difficulty-btn-group">
                  {['Entry', 'Mid-Level', 'Senior/Staff'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`difficulty-level-btn ${difficulty === level ? 'difficulty-level-btn--active' : ''}`}
                      onClick={() => setDifficulty(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="start-session-btn">
                <span>Start Interview Session</span>
                <Icon name="arrowRight" />
              </button>
            </form>
          </div>
        </main>

        <AppFooter />
      </div>
    );
  }

  // VIEW === 'REPORT'
  return (
    <div className="app-shell">
      <SidebarShell />

      <main className="main-content main-content--interview-report">
        {/* BREADCRUMB & HEADER */}
        <div className="report-header-section">
          <div>
            <div className="report-breadcrumb">
              <span>Mock Interviews</span>
              <Icon name="chevronRight" />
              <span className="breadcrumb-active">Interview Report</span>
            </div>
            <h1 className="report-page-title">Post-Interview Analysis</h1>
          </div>

          <div className="report-header-actions">
            <button type="button" className="ghost-button" onClick={handleDownloadPDF}>
              <Icon name="download" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => setView('config')}
            >
              <Icon name="refresh" />
              <span>Retake Interview</span>
            </button>
          </div>
        </div>

        {toastMsg ? (
          <div className="profile-toast">
            <Icon name="checkCircle" />
            <span>{toastMsg}</span>
          </div>
        ) : null}

        {/* TOP ROW: SCORE CARD & SKILL RADAR CHART */}
        <div className="report-top-grid">
          {/* LEFT SCORE CARD */}
          <div className="report-score-card">
            <div className="score-circle-outer">
              <svg viewBox="0 0 36 36" className="score-gauge-svg">
                <path
                  className="score-gauge-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="score-gauge-fill"
                  strokeDasharray="85, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="score-center-text">
                <strong className="score-value">8.5</strong>
                <span className="score-max">OUT OF 10</span>
              </div>
              <div className="gold-medal-badge" title="Top Performer">
                <Icon name="trophy" />
              </div>
            </div>

            <h3 className="score-headline">Excellent Performance!</h3>
            <p className="score-percentile-desc">
              You are in the top 5% of candidates for Senior Product Designer roles.
            </p>
          </div>

          {/* RIGHT SKILL DISTRIBUTION RADAR CHART CARD */}
          <div className="report-radar-card">
            <div className="radar-header">
              <div>
                <h3>Skill Distribution</h3>
                <p>Detailed breakdown of your interview core competencies.</p>
              </div>
              <div className="radar-legend">
                <span className="legend-item"><span className="legend-dot legend-dot--actual" /> Actual</span>
                <span className="legend-item"><span className="legend-dot legend-dot--target" /> Target</span>
              </div>
            </div>

            {/* SVG RADAR CHART */}
            <div className="radar-chart-container">
              <svg viewBox="0 0 300 260" className="radar-svg">
                <polygon points="150,30 245,99 209,210 91,210 55,99" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                <polygon points="150,60 216,108 191,186 109,186 84,108" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                <polygon points="150,90 187,117 173,162 127,162 113,117" fill="none" stroke="#f8fafc" strokeWidth="1" />
                <line x1="150" y1="130" x2="150" y2="30" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="150" y1="130" x2="245" y2="99" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="150" y1="130" x2="209" y2="210" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="150" y1="130" x2="91" y2="210" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="150" y1="130" x2="55" y2="99" stroke="#e2e8f0" strokeWidth="1" />
                <polygon points="150,45 230,105 198,198 102,198 70,105" fill="rgba(203, 213, 225, 0.2)" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                <polygon points="150,50 235,112 195,190 98,195 62,108" fill="rgba(37, 99, 235, 0.15)" stroke="#2563eb" strokeWidth="3" />
                <text x="150" y="18" textAnchor="middle" className="radar-label">Technical</text>
                <text x="255" y="103" textAnchor="start" className="radar-label">Communication</text>
                <text x="214" y="226" textAnchor="middle" className="radar-label">Grammar</text>
                <text x="86" y="226" textAnchor="middle" className="radar-label">Behavioral</text>
                <text x="45" y="103" textAnchor="end" className="radar-label">Confidence</text>
              </svg>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: KEY STRENGTHS & AREAS FOR IMPROVEMENT */}
        <div className="report-middle-grid">
          <div className="feedback-card feedback-card--strengths">
            <div className="feedback-card-header">
              <div className="feedback-icon-badge feedback-icon-badge--green">
                <Icon name="checkCircle" />
              </div>
              <h3>Key Strengths</h3>
            </div>

            <div className="feedback-list">
              <div className="feedback-bullet">
                <div className="bullet-check-icon"><Icon name="check" /></div>
                <div>
                  <strong>Strong Domain Expertise</strong>
                  <p>Your technical explanation of React hooks and system design was precise and architectural.</p>
                </div>
              </div>
              <div className="feedback-bullet">
                <div className="bullet-check-icon"><Icon name="check" /></div>
                <div>
                  <strong>Natural Confidence</strong>
                  <p>Maintained steady eye contact and had very few filler words during the 45-minute session.</p>
                </div>
              </div>
              <div className="feedback-bullet">
                <div className="bullet-check-icon"><Icon name="check" /></div>
                <div>
                  <strong>Structured Storytelling</strong>
                  <p>Successfully used the STAR method for behavioral questions regarding team conflicts.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="feedback-card feedback-card--improvements">
            <div className="feedback-card-header">
              <div className="feedback-icon-badge feedback-icon-badge--amber">
                <Icon name="alertCircle" />
              </div>
              <h3>Areas for Improvement</h3>
            </div>

            <div className="improvement-boxes-list">
              <div className="improvement-box">
                <strong>Elaborate on Trade-offs</strong>
                <p>When discussing the database choice, you jumped to the solution too fast. Mention 1-2 alternatives next time.</p>
              </div>
              <div className="improvement-box">
                <strong>Grammar Consistency</strong>
                <p>Small slip-ups with subject-verb agreement when talking under pressure about previous project timelines.</p>
              </div>
              <div className="improvement-box">
                <strong>Clarifying Questions</strong>
                <p>Try asking more "Why" questions about the constraints before diving into the whiteboard design phase.</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: NEXT STEPS FOR MASTERY */}
        <div className="report-next-steps-section">
          <div className="next-steps-header">
            <h3>Next Steps for Mastery</h3>
            <RouteLink path="/roadmap" className="view-roadmap-link">
              <span>View Practice Roadmap</span>
            </RouteLink>
          </div>

          <div className="next-steps-grid">
            <div className="practice-q-card">
              <div className="q-card-icon-badge"><Icon name="chat" /></div>
              <h5>Practice Question 01</h5>
              <p>"How do you handle scope creep when working with multiple high-priority stakeholders?"</p>
            </div>
            <div className="practice-q-card">
              <div className="q-card-icon-badge"><Icon name="gearSpark" /></div>
              <h5>Practice Question 02</h5>
              <p>"Explain the concept of 'Consistency vs Availability' in distributed systems to a non-technical manager."</p>
            </div>
            <div className="practice-q-card">
              <div className="q-card-icon-badge"><Icon name="users" /></div>
              <h5>Practice Question 03</h5>
              <p>"Describe a time you had to deliver critical feedback to a senior peer who was underperforming."</p>
            </div>
          </div>
        </div>

        <AppFooter />
      </main>
    </div>
  );
}
