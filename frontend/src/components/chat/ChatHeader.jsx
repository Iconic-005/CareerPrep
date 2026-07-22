export function ChatHeader({ userInitials, onClearChat }) {
  return (
    <div className="chat-header">
      <div className="chat-header__left">
        <div className="chat-header__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
        <div>
          <h1 className="chat-header__title">Career AI Assistant</h1>
          <span className="chat-header__subtitle">Your personal career mentor</span>
        </div>
      </div>
      <div className="chat-header__right">
        <button
          type="button"
          className="chat-header__clear-btn"
          onClick={onClearChat}
          title="Clear conversation"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
          <span>Clear Chat</span>
        </button>
        <div className="chat-header__avatar">{userInitials}</div>
      </div>
    </div>
  );
}
