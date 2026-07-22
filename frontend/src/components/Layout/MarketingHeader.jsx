import { Icon } from '../Icon.jsx';
import { RouteLink } from '../Common/RouteLink.jsx';
import { marketingLinks } from '../../constants/navigation.js';

export function MarketingHeader() {
  return (
    <header className="marketing-header">
      <div className="marketing-header__brand">
        <div className="brand__mark brand__mark--small brand__mark--img">
          <img src="/logo.png" alt="CareerPrep Logo" className="brand__logo-img" />
        </div>
        <span className="brand-name-text">CareerPrep</span>
      </div>

      <nav className="marketing-header__nav">
        {marketingLinks.map((item) => (
          <RouteLink
            key={item.path}
            path={item.path}
            className="marketing-link"
            activeClassName="marketing-link--active"
          >
            {item.label}
          </RouteLink>
        ))}
      </nav>

      <div className="marketing-header__actions">
        <button type="button" className="header-icon-btn" title="Notifications">
          <Icon name="bell" />
        </button>
        <button type="button" className="header-icon-btn" title="Settings">
          <Icon name="settings" />
        </button>
        <RouteLink path="/auth" className="header-avatar-btn">
          <img src="/images/avatar_alex.png" alt="User Profile" />
        </RouteLink>
      </div>
    </header>
  );
}
