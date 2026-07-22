import { useAuth } from '../../context/AuthContext.jsx';
import { useProfile } from '../../hooks/useProfile.js';
import { Icon } from '../../components/Icon.jsx';
import { SidebarShell } from '../../components/Layout/Sidebar.jsx';
import { AppFooter } from '../../components/Layout/AppFooter.jsx';
import { RouteLink } from '../../components/Common/RouteLink.jsx';

export default function ProfilePage() {
  const { updateUser } = useAuth();
  const {
    profile,
    saving,
    toast,
    name, setName,
    title, setTitle,
    avatarUrl, setAvatarUrl,
    experiences, setExperiences,
    education, setEducation,
    projects,
    skills,
    skillsActive,
    targetRoles,
    dreamCompanies,
    aiSuggestion,
    showExpModal, setShowExpModal,
    newExp, setNewExp,
    showEduModal, setShowEduModal,
    newEdu, setNewEdu,
    showSkillModal, setShowSkillModal,
    newSkill, setNewSkill,
    showRoleModal, setShowRoleModal,
    newRole, setNewRole,
    showAvatarModal, setShowAvatarModal,
    refiningText,
    handleSaveProfile,
    handleToggleSkillActive,
    handleAddExperience,
    handleAddEducation,
    handleAddSkill,
    handleAddTargetRole,
    handleRefineProjectText,
  } = useProfile(updateUser);

  if (!profile) {
    return (
      <div className="app-shell">
        <SidebarShell />
        <main className="main-content">
          <p className="text-muted" style={{ padding: '2rem' }}>Loading profile…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <SidebarShell />

      <main className="main-content main-content--profile">
        {/* TOP APP HEADER */}
        <header className="page-header page-header--profile">
          <div className="brand-header-title header-brand-container">
            <img src="/logo.png" alt="CareerPrep Logo" className="brand-logo-img" />
            <div>
              <h1 className="brand-header-logo">CareerPrep</h1>
              <span className="brand-header-subtitle">AI Career OS</span>
            </div>
          </div>
          <div className="page-header__actions">
            <RouteLink path="/notifications" className="icon-circle" activeClassName="icon-circle--active">
              <Icon name="bell" />
            </RouteLink>
            <RouteLink path="/profile" className="avatar-chip" activeClassName="avatar-chip--active">
              <img src={avatarUrl} alt={name} className="avatar-chip-img" />
            </RouteLink>
          </div>
        </header>

        {toast ? (
          <div className="profile-toast">
            <Icon name="checkCircle" />
            <span>{toast}</span>
          </div>
        ) : null}

        <div className="profile-redesign-container">
          {/* TOP PROFILE HERO CARD */}
          <section className="profile-hero-card">
            <div className="profile-hero-card__body">
              <div className="profile-avatar-container">
                <img src={avatarUrl} alt={name} className="profile-avatar-img" />
                <button
                  type="button"
                  className="profile-avatar-edit-btn"
                  onClick={() => setShowAvatarModal(true)}
                  title="Change Avatar"
                >
                  <Icon name="pencil" />
                </button>
              </div>

              <div className="profile-hero-info">
                <div className="profile-hero-name-row">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="profile-hero-name-input"
                    aria-label="Profile Name"
                  />
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="profile-hero-title-input"
                  aria-label="Job Title"
                />

                <div className="profile-completion-box">
                  <div className="profile-completion-header">
                    <span>Profile Completion</span>
                    <span className="profile-completion-percent">{profile.completion || 85}%</span>
                  </div>
                  <div className="profile-completion-track">
                    <div
                      className="profile-completion-fill"
                      style={{ width: `${profile.completion || 85}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-hero-card__action">
              <button
                type="button"
                className="save-changes-btn"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                <Icon name="save" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </section>

          {/* 2-COLUMN CONTENT GRID */}
          <div className="profile-content-grid">
            {/* LEFT MAIN COLUMN */}
            <div className="profile-main-column">
              {/* EXPERIENCE SECTION */}
              <section className="profile-section-card">
                <div className="profile-section-header">
                  <div className="profile-section-title">
                    <div className="section-icon-badge section-icon-badge--blue">
                      <Icon name="briefcase" />
                    </div>
                    <h3>Experience</h3>
                  </div>
                  <button type="button" className="section-action-btn" onClick={() => setShowExpModal(true)}>
                    + Add Experience
                  </button>
                </div>

                <div className="timeline-list">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="timeline-item">
                      <div className={`timeline-icon-box ${exp.current ? 'timeline-icon-box--active' : ''}`}>
                        <Icon name="building" />
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h4>{exp.role}</h4>
                          <button
                            type="button"
                            className="timeline-delete-btn"
                            onClick={() => setExperiences((prev) => prev.filter((e) => e.id !== exp.id))}
                            title="Remove experience"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="timeline-subtitle">{exp.company} • {exp.period}</p>
                        <p className="timeline-desc">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* EDUCATION SECTION */}
              <section className="profile-section-card">
                <div className="profile-section-header">
                  <div className="profile-section-title">
                    <div className="section-icon-badge section-icon-badge--blue">
                      <Icon name="graduation" />
                    </div>
                    <h3>Education</h3>
                  </div>
                  <button type="button" className="section-action-btn" onClick={() => setShowEduModal(true)}>
                    + Add Education
                  </button>
                </div>

                <div className="timeline-list">
                  {education.map((edu) => (
                    <div key={edu.id} className="timeline-item">
                      <div className="timeline-icon-box">
                        <Icon name="landmark" />
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h4>{edu.degree}</h4>
                          <button
                            type="button"
                            className="timeline-delete-btn"
                            onClick={() => setEducation((prev) => prev.filter((e) => e.id !== edu.id))}
                            title="Remove education"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="timeline-subtitle">{edu.institution} • {edu.period}</p>
                        <p className="timeline-desc timeline-desc--italic">{edu.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FEATURED PROJECTS SECTION */}
              <section className="profile-section-card">
                <div className="profile-section-header">
                  <div className="profile-section-title">
                    <div className="section-icon-badge section-icon-badge--blue">
                      <Icon name="rocket" />
                    </div>
                    <h3>Featured Projects</h3>
                  </div>
                  <button type="button" className="section-action-btn" onClick={handleRefineProjectText}>
                    Manage All
                  </button>
                </div>

                <div className="featured-projects-grid">
                  {projects.map((proj) => (
                    <div key={proj.id} className="project-card">
                      <div className="project-card__image-wrap">
                        <img src={proj.image} alt={proj.title} className="project-card__image" />
                      </div>
                      <div className="project-card__info">
                        <h4>{proj.title}</h4>
                        <p>{proj.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT SIDEBAR COLUMN */}
            <div className="profile-side-column">
              {/* TECHNICAL SKILLS CARD */}
              <section className="profile-widget-card">
                <h4 className="widget-label">TECHNICAL SKILLS</h4>
                <div className="widget-divider" />

                <div className="skills-tag-cloud">
                  {skills.map((skill) => {
                    const isActive = skillsActive.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        className={`skill-tag-pill ${isActive ? 'skill-tag-pill--active' : ''}`}
                        onClick={() => handleToggleSkillActive(skill)}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>

                <button type="button" className="add-skill-dashed-btn" onClick={() => setShowSkillModal(true)}>
                  + Add Skill
                </button>
              </section>

              {/* CAREER GOALS CARD */}
              <section className="profile-widget-card">
                <h4 className="widget-label">CAREER GOALS</h4>
                <div className="widget-divider" />

                <div className="goals-subgroup">
                  <div className="goals-subgroup-header">
                    <h5>Target Roles</h5>
                    <button type="button" className="small-link-btn" onClick={() => setShowRoleModal(true)}>
                      + Add
                    </button>
                  </div>
                  <div className="target-roles-list">
                    {targetRoles.map((role) => (
                      <div key={role} className="target-role-pill">
                        <div className="check-icon-circle">
                          <Icon name="check" />
                        </div>
                        <span>{role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="goals-subgroup" style={{ marginTop: '1.2rem' }}>
                  <h5>Dream Companies</h5>
                  <div className="dream-companies-list">
                    {dreamCompanies.map((c) => (
                      <div key={c.name} className="dream-company-pill">
                        <span className="company-dot" style={{ backgroundColor: c.color || '#2563eb' }} />
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* AI SUGGESTION HERO CARD */}
              <section className="ai-suggestion-hero-card">
                <div className="ai-suggestion-badge">
                  <Icon name="sparkles" />
                  <span>AI SUGGESTION</span>
                </div>
                <h4>{aiSuggestion?.title || 'Optimize for Stripe'}</h4>
                <p>
                  {aiSuggestion?.description ||
                    "Based on your target companies, you should highlight more 'Systems Thinking' in your project descriptions to align with Stripe's design philosophy."}
                </p>
                <button
                  type="button"
                  className="refine-text-btn"
                  onClick={handleRefineProjectText}
                  disabled={refiningText}
                >
                  {refiningText ? 'Refining with AI...' : aiSuggestion?.buttonLabel || 'Refine Project Text'}
                </button>
              </section>
            </div>
          </div>
        </div>

        {/* MODALS */}
        {showExpModal ? (
          <div className="modal-backdrop" onClick={() => setShowExpModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Add Experience</h3>
              <form onSubmit={handleAddExperience}>
                <label>
                  <span>Role Title *</span>
                  <input type="text" placeholder="e.g. Senior Product Designer" value={newExp.role}
                    onChange={(e) => setNewExp({ ...newExp, role: e.target.value })} required />
                </label>
                <label>
                  <span>Company *</span>
                  <input type="text" placeholder="e.g. Fintech Innovations" value={newExp.company}
                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} required />
                </label>
                <label>
                  <span>Period</span>
                  <input type="text" placeholder="e.g. Jan 2022 — Present" value={newExp.period}
                    onChange={(e) => setNewExp({ ...newExp, period: e.target.value })} />
                </label>
                <label>
                  <span>Key Accomplishments &amp; Description</span>
                  <textarea rows="3" placeholder="Describe your design contributions..." value={newExp.description}
                    onChange={(e) => setNewExp({ ...newExp, description: e.target.value })} />
                </label>
                <div className="modal-actions">
                  <button type="button" className="ghost-button" onClick={() => setShowExpModal(false)}>Cancel</button>
                  <button type="submit" className="primary-button">Add Experience</button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {showEduModal ? (
          <div className="modal-backdrop" onClick={() => setShowEduModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Add Education</h3>
              <form onSubmit={handleAddEducation}>
                <label>
                  <span>Degree *</span>
                  <input type="text" placeholder="e.g. B.S. Interaction Design" value={newEdu.degree}
                    onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })} required />
                </label>
                <label>
                  <span>Institution *</span>
                  <input type="text" placeholder="e.g. Stanford University" value={newEdu.institution}
                    onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })} required />
                </label>
                <label>
                  <span>Period</span>
                  <input type="text" placeholder="e.g. 2015 — 2019" value={newEdu.period}
                    onChange={(e) => setNewEdu({ ...newEdu, period: e.target.value })} />
                </label>
                <label>
                  <span>Specialization / Description</span>
                  <textarea rows="2" placeholder="Focus areas or major coursework..." value={newEdu.description}
                    onChange={(e) => setNewEdu({ ...newEdu, description: e.target.value })} />
                </label>
                <div className="modal-actions">
                  <button type="button" className="ghost-button" onClick={() => setShowEduModal(false)}>Cancel</button>
                  <button type="submit" className="primary-button">Add Education</button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {showSkillModal ? (
          <div className="modal-backdrop" onClick={() => setShowSkillModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Add Technical Skill</h3>
              <form onSubmit={handleAddSkill}>
                <label>
                  <span>Skill Name *</span>
                  <input type="text" placeholder="e.g. Design Systems" value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)} required />
                </label>
                <div className="modal-actions">
                  <button type="button" className="ghost-button" onClick={() => setShowSkillModal(false)}>Cancel</button>
                  <button type="submit" className="primary-button">Add Skill</button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {showRoleModal ? (
          <div className="modal-backdrop" onClick={() => setShowRoleModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Add Target Role</h3>
              <form onSubmit={handleAddTargetRole}>
                <label>
                  <span>Role Title *</span>
                  <input type="text" placeholder="e.g. Staff Product Designer" value={newRole}
                    onChange={(e) => setNewRole(e.target.value)} required />
                </label>
                <div className="modal-actions">
                  <button type="button" className="ghost-button" onClick={() => setShowRoleModal(false)}>Cancel</button>
                  <button type="submit" className="primary-button">Add Role</button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {showAvatarModal ? (
          <div className="modal-backdrop" onClick={() => setShowAvatarModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Update Profile Image</h3>
              <label>
                <span>Image URL</span>
                <input type="text" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="/images/alex_thompson.png" />
              </label>
              <div className="modal-actions" style={{ marginTop: '1rem' }}>
                <button type="button" className="ghost-button" onClick={() => setShowAvatarModal(false)}>Done</button>
              </div>
            </div>
          </div>
        ) : null}

        <AppFooter />
      </main>
    </div>
  );
}
