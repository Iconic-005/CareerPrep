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
    loading,
    reportData,
    view, setView,
    targetCompany, setTargetCompany,
    targetRole, setTargetRole,
    difficulty, setDifficulty,
    toastMsg,
    handleStartSession,
    handleDownloadPDF,
  } = useInterview();

  if (view === 'config') {
    return (
      <div className="interview-config-wrapper" style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* TOP CONFIG HEADER */}
        <header className="config-header-bar" style={{ padding: '16px 32px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="config-header-brand header-brand-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div>
              <h1 className="brand-header-logo" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>CareerPrep</h1>
              <span className="config-header-sub" style={{ fontSize: '0.8rem', color: '#64748b' }}>Mock Interview Setup</span>
            </div>
          </div>

          <div className="privacy-badge-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#256cf0', padding: '6px 12px', borderRadius: '16px', fontSize: '0.82rem', fontWeight: 600 }}>
            <Icon name="shieldCheck" />
            <span>AI Simulation Ready</span>
          </div>
        </header>

        {toastMsg ? (
          <div className="profile-toast">
            <Icon name="checkCircle" />
            <span>{toastMsg}</span>
          </div>
        ) : null}

        {/* CENTERED INTERVIEW CONFIGURATION CARD */}
        <main className="config-centered-main" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
          <div className="interview-config-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', maxWidth: '520px', width: '100%', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>Interview Configuration</h2>
            <p className="config-subtitle" style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 24px 0' }}>
              Set your preferences to start an AI-powered simulation.
            </p>

            <form onSubmit={handleStartSession} className="config-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="config-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label className="config-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="field-label-row" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon name="building" />
                    <span>Target Company</span>
                  </div>
                  <select
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="config-select-input"
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  >
                    <option value="Google">Google</option>
                    <option value="Meta">Meta</option>
                    <option value="Apple">Apple</option>
                    <option value="Stripe">Stripe</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Microsoft">Microsoft</option>
                  </select>
                </label>

                <label className="config-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="field-label-row" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon name="user" />
                    <span>Role</span>
                  </div>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="config-select-input"
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  >
                    <option value="Product Manager">Product Manager</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Cyber Security Analyst">Cyber Security Analyst</option>
                  </select>
                </label>
              </div>

              <div className="difficulty-selection-box" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="field-label-row" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Difficulty Level</label>
                <div className="difficulty-btn-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {['Entry', 'Mid-Level', 'Senior/Staff'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`difficulty-level-btn ${difficulty === level ? 'difficulty-level-btn--active' : ''}`}
                      onClick={() => setDifficulty(level)}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: difficulty === level ? '2px solid #256cf0' : '1px solid #cbd5e1',
                        background: difficulty === level ? '#eff6ff' : '#ffffff',
                        color: difficulty === level ? '#256cf0' : '#475569',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="start-session-btn" style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#256cf0', color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
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
  if (loading) {
    return (
      <div className="app-shell">
        <SidebarShell />
        <main className="main-content" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          Loading your interview report...
        </main>
      </div>
    );
  }

  // EMPTY STATE WHEN NO COMPLETED INTERVIEW EXISTS
  if (!reportData) {
    return (
      <div className="app-shell">
        <SidebarShell />
        <main className="main-content main-content--interview-report" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
          <div style={{ background: '#eff6ff', color: '#256cf0', width: '64px', height: '64px', borderRadius: '50%', display: 'grid', placeItems: 'center', marginBottom: '20px' }}>
            <Icon name="chat" />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
            No Interview Report Available
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '420px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
            Complete a mock interview to generate your personalized AI analysis report and skill distribution breakdown.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => setView('config')}
            style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#256cf0', color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Icon name="spark" />
            <span>Start Mock Interview</span>
          </button>
        </main>
      </div>
    );
  }

  // DYNAMIC COMPLETED REPORT VIEW
  const scoreVal = reportData.score || 8.5;
  const radar = reportData.skillsRadar || { Technical: 85, Communication: 90, Grammar: 88, Behavioral: 82, Confidence: 92 };
  const strengths = reportData.strengths || [
    { title: 'Strong Technical Depth', desc: 'Demonstrated solid grasp of core engineering principles.' },
    { title: 'Structured Storytelling', desc: 'Effectively used the STAR method during behavioral scenarios.' },
  ];
  const improvements = reportData.improvements || [
    { title: 'Elaborate on Trade-offs', desc: 'Discuss alternative architectural choices before deciding.' },
    { title: 'Clarifying Questions', desc: 'Ask more questions about system constraints upfront.' },
  ];
  const nextSteps = reportData.nextSteps || [
    { title: 'Practice System Design', text: 'Review distributed caching and load balancing concepts.' },
    { title: 'Behavioral Drills', text: 'Refine conflict resolution anecdotes.' },
  ];

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
                  strokeDasharray={`${Math.round(scoreVal * 10)}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="score-center-text">
                <strong className="score-value">{scoreVal}</strong>
                <span className="score-max">OUT OF 10</span>
              </div>
              <div className="gold-medal-badge" title="Top Performer">
                <Icon name="trophy" />
              </div>
            </div>

            <h3 className="score-headline">{reportData.headline || 'Excellent Performance!'}</h3>
            <p className="score-percentile-desc">
              {reportData.percentileText || `Top performance candidate for ${targetRole} roles.`}
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
                <polygon points={`150,${130 - (radar.Technical || 80) * 0.9} ${150 + (radar.Communication || 80) * 0.95},${130 - (radar.Communication || 80) * 0.3} ${150 + (radar.Grammar || 80) * 0.6},${130 + (radar.Grammar || 80) * 0.8} ${150 - (radar.Behavioral || 80) * 0.6},${130 + (radar.Behavioral || 80) * 0.8} ${150 - (radar.Confidence || 80) * 0.95},${130 - (radar.Confidence || 80) * 0.3}`} fill="rgba(37, 99, 235, 0.15)" stroke="#2563eb" strokeWidth="3" />
                <text x="150" y="18" textAnchor="middle" className="radar-label">Technical ({radar.Technical || 85}%)</text>
                <text x="255" y="103" textAnchor="start" className="radar-label">Comm ({radar.Communication || 90}%)</text>
                <text x="214" y="226" textAnchor="middle" className="radar-label">Grammar ({radar.Grammar || 88}%)</text>
                <text x="86" y="226" textAnchor="middle" className="radar-label">Behavioral ({radar.Behavioral || 82}%)</text>
                <text x="45" y="103" textAnchor="end" className="radar-label">Confidence ({radar.Confidence || 92}%)</text>
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
              {strengths.map((item, idx) => (
                <div key={idx} className="feedback-bullet">
                  <div className="bullet-check-icon"><Icon name="check" /></div>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
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
              {improvements.map((item, idx) => (
                <div key={idx} className="improvement-box">
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              ))}
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
            {nextSteps.map((step, idx) => (
              <div key={idx} className="practice-q-card">
                <div className="q-card-icon-badge"><Icon name="chat" /></div>
                <h5>{step.title}</h5>
                <p>"{step.text}"</p>
              </div>
            ))}
          </div>
        </div>

        <AppFooter />
      </main>
    </div>
  );
}
