import { useState, useEffect } from 'react';

/**
 * Custom hook that tracks the current window pathname and
 * re-renders consumers whenever navigation occurs.
 */
export function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname || '/');

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return pathname;
}

/**
 * Imperative navigation helper. Not a hook — can be imported anywhere.
 */
export function navigate(path) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}
