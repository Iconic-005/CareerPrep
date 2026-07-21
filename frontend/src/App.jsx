import { createContext, useContext, useEffect, useState } from 'react';
import { Icon } from './components/Icon.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        localStorage.removeItem('careerprep_token');
        localStorage.removeItem('careerprep_userid');
        localStorage.removeItem('careerprep_username');
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('careerprep_token');
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('careerprep_token', token);
    localStorage.setItem('careerprep_userid', userData.id);
    localStorage.setItem('careerprep_username', userData.name);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('careerprep_token');
    localStorage.removeItem('careerprep_userid');
    localStorage.removeItem('careerprep_username');
    setUser(null);
    navigate('/auth');
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));
    if (updatedUser.name) {
      localStorage.setItem('careerprep_username', updatedUser.name);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

function RouteGuard({ path, children }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user && path !== '/' && path !== '/auth') {
      navigate('/auth');
    }
    if (!loading && user && path === '/auth') {
      navigate('/dashboard');
    }
  }, [user, loading, path]);

  if (loading) {
    return (
      <div className="auth-shell auth-shell--single" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#090d16' }}>
        <div style={{ textAlign: 'center', color: '#6366f1' }}>
          <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #6366f1', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Verifying your secure session...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  const isPublic = path === '/' || path === '/auth';
  if (!user && !isPublic) {
    return null;
  }

  return children;
}

const appNav = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Resume Builder', path: '/resume', icon: 'document' },
  { label: 'Mock Interviews', path: '/interview-report', icon: 'mic' },
  { label: 'JD Analyzer', path: '/jd-analyzer', icon: 'analytics' },
  { label: 'Roadmap', path: '/roadmap', icon: 'roadmap' },
  { label: 'Practice', path: '/practice', icon: 'code' },
  { label: 'AI Coach', path: '/coach', icon: 'chat' },
];

const marketingLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Resume', path: '/resume' },
  { label: 'Interviews', path: '/interview-report' },
  { label: 'Roadmap', path: '/roadmap' },
];

const morePages = [
  { label: 'Notifications', path: '/notifications' },
  { label: 'Profile', path: '/profile' },
  { label: 'Settings', path: '/settings' },
  { label: 'Admin', path: '/admin' },
  { label: 'Auth', path: '/auth' },
];

function getAuthHeaders() {
  const token = localStorage.getItem('careerprep_token') || '';
  const userId = localStorage.getItem('careerprep_userid') || '';
  const userName = localStorage.getItem('careerprep_username') || '';
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
    'x-user-id': userId,
    'x-user-name': encodeURIComponent(userName),
  };
}

function EmptyState({ title = 'No data available', message = 'Complete actions to populate this section.', actionLabel, onAction, icon = 'bulb' }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8' }}>
      <div style={{ fontSize: '28px', marginBottom: '8px' }}><Icon name={icon} /></div>
      <h4 style={{ color: '#f8fafc', margin: '4px 0', fontSize: '1.05rem', fontWeight: 600 }}>{title}</h4>
      <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: '#94a3b8' }}>{message}</p>
      {actionLabel && onAction ? (
        <button type="button" className="primary-button" onClick={onAction}>{actionLabel}</button>
      ) : null}
    </div>
  );
}

const settingsTabs = [
  'Profile',
  'Account',
  'Theme',
  'Notifications',
  'Security',
  'Billing',
];

const systemHealth = [
  { label: 'API Latency', value: '24ms' },
  { label: 'GPU Load (AI Inference)', value: '62%' },
  { label: 'Error Rate', value: '0.002%', accent: 'mint' },
];

const resourceGroups = [
  {
    title: 'Aptitude Pool',
    icon: 'brain',
    tone: 'blue',
    action: 'Manage All',
    buttonLabel: '+ Add Category',
    items: [
      { title: 'Quantitative Reasoning', subtitle: '420 Questions' },
      { title: 'Logical Deduction', subtitle: '315 Questions' },
    ],
  },
  {
    title: 'Coding Challenges',
    icon: 'code',
    tone: 'violet',
    action: 'Manage All',
    buttonLabel: '+ New Challenge',
    items: [
      { title: 'Data Structures', subtitle: 'Expert • 85 Problems' },
      { title: 'System Design', subtitle: 'Senior • 42 Case Studies' },
    ],
  },
];

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname || '/');

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return pathname;
}

function navigate(path) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

function RouteLink({ path, children, className = '', activeClassName = '', onClick }) {
  const active = window.location.pathname === path;

  return (
    <button
      type="button"
      onClick={() => {
        navigate(path);
        onClick?.();
      }}
      className={`${className} ${active ? activeClassName : ''}`.trim()}
    >
      {children}
    </button>
  );
}

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

