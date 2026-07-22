import { useState, useEffect } from 'react';
import { getResume, updateResume, optimizeResume } from '../services/resumeService.js';

export function useResume(user) {
  const [selectedVersion, setSelectedVersion] = useState('Active Resume (AI Polished)');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [candidateName, setCandidateName] = useState(user?.name || '');
  const [candidateRole, setCandidateRole] = useState(user?.title || 'Software Engineer & Systems Architect');
  const [candidateEmail, setCandidateEmail] = useState(user?.email || '');
  const [candidatePhone, setCandidatePhone] = useState('+1 (555) 019-2834');
  const [candidateLocation, setCandidateLocation] = useState('San Francisco, CA');
  const [resumeText, setResumeText] = useState(
    `Engineered high-performance web applications and backend API microservices.\nCollaborated with cross-functional product teams to deliver feature updates ahead of sprint deadlines.\nImplemented automated testing suites to maintain code quality and deployment reliability.`
  );
  const [addedSkills, setAddedSkills] = useState([]);
  const [hasProjectsSection, setHasProjectsSection] = useState(false);
  const [missingSkills, setMissingSkills] = useState(['System Design', 'Cloud Architecture', 'CI/CD Pipelines']);
  const [suggestions, setSuggestions] = useState([
    {
      id: 's1',
      type: 'blue',
      icon: 'trendUp',
      title: 'Quantify your achievements with concrete metrics.',
      desc: 'Adding specific percentages and revenue/performance impact increases recruiter ATS match score by up to 25%.',
    },
    {
      id: 's2',
      type: 'purple',
      icon: 'spark',
      title: 'Use Google X-Y-Z formula for bullet points.',
      desc: 'Format bullets as: "Accomplished [X] as measured by [Y], by doing [Z]".',
    },
  ]);
  const [atsScore, setAtsScore] = useState(85);
  const [skillMatchScore, setSkillMatchScore] = useState(88);
  const [aiCritique, setAiCritique] = useState('');
  const [optimizedBullets, setOptimizedBullets] = useState('');

  useEffect(() => {
    if (user?.name) setCandidateName(user.name);
    if (user?.email) setCandidateEmail(user.email);
    if (user?.title) setCandidateRole(user.title);

    getResume()
      .then((data) => {
        if (data?.score) {
          const numeric = parseInt(data.score, 10);
          if (!isNaN(numeric)) setAtsScore(numeric);
        }
        if (data?.resumeText) setResumeText(data.resumeText);
        if (data?.missingSkills?.length) setMissingSkills(data.missingSkills);
        if (data?.suggestions?.length) setSuggestions(data.suggestions);
      })
      .catch(() => {});
  }, [user]);

  const saveResumeToDb = async (patch = {}) => {
    try {
      const payload = {
        resumeText: patch.resumeText !== undefined ? patch.resumeText : resumeText,
        missingSkills: patch.missingSkills !== undefined ? patch.missingSkills : missingSkills,
        suggestions: patch.suggestions !== undefined ? patch.suggestions : suggestions,
        score: patch.atsScore !== undefined ? `${patch.atsScore} ATS` : `${atsScore} ATS`,
      };
      await updateResume(payload);
    } catch {
      // silent
    }
  };

  const handleGenerate = async () => {
    setIsOptimizing(true);
    try {
      const data = await optimizeResume(resumeText, candidateRole);
      let newScore = atsScore;
      if (data?.score) {
        const parsed = parseInt(data.score, 10);
        if (!isNaN(parsed)) {
          setAtsScore(parsed);
          newScore = parsed;
        }
      }
      if (data?.critique) setAiCritique(data.critique);
      if (data?.optimizedText) setOptimizedBullets(data.optimizedText);
      let newSkills = missingSkills;
      if (data?.suggestedSkills?.length) {
        setMissingSkills(data.suggestedSkills);
        newSkills = data.suggestedSkills;
      }
      setSkillMatchScore((prev) => Math.min(99, prev + 5));
      saveResumeToDb({ atsScore: newScore, missingSkills: newSkills });
    } catch {
      // silent
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDismissSuggestion = (id) => {
    setSuggestions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveResumeToDb({ suggestions: updated });
      return updated;
    });
  };

  const handleApplySuggestion = (id) => {
    setAtsScore((prev) => {
      const updatedScore = Math.min(98, prev + 4);
      setSuggestions((sPrev) => {
        const updatedS = sPrev.filter((s) => s.id !== id);
        saveResumeToDb({ atsScore: updatedScore, suggestions: updatedS });
        return updatedS;
      });
      return updatedScore;
    });
  };

  const handleDownload = () => {
    window.print();
  };

  const versionHistory = [
    { name: 'Active Resume (AI Polished)', date: 'Just now (Current)', score: `${atsScore} ATS` },
    { name: 'Target Role Draft_v1.pdf', date: 'Saved yesterday', score: '78 ATS' },
  ];

  return {
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
  };
}
