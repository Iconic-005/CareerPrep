import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function BotAvatar() {
  return (
    <div className="chat-avatar chat-avatar--bot">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    </div>
  );
}

function UserAvatar({ initials }) {
  return <div className="chat-avatar chat-avatar--user">{initials}</div>;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button type="button" className="chat-action-btn" onClick={handleCopy} title="Copy to clipboard">
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

function RegenerateButton({ onClick }) {
  return (
    <button type="button" className="chat-action-btn" onClick={onClick} title="Regenerate response">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
      </svg>
      <span>Regenerate</span>
    </button>
  );
}

// Custom markdown components for clean rendering
const markdownComponents = {
  // Custom code block rendering
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline && (match || String(children).includes('\n'))) {
      return (
        <div className="chat-code-block">
          {match && <div className="chat-code-lang">{match[1]}</div>}
          <pre><code className={className} {...props}>{children}</code></pre>
        </div>
      );
    }
    return <code className="chat-inline-code" {...props}>{children}</code>;
  },
  // Clean table rendering
  table({ children }) {
    return (
      <div className="chat-table-wrap">
        <table className="chat-table">{children}</table>
      </div>
    );
  },
  // Open links in new tab
  a({ href, children }) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
  },
};

export function MessageBubble({ message, userInitials, isLast, onRegenerate }) {
  const isUser = message.role === 'user';

  return (
    <div className={`chat-msg ${isUser ? 'chat-msg--user' : 'chat-msg--bot'}`}>
      {!isUser && <BotAvatar />}

      <div className="chat-msg__body">
        <div className={isUser ? 'chat-bubble chat-bubble--user' : 'chat-bubble chat-bubble--bot'}>
          {isUser ? (
            <p>{message.text}</p>
          ) : (
            <div className="chat-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {message.text || ''}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <div className="chat-msg__meta">
          <span className="chat-msg__time">
            {isUser ? 'You' : 'AI Assistant'} • {message.time}
          </span>

          {!isUser && message.text && (
            <div className="chat-msg__actions">
              <CopyButton text={message.text} />
              {isLast && onRegenerate && (
                <RegenerateButton onClick={onRegenerate} />
              )}
            </div>
          )}
        </div>
      </div>

      {isUser && <UserAvatar initials={userInitials} />}
    </div>
  );
}
