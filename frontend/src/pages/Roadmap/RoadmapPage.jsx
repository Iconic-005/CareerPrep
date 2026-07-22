import { useAuth } from '../../context/AuthContext.jsx';
import { useRoadmap } from '../../hooks/useRoadmap.js';
import { Icon } from '../../components/Icon.jsx';
import { SidebarShell } from '../../components/Layout/Sidebar.jsx';
import { MobileNav } from '../../components/Layout/MobileNav.jsx';
import { getInitials } from '../../utils/helpers.js';

export default function RoadmapPage() {
  const { user } = useAuth();
  const {
    isGenerating,
    targetRole,
    setTargetRole,
    targetCompany,
    setTargetCompany,
    roadmapData,
    milestones,
    completedCount,
    progressPercent,
    handleAiGenerate,
    handleToggleMilestone,
  } = useRoadmap(user);

  const candidateName = user?.name || 'Candidate';
  const userInitials = getInitials(candidateName);

  return (
    <div className="app-shell">
      <SidebarShell />

      <main className="main-content--roadmap">
        {/* TOP HEADER BAR */}
        <div className="rm-top-bar">
          <div className="rm-header-left">
            <h1 className="rm-title">Career Roadmap</h1>
            <span className="rm-level-pill">Target: {targetRole}</span>
          </div>

          <div className="rm-header-right">
            <div className="rm-user-block">
              <div className="rm-user-text">
                <span className="rm-user-name">{candidateName}</span>
                <span className="rm-user-sub">{targetRole} @ {targetCompany}</span>
              </div>
              <div className="rm-avatar-chip">{userInitials}</div>
            </div>
          </div>
        </div>

        {/* TOP INPUT & GENERATION BAR */}
        <div className="card panel" style={{ marginBottom: '20px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>Target Company</label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Google / Top Tech Firms"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <button
              type="button"
              className="btn-ai-adjust"
              onClick={handleAiGenerate}
              disabled={isGenerating}
              style={{ marginTop: '20px' }}
            >
              <Icon name="spark" />
              <span>{isGenerating ? 'Generating Roadmap with Gemini AI...' : 'Generate Roadmap with AI'}</span>
            </button>
          </div>
        </div>

        {/* TOP 3-COLUMN CARDS */}
        <div className="rm-top-3col">
          {/* CARD 1: OVERALL PROGRESS */}
          <div className="rm-card-box">
            <span className="rm-card-label">ROADMAP READINESS PROGRESS</span>
            <h2 className="rm-card-title-lg">{progressPercent}% Completed</h2>

            <div className="rm-progress-split">
              <div className="rm-ring-small">
                <svg viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#e2e8f0" strokeWidth="3.5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#256cf0" strokeWidth="3.5"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="rm-ring-center-num">{progressPercent}%</span>
              </div>

              <div className="rm-progress-text-block">
                <p><strong>{completedCount} of {milestones.length}</strong> Milestones Achieved</p>
                <div className="rm-progress-bar-track">
                  <div className="rm-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: STRATEGIC FOCUS AREAS */}
          <div className="rm-card-box">
            <div className="rm-goals-header">
              <Icon name="roadmap" />
              <span>Strategic Focus Areas</span>
            </div>
            {(roadmapData?.focusAreas || []).map((f) => (
              <div key={f.id || f.title} className="rm-goal-item-btn" style={{ marginBottom: '8px', cursor: 'default' }}>
                <div className="rm-goal-left">
                  <div className="rm-goal-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                    <Icon name="spark" />
                  </div>
                  <div className="rm-goal-info">
                    <strong>{f.title}</strong>
                    <span>{f.text}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CARD 3: TARGET TIMELINE */}
          <div className="rm-card-box">
            <span className="rm-card-label" style={{ textTransform: 'none', fontSize: '0.88rem', color: '#0f172a', fontWeight: 800 }}>
              Timeline Overview
            </span>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '8px' }}>
              {roadmapData?.bannerMeta || 'Generate a custom roadmap to see targeted readiness timelines.'}
            </p>
          </div>
        </div>

        {/* TIMELINE PHASES */}
        <div className="rm-journey-header-row" style={{ marginTop: '24px' }}>
          <div className="rm-journey-title-block">
            <h2>{roadmapData?.bannerSubtitle || `${targetRole} @ ${targetCompany}`}</h2>
            <p>Interactive Milestone Checklist</p>
          </div>
        </div>

        <div className="rm-timeline-wrap">
          {milestones.map((m, index) => (
            <div key={m.id || index} className="rm-timeline-node">
              <div className="rm-timeline-date-col">
                <span className="rm-date-text">{m.time || `Phase ${index + 1}`}</span>
              </div>
              <div
                className={`rm-marker-circle ${m.done ? 'rm-marker-circle--completed' : 'rm-marker-circle--active'}`}
                onClick={() => handleToggleMilestone(m.id, m.done)}
                style={{ cursor: 'pointer' }}
              >
                {m.done ? <Icon name="check" /> : <span>{index + 1}</span>}
              </div>

              <div className={`rm-card-content ${m.done ? '' : 'rm-card-content--active'}`}>
                <div className="rm-phase-top-row">
                  <h3 className="rm-phase-title">{m.title}</h3>
                  <span className={m.done ? 'rm-badge-completed' : 'rm-badge-active'}>
                    {m.done ? 'COMPLETED (+100 XP)' : 'IN PROGRESS'}
                  </span>
                </div>
                <p className="rm-phase-desc">{m.desc}</p>
                <button
                  type="button"
                  onClick={() => handleToggleMilestone(m.id, m.done)}
                  style={{
                    background: m.done ? '#f1f5f9' : '#256cf0',
                    color: m.done ? '#475569' : '#ffffff',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '8px',
                  }}
                >
                  {m.done ? '✓ Mark Incomplete' : '✓ Mark Milestone Complete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
