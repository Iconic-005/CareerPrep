export function SuggestionChips({ suggestions = [], onSelect }) {
  if (!suggestions.length) return null;

  return (
    <div className="chat-suggestions">
      {suggestions.map((text, i) => (
        <button
          key={i}
          type="button"
          className="chat-suggestion-chip"
          onClick={() => onSelect(text)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          {text}
        </button>
      ))}
    </div>
  );
}
