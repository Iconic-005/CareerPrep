import { useState } from 'react';
import { SidebarShell } from './Sidebar.jsx';
import { MobileNav } from './MobileNav.jsx';
import { Icon } from '../Icon.jsx';
import { RouteLink } from '../Common/RouteLink.jsx';

export function AppShell({ title, subtitle, actions, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Top Bar for Mobile & Tablet screens */}
      <div className="mobile-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="icon-circle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <Icon name="menu" />
          </button>
          <RouteLink path="/dashboard" className="mobile-top-bar__brand">
            <img src="/logo.png" alt="CareerPrep Logo" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
            <span>CareerPrep</span>
          </RouteLink>
        </div>
        <div className="mobile-top-bar__actions">
          <RouteLink path="/notifications" className="icon-circle" title="Notifications">
            <Icon name="bell" />
          </RouteLink>
        </div>
      </div>

      <SidebarShell isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">
        {title && (
          <header className="page-header">
            <div>
              <h2>{title}</h2>
              {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="page-header__actions">{actions}</div>}
          </header>
        )}
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
