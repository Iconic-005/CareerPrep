import { useState, useEffect } from 'react';
import { getRoadmap, generateRoadmap, toggleMilestone } from '../services/roadmapService.js';

export function useRoadmap(user) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetRole, setTargetRole] = useState(user?.title || 'Software Engineer');
  const [targetCompany, setTargetCompany] = useState('Top Tech Companies');
  const [roadmapData, setRoadmapData] = useState(null);

  const loadRoadmap = () => {
    getRoadmap()
      .then((data) => { if (data) setRoadmapData(data); })
      .catch(() => {});
  };

  useEffect(() => {
    if (user?.title) setTargetRole(user.title);
    loadRoadmap();
  }, [user]);

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await generateRoadmap(targetRole, targetCompany);
      setRoadmapData(data);
    } catch {
      // silent
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleMilestone = async (id, currentDone) => {
    try {
      const updated = await toggleMilestone(id, !currentDone);
      setRoadmapData((prev) => {
        if (!prev) return prev;
        const milestones = prev.milestones.map((m) => (m.id === id ? { ...m, ...updated } : m));
        return { ...prev, milestones };
      });
    } catch {
      // silent
    }
  };

  const milestones = roadmapData?.milestones || [];
  const completedCount = milestones.filter((m) => m.done).length;
  const progressPercent = milestones.length
    ? Math.round((completedCount / milestones.length) * 100)
    : 0;

  return {
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
  };
}