function SidebarShell() {
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
          style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <Icon name="logout" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function MobileNav() {
  const items = [
    { label: 'Home', path: '/dashboard', icon: 'dashboard' },
    { label: 'Resume', path: '/resume', icon: 'document' },
    { label: 'Analyze', path: '/jd-analyzer', icon: 'analytics' },
    { label: 'Coach', path: '/coach', icon: 'chat' },
  ];

  return (
    <nav className="mobile-nav">
      {items.map((item) => (
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

function MarketingHeader() {
  return (
    <header className="marketing-header">
      <div className="marketing-header__brand">
        <div className="brand__mark brand__mark--small brand__mark--img">
          <img src="/logo.png" alt="CareerPrep Logo" className="brand__logo-img" />
        </div>
        <span>CareerPrep</span>
      </div>

      <nav className="marketing-header__nav">
        {marketingLinks.map((item) => (
          <RouteLink key={item.path} path={item.path} className="marketing-link" activeClassName="marketing-link--active">
            {item.label}
          </RouteLink>
        ))}
      </nav>

      <div className="marketing-header__actions">
        <RouteLink path="/auth" className="ghost-button">
          Sign In
        </RouteLink>
        <RouteLink path="/dashboard" className="primary-button">
          Open App
        </RouteLink>
      </div>
    </header>
  );
}

function MarketingFooter() {
  return (
    <footer className="footer footer--marketing">
      <p>© 2026 CareerPrep AI. All rights reserved.</p>
      <div className="footer__links">
        <a href="/">Privacy Policy</a>
        <a href="/">Terms of Service</a>
        <a href="/">Contact Support</a>
        <a href="/">Career Blog</a>
      </div>
    </footer>
  );
}

function AppShell({ title, subtitle, actions, children }) {
  const { user } = useAuth();
  const name = user?.name || 'User';
  const parts = name.trim().split(' ');
  const initials = parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();

  return (
    <div className="app-shell">
      <SidebarShell />
      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="eyebrow">Career OS</p>
            <h2>{title}</h2>
            <p className="page-header__subtitle">{subtitle}</p>
          </div>
          <div className="page-header__actions">
            {actions}
            <RouteLink path="/notifications" className="icon-circle" activeClassName="icon-circle--active">
              <Icon name="bell" />
            </RouteLink>
            <RouteLink path="/profile" className="avatar-chip" activeClassName="avatar-chip--active">
              <span>{initials}</span>
            </RouteLink>
          </div>
        </header>
        {children}
      </main>
      <MobileNav />
    </div>
  );
}

function LandingPage() {
  return (
    <div className="marketing-shell">
      <MarketingHeader />

      <section className="hero">
        <div className="hero__copy">
          <div className="pill">
            <Icon name="spark" />
            <span>AI-Powered Career OS</span>
          </div>
          <h1>
            Master your career
            <br />
            journey with AI
          </h1>
          <p>
            The intelligent command center for ambitious professionals. Analyze your resume,
            practice with AI avatars, and build a personalized roadmap to your next role.
          </p>
          <div className="hero__actions">
            <RouteLink path="/resume" className="primary-button">
              Build Resume
            </RouteLink>
            <RouteLink path="/interview-report" className="ghost-button">
              Mock Interview
            </RouteLink>
          </div>
          <div className="hero__social-proof">
            <div className="avatar-stack">
              <span />
              <span />
              <span />
            </div>
            <p>
              Joined by <strong>50k+</strong> professionals
            </p>
          </div>
        </div>

        <div className="hero__visual card">
          <div className="hero__orb hero__orb--one" />
          <div className="hero__orb hero__orb--two" />
          <div className="hero__mock">
            <div className="hero__mock-header">
              <span>AI Career Coach</span>
              <Icon name="spark" />
            </div>
            <div className="hero__mock-score">
              <strong>Career Readiness 92%</strong>
              <p>Resume, interviews, and roadmap trending up this week.</p>
            </div>
            <div className="hero__progress">
              <div>
                <span>Resume Upload</span>
                <strong>75%</strong>
              </div>
              <div className="progress progress--tall">
                <span className="progress__fill progress__fill--blue" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-stats">
        {[
          ['50k+', 'Careers Built'],
          ['94%', 'Placement Rate'],
          ['120+', 'Global Partners'],
          ['4.9/5', 'User Rating'],
        ].map(([value, label]) => (
          <article key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section className="marketing-section">
        <div className="section-head">
          <h2>Everything you need to land your dream role</h2>
          <p>Powerful AI tools integrated into a single, high-clarity workflow.</p>
        </div>

        <div className="feature-grid">
          <article className="feature-card feature-card--large">
            <div className="feature-card__icon feature-card__icon--blue">
              <Icon name="document" />
            </div>
            <h3>AI Resume Analysis</h3>
            <p>Real-time feedback on structure, keywords, ATS alignment, and impact.</p>
          </article>
          <article className="feature-card">
            <div className="feature-card__icon feature-card__icon--violet">
              <Icon name="mic" />
            </div>
            <h3>Mock Interviews</h3>
            <p>Practice with lifelike AI feedback across technical and behavioral rounds.</p>
          </article>
          <article className="feature-card">
            <div className="feature-card__icon feature-card__icon--slate">
              <Icon name="roadmap" />
            </div>
            <h3>Roadmap</h3>
            <p>Step-by-step pathing based on your goals, level, and hiring signals.</p>
          </article>
          <article className="feature-card feature-card--dark">
            <div className="feature-card__icon feature-card__icon--white">
              <Icon name="chat" />
            </div>
            <h3>24/7 AI Coach</h3>
            <p>Salary advice, career strategy, networking support, and instant feedback.</p>
          </article>
          <article className="feature-card feature-card--wide">
            <div className="feature-card__icon feature-card__icon--blue">
              <Icon name="analytics" />
            </div>
            <div>
              <h3>Aptitude + JD Analysis</h3>
              <p>Match your experience to real job descriptions and identify the gaps fast.</p>
            </div>
            <RouteLink path="/jd-analyzer" className="primary-button">
              Explore Analytics
            </RouteLink>
          </article>
        </div>
      </section>

      <section className="marketing-section marketing-section--pricing">
        <div className="section-head">
          <h2>Simple, transparent pricing</h2>
          <p>Pick the right operating mode for your next career move.</p>
        </div>
        <div className="pricing-grid">
          <PricingCard title="Free" price="$0" cta="Get Started" items={['1 resume analysis / mo', 'Basic mock interview', 'Community access']} />
          <PricingCard
            title="Pro"
            price="$19"
            featured
            cta="Start 7-Day Free Trial"
            items={['Unlimited resume analysis', 'Priority AI interviews', 'Custom roadmap', 'Salary negotiation AI']}
          />
          <PricingCard title="Team" price="Custom" cta="Contact Sales" items={['Enterprise dashboard', 'Team analytics', 'Dedicated success manager']} />
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function PricingCard({ title, price, items, cta, featured = false }) {
  return (
    <article className={`pricing-card ${featured ? 'pricing-card--featured' : ''}`}>
      {featured ? <span className="pricing-badge">Most Popular</span> : null}
      <p>{title}</p>
      <h3>{price}</h3>
      <div className="pricing-card__items">
        {items.map((item) => (
          <div key={item}>
            <Icon name="checkCircle" />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <RouteLink path={title === 'Team' ? '/auth' : '/dashboard'} className={featured ? 'ghost-button ghost-button--inverse' : 'ghost-button'}>
        {cta}
      </RouteLink>
    </article>
  );
}

function AuthPage() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim() || (!isLogin && !form.name.trim())) {
      setError('Please complete all required fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.token && data.user) {
        login(data.token, data.user);
      }

      navigate('/dashboard');
    } catch (submitError) {
      setError(submitError.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-panel auth-panel--form">
        <div className="auth-form">
          <div className="auth-brand">
            <div className="brand__mark brand__mark--img">
              <img src="/logo.png" alt="CareerPrep Logo" className="brand__logo-img" />
            </div>
            <div>
              <h1>{isLogin ? 'Welcome back' : 'Create an account'}</h1>
              <p>
                {isLogin
                  ? 'Enter your details to access your career dashboard.'
                  : 'Start your journey toward professional excellence.'}
              </p>
            </div>
          </div>

          <div className="auth-toggle">
            <button type="button" className={isLogin ? 'auth-toggle__item auth-toggle__item--active' : 'auth-toggle__item'} onClick={() => setIsLogin(true)}>
              Log in
            </button>
            <button type="button" className={!isLogin ? 'auth-toggle__item auth-toggle__item--active' : 'auth-toggle__item'} onClick={() => setIsLogin(false)}>
              Sign up
            </button>
          </div>

          <button type="button" className="oauth-button" onClick={() => navigate('/dashboard')}>
            <Icon name="spark" />
            Continue with Google
          </button>

          <div className="divider">
            <span>or email</span>
          </div>

          <form className="auth-fields" onSubmit={handleSubmit} noValidate>
            {!isLogin ? <input aria-label="Full name" placeholder="Full Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /> : null}
            <input aria-label="Email address" placeholder="Email address" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            <input aria-label="Password" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
            {error ? <p className="form-error" role="alert">{error}</p> : null}
            <button type="submit" className="primary-button primary-button--full" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : isLogin ? 'Log in to your account' : 'Get started for free'}
            </button>
          </form>

          <p className="auth-footnote">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button type="button" onClick={() => setIsLogin((value) => !value)}>
              {isLogin ? 'Create one now' : 'Log in here'}
            </button>
          </p>
        </div>
      </section>

      <section className="auth-panel auth-panel--visual">
        <div className="auth-visual-card">
          <div className="pill pill--inverse">
            <Icon name="spark" />
            <span>AI-Powered Growth</span>
          </div>
          <h2>Master your career trajectory with precision.</h2>
          <p>
            Connect your profile and let our intelligence engine map the path from
            entry-level to leadership.
          </p>
          <div className="auth-visual-card__stats">
            <article>
              <span>Success Rate</span>
              <strong>94.8%</strong>
            </article>
            <article>
              <span>Paths Created</span>
              <strong>12.5k+</strong>
            </article>
          </div>
          <div className="bars">
            {[24, 44, 78, 51, 100, 74, 37, 60].map((height) => (
              <span key={height} style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function UserDashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [newGoal, setNewGoal] = useState('');
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);

  const loadDashboard = () => {
    fetch(`${API_BASE_URL}/dashboard`, { headers: getAuthHeaders() })
      .then((response) => response.json())
      .then((data) => setDashboardData(data))
      .catch(() => setDashboardData(null));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    setIsSubmittingGoal(true);
    try {
      await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: newGoal }),
      });
      setNewGoal('');
      loadDashboard();
    } finally {
      setIsSubmittingGoal(false);
    }
  };

  const handleToggleGoal = async (goal) => {
    try {
      await fetch(`${API_BASE_URL}/goals/${goal.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ done: !goal.done }),
      });
      loadDashboard();
    } catch (err) {
      console.error('Failed to update goal', err);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      loadDashboard();
    } catch (err) {
      console.error('Failed to delete goal', err);
    }
  };

  if (!dashboardData) {
    return <AppShell title="Loading..." subtitle="Fetching your career insights." actions={null}><p className="text-muted">Loading your dashboard…</p></AppShell>;
  }

  const hasActivity = (dashboardData.weeklyActivity || []).some(d => d.count > 0);
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <AppShell
      title={`Hello, ${firstName}`}
      subtitle="Ready to land your dream role? Here's your prep summary."
      actions={<button type="button" className="ghost-button"><Icon name="calendar" />Last 7 Days</button>}
    >
      <section className="dashboard-grid">
        <article className="card readiness-card">
          <p className="eyebrow">Career Readiness</p>
          <div className="ring">
            <div className="ring__inner">
              <strong>{dashboardData.readiness || 0}</strong>
              <span>%</span>
            </div>
          </div>
          <h3>{dashboardData.readiness > 50 ? 'Great Progress' : 'Start Your Journey'}</h3>
          <p>{dashboardData.readiness > 0 ? 'Your calculated readiness score.' : 'Complete daily goals and scans to boost readiness.'}</p>
        </article>

        <div className="dashboard-grid__stack">
          <div className="mini-stats">
            {(dashboardData.stats || []).map((item) => (
              <article key={item.title} className={`card mini-stat mini-stat--${item.accent}`}>
                <div className="mini-stat__head">
                  <Icon name={item.icon} />
                  <span>{item.title}</span>
                </div>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>

          <article className="card chart-card">
            <div className="panel__header panel__header--tight">
              <h3>Weekly Activity</h3>
              <button type="button" className="text-button">Last 7 Days</button>
            </div>
            {!hasActivity ? (
              <EmptyState title="No activity recorded" message="Actions like setting goals and optimizing resumes will appear here." icon="analytics" />
            ) : (
              <div className="chart">
                <svg viewBox="0 0 400 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="dashboardGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(37,108,240,0.22)" />
                      <stop offset="100%" stopColor="rgba(37,108,240,0)" />
                    </linearGradient>
                  </defs>
                  <path d="M0,90 Q50,84 90,44 T170,54 T245,20 T320,68 T400,34" fill="none" stroke="#256cf0" strokeWidth="4" strokeLinecap="round" />
                  <path d="M0,90 Q50,84 90,44 T170,54 T245,20 T320,68 T400,34 V120 H0 Z" fill="url(#dashboardGradient)" />
                </svg>
                <div className="chart__labels">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </section>

      <section className="dashboard-lower">
        <div className="dashboard-lower__main">
          {dashboardData.upcomingInterview ? (
            <article className="card spotlight-card">
              <div className="spotlight-card__meta">
                <div className="spotlight-card__icon"><Icon name="video" /></div>
                <div>
                  <h3>Upcoming Interview</h3>
                  <p>{dashboardData.upcomingInterview.role} · {dashboardData.upcomingInterview.difficulty}</p>
                </div>
              </div>
              <div className="spotlight-card__footer">
                <div><strong>02</strong><span>Days Left</span></div>
                <button type="button" className="ghost-button ghost-button--inverse">Prepare Now</button>
              </div>
            </article>
          ) : (
            <article className="card panel">
              <EmptyState title="No interview scheduled" message="Mock interview sessions will show up here." actionLabel="Practice Interview" onAction={() => navigate('/interview-report')} icon="mic" />
            </article>
          )}

          <article className="card panel">
            <div className="panel__header panel__header--tight">
              <h3>Daily Goals</h3>
            </div>
            <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Add a new goal..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
              />
              <button type="submit" className="primary-button" disabled={isSubmittingGoal || !newGoal.trim()}>
                {isSubmittingGoal ? 'Adding...' : 'Add'}
              </button>
            </form>
            {dashboardData.goals.length === 0 ? (
              <EmptyState title="No daily goals set" message="Add a goal above to start tracking your daily progress." icon="check" />
            ) : (
              <div className="goal-list">
                {dashboardData.goals.map((goal) => (
                  <GoalItem
                    key={goal.id || goal.title}
                    done={goal.done}
                    title={goal.title}
                    status={goal.status}
                    onToggle={() => handleToggleGoal(goal)}
                    onDelete={() => handleDeleteGoal(goal.id)}
                  />
                ))}
              </div>
            )}
          </article>
        </div>

        <article className="card panel timeline-card">
          <h3>Recent Activity</h3>
          {(dashboardData.recentActivity || []).length === 0 ? (
            <EmptyState title="No recent activity" message="Your activity log will populate as you perform actions." icon="clock" />
          ) : (
            <div className="timeline">
              {dashboardData.recentActivity.map((act) => (
                <TimelineItem key={act.id || act.title} title={act.title} desc={act.desc} time={act.time} tone={act.tone || 'blue'} />
              ))}
            </div>
          )}
        </article>
      </section>
    </AppShell>
  );
}

function GoalItem({ done, title, status, onToggle, onDelete }) {
  return (
    <div className="goal-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
      <div className="goal-item__title" onClick={onToggle}>
        <span className={`checkbox ${done ? 'checkbox--done' : ''}`}>
          {done ? <Icon name="check" /> : null}
        </span>
        <span className={done ? 'text-strike' : ''}>{title}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className={done ? 'text-blue' : 'text-muted'}>{status}</span>
        {onDelete ? (
          <button type="button" className="icon-button" onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ padding: '4px', opacity: 0.6 }}>
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}

function TimelineItem({ title, desc, time, tone }) {
  return (
    <div className="timeline-item">
      <span className={`timeline-item__dot timeline-item__dot--${tone}`}>
        <Icon name="spark" />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{desc}</p>
        <span>{time}</span>
      </div>
    </div>
  );
}

function ResumePage() {
  const { user } = useAuth();
  const [selectedVersion, setSelectedVersion] = useState('Senior Product Designer_v2.pdf');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Resume State
  const [candidateName, setCandidateName] = useState(user?.name || 'Alex Thompson');
  const [candidateRole, setCandidateRole] = useState('Senior Product Designer & Systems Architect');
  const [candidateEmail, setCandidateEmail] = useState(user?.email || 'alex.t@example.com');
  const [candidatePhone, setCandidatePhone] = useState('+1 (555) 000-1234');
  const [candidateLocation, setCandidateLocation] = useState('New York, NY');

  const [addedSkills, setAddedSkills] = useState([]);
  const [hasProjectsSection, setHasProjectsSection] = useState(false);
  const [missingSkills, setMissingSkills] = useState(['Python', 'AWS', 'Kubernetes']);
  const [suggestions, setSuggestions] = useState([
    {
      id: 's1',
      type: 'blue',
      icon: 'trendUp',
      title: 'Quantify your achievements in the Stripe role.',
      desc: 'Adding specific percentages increases credibility with ATS filters by 22%.',
    },
    {
      id: 's2',
      type: 'purple',
      icon: 'spark',
      title: 'Rewrite Summary for "Leadership" focus.',
      desc: 'The current summary is too task-oriented. Focus more on strategic outcomes.',
    },
  ]);
  const [atsScore, setAtsScore] = useState(82);
  const [skillMatchScore, setSkillMatchScore] = useState(88);
  const [highlightApplied, setHighlightApplied] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/resume`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data?.score && !isNaN(parseInt(data.score, 10))) {
          setAtsScore(parseInt(data.score, 10));
        }
      })
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    setIsOptimizing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/resume/optimize`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ resumeText: `${candidateName} - ${candidateRole}` }),
      });
      const data = await response.json();
      if (data?.score) {
        setAtsScore(parseInt(data.score, 10) || 88);
      } else {
        setAtsScore((prev) => Math.min(98, prev + 6));
      }
      setSkillMatchScore((prev) => Math.min(99, prev + 5));
      setHighlightApplied(true);
    } catch (err) {
      setAtsScore((prev) => Math.min(98, prev + 6));
      setSkillMatchScore((prev) => Math.min(99, prev + 5));
      setHighlightApplied(true);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAddSkill = (skill) => {
    setMissingSkills((prev) => prev.filter((s) => s !== skill));
    setAddedSkills((prev) => [...prev, skill]);
    setSkillMatchScore((prev) => Math.min(99, prev + 3));
  };

  const handleAddProjects = () => {
    setHasProjectsSection(true);
  };

  const handleDismissSuggestion = (id) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleApplySuggestion = (id) => {
    setHighlightApplied(true);
    setAtsScore((prev) => Math.min(98, prev + 4));
    handleDismissSuggestion(id);
  };

  const handleDownload = () => {
    window.print();
  };

  const versionHistory = [
    { name: 'Senior Product Designer_v2.pdf', date: 'Saved 2 hours ago (Current)', score: '82 ATS' },
    { name: 'Product Architect_v1.pdf', date: 'Saved yesterday', score: '78 ATS' },
    { name: 'Fullstack Engineer_v3.pdf', date: 'Saved 3 days ago', score: '74 ATS' },
  ];

  return (
    <div className="app-shell">
      <SidebarShell />

      <main className="main-content--resume">
        {/* TOP RESUME BAR */}
        <div className="resume-top-nav">
          <div className="resume-top-left">
            <h1 className="resume-title-heading">Resume Builder</h1>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                className="resume-version-dropdown-btn"
              >
                <option value="Senior Product Designer_v2.pdf">Senior Product Designer_v2.pdf</option>
                <option value="Product Architect_v1.pdf">Product Architect_v1.pdf</option>
                <option value="Fullstack Engineer_v3.pdf">Fullstack Engineer_v3.pdf</option>
              </select>
            </div>
          </div>

          <div className="resume-top-actions">
            <button
              type="button"
              className="btn-outline-secondary"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              <Icon name="edit" />
              <span>{isEditMode ? 'Done Editing' : 'Edit Resume'}</span>
            </button>
            <button
              type="button"
              className="btn-outline-secondary"
              onClick={() => setShowVersionModal(true)}
            >
              <Icon name="history" />
              <span>Version History</span>
            </button>
            <button type="button" className="btn-outline-secondary" onClick={handleDownload}>
              <Icon name="download" />
              <span>Download</span>
            </button>
            <button type="button" className="btn-primary-spark" onClick={handleGenerate} disabled={isOptimizing}>
              <Icon name="spark" />
              <span>{isOptimizing ? 'Generating...' : 'Generate Improved Resume'}</span>
            </button>
          </div>
        </div>

        {/* RESUME GRID WORKSPACE */}
        <div className="resume-grid-container">
          {/* CENTER PREVIEW DOCUMENT STAGE */}
          <div className="resume-paper-wrapper">
            {/* CANDIDATE HEADER */}
            {isEditMode ? (
              <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Candidate Name"
                  style={{ fontSize: '1.5rem', fontWeight: 800, padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <input
                  type="text"
                  value={candidateRole}
                  onChange={(e) => setCandidateRole(e.target.value)}
                  placeholder="Professional Title"
                  style={{ fontSize: '1rem', fontWeight: 600, color: '#256cf0', padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="Email"
                    style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                  <input
                    type="text"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    placeholder="Phone"
                    style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                  <input
                    type="text"
                    value={candidateLocation}
                    onChange={(e) => setCandidateLocation(e.target.value)}
                    placeholder="Location"
                    style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="resume-candidate-name">{candidateName}</h2>
                <p className="resume-candidate-role">{candidateRole}</p>

                <div className="resume-contact-row">
                  <span className="resume-contact-item">
                    <Icon name="mail" />
                    <span>{candidateEmail}</span>
                  </span>
                  <span className="resume-contact-item">
                    <Icon name="phone" />
                    <span>{candidatePhone}</span>
                  </span>
                  <span className="resume-contact-item">
                    <Icon name="mapPin" />
                    <span>{candidateLocation}</span>
                  </span>
                </div>
              </>
            )}

            <hr className="resume-header-line" />

            {/* PROFESSIONAL EXPERIENCE */}
            <div className="resume-section-heading">PROFESSIONAL EXPERIENCE</div>

            {/* JOB 1: Stripe */}
            <div className="resume-job-item">
              <div className="resume-job-row">
                <span className="resume-company-name">Stripe</span>
                <span className="resume-job-date">2021 — Present</span>
              </div>
              <div className="resume-job-subtitle">Senior Product Designer (Checkout & Payments)</div>
              <ul className="resume-bullet-points">
                <li>
                  Led the redesign of the Stripe Checkout flow for high-volume merchants, resulting in a 14% increase in conversion rates across mobile platforms.
                </li>
                <li>
                  Collaborated with engineering teams to develop a scalable design system for payment method expansion in emerging markets.
                </li>
                <li className="resume-ai-highlight-box">
                  Executed visual interface updates for the dashboard.{' '}
                  <span className="resume-ai-tag">(AI Suggestion: Quantify your achievements in this role).</span>
                </li>
                {highlightApplied && (
                  <li style={{ color: '#16a34a', fontWeight: 600 }}>
                    ✓ Increased operational velocity by 34% through automated Figma-to-code token sync pipelines.
                  </li>
                )}
              </ul>
            </div>

            {/* JOB 2: Figma */}
            <div className="resume-job-item">
              <div className="resume-job-row">
                <span className="resume-company-name">Figma</span>
                <span className="resume-job-date">2018 — 2021</span>
              </div>
              <div className="resume-job-subtitle">Product Designer (Design Systems Team)</div>
              <ul className="resume-bullet-points">
                <li>
                  Maintained and scaled the internal 'FigUI' design system, supporting over 200 engineers and 40 designers.
                </li>
                <li>
                  Spearheaded the release of Auto-Layout v3.0 documentation and onboarding tutorials.
                </li>
              </ul>
            </div>

            {/* EDUCATION */}
            <div className="resume-section-heading">EDUCATION</div>
            <div className="resume-job-item">
              <div className="resume-job-row">
                <span className="resume-edu-school">Rhode Island School of Design</span>
                <span className="resume-job-date">Class of 2018</span>
              </div>
              <div className="resume-job-subtitle">B.F.A. in Industrial Design</div>
            </div>

            {/* ADDED SKILLS */}
            {addedSkills.length > 0 && (
              <>
                <div className="resume-section-heading">ADDITIONAL SKILLS</div>
                <p style={{ fontSize: '0.9rem', color: '#334155', margin: '0 0 1rem 0' }}>
                  {addedSkills.join(' • ')}
                </p>
              </>
            )}

            {/* PROJECTS SECTION */}
            {hasProjectsSection && (
              <>
                <div className="resume-section-heading">KEY PROJECTS</div>
                <div className="resume-job-item">
                  <div className="resume-job-row">
                    <span className="resume-company-name">Design System Playbook</span>
                    <span className="resume-job-date">2023</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0.25rem 0' }}>
                    Open-source component library architecture guide downloaded by 15,000+ designers.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* RIGHT ANALYSIS & INSIGHTS PANEL */}
          <div className="resume-sidebar-panel">
            {/* RESUME ANALYSIS / SCORES */}
            <div className="resume-widget-card">
              <h3 className="widget-title">Resume Analysis</h3>
              <div className="score-gauges-row">
                {/* ATS SCORE */}
                <div className="score-gauge-card">
                  <div className="circle-gauge">
                    <svg viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="3.2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#256cf0"
                        strokeWidth="3.2"
                        strokeDasharray={`${atsScore}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="circle-gauge-val">{atsScore}</span>
                  </div>
                  <span className="score-gauge-label">ATS Score</span>
                </div>

                {/* SKILL MATCH */}
                <div className="score-gauge-card">
                  <div className="circle-gauge">
                    <svg viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="3.2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#7c3aed"
                        strokeWidth="3.2"
                        strokeDasharray={`${skillMatchScore}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="circle-gauge-val">{skillMatchScore}%</span>
                  </div>
                  <span className="score-gauge-label">Skill Match</span>
                </div>
              </div>
            </div>

            {/* MISSING SKILLS */}
            <div className="resume-widget-card">
              <div className="widget-label-sm">MISSING SKILLS</div>
              {missingSkills.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#16a34a', margin: 0, fontWeight: 600 }}>✓ All target skills added!</p>
              ) : (
                <div className="skill-pills-wrap">
                  {missingSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className="skill-pill-btn"
                      onClick={() => handleAddSkill(skill)}
                    >
                      <span>+</span>
                      <span>{skill}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* MISSING SECTIONS */}
            <div className="resume-widget-card">
              <div className="widget-label-sm">MISSING SECTIONS</div>
              {hasProjectsSection ? (
                <p style={{ fontSize: '0.85rem', color: '#16a34a', margin: 0, fontWeight: 600 }}>✓ Projects section added!</p>
              ) : (
                <div className="missing-section-card" onClick={handleAddProjects}>
                  <div className="missing-section-left">
                    <Icon name="folder" />
                    <span>Projects Section</span>
                  </div>
                  <Icon name="plus" />
                </div>
              )}
            </div>

            {/* AI SUGGESTIONS */}
            <div className="resume-widget-card">
              <div className="ai-header-row">
                <div className="widget-label-sm" style={{ margin: 0 }}>AI SUGGESTIONS</div>
                {suggestions.length > 0 && (
                  <span className="badge-new-chip">{suggestions.length} NEW</span>
                )}
              </div>

              {suggestions.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>No active suggestions. Click "Generate Improved Resume" for fresh AI insights.</p>
              ) : (
                suggestions.map((item) => (
                  <div key={item.id} className="ai-suggestion-card">
                    <div className="ai-suggestion-body">
                      <div className={`ai-icon-square ai-icon-square--${item.type}`}>
                        <Icon name={item.icon} />
                      </div>
                      <div className="ai-suggestion-content">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                    <div className="ai-suggestion-actions">
                      <button
                        type="button"
                        className="btn-apply-action"
                        onClick={() => handleApplySuggestion(item.id)}
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        className="btn-dismiss-x"
                        onClick={() => handleDismissSuggestion(item.id)}
                        aria-label="Dismiss suggestion"
                      >
                        <Icon name="close" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <MobileNav />

      {/* VERSION HISTORY MODAL */}
      {showVersionModal && (
        <div className="resume-modal-overlay" onClick={() => setShowVersionModal(false)}>
          <div className="resume-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="resume-modal-header">
              <h3>Version History</h3>
              <button
                type="button"
                className="btn-dismiss-x"
                onClick={() => setShowVersionModal(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              {versionHistory.map((item) => (
                <div key={item.name} className="version-item-row">
                  <div className="version-info">
                    <strong>{item.name}</strong>
                    <span>{item.date} • {item.score}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-restore-version"
                    onClick={() => {
                      setSelectedVersion(item.name);
                      setShowVersionModal(false);
                    }}
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn-outline-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setShowVersionModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function ScoreCard({ label, value, accent }) {
  return (
    <div className="score-card">
      <div className={`score-card__ring score-card__ring--${accent}`}>
        <strong>{value}</strong>
      </div>
      <span>{label}</span>
    </div>
  );
}

function SuggestionCard({ title, desc, accent, onDismiss }) {
  return (
    <article className="suggestion-card">
      <div className={`feature-card__icon feature-card__icon--${accent}`}>
        <Icon name="spark" />
      </div>
      <div>
        <strong>{title}</strong>
        <p>{desc}</p>
      </div>
      <div className="suggestion-card__actions">
        <button type="button" className="text-button" onClick={onDismiss}>Apply</button>
        <button type="button" className="icon-button" aria-label="Dismiss suggestion" onClick={onDismiss}>
          <Icon name="close" />
        </button>
      </div>
    </article>
  );
}

function JDAnalyzerPage() {
  const { user } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
  const userInitials = user?.name
    ? user.name.trim().split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AT';

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/jd-analyzer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });
      const data = await response.json();
      if (response.ok) {
        setAnalysisResult(data);
      } else {
        setAnalysisResult(getMockJDResult(jobDescription));
      }
    } catch (err) {
      setAnalysisResult(getMockJDResult(jobDescription));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMockJDResult = (text) => ({
    jobTitle: 'Senior UX Designer @ TechFlow',
    keywordMatch: '82%',
    atsScore: '91%',
    keywordStatText: 'You have 14 out of 17 core keywords identified in the JD.',
    atsStatText: 'Your document structure is highly readable by top-tier ATS systems.',
    requirements: [
      { name: 'Figma Prototyping', type: 'blue', label: 'Expert Match' },
      { name: 'Design Systems', type: 'blue', label: 'High Match' },
      { name: 'User Research Synthesis', type: 'red', label: 'Missing' },
      { name: 'Stakeholder Management', type: 'gray', label: 'Partial' },
    ],
    roadmapSteps: [
      {
        num: 1,
        title: 'Add Research Keywords',
        desc: 'Integrate "Usability Testing" and "Contextual Inquiry" into your Experience section for the TechFlow role.',
      },
      {
        num: 2,
        title: 'Quantify Leadership',
        desc: 'The JD emphasizes leadership. Add metrics like "Managed a team of 4" or "Spearheaded design for 200k+ users".',
      },
      {
        num: 3,
        title: 'Tailor Summary',
        desc: 'Update your professional summary to mention "Product-Led Growth" specifically, as it\'s a core value at TechFlow.',
      },
    ],
  });

  const activeResult = analysisResult || getMockJDResult('');

  return (
    <div className="app-shell">
      <SidebarShell />

      <main className="main-content--jdanalyzer">
        {/* TOP HEADER BAR */}
        <div className="jd-top-bar">
          <h1 className="jd-page-title">JD Analyzer</h1>

          <div className="jd-top-right-actions">
            <div className="jd-search-box">
              <Icon name="search" />
              <input
                type="text"
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="jd-search-input"
              />
            </div>
            <button type="button" className="jd-icon-btn" aria-label="Notifications">
              <Icon name="bell" />
            </button>
            <div className="jd-avatar-chip">{userInitials}</div>
          </div>
        </div>

        {/* TOP 2-COLUMN GRID */}
        <div className="jd-top-grid">
          {/* ANALYZE NEW ROLE INPUT CARD */}
          <div className="jd-card-container">
            <div className="jd-card-header">
              <h2>Analyze New Role</h2>
              <button
                type="button"
                className="btn-browse-files"
                onClick={() => alert('Browse files: Select a JD PDF or text file')}
              >
                Browse Files
              </button>
            </div>

            <div className="jd-textarea-box">
              <textarea
                className="jd-textarea-field"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the Job Description (JD) text here..."
              />
              <div className="jd-textarea-bottom-row">
                <span className="jd-word-count">{wordCount} words</span>
                <button
                  type="button"
                  className="jd-btn-analyze-ai"
                  onClick={handleAnalyze}
                  disabled={!jobDescription.trim() || isAnalyzing}
                >
                  <Icon name="spark" />
                  <span>{isAnalyzing ? 'Analyzing with AI...' : 'Analyze with AI'}</span>
                </button>
              </div>
            </div>

            <div className="jd-info-banner">
              <Icon name="help" />
              <span>
                Analysis will be performed against your default resume:{' '}
                <a href="#resume" className="jd-resume-link">
                  Senior_Product_Designer_2024.pdf
                </a>
              </span>
            </div>
          </div>

          {/* QUICK INSIGHTS OVERVIEW CARD */}
          <div className="jd-card-container">
            <div className="jd-overview-title">Quick Insights Overview</div>
            <div className="jd-overview-stats-row">
              <div className="jd-stat-mini-card jd-stat-mini-card--blue">
                <span className="jd-stat-mini-label">Weekly Scans</span>
                <span className="jd-stat-mini-val">12 / 20</span>
              </div>
              <div className="jd-stat-mini-card jd-stat-mini-card--purple">
                <span className="jd-stat-mini-label">Avg. Match</span>
                <span className="jd-stat-mini-val">74%</span>
              </div>
            </div>

            <div className="jd-graphic-art-box">
              <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="spiralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <path
                  d="M20,80 Q70,10 150,50 T280,20"
                  fill="none"
                  stroke="url(#spiralGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <circle cx="150" cy="50" r="18" fill="rgba(139,92,246,0.15)" stroke="#8b5cf6" strokeWidth="2" />
                <circle cx="70" cy="30" r="10" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="250" cy="30" r="14" fill="rgba(236,72,153,0.15)" stroke="#ec4899" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* ANALYSIS RESULTS SECTION */}
        <div className="jd-analysis-header">
          <h2>Analysis: {activeResult.jobTitle || 'Senior UX Designer @ TechFlow'}</h2>
          <div className="jd-analysis-actions">
            <button
              type="button"
              className="jd-icon-btn"
              onClick={() => alert('Share analysis link copied to clipboard!')}
              aria-label="Share Analysis"
            >
              <Icon name="share" />
            </button>
            <button
              type="button"
              className="jd-icon-btn"
              onClick={() => alert('Downloading Analysis Report PDF...')}
              aria-label="Download Report"
            >
              <Icon name="download" />
            </button>
          </div>
        </div>

        {/* 3 COLUMNS RESULTS GRID */}
        <div className="jd-results-3col-grid">
          {/* KEYWORD MATCH CARD */}
          <div className="jd-result-card">
            <div className="jd-result-card-title">Keyword Match</div>
            <div className="jd-ring-circle">
              <svg viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3.2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#256cf0"
                  strokeWidth="3.2"
                  strokeDasharray={`${parseInt(activeResult.keywordMatch || '82', 10)}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="jd-ring-val">{activeResult.keywordMatch || '82%'}</span>
            </div>
            <p className="jd-ring-desc">
              {activeResult.keywordStatText || 'You have 14 out of 17 core keywords identified in the JD.'}
            </p>
          </div>

          {/* ATS COMPATIBILITY CARD */}
          <div className="jd-result-card">
            <div className="jd-result-card-title">ATS Compatibility</div>
            <div className="jd-ring-circle">
              <svg viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3.2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="3.2"
                  strokeDasharray={`${parseInt(activeResult.atsScore || '91', 10)}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="jd-ring-val">{activeResult.atsScore || '91%'}</span>
            </div>
            <p className="jd-ring-desc">
              {activeResult.atsStatText || 'Your document structure is highly readable by top-tier ATS systems.'}
            </p>
          </div>

          {/* RESUME VS REQUIREMENTS CARD */}
          <div className="jd-compare-card-box">
            <div className="jd-compare-title">Your Resume vs. Requirements</div>
            <div className="jd-compare-list">
              {(activeResult.requirements || [
                { name: 'Figma Prototyping', type: 'blue', label: 'Expert Match' },
                { name: 'Design Systems', type: 'blue', label: 'High Match' },
                { name: 'User Research Synthesis', type: 'red', label: 'Missing' },
                { name: 'Stakeholder Management', type: 'gray', label: 'Partial' },
              ]).map((req) => (
                <div key={req.name} className="jd-compare-item">
                  <div className="jd-compare-left">
                    <Icon
                      name={req.type === 'red' ? 'warning' : 'checkCircle'}
                    />
                    <span>{req.name}</span>
                  </div>
                  <span className={`badge-match-${req.type}`}>{req.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OPTIMIZATION ROADMAP SECTION */}
        <div className="jd-roadmap-container">
          <div className="jd-roadmap-title-row">
            <Icon name="mapPin" />
            <span>Optimization Roadmap</span>
          </div>

          <div className="jd-steps-3col">
            {(activeResult.roadmapSteps || [
              {
                num: 1,
                title: 'Add Research Keywords',
                desc: 'Integrate "Usability Testing" and "Contextual Inquiry" into your Experience section for the TechFlow role.',
              },
              {
                num: 2,
                title: 'Quantify Leadership',
                desc: 'The JD emphasizes leadership. Add metrics like "Managed a team of 4" or "Spearheaded design for 200k+ users".',
              },
              {
                num: 3,
                title: 'Tailor Summary',
                desc: 'Update your professional summary to mention "Product-Led Growth" specifically, as it\'s a core value at TechFlow.',
              },
            ]).map((step) => (
              <div key={step.num} className="jd-step-card-box">
                <div className="jd-step-num-badge">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="jd-roadmap-bottom-btn-row">
            <button
              type="button"
              className="btn-apply-all-resume"
              onClick={() => alert('All optimization suggestions applied to your active resume!')}
            >
              Apply All Suggestions to Resume
            </button>
          </div>
        </div>
      </main>

      {/* FLOATING ACTION BUTTON */}
      <button
        type="button"
        className="jd-fab-btn"
        onClick={() => alert('Exporting JD Audit...')}
        aria-label="Export JD Audit"
      >
        <Icon name="upload" />
      </button>

      <MobileNav />

      {/* FOOTER */}
      <footer className="jd-footer-bar">
        <div className="jd-footer-left">
          <h4>CareerPrep AI</h4>
          <p>© 2024 CareerPrep AI. All rights reserved.</p>
        </div>
        <div className="jd-footer-links">
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
          <a href="/">Contact Support</a>
          <a href="/">Career Blog</a>
        </div>
        <div className="jd-footer-icons">
          <button type="button" className="jd-icon-btn" aria-label="Documentation">
            <Icon name="document" />
          </button>
          <button type="button" className="jd-icon-btn" aria-label="Support">
            <Icon name="help" />
          </button>
        </div>
      </footer>
    </div>
  );
}

function CompareRow({ label, value, tone }) {
  return (
    <div className={`compare-row compare-row--${tone}`}>
      <div>
        <Icon name={tone === 'danger' ? 'warning' : 'checkCircle'} />
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function StepCard({ index, title, text }) {
  return (
    <article className="step-card">
      <span>{index}</span>
      <h4>{title}</h4>
      <p>{text}</p>
    </article>
  );
}

function CoachPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [coachState, setCoachState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/coach`, { headers: getAuthHeaders() })
      .then((response) => response.json())
      .then((data) => setCoachState(data))
      .catch(() => setCoachState(null));
  }, []);

  const sendMessage = (text = message) => {
    const content = text.trim();
    if (!content || isLoading) return;

    const userMsgId = Date.now();
    setMessages((current) => [...current, { id: userMsgId, role: 'user', content }]);
    setMessage('');
    setIsLoading(true);

    fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message: content }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unable to reach the AI service. Please try again.');
        return res.json();
      })
      .then((data) => {
        const replyText = data.reply || data.text || 'Answer received.';
        setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', content: replyText }]);
      })
      .catch(() => {
        setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', content: 'Unable to reach the AI service. Please try again.' }]);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <AppShell
      title="Career AI Assistant"
      subtitle="Ask for resume rewrites, hiring strategies, market positioning, and interview feedback."
      actions={<button type="button" className="ghost-button"><Icon name="spark" />AI Coach Online</button>}
    >
      <section className="chat-layout chat-layout--assistant">
        <div className="chat-welcome">
          <div className="chat-avatar">
            <Icon name="bot" />
          </div>
          <div className="chat-welcome__copy">
            <span>Career copilot</span>
            <h3>Hi, {coachState?.userName || user?.name?.split(' ')[0] || 'there'}</h3>
            <p>{coachState?.welcome || 'Loading your coach context…'}</p>
          </div>
        </div>

        <div className="chip-row">
          {(coachState?.starterPrompts || []).map((item) => (
            <button key={item} type="button" className="chip-action" onClick={() => sendMessage(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="message-list">
          <MessageBubble role="assistant">
            Welcome! I'm your AI career coach. Ask me anything about resume bullet points, interview preparation, salary negotiation, or target skills!
          </MessageBubble>
          {messages.map((item) => <MessageBubble key={item.id} role={item.role}>{item.content}</MessageBubble>)}
          {isLoading ? <MessageBubble role="assistant">Thinking & analyzing your career profile...</MessageBubble> : null}
        </div>

        <div className="chat-input">
          <button type="button" className="icon-button" aria-label="Attach a file"><Icon name="paperclip" /></button>
          <textarea rows="1" value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="Ask me anything about your career..." />
          <button type="button" className="icon-button" aria-label="Use voice input"><Icon name="mic" /></button>
          <button type="button" className="primary-square" aria-label="Send message" onClick={() => sendMessage()} disabled={!message.trim() || isLoading}><Icon name="send" /></button>
        </div>
      </section>
    </AppShell>
  );
}

function MessageBubble({ role, children }) {
  const { user } = useAuth();
  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U';
  return (
    <div className={`message message--${role}`}>
      <div className="message__avatar">{role === 'assistant' ? <Icon name="bot" /> : <span>{initial}</span>}</div>
      <div className="message__body">{children}</div>
    </div>
  );
}

function RoadmapPage() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [framerChecked, setFramerChecked] = useState(true);
  const [aiDesignChecked, setAiDesignChecked] = useState(false);
  const [milestonesDone, setMilestonesDone] = useState(14);

  const candidateName = user?.name || 'Alex Rivera';
  const userInitials = candidateName.trim().split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const handleAiAdjust = async () => {
    setIsGenerating(true);
    try {
      await fetch(`${API_BASE_URL}/roadmap/generate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ targetRole: 'Senior Product Designer', targetCompany: 'Tier-1 Tech Firms' }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      setMilestonesDone(15);
      alert('AI Adjust: Your career roadmap has been recalculated and optimized!');
    }
  };

  const handleToggleFramer = () => {
    setFramerChecked(!framerChecked);
    setMilestonesDone((prev) => (!framerChecked ? prev + 1 : prev - 1));
  };

  const handleToggleAiDesign = () => {
    setAiDesignChecked(!aiDesignChecked);
    setMilestonesDone((prev) => (!aiDesignChecked ? prev + 1 : prev - 1));
  };

  return (
    <div className="app-shell">
      <SidebarShell />

      <main className="main-content--roadmap">
        {/* TOP HEADER BAR */}
        <div className="rm-top-bar">
          <div className="rm-header-left">
            <h1 className="rm-title">Your Career Roadmap</h1>
            <span className="rm-level-pill">Level 4: Mid-Senior</span>
          </div>

          <div className="rm-header-right">
            <button type="button" className="jd-icon-btn" aria-label="Notifications">
              <span className="system-card__pulse" style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8 }} />
              <Icon name="bell" />
            </button>
            <div className="rm-user-block">
              <div className="rm-user-text">
                <span className="rm-user-name">{candidateName}</span>
                <span className="rm-user-sub">Dream Role: Senior Product Designer</span>
              </div>
              <div className="rm-avatar-chip">{userInitials}</div>
            </div>
          </div>
        </div>

        {/* TOP 3-COLUMN CARDS */}
        <div className="rm-top-3col">
          {/* CARD 1: OVERALL PROGRESS */}
          <div className="rm-card-box">
            <span className="rm-card-label">OVERALL PROGRESS</span>
            <h2 className="rm-card-title-lg">78% to Senior Role</h2>

            <div className="rm-progress-split">
              <div className="rm-ring-small">
                <svg viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#256cf0"
                    strokeWidth="3.5"
                    strokeDasharray="78, 100"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="rm-ring-val">78%</span>
              </div>

              <div className="rm-bar-right">
                <div className="rm-bar-info">
                  <span>Milestones Done</span>
                  <strong>{milestonesDone}/18</strong>
                </div>
                <div className="rm-progress-track">
                  <div
                    className="rm-progress-fill"
                    style={{ width: `${Math.round((milestonesDone / 18) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: CURRENT GOALS */}
          <div className="rm-card-box">
            <div className="rm-goals-header">
              <Icon name="roadmap" />
              <span>Current Goals</span>
            </div>

            <button
              type="button"
              className="rm-goal-item-btn"
              onClick={() => alert('Goal details: Master React Native by Oct 15')}
            >
              <div className="rm-goal-left">
                <div className="rm-goal-icon">
                  <Icon name="code" />
                </div>
                <div className="rm-goal-info">
                  <strong>Master React Native</strong>
                  <span>Target: Oct 15</span>
                </div>
              </div>
              <Icon name="chevronRight" />
            </button>

            <button
              type="button"
              className="rm-goal-item-btn"
              onClick={() => alert('Goal details: 3 of 5 Mock Interviews completed')}
            >
              <div className="rm-goal-left">
                <div className="rm-goal-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                  <Icon name="chat" />
                </div>
                <div className="rm-goal-info">
                  <strong>5 Mock Interviews</strong>
                  <span>3 of 5 completed</span>
                </div>
              </div>
              <Icon name="chevronRight" />
            </button>
          </div>

          {/* CARD 3: SKILL PROFILE (RADAR CHART) */}
          <div className="rm-card-box">
            <span className="rm-card-label" style={{ textTransform: 'none', fontSize: '0.88rem', color: '#0f172a', fontWeight: 800 }}>
              Skill Profile
            </span>

            <div className="rm-skill-chart-box">
              <svg viewBox="0 0 200 140" style={{ width: '100%', height: '100%' }}>
                {/* Concentric Polygons */}
                <polygon points="100,20 160,50 160,110 100,130 40,110 40,50" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                <polygon points="100,40 140,60 140,100 100,115 60,100 60,60" fill="none" stroke="#f1f5f9" strokeWidth="1" />

                {/* Filled Skill Radar Polygon (Current) */}
                <polygon
                  points="100,30 145,58 135,102 100,122 52,95 55,58"
                  fill="rgba(139, 92, 246, 0.45)"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                />

                {/* Target Outline Polygon */}
                <polygon
                  points="100,22 155,52 155,108 100,128 44,108 44,52"
                  fill="none"
                  stroke="#256cf0"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* Axis Labels */}
                <text x="100" y="14" textAnchor="middle" fill="#256cf0" fontSize="8" fontWeight="800">UX RESEARCH</text>
                <text x="100" y="138" textAnchor="middle" fill="#256cf0" fontSize="8" fontWeight="800">FRONTEND</text>
              </svg>
            </div>

            <div className="rm-radar-legend">
              <span><i className="dot-purple" /> Current</span>
              <span><i className="dot-blue" /> Target</span>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: THE JOURNEY AHEAD */}
        <div className="rm-journey-header-row">
          <div className="rm-journey-title-block">
            <h2>The Journey Ahead</h2>
            <p>6-month accelerated path to Senior Product Designer</p>
          </div>

          <div className="rm-journey-actions">
            <button
              type="button"
              className="btn-expand-all"
              onClick={() => alert('All roadmap phases expanded')}
            >
              Expand All
            </button>
            <button
              type="button"
              className="btn-ai-adjust"
              onClick={handleAiAdjust}
              disabled={isGenerating}
            >
              <Icon name="spark" />
              <span>{isGenerating ? 'Adjusting...' : 'AI Adjust'}</span>
            </button>
          </div>
        </div>

        {/* TIMELINE PHASES */}
        <div className="rm-timeline-wrap">
          {/* PHASE 1: Aug 2024 (Completed) */}
          <div className="rm-timeline-node">
            <div className="rm-timeline-date-col">
              <span className="rm-date-text">Aug 2024</span>
            </div>
            <div className="rm-marker-circle rm-marker-circle--completed">
              <Icon name="check" />
            </div>

            <div className="rm-card-content">
              <div className="rm-phase-top-row">
                <h3 className="rm-phase-title">Foundation & Portfolio Review</h3>
                <span className="rm-badge-completed">COMPLETED</span>
              </div>
              <p className="rm-phase-desc">
                Clean up Figma files, update case studies for 3 major projects, and define core USP.
              </p>
              <div className="rm-tags-row">
                <span className="rm-tag-chip">#Portfolio</span>
                <span className="rm-tag-chip">#Strategy</span>
              </div>
            </div>
          </div>

          {/* PHASE 2: Sept 2024 (Current Phase - In Progress) */}
          <div className="rm-timeline-node">
            <div className="rm-timeline-date-col">
              <span className="rm-date-text">Sept 2024</span>
              <span className="rm-date-sub">Current Phase</span>
            </div>
            <div className="rm-marker-circle rm-marker-circle--active" />

            <div className="rm-card-content rm-card-content--active">
              <div className="rm-phase-top-row">
                <h3 className="rm-phase-title">Advanced Prototyping & AI Tools</h3>
                <span className="rm-badge-active">IN PROGRESS</span>
              </div>
              <p className="rm-phase-desc">
                Integrating Framer and AI-driven design workflows into the daily stack.
              </p>

              <div className="rm-checkbox-cards-grid">
                <div className="rm-check-item-card" onClick={handleToggleFramer}>
                  <div className={framerChecked ? 'rm-check-box-blue' : 'rm-check-box-empty'}>
                    {framerChecked && '✓'}
                  </div>
                  <span>Framer Fundamentals</span>
                </div>

                <div className="rm-check-item-card" onClick={handleToggleAiDesign}>
                  <div className={aiDesignChecked ? 'rm-check-box-blue' : 'rm-check-box-empty'}>
                    {aiDesignChecked && '✓'}
                  </div>
                  <span>AI Design Systems</span>
                </div>
              </div>
            </div>
          </div>

          {/* PHASE 3: Oct 2024 (Upcoming) */}
          <div className="rm-timeline-node">
            <div className="rm-timeline-date-col">
              <span className="rm-date-text">Oct 2024</span>
            </div>
            <div className="rm-marker-circle" />

            <div className="rm-card-content">
              <div className="rm-phase-top-row">
                <h3 className="rm-phase-title">Leadership & Team Dynamics</h3>
                <span className="rm-badge-upcoming">UPCOMING</span>
              </div>
              <p className="rm-phase-desc">
                Focusing on cross-functional communication, stakeholder management, and design mentoring.
              </p>
              <a href="#courses" className="rm-link-blue" onClick={(e) => { e.preventDefault(); alert('Loading 4 suggested leadership courses...'); }}>
                View 4 suggested courses →
              </a>
            </div>
          </div>

          {/* PHASE 4: Nov 2024 (The Job Hunt Peak) */}
          <div className="rm-timeline-node">
            <div className="rm-timeline-date-col">
              <span className="rm-date-text">Nov 2024</span>
            </div>
            <div className="rm-marker-circle rm-marker-circle--peak">
              <Icon name="spark" />
            </div>

            <div className="rm-card-content rm-card-content--peak">
              <div className="rm-phase-top-row">
                <h3 className="rm-phase-title" style={{ color: '#312e81', fontSize: '1.15rem' }}>
                  The Job Hunt Peak
                </h3>
              </div>
              <p className="rm-phase-desc" style={{ color: '#3730a3' }}>
                High-intensity interview prep and active applications to Tier-1 tech companies.
              </p>

              <div className="rm-peak-chips-row">
                <div className="rm-peak-chip">
                  <Icon name="checkCircle" />
                  <span>10 Targeted Applications</span>
                </div>
                <div className="rm-peak-chip">
                  <Icon name="users" />
                  <span>5 Referrals Locked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />

      {/* FOOTER */}
      <footer className="jd-footer-bar" style={{ marginTop: 0 }}>
        <div className="jd-footer-left">
          <h4>CareerPrep</h4>
          <p>© 2024 CareerPrep AI. All rights reserved.</p>
        </div>
        <div className="jd-footer-links">
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
          <a href="/">Contact Support</a>
          <a href="/">Career Blog</a>
        </div>
      </footer>
    </div>
  );
}

function PracticePage() {
  const { user } = useAuth();
  const [practiceData, setPracticeData] = useState(null);
  const [mode, setMode] = useState('coding'); // 'coding' or 'aptitude'

  // Coding IDE State
  const [language, setLanguage] = useState('Python 3');
  const [code, setCode] = useState(`class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # TODO: Initialize slow and fast pointers
        slow = fast = head

        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

            if slow == fast:
                slow = head
                while slow != fast:
                    slow = slow.next
                    fast = fast.next
                return slow

        return None

        return None`);
  const [consoleTab, setConsoleTab] = useState('console');
  const [consoleOutput, setConsoleOutput] = useState({
    status: 'passed',
    message: '✓ All standard test cases passed.',
    runtime: 'Run time: 48ms (Beats 92% of Python users)',
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const [codingTimer, setCodingTimer] = useState(765); // 12:45 in seconds

  // Aptitude State
  const [activeCategory, setActiveCategory] = useState('Logical');
  const [selectedOption, setSelectedOption] = useState('B');
  const [aptitudeTimer, setAptitudeTimer] = useState(889); // 14:49 in seconds
  const [questionIndex, setQuestionIndex] = useState(5);
  const [accuracy, setAccuracy] = useState(85);
  const [streak, setStreak] = useState(12);
  const [toastMsg, setToastMsg] = useState('');

  const loadPracticeData = () => {
    fetch(`${API_BASE_URL}/practice`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => setPracticeData(data))
      .catch(() => setPracticeData(null));
  };

  useEffect(() => {
    loadPracticeData();
  }, []);

  // Timers countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCodingTimer((prev) => (prev > 0 ? prev - 1 : 0));
      setAptitudeTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/practice/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ type: 'code', code }),
      });
      const data = await res.json();
      setConsoleOutput({
        status: 'passed',
        message: data.message || '✓ All standard test cases passed.',
        runtime: `Run time: ${data.runtime || '48ms'} (Beats ${data.beatsPercent || '92%'} of Python users)`,
      });
      showToast('Code executed successfully!');
    } catch (err) {
      setConsoleOutput({
        status: 'passed',
        message: '✓ All standard test cases passed.',
        runtime: 'Run time: 48ms (Beats 92% of Python users)',
      });
      showToast('Executed test suite.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsExecuting(true);
    try {
      await handleRunCode();
      showToast('Solution submitted! Earned +50 XP.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSelectOption = (label) => {
    setSelectedOption(label);
    if (label === 'B') {
      showToast('✓ Option B is correct!');
      setAccuracy(85);
      setStreak((prev) => prev + 1);
    } else {
      showToast('Option selected. Try again or submit for evaluation.');
    }
  };

  const avatarUrl = user?.avatarUrl || '/images/alex_thompson.png';
  const userName = user?.name || 'Alex Thompson';

  return (
    <div className="app-shell">
      <SidebarShell />

      <main className="main-content main-content--practice">
        {/* TOP NAVBAR SWITCHER */}
        <header className="practice-mode-navbar">
          <div className="practice-brand-row header-brand-container">
            <img src="/logo.png" alt="CareerPrep Logo" className="brand-logo-img" />
            <div>
              <h1 className="brand-header-logo">CareerPrep</h1>
              <span className="brand-header-subtitle">AI Career OS</span>
            </div>
          </div>

          <div className="practice-mode-tabs">
            <button
              type="button"
              className={`mode-tab ${mode === 'coding' ? 'mode-tab--active' : ''}`}
              onClick={() => setMode('coding')}
            >
              <Icon name="code" />
              <span>Coding Challenges (IDE)</span>
            </button>
            <button
              type="button"
              className={`mode-tab ${mode === 'aptitude' ? 'mode-tab--active' : ''}`}
              onClick={() => setMode('aptitude')}
            >
              <Icon name="brain" />
              <span>Aptitude Practice</span>
            </button>
          </div>

          <div className="page-header__actions">
            <RouteLink path="/notifications" className="icon-circle">
              <Icon name="bell" />
            </RouteLink>
            <RouteLink path="/settings" className="icon-circle">
              <Icon name="settings" />
            </RouteLink>
            <RouteLink path="/profile" className="avatar-chip">
              <img src={avatarUrl} alt={userName} className="avatar-chip-img" />
            </RouteLink>
          </div>
        </header>

        {toastMsg ? (
          <div className="profile-toast">
            <Icon name="checkCircle" />
            <span>{toastMsg}</span>
          </div>
        ) : null}

        {/* MODE 1: CODING IDE VIEW (Matching Image 1) */}
        {mode === 'coding' ? (
          <div className="coding-ide-wrapper">
            {/* SUBHEADER PROBLEM TITLE */}
            <div className="coding-problem-header">
              <div className="problem-header-left">
                <span className="problem-number-badge">#142</span>
                <h2>Linked List Cycle II</h2>
                <span className="difficulty-tag difficulty-tag--medium">Medium</span>
              </div>
              <div className="problem-header-right">
                <div className="copilot-badge">
                  <span className="copilot-icon">AI</span>
                  <span>Copilot Active</span>
                </div>
              </div>
            </div>

            <div className="coding-ide-body">
              {/* LEFT PANEL: DESCRIPTION, EXAMPLES, CONSTRAINTS, AI ANALYSIS */}
              <div className="problem-details-panel">
                <div className="panel-section">
                  <h4 className="details-section-label">DESCRIPTION</h4>
                  <p className="description-text">
                    Given the <code className="code-inline">head</code> of a linked list, return the node where the cycle begins. If there is no cycle, return <code className="code-inline">null</code>.
                  </p>
                  <p className="description-text">
                    There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code className="code-inline">next</code> pointer.
                  </p>
                </div>

                <div className="panel-section">
                  <h4 className="details-section-label">EXAMPLES</h4>
                  <div className="example-card">
                    <strong>Example 1</strong>
                    <div className="example-code">
                      <div>Input: head = [3,2,0,-4], pos = 1</div>
                      <div>Output: tail connects to node index 1</div>
                      <div>Explanation: There is a cycle in the linked list where tail connects to the second node.</div>
                    </div>
                  </div>
                </div>

                <div className="panel-section">
                  <h4 className="details-section-label">CONSTRAINTS</h4>
                  <ul className="constraints-list">
                    <li>The number of nodes in the list is in the range <code className="code-inline">[0, 10^4]</code>.</li>
                    <li><code className="code-inline">-10^5 &lt;= Node.val &lt;= 10^5</code></li>
                    <li><code className="code-inline">pos</code> is <code className="code-inline">-1</code> or a valid index in the linked-list.</li>
                  </ul>
                </div>

                <div className="panel-section">
                  <h4 className="details-section-label">AI ANALYSIS</h4>
                  <div className="ai-analysis-card">
                    <div className="ai-analysis-icon">
                      <Icon name="bulb" />
                    </div>
                    <div>
                      <h5>Floyd's Tortoise and Hare</h5>
                      <p>Most candidates use a two-pointer approach here. Focus on the mathematical proof of why the pointers meet at the cycle start.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: DARK CODE EDITOR & CONSOLE */}
              <div className="code-editor-panel">
                <div className="editor-top-bar">
                  <div className="editor-top-left">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="language-selector"
                    >
                      <option value="Python 3">Python 3</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="C++">C++</option>
                      <option value="Java">Java</option>
                    </select>
                    <span className="autocomplete-status">
                      <Icon name="sparkles" /> Auto-complete: On
                    </span>
                  </div>
                  <div className="editor-top-right">
                    <button type="button" className="editor-icon-btn" title="Editor Settings">
                      <Icon name="settings" />
                    </button>
                    <button type="button" className="editor-icon-btn" title="Fullscreen">
                      <Icon name="expand" />
                    </button>
                  </div>
                </div>

                {/* DARK CODE CONTAINER */}
                <div className="dark-code-container">
                  <div className="line-numbers-col">
                    {Array.from({ length: 16 }, (_, i) => (
                      <span key={i + 1}>{i + 1}</span>
                    ))}
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="dark-code-textarea"
                    spellCheck="false"
                  />
                </div>

                {/* BOTTOM CONSOLE & TEST RUNNER */}
                <div className="ide-console-panel">
                  <div className="console-tabs-bar">
                    <button
                      type="button"
                      className={`console-tab ${consoleTab === 'console' ? 'console-tab--active' : ''}`}
                      onClick={() => setConsoleTab('console')}
                    >
                      Console
                    </button>
                    <button
                      type="button"
                      className={`console-tab ${consoleTab === 'testcases' ? 'console-tab--active' : ''}`}
                      onClick={() => setConsoleTab('testcases')}
                    >
                      Test Cases
                    </button>
                    <button
                      type="button"
                      className={`console-tab ${consoleTab === 'hints' ? 'console-tab--active' : ''}`}
                      onClick={() => setConsoleTab('hints')}
                    >
                      Hints (2)
                    </button>
                  </div>

                  <div className="console-output-area">
                    {consoleOutput ? (
                      <div className="console-result">
                        <div className="console-status-line">
                          <Icon name="checkCircle" />
                          <span>{consoleOutput.message}</span>
                        </div>
                        <div className="console-runtime">{consoleOutput.runtime}</div>
                      </div>
                    ) : (
                      <div className="console-placeholder">Click Run or Submit to test your code.</div>
                    )}

                    <div className="console-actions">
                      <button
                        type="button"
                        className="ide-btn ide-btn--debug"
                        onClick={handleRunCode}
                        disabled={isExecuting}
                      >
                        <Icon name="bug" />
                        <span>Debug</span>
                      </button>
                      <div className="console-primary-actions">
                        <button
                          type="button"
                          className="ide-btn ide-btn--run"
                          onClick={handleRunCode}
                          disabled={isExecuting}
                        >
                          <span>Run</span>
                        </button>
                        <button
                          type="button"
                          className="ide-btn ide-btn--submit"
                          onClick={handleSubmitCode}
                          disabled={isExecuting}
                        >
                          <span>{isExecuting ? 'Submitting...' : 'Submit'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAR RIGHT FLOATING SIDEBAR TOOLBAR */}
              <aside className="ide-floating-toolbar">
                <div className="toolbar-item" title="Session Timer">
                  <Icon name="clock" />
                  <span className="toolbar-timer">{formatTimer(codingTimer)}</span>
                </div>
                <div className="toolbar-item" title="Difficulty">
                  <Icon name="lightning" />
                  <span className="toolbar-med">MED</span>
                </div>
                <div className="toolbar-item toolbar-item--button" title="Help">
                  <Icon name="help" />
                </div>
                <div className="toolbar-item toolbar-item--button" title="History">
                  <Icon name="history" />
                </div>
              </aside>
            </div>
          </div>
        ) : (
          /* MODE 2: APTITUDE PRACTICE VIEW (Matching Image 2) */
          <div className="aptitude-practice-wrapper">
            {/* APTITUDE HEADER */}
            <div className="aptitude-page-header">
              <h2>Aptitude Practice</h2>
              <div className="aptitude-header-actions">
                <div className="aptitude-timer-chip">
                  <Icon name="clock" />
                  <span>{formatTimer(aptitudeTimer)}</span>
                </div>
              </div>
            </div>

            {/* TOP 4 CATEGORIES GRID */}
            <div className="aptitude-categories-grid">
              <div
                className={`aptitude-cat-card ${activeCategory === 'Quantitative' ? 'aptitude-cat-card--active' : ''}`}
                onClick={() => setActiveCategory('Quantitative')}
              >
                <div className="cat-icon-badge cat-icon-badge--blue">
                  <Icon name="sigma" />
                </div>
                <h4>Quantitative</h4>
                <p>Numbers, Algebra, Geometry</p>
              </div>

              <div
                className={`aptitude-cat-card ${activeCategory === 'Logical' ? 'aptitude-cat-card--active' : ''}`}
                onClick={() => setActiveCategory('Logical')}
              >
                <div className="cat-icon-badge cat-icon-badge--purple">
                  <Icon name="brain" />
                </div>
                <h4>Logical</h4>
                <p>Reasoning, Puzzles, Coding</p>
              </div>

              <div
                className={`aptitude-cat-card ${activeCategory === 'Verbal' ? 'aptitude-cat-card--active' : ''}`}
                onClick={() => setActiveCategory('Verbal')}
              >
                <div className="cat-icon-badge cat-icon-badge--gray">
                  <Icon name="language" />
                </div>
                <h4>Verbal</h4>
                <p>Grammar, Comprehension</p>
              </div>

              <div
                className={`aptitude-cat-card ${activeCategory === 'Data Interpretation' ? 'aptitude-cat-card--active' : ''}`}
                onClick={() => setActiveCategory('Data Interpretation')}
              >
                <div className="cat-icon-badge cat-icon-badge--pink">
                  <Icon name="barChart" />
                </div>
                <h4>Data Interpretation</h4>
                <p>Graphs, Tables, Charts</p>
              </div>
            </div>

            {/* MAIN CONTENT + PERFORMANCE SIDEBAR */}
            <div className="aptitude-content-layout">
              {/* LEFT APTITUDE QUESTION AREA */}
              <div className="aptitude-main-area">
                {/* PROGRESS TRACKER */}
                <div className="aptitude-progress-box">
                  <div className="aptitude-progress-header">
                    <span className="question-count">Question {questionIndex} of 20</span>
                    <span className="accuracy-count">{accuracy}% Accuracy today</span>
                  </div>
                  <div className="aptitude-progress-track">
                    <div className="aptitude-progress-fill" style={{ width: '25%' }} />
                  </div>
                </div>

                {/* QUESTION CONTAINER CARD */}
                <div className="aptitude-question-card">
                  <span className="category-pill-tag">Logical Reasoning</span>

                  <h3 className="question-prompt">
                    If 'CLARK' is coded as '24-12-1-18-11' in a certain language, how would you code 'MEMBER' using the same logic?
                  </h3>

                  {/* MULTIPLE CHOICE OPTIONS */}
                  <div className="aptitude-options-list">
                    {[
                      { label: 'A', text: '13-5-13-2-5-18' },
                      { label: 'B', text: '14-6-14-3-6-19' },
                      { label: 'C', text: '12-4-12-1-4-17' },
                      { label: 'D', text: '13-6-13-3-6-18' },
                    ].map((opt) => {
                      const isSelected = selectedOption === opt.label;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          className={`aptitude-option-btn ${isSelected ? 'aptitude-option-btn--selected' : ''}`}
                          onClick={() => handleSelectOption(opt.label)}
                        >
                          <div className={`option-badge ${isSelected ? 'option-badge--selected' : ''}`}>
                            {opt.label}
                          </div>
                          <span className="option-text">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT PERFORMANCE SIDEBAR */}
              <div className="aptitude-side-area">
                {/* REAL-TIME PERFORMANCE CARD */}
                <div className="aptitude-widget-card">
                  <h4 className="widget-label-title">Real-time Performance</h4>

                  <div className="performance-gauge-row">
                    <div className="circular-gauge">
                      <svg viewBox="0 0 36 36" className="gauge-svg">
                        <path
                          className="gauge-bg"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="gauge-fill"
                          strokeDasharray="85, 100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="gauge-center-text">
                        <strong>85<span>%</span></strong>
                      </div>
                    </div>

                    <div className="gauge-info">
                      <strong>Current Accuracy</strong>
                      <p>+2% from last session</p>
                    </div>
                  </div>

                  <div className="performance-metrics-grid">
                    <div className="metric-box">
                      <div className="metric-box__header">
                        <Icon name="clock" />
                      </div>
                      <strong className="metric-value">42s</strong>
                      <span className="metric-label">Avg. per Q</span>
                    </div>

                    <div className="metric-box">
                      <div className="metric-box__header">
                        <Icon name="lightning" />
                      </div>
                      <strong className="metric-value">{streak}</strong>
                      <span className="metric-label">Streak</span>
                    </div>
                  </div>

                  <div className="meter-bars-list">
                    <div className="meter-row">
                      <span>Logic Mapping</span>
                      <strong>High</strong>
                    </div>
                    <div className="meter-track">
                      <div className="meter-fill" style={{ width: '88%' }} />
                    </div>

                    <div className="meter-row" style={{ marginTop: '12px' }}>
                      <span>Speed Control</span>
                      <strong>Medium</strong>
                    </div>
                    <div className="meter-track">
                      <div className="meter-fill" style={{ width: '65%' }} />
                    </div>
                  </div>
                </div>

                {/* GLOBAL RANKING BANNER CARD */}
                <div className="global-ranking-banner">
                  <div className="ranking-banner-overlay" />
                  <div className="ranking-banner-content">
                    <span className="ranking-eyebrow">GLOBAL RANKING</span>
                    <h3>Top 5% of Applicants</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <AppFooter />
      </main>
    </div>
  );
}


function InterviewReportPage() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [view, setView] = useState('report'); // 'config' or 'report'

  // Configuration form state
  const [targetCompany, setTargetCompany] = useState('Google');
  const [targetRole, setTargetRole] = useState('Product Manager');
  const [difficulty, setDifficulty] = useState('Mid-Level');
  const [toastMsg, setToastMsg] = useState('');

  const loadReportData = () => {
    fetch(`${API_BASE_URL}/interview-report`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => setReportData(data))
      .catch(() => setReportData(null));
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleStartSession = (e) => {
    e.preventDefault();
    showToast(`AI Mock Interview initialized for ${targetRole} @ ${targetCompany}!`);
    setTimeout(() => {
      setView('report');
    }, 600);
  };

  const handleDownloadPDF = () => {
    showToast('Downloading Post-Interview Analysis Report PDF...');
  };

  const avatarUrl = user?.avatarUrl || '/images/alex_thompson.png';
  const userName = user?.name || 'Alex Thompson';

  if (view === 'config') {
    return (
      <div className="interview-config-wrapper">
        {/* TOP CONFIG HEADER */}
        <header className="config-header-bar">
          <div className="config-header-brand header-brand-container">
            <img src="/logo.png" alt="CareerPrep Logo" className="brand-logo-img" />
            <div>
              <h1 className="brand-header-logo">CareerPrep</h1>
              <span className="config-header-sub">Mock Interview Session</span>
            </div>
          </div>

          <div className="privacy-badge-chip">
            <Icon name="shieldCheck" />
            <span>Privacy Mode On</span>
          </div>
        </header>

        {toastMsg ? (
          <div className="profile-toast">
            <Icon name="checkCircle" />
            <span>{toastMsg}</span>
          </div>
        ) : null}

        {/* CENTERED INTERVIEW CONFIGURATION CARD */}
        <main className="config-centered-main">
          <div className="interview-config-card">
            <h2>Interview Configuration</h2>
            <p className="config-subtitle">Set your preferences to start an AI-powered simulation.</p>

            <form onSubmit={handleStartSession} className="config-form">
              <div className="config-form-grid">
                <label className="config-field">
                  <div className="field-label-row">
                    <Icon name="building" />
                    <span>Target Company</span>
                  </div>
                  <div className="select-dropdown-wrap">
                    <select
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      className="config-select-input"
                    >
                      <option value="Google">Google</option>
                      <option value="Meta">Meta</option>
                      <option value="Apple">Apple</option>
                      <option value="Stripe">Stripe</option>
                      <option value="Amazon">Amazon</option>
                      <option value="Microsoft">Microsoft</option>
                    </select>
                  </div>
                </label>

                <label className="config-field">
                  <div className="field-label-row">
                    <Icon name="user" />
                    <span>Role</span>
                  </div>
                  <div className="select-dropdown-wrap">
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="config-select-input"
                    >
                      <option value="Product Manager">Product Manager</option>
                      <option value="Senior Product Designer">Senior Product Designer</option>
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Data Scientist">Data Scientist</option>
                    </select>
                  </div>
                </label>
              </div>

              <div className="difficulty-selection-box">
                <label className="field-label-row">Difficulty Level</label>
                <div className="difficulty-btn-group">
                  {['Entry', 'Mid-Level', 'Senior/Staff'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`difficulty-level-btn ${difficulty === level ? 'difficulty-level-btn--active' : ''}`}
                      onClick={() => setDifficulty(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="start-session-btn">
                <span>Start Interview Session</span>
                <Icon name="arrowRight" />
              </button>
            </form>
          </div>
        </main>

        <AppFooter />
      </div>
    );
  }

  // VIEW === 'REPORT' (POST-INTERVIEW ANALYSIS REPORT - MATCHING IMAGE 2)
  return (
    <div className="app-shell">
      <SidebarShell />

      <main className="main-content main-content--interview-report">
        {/* BREADCRUMB & HEADER */}
        <div className="report-header-section">
          <div>
            <div className="report-breadcrumb">
              <span>Mock Interviews</span>
              <Icon name="chevronRight" />
              <span className="breadcrumb-active">Interview Report</span>
            </div>
            <h1 className="report-page-title">Post-Interview Analysis</h1>
          </div>

          <div className="report-header-actions">
            <button type="button" className="ghost-button" onClick={handleDownloadPDF}>
              <Icon name="download" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => setView('config')}
            >
              <Icon name="refresh" />
              <span>Retake Interview</span>
            </button>
          </div>
        </div>

        {toastMsg ? (
          <div className="profile-toast">
            <Icon name="checkCircle" />
            <span>{toastMsg}</span>
          </div>
        ) : null}

        {/* TOP ROW: SCORE CARD & SKILL RADAR CHART */}
        <div className="report-top-grid">
          {/* LEFT SCORE CARD */}
          <div className="report-score-card">
            <div className="score-circle-outer">
              <svg viewBox="0 0 36 36" className="score-gauge-svg">
                <path
                  className="score-gauge-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="score-gauge-fill"
                  strokeDasharray="85, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="score-center-text">
                <strong className="score-value">8.5</strong>
                <span className="score-max">OUT OF 10</span>
              </div>
              <div className="gold-medal-badge" title="Top Performer">
                <Icon name="trophy" />
              </div>
            </div>

            <h3 className="score-headline">Excellent Performance!</h3>
            <p className="score-percentile-desc">
              You are in the top 5% of candidates for Senior Product Designer roles.
            </p>
          </div>

          {/* RIGHT SKILL DISTRIBUTION RADAR CHART CARD */}
          <div className="report-radar-card">
            <div className="radar-header">
              <div>
                <h3>Skill Distribution</h3>
                <p>Detailed breakdown of your interview core competencies.</p>
              </div>
              <div className="radar-legend">
                <span className="legend-item"><span className="legend-dot legend-dot--actual" /> Actual</span>
                <span className="legend-item"><span className="legend-dot legend-dot--target" /> Target</span>
              </div>
            </div>

            {/* SVG RADAR CHART */}
            <div className="radar-chart-container">
              <svg viewBox="0 0 300 260" className="radar-svg">
                {/* PENTAGON AXES BACKGROUND GRID */}
                <polygon points="150,30 245,99 209,210 91,210 55,99" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                <polygon points="150,60 216,108 191,186 109,186 84,108" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                <polygon points="150,90 187,117 173,162 127,162 113,117" fill="none" stroke="#f8fafc" strokeWidth="1" />

                {/* AXIS LINES */}
                <line x1="150" y1="130" x2="150" y2="30" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="150" y1="130" x2="245" y2="99" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="150" y1="130" x2="209" y2="210" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="150" y1="130" x2="91" y2="210" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="150" y1="130" x2="55" y2="99" stroke="#e2e8f0" strokeWidth="1" />

                {/* TARGET POLYGON (GRAY) */}
                <polygon points="150,45 230,105 198,198 102,198 70,105" fill="rgba(203, 213, 225, 0.2)" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

                {/* ACTUAL POLYGON (BLUE) */}
                <polygon points="150,50 235,112 195,190 98,195 62,108" fill="rgba(37, 99, 235, 0.15)" stroke="#2563eb" strokeWidth="3" />

                {/* AXIS LABELS */}
                <text x="150" y="18" textAnchor="middle" className="radar-label">Technical</text>
                <text x="255" y="103" textAnchor="start" className="radar-label">Communication</text>
                <text x="214" y="226" textAnchor="middle" className="radar-label">Grammar</text>
                <text x="86" y="226" textAnchor="middle" className="radar-label">Behavioral</text>
                <text x="45" y="103" textAnchor="end" className="radar-label">Confidence</text>
              </svg>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: KEY STRENGTHS & AREAS FOR IMPROVEMENT */}
        <div className="report-middle-grid">
          {/* KEY STRENGTHS (GREEN ACCENT BORDER) */}
          <div className="feedback-card feedback-card--strengths">
            <div className="feedback-card-header">
              <div className="feedback-icon-badge feedback-icon-badge--green">
                <Icon name="checkCircle" />
              </div>
              <h3>Key Strengths</h3>
            </div>

            <div className="feedback-list">
              <div className="feedback-bullet">
                <div className="bullet-check-icon">
                  <Icon name="check" />
                </div>
                <div>
                  <strong>Strong Domain Expertise</strong>
                  <p>Your technical explanation of React hooks and system design was precise and architectural.</p>
                </div>
              </div>

              <div className="feedback-bullet">
                <div className="bullet-check-icon">
                  <Icon name="check" />
                </div>
                <div>
                  <strong>Natural Confidence</strong>
                  <p>Maintained steady eye contact and had very few filler words during the 45-minute session.</p>
                </div>
              </div>

              <div className="feedback-bullet">
                <div className="bullet-check-icon">
                  <Icon name="check" />
                </div>
                <div>
                  <strong>Structured Storytelling</strong>
                  <p>Successfully used the STAR method for behavioral questions regarding team conflicts.</p>
                </div>
              </div>
            </div>
          </div>

          {/* AREAS FOR IMPROVEMENT (AMBER ACCENT BORDER) */}
          <div className="feedback-card feedback-card--improvements">
            <div className="feedback-card-header">
              <div className="feedback-icon-badge feedback-icon-badge--amber">
                <Icon name="alertCircle" />
              </div>
              <h3>Areas for Improvement</h3>
            </div>

            <div className="improvement-boxes-list">
              <div className="improvement-box">
                <strong>Elaborate on Trade-offs</strong>
                <p>When discussing the database choice, you jumped to the solution too fast. Mention 1-2 alternatives next time.</p>
              </div>

              <div className="improvement-box">
                <strong>Grammar Consistency</strong>
                <p>Small slip-ups with subject-verb agreement when talking under pressure about previous project timelines.</p>
              </div>

              <div className="improvement-box">
                <strong>Clarifying Questions</strong>
                <p>Try asking more "Why" questions about the constraints before diving into the whiteboard design phase.</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: NEXT STEPS FOR MASTERY */}
        <div className="report-next-steps-section">
          <div className="next-steps-header">
            <h3>Next Steps for Mastery</h3>
            <RouteLink path="/roadmap" className="view-roadmap-link">
              <span>View Practice Roadmap</span>
            </RouteLink>
          </div>

          <div className="next-steps-grid">
            <div className="practice-q-card">
              <div className="q-card-icon-badge">
                <Icon name="chat" />
              </div>
              <h5>Practice Question 01</h5>
              <p>"How do you handle scope creep when working with multiple high-priority stakeholders?"</p>
            </div>

            <div className="practice-q-card">
              <div className="q-card-icon-badge">
                <Icon name="gearSpark" />
              </div>
              <h5>Practice Question 02</h5>
              <p>"Explain the concept of 'Consistency vs Availability' in distributed systems to a non-technical manager."</p>
            </div>

            <div className="practice-q-card">
              <div className="q-card-icon-badge">
                <Icon name="users" />
              </div>
              <h5>Practice Question 03</h5>
              <p>"Describe a time you had to deliver critical feedback to a senior peer who was underperforming."</p>
            </div>
          </div>
        </div>

        <AppFooter />
      </main>
    </div>
  );
}


function NotificationsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/notifications`, { headers: getAuthHeaders() })
      .then((response) => response.json())
      .then((data) => setItems(data.groups || []))
      .catch(() => setItems([]));
  }, []);

  const handleDeleteNotif = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      setItems((curr) => curr.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppShell
      title="Notifications"
      subtitle="A consolidated feed of reminders, AI suggestions, and progress milestones."
      actions={items.length ? <button type="button" className="ghost-button" onClick={() => setItems([])}>Clear all</button> : null}
    >
      {items.length === 0 ? (
        <section className="card panel" style={{ marginTop: '24px' }}>
          <EmptyState title="No notifications" message="You're all caught up! System updates and reminders will appear here." icon="bell" />
        </section>
      ) : (
        <section className="stack-section">
          {items.map((item) => (
            <article key={item.id || item.title} className="card panel notification-row">
              <div className={`feature-card__icon feature-card__icon--${item.accent || 'blue'}`}>
                <Icon name="bell" />
              </div>
              <div style={{ flex: 1 }}>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>{item.time}</span>
                {item.id ? (
                  <button type="button" className="icon-button" onClick={() => handleDeleteNotif(item.id)}>✕</button>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      )}
    </AppShell>
  );
}

function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer__brand">
        <strong>CareerPrep</strong>
        <span>© 2024 CareerPrep AI. All rights reserved.</span>
      </div>
      <div className="app-footer__links">
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
        <a href="#support">Contact Support</a>
        <a href="#blog">Career Blog</a>
      </div>
    </footer>
  );
}

function ProfilePage() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Editable fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/images/alex_thompson.png');
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillsActive, setSkillsActive] = useState([]);
  const [targetRoles, setTargetRoles] = useState([]);
  const [dreamCompanies, setDreamCompanies] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  // Modals / forms state
  const [showExpModal, setShowExpModal] = useState(false);
  const [newExp, setNewExp] = useState({ role: '', company: '', period: '', description: '' });

  const [showEduModal, setShowEduModal] = useState(false);
  const [newEdu, setNewEdu] = useState({ degree: '', institution: '', period: '', description: '' });

  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [refiningText, setRefiningText] = useState(false);

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const loadProfile = () => {
    fetch(`${API_BASE_URL}/profile`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setName(data.name || 'Alex Thompson');
        setTitle(data.title || 'Senior Product Designer @ Fintech Innovations');
        setAvatarUrl(data.avatarUrl || '/images/alex_thompson.png');
        setExperiences(data.experiences || []);
        setEducation(data.education || []);
        setProjects(data.projects || []);
        setSkills(data.skills || []);
        setSkillsActive(data.skillsActive || []);
        setTargetRoles(data.targetRoles || []);
        setDreamCompanies(data.dreamCompanies || []);
        setAiSuggestion(data.aiSuggestion || null);
      })
      .catch(() => setProfile(null));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        name,
        title,
        avatarUrl,
        experiences,
        education,
        projects,
        skills,
        skillsActive,
        targetRoles,
        dreamCompanies,
        aiSuggestion,
        completion: 85,
      };
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save profile');
      setProfile(data);
      updateUser({ name: data.name });
      showNotification('Profile changes saved successfully!');
    } catch (err) {
      showNotification(err.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSkillActive = (skillName) => {
    setSkillsActive((prev) =>
      prev.includes(skillName) ? prev.filter((s) => s !== skillName) : [...prev, skillName]
    );
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!newExp.role || !newExp.company) return;
    const item = {
      id: `exp_${Date.now()}`,
      role: newExp.role,
      company: newExp.company,
      period: newExp.period || '2023 — Present',
      description: newExp.description || '',
      current: newExp.period?.toLowerCase().includes('present'),
    };
    setExperiences((prev) => [item, ...prev]);
    setNewExp({ role: '', company: '', period: '', description: '' });
    setShowExpModal(false);
    showNotification('Experience added!');
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!newEdu.degree || !newEdu.institution) return;
    const item = {
      id: `edu_${Date.now()}`,
      degree: newEdu.degree,
      institution: newEdu.institution,
      period: newEdu.period || '2019 — 2023',
      description: newEdu.description || '',
    };
    setEducation((prev) => [item, ...prev]);
    setNewEdu({ degree: '', institution: '', period: '', description: '' });
    setShowEduModal(false);
    showNotification('Education added!');
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const s = newSkill.trim();
    if (!skills.includes(s)) {
      setSkills((prev) => [...prev, s]);
      setSkillsActive((prev) => [...prev, s]);
    }
    setNewSkill('');
    setShowSkillModal(false);
    showNotification(`Skill "${s}" added!`);
  };

  const handleAddTargetRole = (e) => {
    e.preventDefault();
    if (!newRole.trim()) return;
    const r = newRole.trim();
    if (!targetRoles.includes(r)) {
      setTargetRoles((prev) => [...prev, r]);
    }
    setNewRole('');
    setShowRoleModal(false);
    showNotification(`Target role "${r}" added!`);
  };

  const handleRefineProjectText = () => {
    setRefiningText(true);
    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p, index) => {
          if (index === 0) {
            return {
              ...p,
              description: 'Crypto asset management redesigned for clarity with scalable system design architectures.',
            };
          }
          if (index === 1) {
            return {
              ...p,
              description: 'Real-time analytics for enterprise-level logistics incorporating end-to-end component systems.',
            };
          }
          return p;
        })
      );
      setRefiningText(false);
      showNotification('AI refined project descriptions with Systems Thinking!');
    }, 1200);
  };

  if (!profile) {
    return (
      <div className="app-shell">
        <SidebarShell />
        <main className="main-content">
          <p className="text-muted" style={{ padding: '2rem' }}>Loading profile…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <SidebarShell />

      <main className="main-content main-content--profile">
        {/* TOP APP HEADER */}
        <header className="page-header page-header--profile">
          <div className="brand-header-title header-brand-container">
            <img src="/logo.png" alt="CareerPrep Logo" className="brand-logo-img" />
            <div>
              <h1 className="brand-header-logo">CareerPrep</h1>
              <span className="brand-header-subtitle">AI Career OS</span>
            </div>
          </div>
          <div className="page-header__actions">
            <RouteLink path="/notifications" className="icon-circle" activeClassName="icon-circle--active">
              <Icon name="bell" />
            </RouteLink>
            <RouteLink path="/profile" className="avatar-chip" activeClassName="avatar-chip--active">
              <img src={avatarUrl} alt={name} className="avatar-chip-img" />
            </RouteLink>
          </div>
        </header>

        {toast ? (
          <div className="profile-toast">
            <Icon name="checkCircle" />
            <span>{toast}</span>
          </div>
        ) : null}

        <div className="profile-redesign-container">
          {/* TOP PROFILE HERO CARD */}
          <section className="profile-hero-card">
            <div className="profile-hero-card__body">
              <div className="profile-avatar-container">
                <img src={avatarUrl} alt={name} className="profile-avatar-img" />
                <button
                  type="button"
                  className="profile-avatar-edit-btn"
                  onClick={() => setShowAvatarModal(true)}
                  title="Change Avatar"
                >
                  <Icon name="pencil" />
                </button>
              </div>

              <div className="profile-hero-info">
                <div className="profile-hero-name-row">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="profile-hero-name-input"
                    aria-label="Profile Name"
                  />
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="profile-hero-title-input"
                  aria-label="Job Title"
                />

                <div className="profile-completion-box">
                  <div className="profile-completion-header">
                    <span>Profile Completion</span>
                    <span className="profile-completion-percent">{profile.completion || 85}%</span>
                  </div>
                  <div className="profile-completion-track">
                    <div
                      className="profile-completion-fill"
                      style={{ width: `${profile.completion || 85}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-hero-card__action">
              <button
                type="button"
                className="save-changes-btn"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                <Icon name="save" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </section>

          {/* 2-COLUMN CONTENT GRID */}
          <div className="profile-content-grid">
            {/* LEFT MAIN COLUMN */}
            <div className="profile-main-column">
              {/* EXPERIENCE SECTION */}
              <section className="profile-section-card">
                <div className="profile-section-header">
                  <div className="profile-section-title">
                    <div className="section-icon-badge section-icon-badge--blue">
                      <Icon name="briefcase" />
                    </div>
                    <h3>Experience</h3>
                  </div>
                  <button
                    type="button"
                    className="section-action-btn"
                    onClick={() => setShowExpModal(true)}
                  >
                    + Add Experience
                  </button>
                </div>

                <div className="timeline-list">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="timeline-item">
                      <div className={`timeline-icon-box ${exp.current ? 'timeline-icon-box--active' : ''}`}>
                        <Icon name="building" />
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h4>{exp.role}</h4>
                          <button
                            type="button"
                            className="timeline-delete-btn"
                            onClick={() => setExperiences((prev) => prev.filter((e) => e.id !== exp.id))}
                            title="Remove experience"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="timeline-subtitle">
                          {exp.company} • {exp.period}
                        </p>
                        <p className="timeline-desc">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* EDUCATION SECTION */}
              <section className="profile-section-card">
                <div className="profile-section-header">
                  <div className="profile-section-title">
                    <div className="section-icon-badge section-icon-badge--blue">
                      <Icon name="graduation" />
                    </div>
                    <h3>Education</h3>
                  </div>
                  <button
                    type="button"
                    className="section-action-btn"
                    onClick={() => setShowEduModal(true)}
                  >
                    + Add Education
                  </button>
                </div>

                <div className="timeline-list">
                  {education.map((edu) => (
                    <div key={edu.id} className="timeline-item">
                      <div className="timeline-icon-box">
                        <Icon name="landmark" />
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h4>{edu.degree}</h4>
                          <button
                            type="button"
                            className="timeline-delete-btn"
                            onClick={() => setEducation((prev) => prev.filter((e) => e.id !== edu.id))}
                            title="Remove education"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="timeline-subtitle">
                          {edu.institution} • {edu.period}
                        </p>
                        <p className="timeline-desc timeline-desc--italic">{edu.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FEATURED PROJECTS SECTION */}
              <section className="profile-section-card">
                <div className="profile-section-header">
                  <div className="profile-section-title">
                    <div className="section-icon-badge section-icon-badge--blue">
                      <Icon name="rocket" />
                    </div>
                    <h3>Featured Projects</h3>
                  </div>
                  <button type="button" className="section-action-btn" onClick={handleRefineProjectText}>
                    Manage All
                  </button>
                </div>

                <div className="featured-projects-grid">
                  {projects.map((proj) => (
                    <div key={proj.id} className="project-card">
                      <div className="project-card__image-wrap">
                        <img src={proj.image} alt={proj.title} className="project-card__image" />
                      </div>
                      <div className="project-card__info">
                        <h4>{proj.title}</h4>
                        <p>{proj.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT SIDEBAR COLUMN */}
            <div className="profile-side-column">
              {/* TECHNICAL SKILLS CARD */}
              <section className="profile-widget-card">
                <h4 className="widget-label">TECHNICAL SKILLS</h4>
                <div className="widget-divider" />

                <div className="skills-tag-cloud">
                  {skills.map((skill) => {
                    const isActive = skillsActive.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        className={`skill-tag-pill ${isActive ? 'skill-tag-pill--active' : ''}`}
                        onClick={() => handleToggleSkillActive(skill)}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="add-skill-dashed-btn"
                  onClick={() => setShowSkillModal(true)}
                >
                  + Add Skill
                </button>
              </section>

              {/* CAREER GOALS CARD */}
              <section className="profile-widget-card">
                <h4 className="widget-label">CAREER GOALS</h4>
                <div className="widget-divider" />

                <div className="goals-subgroup">
                  <div className="goals-subgroup-header">
                    <h5>Target Roles</h5>
                    <button
                      type="button"
                      className="small-link-btn"
                      onClick={() => setShowRoleModal(true)}
                    >
                      + Add
                    </button>
                  </div>
                  <div className="target-roles-list">
                    {targetRoles.map((role) => (
                      <div key={role} className="target-role-pill">
                        <div className="check-icon-circle">
                          <Icon name="check" />
                        </div>
                        <span>{role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="goals-subgroup" style={{ marginTop: '1.2rem' }}>
                  <h5>Dream Companies</h5>
                  <div className="dream-companies-list">
                    {dreamCompanies.map((c) => (
                      <div key={c.name} className="dream-company-pill">
                        <span className="company-dot" style={{ backgroundColor: c.color || '#2563eb' }} />
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* AI SUGGESTION HERO CARD */}
              <section className="ai-suggestion-hero-card">
                <div className="ai-suggestion-badge">
                  <Icon name="sparkles" />
                  <span>AI SUGGESTION</span>
                </div>
                <h4>{aiSuggestion?.title || 'Optimize for Stripe'}</h4>
                <p>
                  {aiSuggestion?.description ||
                    "Based on your target companies, you should highlight more 'Systems Thinking' in your project descriptions to align with Stripe's design philosophy."}
                </p>
                <button
                  type="button"
                  className="refine-text-btn"
                  onClick={handleRefineProjectText}
                  disabled={refiningText}
                >
                  {refiningText ? 'Refining with AI...' : aiSuggestion?.buttonLabel || 'Refine Project Text'}
                </button>
              </section>
            </div>
          </div>
        </div>

        {/* MODALS */}
        {showExpModal ? (
          <div className="modal-backdrop" onClick={() => setShowExpModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Add Experience</h3>
              <form onSubmit={handleAddExperience}>
                <label>
                  <span>Role Title *</span>
                  <input
                    type="text"
                    placeholder="e.g. Senior Product Designer"
                    value={newExp.role}
                    onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                    required
                  />
                </label>
                <label>
                  <span>Company *</span>
                  <input
                    type="text"
                    placeholder="e.g. Fintech Innovations"
                    value={newExp.company}
                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    required
                  />
                </label>
                <label>
                  <span>Period</span>
                  <input
                    type="text"
                    placeholder="e.g. Jan 2022 — Present"
                    value={newExp.period}
                    onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                  />
                </label>
                <label>
                  <span>Key Accomplishments & Description</span>
                  <textarea
                    rows="3"
                    placeholder="Describe your design contributions..."
                    value={newExp.description}
                    onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  />
                </label>
                <div className="modal-actions">
                  <button type="button" className="ghost-button" onClick={() => setShowExpModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    Add Experience
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {showEduModal ? (
          <div className="modal-backdrop" onClick={() => setShowEduModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Add Education</h3>
              <form onSubmit={handleAddEducation}>
                <label>
                  <span>Degree *</span>
                  <input
                    type="text"
                    placeholder="e.g. B.S. Interaction Design"
                    value={newEdu.degree}
                    onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                    required
                  />
                </label>
                <label>
                  <span>Institution *</span>
                  <input
                    type="text"
                    placeholder="e.g. Stanford University"
                    value={newEdu.institution}
                    onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                    required
                  />
                </label>
                <label>
                  <span>Period</span>
                  <input
                    type="text"
                    placeholder="e.g. 2015 — 2019"
                    value={newEdu.period}
                    onChange={(e) => setNewEdu({ ...newEdu, period: e.target.value })}
                  />
                </label>
                <label>
                  <span>Specialization / Description</span>
                  <textarea
                    rows="2"
                    placeholder="Focus areas or major coursework..."
                    value={newEdu.description}
                    onChange={(e) => setNewEdu({ ...newEdu, description: e.target.value })}
                  />
                </label>
                <div className="modal-actions">
                  <button type="button" className="ghost-button" onClick={() => setShowEduModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    Add Education
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {showSkillModal ? (
          <div className="modal-backdrop" onClick={() => setShowSkillModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Add Technical Skill</h3>
              <form onSubmit={handleAddSkill}>
                <label>
                  <span>Skill Name *</span>
                  <input
                    type="text"
                    placeholder="e.g. Design Systems"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button type="button" className="ghost-button" onClick={() => setShowSkillModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    Add Skill
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {showRoleModal ? (
          <div className="modal-backdrop" onClick={() => setShowRoleModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Add Target Role</h3>
              <form onSubmit={handleAddTargetRole}>
                <label>
                  <span>Role Title *</span>
                  <input
                    type="text"
                    placeholder="e.g. Staff Product Designer"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button type="button" className="ghost-button" onClick={() => setShowRoleModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    Add Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {showAvatarModal ? (
          <div className="modal-backdrop" onClick={() => setShowAvatarModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Update Profile Image</h3>
              <label>
                <span>Image URL</span>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="/images/alex_thompson.png"
                />
              </label>
              <div className="modal-actions" style={{ marginTop: '1rem' }}>
                <button type="button" className="ghost-button" onClick={() => setShowAvatarModal(false)}>
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <AppFooter />
      </main>
    </div>
  );
}


function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Theme');
  const [theme, setTheme] = useState('Light');
  const [preferences, setPreferences] = useState({ email: true, reminders: true, insights: false });
  const [settingsData, setSettingsData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme.toLowerCase();
  }, [theme]);

  const loadSettings = () => {
    fetch(`${API_BASE_URL}/settings`, { headers: getAuthHeaders() })
      .then((response) => response.json())
      .then((data) => {
        setSettingsData(data);
        setTheme(data.theme || 'Light');
        setPreferences(data.preferences || { email: true, reminders: true, insights: false });
      })
      .catch(() => setSettingsData(null));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ preferences, theme }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save settings');
      setSettingsData((current) => current ? { ...current, preferences: data.preferences, theme: data.theme } : current);
    } finally {
      setSaving(false);
    }
  };

  if (!settingsData) {
    return <AppShell title="Settings" subtitle="Loading your preferences..." actions={null}><p className="text-muted">Loading settings…</p></AppShell>;
  }

  return (
    <AppShell
      title="Settings"
      subtitle="Customize your account, notifications, and interface preferences."
      actions={null}
    >
      <section className="settings-layout">
        <nav className="settings-tabs">
          {settingsData.tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`settings-tab ${activeTab === tab ? 'settings-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <article className="card panel">
          <div className="section-head section-head--left">
            <h2>{activeTab}</h2>
            <p>
              {activeTab === 'Theme'
                ? 'Customize how CareerPrep looks on your device.'
                : 'This section is wired into the multi-page shell and ready for expansion.'}
            </p>
          </div>

          {activeTab === 'Theme' ? (
            <>
              <div className="theme-grid">
                {settingsData.themeOptions.map((option) => (
                  <button key={option} type="button" className={`theme-card ${theme === option ? 'theme-card--active' : ''}`} onClick={() => setTheme(option)} aria-pressed={theme === option}>
                    <div className={`theme-card__preview theme-card__preview--${option.toLowerCase()}`}>
                      <span />
                      <span />
                      <span />
                    </div>
                    <strong>{option}</strong>
                  </button>
                ))}
              </div>

              <div className="toggle-list">
                <ToggleRow title="Email Notifications" desc="Receive updates about your progress and alerts." enabled={preferences.email} onToggle={() => setPreferences((current) => ({ ...current, email: !current.email }))} />
                <ToggleRow title="Interview Reminders" desc="Get notified 15 minutes before scheduled sessions." enabled={preferences.reminders} onToggle={() => setPreferences((current) => ({ ...current, reminders: !current.reminders }))} />
                <ToggleRow title="Weekly Career Insights" desc="A summary of your skill growth and application status." enabled={preferences.insights} onToggle={() => setPreferences((current) => ({ ...current, insights: !current.insights }))} />
              </div>
            </>
          ) : <SettingsDetail tab={activeTab} content={settingsData.content} />}

          <div className="panel__actions panel__actions--end">
            <button type="button" className="ghost-button">Cancel</button>
            <button type="button" className="primary-button" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </article>
      </section>
    </AppShell>
  );
}

function SettingsDetail({ tab, content = {} }) {
  return (
    <div className="settings-detail">
      {(content[tab] || []).map(([label, value]) => (
        <div key={label} className="settings-detail__row"><span>{label}</span><strong>{value}</strong></div>
      ))}
      {tab === 'Security' ? <button type="button" className="ghost-button">Manage security</button> : null}
      {tab === 'Billing' ? <button type="button" className="ghost-button">Manage subscription</button> : null}
    </div>
  );
}

function ToggleRow({ title, desc, enabled, onToggle }) {
  return (
    <div className="toggle-row">
      <div>
        <strong>{title}</strong>
        <p>{desc}</p>
      </div>
      <button type="button" className={`toggle ${enabled ? 'toggle--on' : ''}`} onClick={onToggle} aria-label={`Toggle ${title}`} aria-pressed={enabled}>
        <span />
      </button>
    </div>
  );
}

function AdminPage() {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin`)
      .then((response) => response.json())
      .then((data) => setAdminData(data))
      .catch(() => setAdminData({ stats: adminStats, userActivity, resourceGroups, reports, topSkills, systemHealth }));
  }, []);

  if (!adminData) {
    return <div className="app-shell"><SidebarShell /><main className="main-content"><p className="text-muted">Loading admin data…</p></main><MobileNav /></div>;
  }

  return (
    <div className="app-shell">
      <SidebarShell />
      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="eyebrow">Operations Console</p>
            <h2>Intelligence Dashboard</h2>
            <p className="page-header__subtitle">Real-time system overview and performance metrics.</p>
          </div>
          <div className="page-header__actions">
            <button type="button" className="ghost-button"><Icon name="calendar" />Last 30 Days</button>
            <button type="button" className="primary-button">Download Report</button>
          </div>
        </header>

        <section className="stats-grid">
          {adminData.stats.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </section>

        <section className="content-grid">
          <div className="content-grid__main">
            <UserTable users={adminData.userActivity} />
            <div className="resource-grid">
              {adminData.resourceGroups.map((group) => (
                <ResourcePanel key={group.title} group={group} />
              ))}
            </div>
          </div>
          <aside className="content-grid__side">
            <ReportsCard reports={adminData.reports} topSkills={adminData.topSkills} />
            <SystemHealthCard systemHealth={adminData.systemHealth} />
            <AdminCard />
          </aside>
        </section>
      </main>
      <MobileNav />
    </div>
  );
}

function StatCard({ stat }) {
  return (
    <article className="card stat-card">
      <div className="stat-card__head">
        <div className={`stat-icon stat-icon--${stat.tone}`}>
          <Icon name={stat.icon} />
        </div>
        <div className={`stat-change ${stat.trend === 'down' ? 'stat-change--down' : 'stat-change--up'}`}>
          <span>{stat.change}</span>
          {stat.trend !== 'neutral' ? <Icon name={stat.trend === 'down' ? 'trendDown' : 'trendUp'} /> : null}
        </div>
      </div>
      <p className="stat-card__label">{stat.title}</p>
      <h3>{stat.value}</h3>
      <div className="progress">
        <span className={`progress__fill progress__fill--${stat.tone}`} style={{ width: `${stat.progress}%` }} />
      </div>
    </article>
  );
}

function UserTable({ users }) {
  return (
    <section className="card panel panel--table">
      <div className="panel__header">
        <h3>Recent User Activity</h3>
        <label className="search">
          <Icon name="search" />
          <input type="text" placeholder="Search users..." />
        </label>
      </div>

      <div className="table-wrap">
        <table className="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Status</th>
              <th>Subscription</th>
              <th>Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email}>
                <td>
                  <div className="user-cell">
                    <div className={`avatar avatar--${user.accent}`}>{user.initials}</div>
                    <div>
                      <div className="user-cell__name">{user.name}</div>
                      <div className="user-cell__email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-pill status-pill--${user.statusTone}`}>
                    <span className="status-pill__dot" />
                    {user.status}
                  </span>
                </td>
                <td className={user.subscription !== 'Free' ? 'table-link' : ''}>{user.subscription}</td>
                <td>{user.activity}</td>
                <td>
                  <button type="button" className="icon-button" aria-label={`More actions for ${user.name}`}>
                    <Icon name="more" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel__footer">
        <span>Showing 3 of 42,892 users</span>
        <div className="panel__pager">
          <button type="button" className="pager-button" aria-label="Previous page">
            <Icon name="chevronLeft" />
          </button>
          <button type="button" className="pager-button" aria-label="Next page">
            <Icon name="chevronRight" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ResourcePanel({ group }) {
  return (
    <section className="card panel">
      <div className="resource-panel__header">
        <h3>
          <span className={`resource-panel__icon resource-panel__icon--${group.tone}`}>
            <Icon name={group.icon} />
          </span>
          {group.title}
        </h3>
        <button type="button" className="text-button">
          {group.action}
        </button>
      </div>

      <div className="resource-panel__items">
        {group.items.map((item) => (
          <article key={item.title} className="resource-item">
            <div>
              <h4>{item.title}</h4>
              <p>{item.subtitle}</p>
            </div>
            <button type="button" className="icon-button" aria-label={`Edit ${item.title}`}>
              <Icon name="edit" />
            </button>
          </article>
        ))}
      </div>

      <button type="button" className="dashed-button">
        {group.buttonLabel}
      </button>
    </section>
  );
}

function ReportsCard({ reports, topSkills }) {
  return (
    <section className="card panel reports-card">
      <div className="reports-card__mark">
        <Icon name="analytics" />
      </div>
      <h3>Reports</h3>

      <div className="reports-card__metrics">
        {reports.map((item) => (
          <div key={item.label}>
            <div className="reports-card__row">
              <span>{item.label}</span>
              <strong>{item.value}%</strong>
            </div>
            <div className="progress progress--tall">
              <span className={`progress__fill progress__fill--${item.tone}`} style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="reports-card__tags">
        <p>Top Skills In Demand</p>
        <div className="tag-list">
          {topSkills.map((skill) => (
            <span key={skill} className="tag">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SystemHealthCard({ systemHealth }) {
  return (
    <section className="system-card">
      <div className="system-card__title">
        <span className="system-card__pulse" />
        <p>System Health</p>
      </div>
      <div className="system-card__list">
        {systemHealth.map((item) => (
          <div key={item.label} className="system-card__row">
            <span>{item.label}</span>
            <strong className={item.accent ? `text-${item.accent}` : ''}>{item.value}</strong>
          </div>
        ))}
      </div>
      <button type="button" className="system-card__button">
        View Log Explorer
      </button>
    </section>
  );
}

function AdminCard() {
  return (
    <section className="admin-card">
      <div className="admin-card__avatar">
        <span>AA</span>
      </div>
      <h3>Alex Admin</h3>
      <p>Super Admin Access</p>
      <button type="button">Terminate Session</button>
    </section>
  );
}

function NotFoundPage() {
  return (
    <div className="auth-shell auth-shell--single">
      <article className="card panel not-found">
        <Icon name="warning" />
        <h2>Page not found</h2>
        <p>The requested route is not in the current CareerPrep frontend set.</p>
        <div className="page-header__actions">
          <RouteLink path="/" className="ghost-button">Back to Landing</RouteLink>
          <RouteLink path="/dashboard" className="primary-button">Open Dashboard</RouteLink>
        </div>
      </article>
    </div>
  );
}

const routes = {
  '/': LandingPage,
  '/auth': AuthPage,
  '/dashboard': UserDashboardPage,
  '/resume': ResumePage,
  '/jd-analyzer': JDAnalyzerPage,
  '/coach': CoachPage,
  '/roadmap': RoadmapPage,
  '/practice': PracticePage,
  '/interview-report': InterviewReportPage,
  '/notifications': NotificationsPage,
  '/profile': ProfilePage,
  '/settings': SettingsPage,
  '/admin': AdminPage,
};

export default function App() {
  const pathname = usePathname();
  const Page = routes[pathname] || NotFoundPage;

  useEffect(() => {
    document.title = `CareerPrep${pathname === '/' ? '' : ` · ${pathname.replace('/', '').replace(/-/g, ' ')}`}`;
  }, [pathname]);

  return (
    <AuthProvider>
      <RouteGuard path={pathname}>
        <Page />
      </RouteGuard>
    </AuthProvider>
  );
}
