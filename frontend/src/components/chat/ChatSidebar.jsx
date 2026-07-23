import { useState } from 'react';

export function ChatSidebar({
  sessions = [],
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onUpdateSession,
  onDeleteSession,
  isOpen,
  onCloseMobile,
}) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredSessions = sessions.filter((s) =>
    (s.title || '').toLowerCase().includes(search.toLowerCase())
  );

  const pinnedSessions = filteredSessions.filter((s) => s.isPinned);
  const unpinnedSessions = filteredSessions.filter((s) => !s.isPinned);

  const handleStartRename = (session, e) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title || 'Untitled Chat');
  };

  const handleSaveRename = (sessionId, e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onUpdateSession(sessionId, { title: editTitle.trim() });
    }
    setEditingId(null);
  };

  const handleKeyDownRename = (sessionId, e) => {
    if (e.key === 'Enter') {
      handleSaveRename(sessionId, e);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleTogglePin = (session, e) => {
    e.stopPropagation();
    onUpdateSession(session.id, { isPinned: !session.isPinned });
  };

  const handleDelete = (sessionId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat conversation?')) {
      onDeleteSession(sessionId);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="chat-sidebar-backdrop" onClick={onCloseMobile} />}

      <aside className={`chat-sidebar ${isOpen ? 'chat-sidebar--open' : ''}`}>
        <div className="chat-sidebar__header">
          <button type="button" className="btn-new-chat" onClick={() => { onCreateSession(); onCloseMobile(); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>

        <div className="chat-sidebar__search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="btn-clear-search" onClick={() => setSearch('')}>
              ×
            </button>
          )}
        </div>

        <div className="chat-sidebar__list">
          {pinnedSessions.length > 0 && (
            <div className="chat-sidebar__group">
              <span className="chat-sidebar__group-label">📌 Pinned Chats</span>
              {pinnedSessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  editingId={editingId}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  onSelect={() => { onSelectSession(session.id); onCloseMobile(); }}
                  onStartRename={handleStartRename}
                  onSaveRename={handleSaveRename}
                  onKeyDownRename={handleKeyDownRename}
                  onTogglePin={handleTogglePin}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          <div className="chat-sidebar__group">
            {pinnedSessions.length > 0 && <span className="chat-sidebar__group-label">💬 Recent Chats</span>}
            {unpinnedSessions.length === 0 && pinnedSessions.length === 0 ? (
              <div className="chat-sidebar__empty">
                {search ? 'No matching conversations found' : 'No previous chat history'}
              </div>
            ) : (
              unpinnedSessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  editingId={editingId}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  onSelect={() => { onSelectSession(session.id); onCloseMobile(); }}
                  onStartRename={handleStartRename}
                  onSaveRename={handleSaveRename}
                  onKeyDownRename={handleKeyDownRename}
                  onTogglePin={handleTogglePin}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function SessionItem({
  session,
  isActive,
  editingId,
  editTitle,
  setEditTitle,
  onSelect,
  onStartRename,
  onSaveRename,
  onKeyDownRename,
  onTogglePin,
  onDelete,
}) {
  const isEditing = editingId === session.id;

  return (
    <div
      className={`chat-session-item ${isActive ? 'chat-session-item--active' : ''}`}
      onClick={onSelect}
    >
      <div className="chat-session-item__icon">
        {session.isPinned ? '📌' : '💬'}
      </div>

      <div className="chat-session-item__main">
        {isEditing ? (
          <input
            type="text"
            className="chat-session-item__input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={(e) => onSaveRename(session.id, e)}
            onKeyDown={(e) => onKeyDownRename(session.id, e)}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="chat-session-item__title" title={session.title}>
            {session.title || 'Untitled Conversation'}
          </span>
        )}
      </div>

      <div className="chat-session-item__actions">
        <button
          type="button"
          className={`btn-session-action ${session.isPinned ? 'active' : ''}`}
          onClick={(e) => onTogglePin(session, e)}
          title={session.isPinned ? 'Unpin chat' : 'Pin chat'}
        >
          📌
        </button>
        <button
          type="button"
          className="btn-session-action"
          onClick={(e) => onStartRename(session, e)}
          title="Rename conversation"
        >
          ✏️
        </button>
        <button
          type="button"
          className="btn-session-action btn-session-action--delete"
          onClick={(e) => onDelete(session.id, e)}
          title="Delete conversation"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
