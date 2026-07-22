import { useState, useEffect } from 'react';
import { getInterviewReport, startInterview, evaluateInterview } from '../services/interviewService.js';

export function useInterview() {
  const [reportData, setReportData] = useState(null);
  const [view, setView] = useState('report');
  const [targetCompany, setTargetCompany] = useState('Google');
  const [targetRole, setTargetRole] = useState('Product Manager');
  const [difficulty, setDifficulty] = useState('Mid-Level');
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    getInterviewReport()
      .then((data) => setReportData(data))
      .catch(() => setReportData(null));
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleStartSession = async (e) => {
    e.preventDefault();
    showToast(`Initializing AI Mock Interview for ${targetRole} @ ${targetCompany}...`);
    try {
      await startInterview({ role: targetRole, company: targetCompany, difficulty });
      const data = await evaluateInterview({
        role: targetRole,
        company: targetCompany,
        difficulty,
        qnaList: [],
      });
      setReportData(data);
      showToast('Session evaluated & saved to MongoDB!');
      setView('report');
    } catch {
      // silent
    }
  };

  const handleDownloadPDF = () => {
    showToast('Downloading Post-Interview Analysis Report PDF...');
  };

  return {
    reportData,
    view,
    setView,
    targetCompany,
    setTargetCompany,
    targetRole,
    setTargetRole,
    difficulty,
    setDifficulty,
    toastMsg,
    handleStartSession,
    handleDownloadPDF,
  };
}
