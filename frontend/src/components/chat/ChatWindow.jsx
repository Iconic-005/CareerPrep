import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatHeader } from './ChatHeader.jsx';
import { ChatEmptyState } from './ChatEmptyState.jsx';
import { MessageBubble } from './MessageBubble.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';
import { SuggestionChips } from './SuggestionChips.jsx';
import { ChatInput } from './ChatInput.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getAuthHeaders() {
  const token = localStorage.getItem('careerprep_token') || '';
  const userId = localStorage.getItem('careerprep_userid') || '';
  const userName = localStorage.getItem('careerprep_username') || '';
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
    'x-user-id': userId,
    'x-user-name': encodeURIComponent(userName),
  };
}

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getClientFallbackReply(userMessage) {
  const msg = (userMessage || '').toLowerCase();
  if (msg.includes('resume')) {
    return `### 📄 Resume Optimization Advice\n\nHere are 3 concrete steps to sharpen your resume for software engineering roles:\n\n• **Apply the Google X-Y-Z Formula**: Write bullet points as "Accomplished [X] as measured by [Y], by doing [Z]".\n• **Quantify Technical Accomplishments**: Include metrics such as "Reduced API latency by 40%" or "Automated CI/CD saving 10 hours weekly".\n• **Highlight Core Tech Stack**: Put primary technologies (React, Node.js, Python, SQL) near the top.\n\n**Quick Tip:** Keep formatting clean and standard so ATS software can easily parse every section.\n\nWould you like me to analyze a specific section of your resume?`;
  }
  if (msg.includes('interview') || msg.includes('google')) {
    return `### 🎯 Interview Preparation Strategy\n\nFollow these 3 core steps for interview success:\n\n• **Master the STAR Framework**: Prepare Situation, Task, Action, and Result for behavioral questions.\n• **Technical Core**: Practice data structures, system design, and coding problems step-by-step out loud.\n• **Company Research**: Understand the target company's core engineering values and products.\n\n**Quick Tip:** Always state assumptions clearly before starting technical problem-solving.\n\nWould you like to practice a mock interview question right now?`;
  }
  if (msg.includes('skill') || msg.includes('gap')) {
    return `### 📊 Skill Gap Analysis\n\nHere is how to identify and bridge your technical skill gaps:\n\n• **Target Role Benchmark**: Review 5 top job descriptions for your target position.\n• **Hands-On Projects**: Build end-to-end projects implementing missing technical skills.\n• **Structured Practice**: Practice daily coding and architectural challenges.\n\n**Quick Tip:** Depth beats breadth — focus on mastering core fundamentals first.\n\nWould you like me to generate a customized 30-day study plan for you?`;
  }
  return `### 💡 Career Mentor Guidance\n\nHere is actionable advice to boost your career preparation:\n\n• **Consistent Practice**: Set aside 30–45 minutes daily for targeted practice.\n• **Portfolio & LinkedIn**: Keep your GitHub and LinkedIn updated with recent projects.\n• **Mock Interviews**: Practice articulating your solutions clearly and concisely.\n\n**Quick Tip:** Focus on incremental daily progress to build strong confidence.\n\nHow else can I assist with your career preparation today?`;
}

