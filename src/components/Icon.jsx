const iconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
};

function Svg({ children }) {
  return (
    <svg aria-hidden="true" {...iconProps}>
      {children}
    </svg>
  );
}

export function Icon({ name }) {
  switch (name) {
    case 'terminal':
      return (
        <Svg>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M7 10l3 3-3 3" />
          <path d="M12.5 16H17" />
        </Svg>
      );
    case 'dashboard':
      return (
        <Svg>
          <rect x="4" y="4" width="6" height="6" rx="1.5" />
          <rect x="14" y="4" width="6" height="6" rx="1.5" />
          <rect x="4" y="14" width="6" height="6" rx="1.5" />
          <rect x="14" y="14" width="6" height="6" rx="1.5" />
        </Svg>
      );
    case 'users':
      return (
        <Svg>
          <path d="M16 21v-1.5a4.5 4.5 0 0 0-4.5-4.5H8.5A4.5 4.5 0 0 0 4 19.5V21" />
          <circle cx="10" cy="8" r="3" />
          <path d="M20 21v-1a3.5 3.5 0 0 0-3-3.46" />
          <path d="M15.5 5.2a3 3 0 0 1 0 5.6" />
        </Svg>
      );
    case 'question':
      return (
        <Svg>
          <path d="M9.5 9a2.5 2.5 0 1 1 4 2l-1 1" />
          <path d="M12 17h.01" />
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5z" />
        </Svg>
      );
    case 'chartSquare':
      return (
        <Svg>
          <path d="M5 20V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14" />
          <path d="M8 16v-4" />
          <path d="M12 16v-7" />
          <path d="M16 16v-2" />
        </Svg>
      );
    case 'barChart':
      return (
        <Svg>
          <path d="M5 20V10" />
          <path d="M12 20V5" />
          <path d="M19 20v-7" />
        </Svg>
      );
    case 'gearSpark':
    case 'settings':
      return (
        <Svg>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 0 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 0 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 0 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a2 2 0 0 1 0 4h-.2a1 1 0 0 0-.9.6z" />
          {name === 'gearSpark' ? (
            <>
              <path d="M19 2v4" />
              <path d="M17 4h4" />
            </>
          ) : null}
        </Svg>
      );
    case 'help':
      return (
        <Svg>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.75 9a2.25 2.25 0 1 1 3.79 1.64c-.82.73-1.54 1.23-1.54 2.36" />
          <path d="M12 17h.01" />
        </Svg>
      );
    case 'calendar':
      return (
        <Svg>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4" />
          <path d="M8 3v4" />
          <path d="M3 10h18" />
        </Svg>
      );
    case 'broadcast':
      return (
        <Svg>
          <path d="M12 12a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5z" />
          <path d="M6.8 17.2a7.5 7.5 0 0 0 10.4 0" />
          <path d="M18.5 5.5a9.2 9.2 0 0 1 0 13" />
          <path d="M5.5 18.5a9.2 9.2 0 0 1 0-13" />
        </Svg>
      );
    case 'wallet':
      return (
        <Svg>
          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5z" />
          <path d="M4 9h16" />
          <path d="M15 14h3" />
          <circle cx="15" cy="14" r=".6" fill="currentColor" stroke="none" />
        </Svg>
      );
    case 'badge':
      return (
        <Svg>
          <path d="M12 3l2.4 1.2 2.7-.4 1.1 2.5 2.1 1.8-1 2.5 1 2.5-2.1 1.8-1.1 2.5-2.7-.4L12 21l-2.4-1.2-2.7.4-1.1-2.5-2.1-1.8 1-2.5-1-2.5 2.1-1.8 1.1-2.5 2.7.4z" />
          <path d="M9.5 12l1.6 1.6 3.4-3.7" />
        </Svg>
      );
    case 'trendUp':
      return (
        <Svg>
          <path d="M5 15l5-5 4 4 5-7" />
          <path d="M14 7h5v5" />
        </Svg>
      );
    case 'trendDown':
      return (
        <Svg>
          <path d="M5 9l5 5 4-4 5 7" />
          <path d="M14 17h5v-5" />
        </Svg>
      );
    case 'search':
      return (
        <Svg>
          <circle cx="11" cy="11" r="6" />
          <path d="M20 20l-4.2-4.2" />
        </Svg>
      );
    case 'more':
      return (
        <Svg>
          <circle cx="12" cy="6" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
        </Svg>
      );
    case 'chevronLeft':
      return (
        <Svg>
          <path d="M15 18l-6-6 6-6" />
        </Svg>
      );
    case 'chevronRight':
    case 'arrowRight':
      return (
        <Svg>
          <path d="M9 18l6-6-6-6" />
        </Svg>
      );
    case 'brain':
      return (
        <Svg>
          <path d="M9.5 6A3.5 3.5 0 0 1 16 7.7a3 3 0 0 1 1.7 4.6 3 3 0 0 1-2.2 5.3H14" />
          <path d="M9.5 6A3.5 3.5 0 0 0 3 7.7a3 3 0 0 0-1.7 4.6 3 3 0 0 0 2.2 5.3H5" />
          <path d="M12 4v16" />
          <path d="M8 11h4" />
          <path d="M8 15h4" />
        </Svg>
      );
    case 'code':
      return (
        <Svg>
          <path d="M9 8l-4 4 4 4" />
          <path d="M15 8l4 4-4 4" />
        </Svg>
      );
    case 'edit':
      return (
        <Svg>
          <path d="M4 20l4.5-1 9-9a2.1 2.1 0 0 0-3-3l-9 9z" />
          <path d="M13.5 6.5l3 3" />
        </Svg>
      );
    case 'analytics':
      return (
        <Svg>
          <path d="M4 19V9" />
          <path d="M10 19V5" />
          <path d="M16 19v-8" />
          <path d="M22 19V3" />
        </Svg>
      );
    case 'document':
      return (
        <Svg>
          <path d="M8 3h6l5 5v13H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path d="M14 3v6h6" />
          <path d="M10 13h6" />
          <path d="M10 17h4" />
        </Svg>
      );
    case 'mic':
      return (
        <Svg>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0" />
          <path d="M12 18v3" />
        </Svg>
      );
    case 'chat':
      return (
        <Svg>
          <path d="M7 18l-4 3V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z" />
          <path d="M8 10h8" />
          <path d="M8 14h5" />
        </Svg>
      );
    case 'roadmap':
      return (
        <Svg>
          <path d="M4 17c4 0 4-10 8-10s4 10 8 10" />
          <circle cx="4" cy="17" r="1.5" />
          <circle cx="12" cy="7" r="1.5" />
          <circle cx="20" cy="17" r="1.5" />
        </Svg>
      );
    case 'bell':
      return (
        <Svg>
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </Svg>
      );
    case 'user':
      return (
        <Svg>
          <circle cx="12" cy="8" r="4" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </Svg>
      );
    case 'spark':
      return (
        <Svg>
          <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" />
          <path d="M19 3v4" />
          <path d="M17 5h4" />
          <path d="M5 16v3" />
          <path d="M3.5 17.5h3" />
        </Svg>
      );
    case 'video':
      return (
        <Svg>
          <rect x="3" y="6" width="12" height="12" rx="2" />
          <path d="M15 10l6-3v10l-6-3z" />
        </Svg>
      );
    case 'history':
      return (
        <Svg>
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 3v6h6" />
          <path d="M12 7v5l3 2" />
        </Svg>
      );
    case 'folder':
      return (
        <Svg>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </Svg>
      );
    case 'plusCircle':
      return (
        <Svg>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </Svg>
      );
    case 'close':
      return (
        <Svg>
          <path d="M6 6l12 12" />
          <path d="M18 6l-12 12" />
        </Svg>
      );
    case 'share':
      return (
        <Svg>
          <circle cx="18" cy="5" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="19" r="2" />
          <path d="M8 11l8-5" />
          <path d="M8 13l8 5" />
        </Svg>
      );
    case 'download':
      return (
        <Svg>
          <path d="M12 3v12" />
          <path d="M7 10l5 5 5-5" />
          <path d="M4 20h16" />
        </Svg>
      );
    case 'bulb':
      return (
        <Svg>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M8 14a6 6 0 1 1 8 0c-1 1-1.5 1.8-1.8 4H9.8c-.3-2.2-.8-3-1.8-4z" />
        </Svg>
      );
    case 'bot':
      return (
        <Svg>
          <rect x="5" y="8" width="14" height="10" rx="3" />
          <path d="M12 3v3" />
          <path d="M9 13h.01" />
          <path d="M15 13h.01" />
          <path d="M8 18v2" />
          <path d="M16 18v2" />
        </Svg>
      );
    case 'paperclip':
      return (
        <Svg>
          <path d="M8 12.5l6.5-6.5a3 3 0 1 1 4.2 4.2L10 19a5 5 0 1 1-7.1-7.1l8.5-8.5" />
        </Svg>
      );
    case 'send':
      return (
        <Svg>
          <path d="M21 3L10 14" />
          <path d="M21 3l-7 18-4-7-7-4z" />
        </Svg>
      );
    case 'warning':
      return (
        <Svg>
          <path d="M12 3l10 18H2z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </Svg>
      );
    case 'checkCircle':
      return (
        <Svg>
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12.5l2.2 2.2 4.8-5.2" />
        </Svg>
      );
    case 'check':
      return (
        <Svg>
          <path d="M5 12.5l4 4L19 7" />
        </Svg>
      );
    default:
      return null;
  }
}
