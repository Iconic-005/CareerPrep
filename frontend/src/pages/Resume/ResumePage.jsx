import { useAuth } from '../../context/AuthContext.jsx';
import { useResume } from '../../hooks/useResume.js';
import { Icon } from '../../components/Icon.jsx';
import { SidebarShell } from '../../components/Layout/Sidebar.jsx';
import { MobileNav } from '../../components/Layout/MobileNav.jsx';

export default function ResumePage() {
  const { user } = useAuth();
  const {
    selectedVersion,
    setSelectedVersion,
    isOptimizing,
    showVersionModal,
    setShowVersionModal,
    isEditMode,
    setIsEditMode,
    candidateName,
    setCandidateName,
    candidateRole,
    setCandidateRole,
    candidateEmail,
    setCandidateEmail,
    candidatePhone,
    setCandidatePhone,
    candidateLocation,
    setCandidateLocation,
    resumeText,
    setResumeText,
    addedSkills,
    setAddedSkills,
    hasProjectsSection,
    setHasProjectsSection,
    missingSkills,
    suggestions,
    atsScore,
    skillMatchScore,
    aiCritique,
    optimizedBullets,
    saveResumeToDb,
    handleGenerate,
    handleDismissSuggestion,
    handleApplySuggestion,
    handleDownload,
    versionHistory,
  } = useResume(user);

  return (
    <div className="app-shell">
      <SidebarShell />

      <main className="main-content--resume">
        {/* TOP RESUME BAR */}
        <div className="resume-top-nav">
          <div className="resume-top-left">
            <h1 className="resume-title-heading">Resume Builder &amp; AI Optimizer</h1>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                className="resume-version-dropdown-btn"
              >
                <option value="Active Resume (AI Polished)">Active Resume (AI Polished)</option>
                <option value="Target Role Draft_v1.pdf">Target Role Draft_v1.pdf</option>
              </select>
            </div>
          </div>

          <div className="resume-top-actions">
            <button
              type="button"
              className="btn-outline-secondary"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              <Icon name="edit" />
              <span>{isEditMode ? 'Done Editing' : 'Edit Contact & Role'}</span>
            </button>
            <button
              type="button"
              className="btn-outline-secondary"
              onClick={() => setShowVersionModal(true)}
            >
              <Icon name="history" />
              <span>Versions</span>
            </button>
            <button type="button" className="btn-outline-secondary" onClick={handleDownload}>
              <Icon name="download" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              className="btn-primary-spark"
              onClick={handleGenerate}
              disabled={isOptimizing}
            >
              <Icon name="spark" />
              <span>{isOptimizing ? 'Optimizing with Gemini AI...' : 'Optimize Resume with AI'}</span>
            </button>
          </div>
        </div>

        {/* RESUME GRID WORKSPACE */}
        <div className="resume-grid-container">
          {/* CENTER PREVIEW DOCUMENT STAGE */}
          <div className="resume-paper-wrapper">
            {/* CANDIDATE HEADER */}
            {isEditMode ? (
              <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Candidate Name"
                  style={{ fontSize: '1.5rem', fontWeight: 800, padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <input
                  type="text"
                  value={candidateRole}
                  onChange={(e) => setCandidateRole(e.target.value)}
                  placeholder="Target Role / Professional Title"
                  style={{ fontSize: '1rem', fontWeight: 600, color: '#256cf0', padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="Email"
                    style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                  <input
                    type="text"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    placeholder="Phone"
                    style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                  <input
                    type="text"
                    value={candidateLocation}
                    onChange={(e) => setCandidateLocation(e.target.value)}
                    placeholder="Location"
                    style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="resume-candidate-name">{candidateName || 'Candidate Profile'}</h2>
                <p className="resume-candidate-role">{candidateRole || 'Software Professional'}</p>

                <div className="resume-contact-row">
                  <span className="resume-contact-item">
                    <Icon name="mail" />
                    <span>{candidateEmail}</span>
                  </span>
                  <span className="resume-contact-item">
                    <Icon name="phone" />
                    <span>{candidatePhone}</span>
                  </span>
                  <span className="resume-contact-item">
                    <Icon name="mapPin" />
                    <span>{candidateLocation}</span>
                  </span>
                </div>
              </>
            )}

            <hr className="resume-header-line" />

            {/* RESUME INPUT & EXPERIENCE TEXT AREA */}
            <div className="resume-section-heading">RESUME CONTENT &amp; EXPERIENCE BULLETS</div>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              onBlur={() => saveResumeToDb({ resumeText })}
              placeholder="Paste or type your resume experience and achievements here..."
              rows="6"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                marginBottom: '16px',
                resize: 'vertical',
              }}
            />

            {/* AI GEMINI OPTIMIZED TEXT & CRITIQUE */}
            {aiCritique && (
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #7c3aed', marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#6b21a8' }}>AI Resume Critique:</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>{aiCritique}</p>
              </div>
            )}

            {optimizedBullets && (
              <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #16a34a', marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#15803d' }}>Gemini X-Y-Z Optimized Section:</h4>
                <pre style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#166534' }}>{optimizedBullets}</pre>
              </div>
            )}

            {/* ADDED SKILLS */}
            {addedSkills.length > 0 && (
              <>
                <div className="resume-section-heading">ADDITIONAL SKILLS</div>
                <p style={{ fontSize: '0.9rem', color: '#334155', margin: '0 0 1rem 0' }}>
                  {addedSkills.join(' • ')}
                </p>
              </>
            )}

            {/* PROJECTS SECTION */}
            {hasProjectsSection && (
              <>
                <div className="resume-section-heading">KEY PROJECTS</div>
                <div className="resume-job-item">
                  <div className="resume-job-row">
                    <span className="resume-company-name">CareerPrep AI Suite</span>
                    <span className="resume-job-date">2024</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0.25rem 0' }}>
                    Full-stack AI Career OS built with React, Node.js, Express, MongoDB, and Gemini AI.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* RIGHT ANALYSIS & INSIGHTS PANEL */}
          <div className="resume-sidebar-panel">
            {/* RESUME ANALYSIS / SCORES */}
            <div className="resume-widget-card">
              <h3 className="widget-title">Live Resume Scores</h3>
              <div className="score-gauges-row">
                {/* ATS SCORE */}
                <div className="score-gauge-card">
                  <div className="circle-gauge">
                    <svg viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="3.2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#256cf0"
                        strokeWidth="3.2"
                        strokeDasharray={`${atsScore}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="circle-gauge-val">{atsScore}</span>
                  </div>
                  <span className="score-gauge-label">ATS Score</span>
                </div>

                {/* SKILL MATCH */}
                <div className="score-gauge-card">
                  <div className="circle-gauge">
                    <svg viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="3.2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#7c3aed"
                        strokeWidth="3.2"
                        strokeDasharray={`${skillMatchScore}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="circle-gauge-val">{skillMatchScore}%</span>
                  </div>
                  <span className="score-gauge-label">Skill Match</span>
                </div>
              </div>
            </div>

            {/* MISSING SKILLS */}
            <div className="resume-widget-card">
              <div className="widget-label-sm">RECOMMENDED SKILLS</div>
              {missingSkills.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#16a34a', margin: 0, fontWeight: 600 }}>✓ All target skills added!</p>
              ) : (
                <div className="skill-pills-wrap">
                  {missingSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className="skill-pill-btn"
                      onClick={() => setAddedSkills((prev) => [...prev, skill])}
                    >
                      <span>+</span>
                      <span>{skill}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* MISSING SECTIONS */}
            <div className="resume-widget-card">
              <div className="widget-label-sm">MISSING SECTIONS</div>
              {hasProjectsSection ? (
                <p style={{ fontSize: '0.85rem', color: '#16a34a', margin: 0, fontWeight: 600 }}>✓ Key Projects section added!</p>
              ) : (
                <div className="missing-section-card" onClick={() => setHasProjectsSection(true)}>
                  <div className="missing-section-left">
                    <Icon name="folder" />
                    <span>Projects Section</span>
                  </div>
                  <Icon name="plus" />
                </div>
              )}
            </div>

            {/* AI SUGGESTIONS */}
            <div className="resume-widget-card">
              <div className="ai-header-row">
                <div className="widget-label-sm" style={{ margin: 0 }}>AI SUGGESTIONS</div>
                {suggestions.length > 0 && (
                  <span className="badge-new-chip">{suggestions.length} NEW</span>
                )}
              </div>

              {suggestions.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  No active suggestions. Click "Optimize Resume with AI" for fresh insights.
                </p>
              ) : (
                suggestions.map((item) => (
                  <div key={item.id} className="ai-suggestion-card">
                    <div className="ai-suggestion-body">
                      <div className={`ai-icon-square ai-icon-square--${item.type}`}>
                        <Icon name={item.icon} />
                      </div>
                      <div className="ai-suggestion-content">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                    <div className="ai-suggestion-actions">
                      <button
                        type="button"
                        className="btn-apply-action"
                        onClick={() => handleApplySuggestion(item.id)}
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        className="btn-dismiss-x"
                        onClick={() => handleDismissSuggestion(item.id)}
                        aria-label="Dismiss suggestion"
                      >
                        <Icon name="close" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <MobileNav />

      {/* VERSION HISTORY MODAL */}
      {showVersionModal && (
        <div className="resume-modal-overlay" onClick={() => setShowVersionModal(false)}>
          <div className="resume-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="resume-modal-header">
              <h3>Version History</h3>
              <button
                type="button"
                className="btn-dismiss-x"
                onClick={() => setShowVersionModal(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              {versionHistory.map((item) => (
                <div key={item.name} className="version-item-row">
                  <div className="version-info">
                    <strong>{item.name}</strong>
                    <span>{item.date} • {item.score}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn-outline-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setShowVersionModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
