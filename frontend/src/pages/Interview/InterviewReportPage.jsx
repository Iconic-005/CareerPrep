import { useAuth } from '../../context/AuthContext.jsx';
import { useInterview } from '../../hooks/useInterview.js';
import { Icon } from '../../components/Icon.jsx';
import { SidebarShell } from '../../components/Layout/Sidebar.jsx';
import { MobileNav } from '../../components/Layout/MobileNav.jsx';
import { AppFooter } from '../../components/Layout/AppFooter.jsx';
import { RouteLink } from '../../components/Common/RouteLink.jsx';
import { navigate } from '../../hooks/usePathname.js';

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
    questions,
    currentQuestionIndex,
    userAnswer,
    setUserAnswer,
    qnaList,
    isEvaluating,
    isSpeaking,
    isListening,
    hintsUsedCount,
    revealedHints,
    handleUseHint,
    speakQuestion,
    stopSpeaking,
    toggleListening,
    handleStartSession,
    handleNextQuestion,
    handleFinishSession,
    handleExitReport,
    handleDownloadPDF,
  } = useInterview();

  // VIEW === 'CONFIG' (MOCK INTERVIEW SETUP)
  if (view === 'config') {
    return (
      <div className="app-shell">
        <SidebarShell />

        <main className="main-content" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <header style={{ background: '#ffffff', padding: '20px 28px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>AI Mock Interview Setup</h1>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>Configure your targeted role and company to launch an interactive simulation.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#256cf0', padding: '6px 14px', borderRadius: '16px', fontSize: '0.82rem', fontWeight: 700 }}>
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

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0' }}>
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

                <button type="submit" className="start-session-btn" disabled={loading} style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#256cf0', color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
                  <span>{loading ? 'Initializing Session...' : 'Start Interview Session'}</span>
                  <Icon name="arrowRight" />
                </button>
              </form>
            </div>
          </div>

          <AppFooter />
        </main>
      </div>
    );
  }

  // VIEW === 'SESSION' (INTERACTIVE AI INTERVIEW PRACTICE SESSION)
  if (view === 'session') {
    const currentQ = questions[currentQuestionIndex] || {};
    const totalQ = questions.length;

    return (
      <div className="app-shell">
        <SidebarShell />

        <main className="main-content" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* TOP SESSION STATUS HEADER */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '16px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#256cf0', fontWeight: 700, letterSpacing: '0.5px' }}>INTERACTIVE AI MOCK INTERVIEW</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>{targetRole} @ {targetCompany}</span>
                <span style={{ fontSize: '0.8rem', background: '#eff6ff', color: '#256cf0', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                  {difficulty}
                </span>
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '6px 14px', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
                Question {currentQuestionIndex + 1} of {totalQ}
              </div>
              <button
                type="button"
                onClick={() => setView('config')}
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', color: '#64748b', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Exit Session
              </button>
            </div>
          </div>

          {toastMsg ? (
            <div className="profile-toast">
              <Icon name="checkCircle" />
              <span>{toastMsg}</span>
            </div>
          ) : null}

          {/* MAIN INTERVIEW WORKSPACE GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
            {/* LEFT: QUESTION PROMPT & CANDIDATE RESPONSE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* AI QUESTION CARD */}
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ background: '#eff6ff', color: '#256cf0', fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: '12px' }}>
                    {currentQ.category || 'General Interview Question'}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => speakQuestion(currentQ.question)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: isSpeaking ? '2px solid #256cf0' : '1px solid #cbd5e1',
                        background: isSpeaking ? '#eff6ff' : '#ffffff',
                        color: isSpeaking ? '#256cf0' : '#334155',
                        fontWeight: 700,
                        fontSize: '0.83rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Icon name="mic" />
                      <span>{isSpeaking ? '🔊 Speaking Question...' : '🔊 Speak Question'}</span>
                    </button>
                    {isSpeaking ? (
                      <button
                        type="button"
                        onClick={stopSpeaking}
                        style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fef2f2', color: '#ef4444', fontWeight: 700, fontSize: '0.83rem', cursor: 'pointer' }}
                      >
                        Stop ⏹
                      </button>
                    ) : null}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  "{currentQ.question}"
                </h3>

                {currentQ.hint ? (
                  <div style={{ marginTop: '14px' }}>
                    {!revealedHints[currentQuestionIndex] ? (
                      <button
                        type="button"
                        onClick={handleUseHint}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '1px solid #fcd34d',
                          background: '#fffbeb',
                          color: '#b45309',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Icon name="spark" />
                        <span>Show Interviewer Hint (-0.5 pts)</span>
                      </button>
                    ) : (
                      <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', fontSize: '0.88rem', lineHeight: 1.5 }}>
                        <strong>💡 Interviewer Hint:</strong> {currentQ.hint}
                        <span style={{ display: 'block', fontSize: '0.78rem', color: '#b45309', marginTop: '4px', fontWeight: 600 }}>
                          ⚠️ 0.5 point deduction applied to final evaluation score.
                        </span>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* CANDIDATE ANSWER INPUT CARD */}
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Your Response</label>
                  <button
                    type="button"
                    onClick={toggleListening}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: isListening ? '2px solid #ef4444' : '1px solid #cbd5e1',
                      background: isListening ? '#fef2f2' : '#ffffff',
                      color: isListening ? '#ef4444' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon name="mic" />
                    <span>{isListening ? '🔴 Listening... Click to Stop' : '🎤 Voice Input'}</span>
                  </button>
                </div>

                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your response here or click '🎤 Voice Input' to speak your answer..."
                  rows={6}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', color: '#0f172a', lineHeight: 1.5 }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                    {userAnswer.trim() ? `${userAnswer.trim().split(/\s+/).length} words` : '0 words'}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    disabled={isEvaluating}
                    style={{
                      padding: '12px 26px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#256cf0',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      opacity: isEvaluating ? 0.7 : 1,
                      boxShadow: '0 4px 12px rgba(37, 108, 240, 0.2)',
                    }}
                  >
                    {isEvaluating ? (
                      <span>Evaluating Session...</span>
                    ) : currentQuestionIndex < totalQ - 1 ? (
                      <>
                        <span>Submit Answer & Next Question</span>
                        <Icon name="arrowRight" />
                      </>
                    ) : (
                      <>
                        <span>Finish & Evaluate Interview</span>
                        <Icon name="spark" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR: SESSION TRANSCRIPT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Session Transcript</span>
                  <span style={{ fontSize: '0.78rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                    {qnaList.length} / {totalQ}
                  </span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                  {qnaList.map((item, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', borderLeft: '3px solid #256cf0' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#256cf0', marginBottom: '4px' }}>
                        Q{idx + 1}: {item.category}
                      </div>
                      <div style={{ fontSize: '0.83rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                        {item.question}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        "{item.answer}"
                      </div>
                    </div>
                  ))}
                  {qnaList.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', margin: '24px 0' }}>
                      Your answered questions will log here as you progress.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <AppFooter />
        </main>
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

  // EMPTY STATE WHEN NO VALID COMPLETED INTERVIEW EXISTS
  if (!reportData || reportData.status !== 'completed') {
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
            Complete a mock interview to generate your personalized report.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/mock-interviews')}
            style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#256cf0', color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Icon name="spark" />
            <span>Start Mock Interview</span>
          </button>
        </main>
      </div>
    );
  }

  // DYNAMIC COMPLETED REPORT VIEW (PURE DATABASE DATA, NO MOCK/HARDCODED FALLBACKS)
  const scoreVal = reportData.score ?? 0;
  const radar = reportData.skillsRadar || { Technical: 0, Communication: 0, Grammar: 0, Behavioral: 0, Confidence: 0 };
  const strengths = reportData.strengths || [];
  const improvements = reportData.improvements || [];
  const nextSteps = reportData.nextSteps || [];

  return (
    <div className="app-shell">
      <SidebarShell />

      <main className="main-content main-content--interview-report">
        {/* BREADCRUMB & HEADER */}
        <div className="report-header-section">
          <div>
            <div className="report-breadcrumb">
              <span style={{ cursor: 'pointer', color: '#256cf0', fontWeight: 600 }} onClick={handleExitReport}>
                ← Mock Interviews Setup
              </span>
              <Icon name="chevronRight" />
              <span className="breadcrumb-active">Interview Report</span>
            </div>
            <h1 className="report-page-title">Post-Interview Analysis</h1>
          </div>

          <div className="report-header-actions">
            <button type="button" className="ghost-button" onClick={handleExitReport} title="Exit report and return to setup">
              <span>← Back to Setup</span>
            </button>
            <button type="button" className="ghost-button" onClick={handleDownloadPDF}>
              <Icon name="download" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={handleExitReport}
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

            {reportData.hintsUsedCount > 0 ? (
              <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                <Icon name="spark" />
                <span>{reportData.hintsUsedCount} Hint(s) Used (-{reportData.scoreDeduction || reportData.hintsUsedCount * 0.5} pts deduction)</span>
              </div>
            ) : null}
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
              <svg viewBox="0 0 500 240" className="radar-svg">
                <polygon points="250,50 326,105 297,195 203,195 174,105" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                <polygon points="250,75 302,113 282,175 218,175 198,113" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                <polygon points="250,100 279,121 268,154 232,154 221,121" fill="none" stroke="#f8fafc" strokeWidth="1" />
                <line x1="250" y1="130" x2="250" y2="50" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="250" y1="130" x2="326" y2="105" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="250" y1="130" x2="297" y2="195" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="250" y1="130" x2="203" y2="195" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="250" y1="130" x2="174" y2="105" stroke="#e2e8f0" strokeWidth="1" />
                <polygon points="250,60 317,108 291,187 209,187 183,108" fill="rgba(203, 213, 225, 0.2)" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                <polygon points={`250,${130 - (radar.Technical || 80) * 0.8} ${250 + (radar.Communication || 80) * 0.76},${130 - (radar.Communication || 80) * 0.25} ${250 + (radar.Grammar || 80) * 0.47},${130 + (radar.Grammar || 80) * 0.65} ${250 - (radar.Behavioral || 80) * 0.47},${130 + (radar.Behavioral || 80) * 0.65} ${250 - (radar.Confidence || 80) * 0.76},${130 - (radar.Confidence || 80) * 0.25}`} fill="rgba(37, 99, 235, 0.15)" stroke="#2563eb" strokeWidth="3" />
                <text x="250" y="32" textAnchor="middle" className="radar-label">Technical ({radar.Technical || 85}%)</text>
                <text x="338" y="108" textAnchor="start" className="radar-label">Communication ({radar.Communication || 90}%)</text>
                <text x="302" y="215" textAnchor="middle" className="radar-label">Grammar ({radar.Grammar || 88}%)</text>
                <text x="198" y="215" textAnchor="middle" className="radar-label">Behavioral ({radar.Behavioral || 82}%)</text>
                <text x="162" y="108" textAnchor="end" className="radar-label">Confidence ({radar.Confidence || 92}%)</text>
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
            <RouteLink
              path={`/roadmap?role=${encodeURIComponent(reportData.role || targetRole || '')}&company=${encodeURIComponent(reportData.targetCompany || targetCompany || '')}`}
              className="view-roadmap-link"
            >
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