export function ChatWindow({ user }) {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const streamingMsgIdRef = useRef(null);

  const candidateName = user?.name || 'User';
  const userInitials = candidateName.trim().split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  // Load conversation history on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/coach`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data?.history && Array.isArray(data.history) && data.history.length > 0) {
          setMessages(
            data.history.map((m, i) => ({
              id: `hist-${i}`,
              role: m.role,
              time: 'Earlier',
              text: m.content,
            }))
          );
        }
        setHistoryLoaded(true);
      })
      .catch(() => {
        setHistoryLoaded(true);
      });
  }, []);

  // Send message with 3-stage resilient fallback
  const handleSend = useCallback(async (text) => {
    if (!text.trim() || isStreaming) return;

    setSuggestions([]);

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      time: formatTime(),
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setIsStreaming(true);

    const botMsgId = `bot-${Date.now()}`;
    streamingMsgIdRef.current = botMsgId;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let streamedSuccess = false;

    // Strategy 1: Try SSE Stream
    try {
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message: text.trim() }),
        signal: controller.signal,
      });

      if (response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let firstChunk = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);

              if (event.type === 'chunk') {
                if (!firstChunk) {
                  firstChunk = true;
                  streamedSuccess = true;
                  setIsThinking(false);
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: botMsgId,
                      role: 'assistant',
                      time: formatTime(),
                      text: event.content,
                    },
                  ]);
                } else {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === botMsgId ? { ...m, text: m.text + event.content } : m
                    )
                  );
                }
              } else if (event.type === 'suggestions') {
                setSuggestions(event.suggestions || []);
              }
            } catch {
              // Ignore malformed lines
            }
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setIsThinking(false);
        setIsStreaming(false);
        return;
      }
    }

    // Strategy 2: If SSE stream returned non-ok/failed, try standard POST /chat endpoint
    if (!streamedSuccess && !controller.signal.aborted) {
      try {
        const res = await fetch(`${API_BASE_URL}/chat`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ message: text.trim() }),
          signal: controller.signal,
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.reply || data.response || data.text;
          if (reply) {
            streamedSuccess = true;
            setIsThinking(false);
            setMessages((prev) => [
              ...prev,
              {
                id: botMsgId,
                role: 'assistant',
                time: formatTime(),
                text: reply,
              },
            ]);
            setSuggestions(['Practice Coding Interview', 'Improve Resume', 'Generate Study Plan']);
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          setIsThinking(false);
          setIsStreaming(false);
          return;
        }
      }
    }

    // Strategy 3: Guaranteed client-side mentor fallback stream
    if (!streamedSuccess && !controller.signal.aborted) {
      setIsThinking(false);
      const fallbackText = getClientFallbackReply(text.trim());
      const words = fallbackText.split(' ');

      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: 'assistant',
          time: formatTime(),
          text: '',
        },
      ]);

      for (let i = 0; i < words.length; i += 3) {
        if (controller.signal.aborted) break;
        const chunk = words.slice(i, i + 3).join(' ') + ' ';
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsgId ? { ...m, text: m.text + chunk } : m))
        );
        await new Promise((r) => setTimeout(r, 35));
      }

      setSuggestions(['Practice Coding Interview', 'Improve Resume', 'Generate Study Plan']);
    }

    setIsStreaming(false);
    setIsThinking(false);
    abortControllerRef.current = null;
    streamingMsgIdRef.current = null;
  }, [isStreaming]);

  // Stop generating
  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Regenerate last response
  const handleRegenerate = useCallback(() => {
    // Find the last user message
    const userMessages = messages.filter((m) => m.role === 'user');
    if (userMessages.length === 0) return;

    const lastUserMsg = userMessages[userMessages.length - 1];

    // Remove the last assistant message
    setMessages((prev) => {
      const lastBotIndex = prev.findLastIndex((m) => m.role === 'assistant');
      if (lastBotIndex > -1) {
        return prev.filter((_, i) => i !== lastBotIndex);
      }
      return prev;
    });

    setSuggestions([]);

    // Re-send the last user prompt
    setTimeout(() => handleSend(lastUserMsg.text), 100);
  }, [messages, handleSend]);

  // Clear chat
  const handleClearChat = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/chat/clear`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.error('Clear chat error:', err);
    }
    setMessages([]);
    setSuggestions([]);
    setShowClearDialog(false);
  }, []);

  const isEmpty = historyLoaded && messages.length === 0;

  return (
    <div className="chat-container">
      <ChatHeader
        userInitials={userInitials}
        onClearChat={() => setShowClearDialog(true)}
      />

      <div className="chat-messages-area">
        {isEmpty ? (
          <ChatEmptyState onSendPrompt={handleSend} />
        ) : (
          <div className="chat-messages-list">
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                userInitials={userInitials}
                isLast={i === messages.length - 1 && msg.role === 'assistant'}
                onRegenerate={!isStreaming ? handleRegenerate : null}
              />
            ))}

            {isThinking && <TypingIndicator />}

            {!isStreaming && suggestions.length > 0 && (
              <SuggestionChips suggestions={suggestions} onSelect={handleSend} />
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput
        onSend={handleSend}
        isStreaming={isStreaming}
        onStop={handleStop}
      />

      {/* Clear Chat Confirmation Dialog */}
      {showClearDialog && (
        <div className="chat-dialog-overlay" onClick={() => setShowClearDialog(false)}>
          <div className="chat-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="chat-dialog__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </div>
            <h3 className="chat-dialog__title">Clear conversation?</h3>
            <p className="chat-dialog__text">
              Are you sure you want to clear this conversation? This will remove all messages and reset the assistant.
            </p>
            <div className="chat-dialog__actions">
              <button
                type="button"
                className="chat-dialog__btn chat-dialog__btn--cancel"
                onClick={() => setShowClearDialog(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="chat-dialog__btn chat-dialog__btn--confirm"
                onClick={handleClearChat}
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
