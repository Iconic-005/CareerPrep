import { Icon } from '../Icon.jsx';
import { RouteLink } from '../Common/RouteLink.jsx';

const mobileNavItems = [
  { label: 'Home', path: '/dashboard', icon: 'dashboard' },
  { label: 'Resume', path: '/resume', icon: 'document' },
  { label: 'Analyze', path: '/jd-analyzer', icon: 'analytics' },
  { label: 'Coach', path: '/coach', icon: 'chat' },
];

export function MobileNav() {
  return (
    <nav className="mobile-nav">
      {mobileNavItems.map((item) => (
        <RouteLink
          key={item.path}
          path={item.path}
          className="mobile-nav__item"
          activeClassName="mobile-nav__item--active"
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </RouteLink>
      ))}
    </nav>
  );
}
