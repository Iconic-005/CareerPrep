import { useAuth } from '../../context/AuthContext.jsx';
import { useSidebar } from '../../context/SidebarContext.jsx';
import { Icon } from '../Icon.jsx';
import { RouteLink } from '../Common/RouteLink.jsx';
import { appNav } from '../../constants/navigation.js';

function ShellNav({ compact = false, onItemClick }) {
  return (
    <>
      {appNav.map((item) => (
        <RouteLink
          key={item.path}
          path={item.path}
          className={`nav-link ${compact ? 'nav-link--compact' : ''}`}
          activeClassName="nav-link--active"
          onClick={onItemClick}
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </RouteLink>
      ))}
    </>
  );
}

export function SidebarShell({ isOpen: propIsOpen, onClose: propOnClose }) {
  const { logout } = useAuth();
  const context = useSidebar();

  const isOpen = propIsOpen !== undefined ? propIsOpen : (context?.isOpen || false);
  const handleClose = propOnClose || context?.closeSidebar || (() => {});

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--open' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <RouteLink
            path="/dashboard"
            className="brand"
            onClick={handleClose}
            style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
          >
            <div className="brand__mark brand__mark--img">
              <img src="/logo.png" alt="CareerPrep Logo" className="brand__logo-img" />
            </div>
            <div>
              <h1>CareerPrep</h1>
              <div className="brand__meta">
                <span>AI Career OS</span>
                <span className="brand__badge">LIVE</span>
              </div>
            </div>
          </RouteLink>
        </div>

        <nav className="sidebar__nav">
          <ShellNav onItemClick={handleClose} />
        </nav>

        <div className="sidebar__promo">
          <p>Upgrade to Pro</p>
          <span>Unlock AI-powered JD analysis and unlimited mock interviews.</span>
          <RouteLink
            path="/settings"
            className="sidebar__promo-btn"
            onClick={handleClose}
            style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
          >
            Go Premium
          </RouteLink>
        </div>

        <div className="sidebar__footer">
          <RouteLink path="/settings" className="nav-link" activeClassName="nav-link--active" onClick={handleClose}>
            <Icon name="settings" />
            <span>Settings</span>
          </RouteLink>
          <RouteLink path="/profile" className="nav-link" activeClassName="nav-link--active" onClick={handleClose}>
            <Icon name="user" />
            <span>Profile</span>
          </RouteLink>
          <button
            type="button"
            onClick={() => {
              if (handleClose) handleClose();
              logout();
            }}
            className="nav-link"
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Icon name="logout" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
