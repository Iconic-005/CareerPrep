import { useState, useEffect, useRef } from 'react';
import { getInterviewReport, startInterview, evaluateInterview } from '../services/interviewService.js';
import { navigate } from './usePathname.js';

export function useInterview() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const interviewId = searchParams.get('interviewId');

  const [view, setView] = useState(() => {
    return pathname === '/mock-interviews' ? 'config' : 'report';
  });

  const [targetCompany, setTargetCompany] = useState('Google');
  const [targetRole, setTargetRole] = useState('Product Manager');
  const [difficulty, setDifficulty] = useState('Mid-Level');
  const [toastMsg, setToastMsg] = useState('');

  // Interactive Session State
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [qnaList, setQnaList] = useState([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Interviewer Hint State
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [revealedHints, setRevealedHints] = useState({});

  const handleUseHint = () => {
    if (!revealedHints[currentQuestionIndex]) {
      setRevealedHints((prev) => ({ ...prev, [currentQuestionIndex]: true }));
      setHintsUsedCount((prev) => prev + 1);
      showToast('💡 Hint unlocked! (0.5 point deduction applied to evaluation)');
    }
  };

  // Audio / Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentParams = new URLSearchParams(window.location.search);
    const paramId = currentParams.get('interviewId');
    const storedId = localStorage.getItem('careerprep_active_interview_id');
    const id = paramId || storedId;

    if (currentPath === '/mock-interviews') {
      if (id) {
        setView('report');
        setLoading(true);
        getInterviewReport(id)
          .then((data) => {
            if (data && data.status === 'completed') {
              setReportData(data);
              localStorage.setItem('careerprep_active_interview_id', id);
            } else {
              localStorage.removeItem('careerprep_active_interview_id');
              setReportData(null);
              setView('config');
            }
          })
          .catch(() => {
            localStorage.removeItem('careerprep_active_interview_id');
            setReportData(null);
            setView('config');
          })
          .finally(() => setLoading(false));
      } else {
        if (view !== 'session') {
          setView('config');
        }
        setReportData(null);
        setLoading(false);
      }
      return;
    }

    if (currentPath === '/interview-report') {
      if (!id) {
        navigate('/mock-interviews');
        return;
      }

      setView('report');
      setLoading(true);
      getInterviewReport(id)
        .then((data) => {
          if (data && data.status === 'completed') {
            setReportData(data);
            localStorage.setItem('careerprep_active_interview_id', id);
          } else {
            localStorage.removeItem('careerprep_active_interview_id');
            setReportData(null);
            navigate('/mock-interviews');
          }
        })
        .catch(() => {
          localStorage.removeItem('careerprep_active_interview_id');
          setReportData(null);
          navigate('/mock-interviews');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [pathname, window.location.search]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleExitReport = () => {
    localStorage.removeItem('careerprep_active_interview_id');
    setReportData(null);
    setView('config');
    navigate('/mock-interviews');
    showToast('Exited interview report.');
  };

  // Text-to-Speech (Speaker option)
  const speakQuestion = (text) => {
    if (!text) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      showToast('Text-to-speech is not supported in this browser.');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Speech Recognition (Microphone voice input)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice input is not supported in this browser. Please type your response.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setUserAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        };

        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
      } catch (err) {
        showToast('Unable to start microphone.');
        setIsListening(false);
      }
    }
  };

  const handleStartSession = async (e) => {
    e.preventDefault();
    showToast(`Initializing AI Mock Interview for ${targetRole} @ ${targetCompany}...`);
    setLoading(true);
    try {
      const data = await startInterview({ role: targetRole, company: targetCompany, difficulty });
      const fetchedQuestions = data?.questions || [];
      if (fetchedQuestions.length === 0) {
        throw new Error('No interview questions generated.');
      }
      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setQnaList([]);
      setUserAnswer('');
      setHintsUsedCount(0);
      setRevealedHints({});
      setView('session');
      showToast('Interview session started! AI interviewer is ready.');
      speakQuestion(fetchedQuestions[0].question);
    } catch (err) {
      showToast(err.message || 'Failed to initialize interview session.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const currentQ = questions[currentQuestionIndex];
    const newEntry = {
      questionId: currentQ?.id || `q_${currentQuestionIndex}`,
      question: currentQ?.question || '',
      answer: userAnswer.trim() || 'No answer provided.',
      category: currentQ?.category || 'General',
    };

    const updatedQna = [...qnaList, newEntry];
    setQnaList(updatedQna);
    setUserAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      speakQuestion(questions[nextIdx].question);
    } else {
      handleFinishSession(updatedQna);
    }
  };

  const handleFinishSession = async (finalQnaList = qnaList) => {
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsEvaluating(true);
    showToast('Submitting responses... AI Bar Raiser is evaluating your interview session.');

    let finalQna = [...finalQnaList];
    const currentQ = questions[currentQuestionIndex];
    if (currentQ && userAnswer.trim() && !finalQna.some((q) => q.questionId === currentQ.id || q.question === currentQ.question)) {
      finalQna.push({
        questionId: currentQ.id || `q_${currentQuestionIndex}`,
        question: currentQ.question || '',
        answer: userAnswer.trim(),
        category: currentQ.category || 'General',
      });
    }

    try {
      const data = await evaluateInterview({
        role: targetRole,
        company: targetCompany,
        difficulty,
        qnaList: finalQna,
        hintsUsedCount,
      });

      const reportId = data?.id || data?._id;
      if (data && reportId) {
        localStorage.setItem('careerprep_active_interview_id', reportId);
        showToast('Evaluation complete! Opening detailed interview report...');
        navigate(`/interview-report?interviewId=${reportId}`);
      } else if (data && (data.score || data.skillsRadar || data.headline)) {
        setReportData(data);
        setView('report');
      } else {
        throw new Error(data?.error || 'Failed to parse evaluation report.');
      }
    } catch (err) {
      showToast(err.message || 'Evaluation failed. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleDownloadPDF = () => {
    showToast('Downloading Post-Interview Analysis Report PDF...');
  };

  return {
    loading,
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
  };
}
