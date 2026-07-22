import { useAuth } from '../../context/AuthContext.jsx';
import { Icon } from '../Icon.jsx';
import { RouteLink } from '../Common/RouteLink.jsx';
import { appNav } from '../../constants/navigation.js';

function ShellNav({ compact = false }) {
  return (
    <>
      {appNav.map((item) => (
        <RouteLink
          key={item.path}
          path={item.path}
          className={`nav-link ${compact ? 'nav-link--compact' : ''}`}
          activeClassName="nav-link--active"
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </RouteLink>
      ))}
    </>
  );
}

export function SidebarShell() {
  const { logout } = useAuth();
  return (
    <aside className="sidebar">
      <div className="brand">
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
      </div>

      <nav className="sidebar__nav">
        <ShellNav />
      </nav>

      <div className="sidebar__promo">
        <p>Upgrade to Pro</p>
        <span>Unlock AI-powered JD analysis and unlimited mock interviews.</span>
        <button type="button" className="sidebar__promo-btn">
          Go Premium
        </button>
      </div>

      <div className="sidebar__footer">
        <RouteLink path="/settings" className="nav-link" activeClassName="nav-link--active">
          <Icon name="settings" />
          <span>Settings</span>
        </RouteLink>
        <RouteLink path="/profile" className="nav-link" activeClassName="nav-link--active">
          <Icon name="user" />
          <span>Profile</span>
        </RouteLink>
        <button
          type="button"
          onClick={logout}
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
  );
}
