import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/profileService.js';

export function useProfile(updateUserCtx) {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Editable fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/images/alex_thompson.png');
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillsActive, setSkillsActive] = useState([]);
  const [targetRoles, setTargetRoles] = useState([]);
  const [dreamCompanies, setDreamCompanies] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  // Modal states
  const [showExpModal, setShowExpModal] = useState(false);
  const [newExp, setNewExp] = useState({ role: '', company: '', period: '', description: '' });
  const [showEduModal, setShowEduModal] = useState(false);
  const [newEdu, setNewEdu] = useState({ degree: '', institution: '', period: '', description: '' });
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [refiningText, setRefiningText] = useState(false);

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const loadProfile = () => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setName(data.name || 'Alex Thompson');
        setTitle(data.title || 'Senior Product Designer @ Fintech Innovations');
        setAvatarUrl(data.avatarUrl || '/images/alex_thompson.png');
        setExperiences(data.experiences || []);
        setEducation(data.education || []);
        setProjects(data.projects || []);
        setSkills(data.skills || []);
        setSkillsActive(data.skillsActive || []);
        setTargetRoles(data.targetRoles || []);
        setDreamCompanies(data.dreamCompanies || []);
        setAiSuggestion(data.aiSuggestion || null);
      })
      .catch(() => setProfile(null));
  };

  useEffect(() => { loadProfile(); }, []);

  const buildPayload = (patch = {}) => ({
    name, title, avatarUrl, experiences, education, projects,
    skills, skillsActive, targetRoles, dreamCompanies, aiSuggestion,
    completion: 85,
    ...patch,
  });

  const persistProfilePatch = async (patch = {}) => {
    try {
      const data = await updateProfile(buildPayload(patch));
      setProfile(data);
      if (patch.name) updateUserCtx({ name: data.name });
    } catch {
      // silent
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const data = await updateProfile(buildPayload());
      setProfile(data);
      updateUserCtx({ name: data.name });
      showNotification('Profile changes saved successfully!');
    } catch (err) {
      showNotification(err.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSkillActive = (skillName) => {
    const updated = skillsActive.includes(skillName)
      ? skillsActive.filter((s) => s !== skillName)
      : [...skillsActive, skillName];
    setSkillsActive(updated);
    persistProfilePatch({ skillsActive: updated });
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!newExp.role || !newExp.company) return;
    const item = {
      id: `exp_${Date.now()}`,
      role: newExp.role,
      company: newExp.company,
      period: newExp.period || '2023 — Present',
      description: newExp.description || '',
      current: newExp.period?.toLowerCase().includes('present'),
    };
    const updated = [item, ...experiences];
    setExperiences(updated);
    setNewExp({ role: '', company: '', period: '', description: '' });
    setShowExpModal(false);
    showNotification('Experience added!');
    persistProfilePatch({ experiences: updated });
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!newEdu.degree || !newEdu.institution) return;
    const item = {
      id: `edu_${Date.now()}`,
      degree: newEdu.degree,
      institution: newEdu.institution,
      period: newEdu.period || '2019 — 2023',
      description: newEdu.description || '',
    };
    const updated = [item, ...education];
    setEducation(updated);
    setNewEdu({ degree: '', institution: '', period: '', description: '' });
    setShowEduModal(false);
    showNotification('Education added!');
    persistProfilePatch({ education: updated });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const s = newSkill.trim();
    let updatedSkills = skills;
    let updatedActive = skillsActive;
    if (!skills.includes(s)) {
      updatedSkills = [...skills, s];
      updatedActive = [...skillsActive, s];
      setSkills(updatedSkills);
      setSkillsActive(updatedActive);
    }
    setNewSkill('');
    setShowSkillModal(false);
    showNotification(`Skill "${s}" added!`);
    persistProfilePatch({ skills: updatedSkills, skillsActive: updatedActive });
  };

  const handleAddTargetRole = (e) => {
    e.preventDefault();
    if (!newRole.trim()) return;
    const r = newRole.trim();
    let updatedRoles = targetRoles;
    if (!targetRoles.includes(r)) {
      updatedRoles = [...targetRoles, r];
      setTargetRoles(updatedRoles);
    }
    setNewRole('');
    setShowRoleModal(false);
    showNotification(`Target role "${r}" added!`);
    persistProfilePatch({ targetRoles: updatedRoles });
  };

  const handleRefineProjectText = () => {
    setRefiningText(true);
    setTimeout(() => {
      const updatedProjects = projects.map((p, index) => {
        if (index === 0) {
          return {
            ...p,
            description: 'Crypto asset management redesigned for clarity with scalable system design architectures.',
          };
        }
        if (index === 1) {
          return {
            ...p,
            description:
              'Real-time analytics for enterprise-level logistics incorporating end-to-end component systems.',
          };
        }
        return p;
      });
      setProjects(updatedProjects);
      setRefiningText(false);
      showNotification('AI refined project descriptions with Systems Thinking!');
      persistProfilePatch({ projects: updatedProjects });
    }, 1200);
  };

  return {
    profile,
    saving,
    toast,
    name,
    setName,
    title,
    setTitle,
    avatarUrl,
    setAvatarUrl,
    experiences,
    setExperiences,
    education,
    setEducation,
    projects,
    skills,
    skillsActive,
    targetRoles,
    dreamCompanies,
    aiSuggestion,
    showExpModal,
    setShowExpModal,
    newExp,
    setNewExp,
    showEduModal,
    setShowEduModal,
    newEdu,
    setNewEdu,
    showSkillModal,
    setShowSkillModal,
    newSkill,
    setNewSkill,
    showRoleModal,
    setShowRoleModal,
    newRole,
    setNewRole,
    showAvatarModal,
    setShowAvatarModal,
    refiningText,
    handleSaveProfile,
    handleToggleSkillActive,
    handleAddExperience,
    handleAddEducation,
    handleAddSkill,
    handleAddTargetRole,
    handleRefineProjectText,
  };
}
