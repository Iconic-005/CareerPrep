import { SidebarShell } from './Sidebar.jsx';
import { MobileNav } from './MobileNav.jsx';

/**
 * AppShell — standard authenticated page wrapper.
 *
 * Renders: sidebar + main content area with a page header.
 * Used by pages that follow the title/subtitle/actions header pattern.
 * Previously referenced in Notifications and Settings pages but was never
 * defined in the original monolith (latent bug). Now properly implemented.
 */
export function AppShell({ title, subtitle, actions, children }) {
  return (
    <div className="app-shell">
      <SidebarShell />
      <main className="main-content">
        <header className="page-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="page-header__actions">{actions}</div>}
        </header>
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
