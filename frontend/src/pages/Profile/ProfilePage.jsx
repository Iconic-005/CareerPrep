import { useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useProfile } from '../../hooks/useProfile.js';
import { Icon } from '../../components/Icon.jsx';
import { SidebarShell } from '../../components/Layout/Sidebar.jsx';
import { AppFooter } from '../../components/Layout/AppFooter.jsx';
import { RouteLink } from '../../components/Common/RouteLink.jsx';

export default function ProfilePage() {
  const { updateUser } = useAuth();
  const fileInputRef = useRef(null);

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
    showCompanyModal, setShowCompanyModal,
    newCompany, setNewCompany,
    showProjectModal, setShowProjectModal,
    newProject, setNewProject,
    showAvatarModal, setShowAvatarModal,
    refiningText,
    handleSaveProfile,
    handleToggleSkillActive,
    handleAddExperience,
    handleAddEducation,
    handleAddSkill,
    handleAddTargetRole,
    handleRemoveTargetRole,
    handleAddCompany,
    handleRemoveCompany,
    handleAddProject,
    handleRemoveProject,
    handlePhotoUpload,
    handleRefineProjectText,
  } = useProfile(updateUser);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

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
        {/* Hidden global photo upload input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

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
            <Icon name="check" />
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
                  title="Upload / Change Photo"
                >
                  <Icon name="edit" />
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
                        <Icon name="briefcase" />
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
                      <Icon name="document" />
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
                        <Icon name="document" />
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
                  <div className="profile-section-actions">
                    <button
                      type="button"
                      className="section-action-btn"
                      onClick={() => setShowProjectModal(true)}
                    >
                      + Add Project
                    </button>
                  </div>
                </div>

                {projects.length === 0 ? (
                  <div className="empty-projects-state">
                    <div className="empty-icon-box">
                      <Icon name="rocket" />
                    </div>
                    <p className="empty-title">No featured projects added yet</p>
                    <p className="empty-subtitle">Highlight your best engineering or design projects to stand out to recruiters.</p>
                    <button
                      type="button"
                      className="primary-button"
                      style={{ marginTop: '0.75rem' }}
                      onClick={() => setShowProjectModal(true)}
                    >
                      + Add Your First Project
                    </button>
                  </div>
                ) : (
                  <div className="featured-projects-grid">
                    {projects.map((proj) => (
                      <div key={proj.id} className="project-card">
                        <button
                          type="button"
                          className="project-card__delete-btn"
                          onClick={() => handleRemoveProject(proj.id)}
                          title="Remove project"
                        >
                          ✕
                        </button>
                        <div className="project-card__image-wrap">
                          {proj.image ? (
                            <img
                              src={proj.image}
                              alt={proj.title}
                              className="project-card__image"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div
                            className="project-card__fallback"
                            style={{ display: proj.image ? 'none' : 'flex' }}
                          >
                            <Icon name="rocket" />
                          </div>
                        </div>
                        <div className="project-card__info">
                          <h4>{proj.title}</h4>
                          <p>{proj.description}</p>
                          {proj.link ? (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                              className="project-card__link"
                            >
                              View Project →
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                        <button
                          type="button"
                          className="pill-remove-btn"
                          onClick={() => handleRemoveTargetRole(role)}
                          title="Remove role"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="goals-subgroup" style={{ marginTop: '1.25rem' }}>
                  <div className="goals-subgroup-header">
                    <h5>Dream Companies</h5>
                    <button type="button" className="small-link-btn" onClick={() => setShowCompanyModal(true)}>
                      + Add
                    </button>
                  </div>
                  <div className="dream-companies-list">
                    {dreamCompanies.map((c) => (
                      <div key={c.name} className="dream-company-pill">
                        <span className="company-dot" style={{ backgroundColor: c.color || '#2563eb' }} />
                        <span>{c.name}</span>
                        <button
                          type="button"
                          className="pill-remove-btn"
                          onClick={() => handleRemoveCompany(c.name)}
                          title="Remove company"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* AI SUGGESTION HERO CARD */}
              <section className="ai-suggestion-hero-card">
                <div className="ai-suggestion-badge">
                  <Icon name="brain" />
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
                  <Icon name="brain" />
                  <span>{refiningText ? 'Refining with AI...' : aiSuggestion?.buttonLabel || 'Refine Project Text'}</span>
                </button>
              </section>
            </div>
          </div>
        </div>

        {/* MODALS */}

        {/* UPLOAD / CHANGE AVATAR MODAL */}
        {showAvatarModal ? (
          <div className="modal-backdrop" onClick={() => setShowAvatarModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Update Profile Photo</h3>
              
              <div className="modal-photo-upload-section">
                <p className="photo-upload-label">Option 1: Upload Photo from Device</p>
                <div
                  className="photo-dropzone"
                  onClick={triggerFileInput}
                >
                  <div className="photo-dropzone-icon">
                    <Icon name="edit" />
                  </div>
                  <div className="photo-dropzone-text">
                    <strong>Click to upload photo</strong>
                    <span>Supports JPG, PNG, WebP (Max 5MB)</span>
                  </div>
                </div>
              </div>

              <div className="modal-divider-row">
                <span>OR</span>
              </div>

              <div className="modal-photo-url-section">
                <label>
                  <span>Option 2: Paste Image URL</span>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                  />
                </label>
              </div>

              <div className="modal-actions" style={{ marginTop: '1.25rem' }}>
                <button type="button" className="ghost-button" onClick={() => setShowAvatarModal(false)}>
                  Cancel
                </button>
                <button type="button" className="primary-button" onClick={() => setShowAvatarModal(false)}>
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* ADD EXPERIENCE MODAL */}
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

        {/* ADD EDUCATION MODAL */}
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

        {/* ADD SKILL MODAL */}
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

        {/* ADD TARGET ROLE MODAL */}
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

        {/* ADD DREAM COMPANY MODAL */}
        {showCompanyModal ? (
          <div className="modal-backdrop" onClick={() => setShowCompanyModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Add Dream Company</h3>
              <form onSubmit={handleAddCompany}>
                <label>
                  <span>Company Name *</span>
                  <input
                    type="text"
                    placeholder="e.g. Stripe, Apple, Google"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    required
                  />
                </label>

                <div style={{ marginTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Brand Accent Color</span>
                  <div className="color-picker-options" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {['#6366f1', '#2563eb', '#ff385c', '#10b981', '#f59e0b', '#8b5cf6', '#000000'].map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setNewCompany({ ...newCompany, color: col })}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: col,
                          border: newCompany.color === col ? '3px solid #3b82f6' : '2px solid transparent',
                          cursor: 'pointer',
                          outline: newCompany.color === col ? '2px solid #bfdbfe' : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="modal-actions" style={{ marginTop: '1.25rem' }}>
                  <button type="button" className="ghost-button" onClick={() => setShowCompanyModal(false)}>Cancel</button>
                  <button type="submit" className="primary-button">Add Company</button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {/* ADD FEATURED PROJECT MODAL */}
        {showProjectModal ? (
          <div className="modal-backdrop" onClick={() => setShowProjectModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Add Featured Project</h3>
              <form onSubmit={handleAddProject}>
                <label>
                  <span>Project Title *</span>
                  <input
                    type="text"
                    placeholder="e.g. Nexus Wallet Redesign"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    required
                  />
                </label>
                <label>
                  <span>Description</span>
                  <textarea
                    rows="3"
                    placeholder="Brief description of your key achievements and tech stack..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </label>
                <label>
                  <span>Image URL (optional)</span>
                  <input
                    type="text"
                    placeholder="e.g. /images/nexus_wallet.png or https://..."
                    value={newProject.image}
                    onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                  />
                </label>
                <label>
                  <span>Project Link (optional)</span>
                  <input
                    type="url"
                    placeholder="https://github.com/my-project"
                    value={newProject.link}
                    onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                  />
                </label>

                <div className="modal-actions">
                  <button type="button" className="ghost-button" onClick={() => setShowProjectModal(false)}>Cancel</button>
                  <button type="submit" className="primary-button">Add Project</button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        <AppFooter />
      </main>
    </div>
  );
}
