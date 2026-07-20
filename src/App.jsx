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
        <div className="brand__mark">
          <Icon name="terminal" />
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
        <span>Unlock unlimited AI mock interviews and expert review workflows.</span>
        <button type="button" className="primary-button primary-button--full">
          Upgrade Now
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
        <div className="brand__mark brand__mark--small">
          <Icon name="terminal" />
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
            <div className="brand__mark">
              <Icon name="terminal" />
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
  const [resumeData, setResumeData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resumeInput, setResumeInput] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const loadResume = () => {
    fetch(`${API_BASE_URL}/resume`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => setResumeData(data))
      .catch(() => setResumeData({ suggestions: [], missingSkills: [], resumeText: '', score: 'Not Generated' }));

    fetch(`${API_BASE_URL}/profile`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => {});
  };

  useEffect(() => {
    loadResume();
  }, []);

  const handleOptimize = async () => {
    if (!resumeInput.trim()) return;
    setIsOptimizing(true);
    try {
      await fetch(`${API_BASE_URL}/resume/optimize`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ resumeText: resumeInput }),
      });
      loadResume();
    } finally {
      setIsOptimizing(false);
    }
  };

  const suggestions = resumeData?.suggestions || [];
  const missingSkills = resumeData?.missingSkills || [];
  const resumeText = resumeData?.resumeText || '';

  return (
    <AppShell
      title="Resume Builder"
      subtitle="Refine your resume with live AI guidance, ATS scoring, and targeted rewrites."
      actions={
        <>
          <button type="button" className="primary-button" onClick={handleOptimize} disabled={isOptimizing || !resumeInput.trim()}>
            {isOptimizing ? 'Optimizing...' : 'Optimize Resume with AI'}
          </button>
        </>
      }
    >
      <section className="split-workspace">
        <article className="resume-stage">
          <div className="resume-paper">
            <div className="resume-paper__heading">
              <h3>{profile?.name || 'Your Name'}</h3>
              <p>{profile?.title || 'Target Professional Role'}</p>
              <div className="resume-paper__meta">
                <span>{profile?.email || 'email@example.com'}</span>
              </div>
            </div>

            <section className="resume-paper__section">
              <p className="resume-paper__label">Resume Content</p>
              {resumeText ? (
                <div style={{ whiteSpace: 'pre-wrap', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {resumeText}
                </div>
              ) : (
                <div style={{ marginTop: '12px' }}>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '12px' }}>
                    No resume text added yet. Paste your current resume bullet points below to optimize against ATS filters:
                  </p>
                  <textarea
                    rows="8"
                    value={resumeInput}
                    onChange={(e) => setResumeInput(e.target.value)}
                    placeholder="Paste your resume content or experience bullet points here..."
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                  />
                </div>
              )}
            </section>
          </div>
        </article>

        <aside className="resume-insights">
          <article className="card panel">
            <h3>Resume Score</h3>
            <div className="score-ring">
              <ScoreCard label="ATS Score" value={resumeData?.score || 'Not Generated'} accent="blue" />
            </div>
          </article>

          <article className="card panel">
            <h3>Missing Target Skills</h3>
            {missingSkills.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Add profile skills or scan a JD to identify skill gaps.</p>
            ) : (
              <div className="skill-pills">
                {missingSkills.map((skill) => (
                  <span key={skill} className="skill-pill skill-pill--missing">{skill}</span>
                ))}
              </div>
            )}
          </article>

          <article className="card panel">
            <div className="panel__header panel__header--tight">
              <h3>AI Optimization Tips</h3>
            </div>
            {suggestions.length === 0 ? (
              <EmptyState title="No suggestions yet" message="Run an AI resume optimization to generate tailored feedback." icon="spark" />
            ) : (
              <div className="suggestion-list">
                {suggestions.map((suggestion) => (
                  <SuggestionCard key={suggestion.id} {...suggestion} onDismiss={() => setSuggestions((current) => current.filter((item) => item.id !== suggestion.id))} />
                ))}
              </div>
            )}
          </article>
        </aside>
      </section>
    </AppShell>
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
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

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
      }
    } catch (err) {
      console.error('Failed to analyze JD', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AppShell
      title="JD Analyzer"
      subtitle="Paste a job description and compare it against your profile in seconds."
      actions={<button type="button" className="ghost-button"><Icon name="search" />Search insights</button>}
    >
      <section className="analyzer-grid">
        <article className="card panel analyzer-panel">
          <div className="panel__header panel__header--tight">
            <h3>Analyze New Role</h3>
            <button type="button" className="ghost-button">Browse Files</button>
          </div>
          <textarea
            className="large-textarea"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the job description text here (e.g. Senior Product Manager at Tech Corp, requiring SQL, Figma, Product Strategy...)"
          />
          <div className="analyzer-panel__footer">
            <span>Analysis will run against your current profile skills</span>
            <button type="button" className="primary-button" onClick={handleAnalyze} disabled={!jobDescription.trim() || isAnalyzing}>
              {isAnalyzing ? 'Analyzing with AI...' : 'Analyze with AI'}
            </button>
          </div>
        </article>

        <article className="card panel visual-panel">
          <h3>Quick Insights Overview</h3>
          <div className="mini-stats mini-stats--two">
            <article className="card mini-stat mini-stat--blue">
              <span>Keyword Match</span>
              <strong>{analysisResult ? analysisResult.keywordMatch : '74%'}</strong>
            </article>
            <article className="card mini-stat mini-stat--violet">
              <span>ATS Compatibility</span>
              <strong>{analysisResult ? analysisResult.atsScore : '88%'}</strong>
            </article>
          </div>
          <div className="visual-panel__art">
            <div />
            <div />
            <div />
          </div>
        </article>
      </section>

      <section className="analysis-results" aria-live="polite">
        {!analysisResult ? (
          <p className="analysis-results__hint">Paste a job description and run an analysis to view live recommendations.</p>
        ) : null}
        <div className="panel__header">
          <h3>Analysis: {analysisResult?.jobTitle || 'Target Role Audit'}</h3>
          <div className="page-header__actions">
            <button type="button" className="icon-button"><Icon name="share" /></button>
            <button type="button" className="icon-button"><Icon name="download" /></button>
          </div>
        </div>

        <div className="analysis-results__grid">
          <article className="card panel metric-panel">
            <p>Keyword Match</p>
            <div className="ring ring--small">
              <div className="ring__inner">
                <strong>{analysisResult?.keywordMatch || '82%'}</strong>
              </div>
            </div>
            <span>Matching core requirements.</span>
          </article>

          <article className="card panel metric-panel">
            <p>ATS Compatibility</p>
            <div className="ring ring--small ring--violet">
              <div className="ring__inner">
                <strong>{analysisResult?.atsScore || '91%'}</strong>
              </div>
            </div>
            <span>Readability and section structure score.</span>
          </article>

          <article className="card panel compare-panel">
            <h3>Your Profile vs Requirements</h3>
            {(analysisResult?.matchedSkills || ['Figma', 'Product Strategy', 'SQL']).map((skill) => (
              <CompareRow key={skill} tone="success" label={skill} value="Match" />
            ))}
            {(analysisResult?.missingSkills || ['Python', 'AWS']).map((skill) => (
              <CompareRow key={skill} tone="danger" label={skill} value="Missing" />
            ))}
          </article>
        </div>

        <article className="card panel">
          <div className="panel__header panel__header--tight">
            <h3>Optimization Recommendations</h3>
            <Icon name="bulb" />
          </div>
          <div className="step-grid">
            {(analysisResult?.recommendations || [
              'Add quantifiable metrics to your recent role.',
              'Highlight missing skills in your skills breakdown.',
              'Align job title with standard industry terms.'
            ]).map((rec, i) => (
              <StepCard key={rec} index={String(i + 1)} title={`Tip #${i + 1}`} text={rec} />
            ))}
          </div>
        </article>
      </section>
    </AppShell>
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
  const [roadmapData, setRoadmapData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadRoadmap = () => {
    fetch(`${API_BASE_URL}/roadmap`, { headers: getAuthHeaders() })
      .then((response) => response.json())
      .then((data) => setRoadmapData(data))
      .catch(() => setRoadmapData(null));
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await fetch(`${API_BASE_URL}/roadmap/generate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ targetRole: 'Senior Product Manager', targetCompany: 'Top Tech Firms' }),
      });
      loadRoadmap();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleMilestone = async (milestone) => {
    try {
      await fetch(`${API_BASE_URL}/roadmap/milestones/${milestone.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ done: !milestone.done }),
      });
      loadRoadmap();
    } catch (err) {
      console.error(err);
    }
  };

  const milestones = roadmapData?.milestones || [];
  const focusAreas = roadmapData?.focusAreas || [];

  return (
    <AppShell
      title="Career Roadmap"
      subtitle="Track your growth path from current role to target role with milestones and blockers."
      actions={
        <button type="button" className="primary-button" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Roadmap'}
        </button>
      }
    >
      <section className="roadmap-hero">
        <article className="card roadmap-banner">
          <div className="roadmap-banner__content">
            <div className="roadmap-banner__icon"><Icon name="roadmap" /></div>
            <div>
              <p className="eyebrow">{roadmapData?.bannerTitle || 'Target Transition'}</p>
              <h3>{roadmapData?.bannerSubtitle || 'Not Set'}</h3>
              <p>{roadmapData?.bannerMeta || 'No roadmap generated yet.'}</p>
            </div>
          </div>
          <button type="button" className="ghost-button" onClick={handleGenerate} disabled={isGenerating}>Generate Roadmap</button>
        </article>
      </section>

      {milestones.length === 0 ? (
        <section className="card panel" style={{ marginTop: '24px' }}>
          <EmptyState
            title="No roadmap milestones generated"
            message="Map your target transition path with customized milestone phases."
            actionLabel="Generate Career Roadmap"
            onAction={handleGenerate}
            icon="roadmap"
          />
        </section>
      ) : (
        <section className="roadmap-grid roadmap-grid--career">
          <article className="card panel">
            <h3>Milestone Timeline</h3>
            <div className="timeline">
              {milestones.map((item) => (
                <div key={item.id || item.title} onClick={() => handleToggleMilestone(item)} style={{ cursor: 'pointer' }}>
                  <TimelineItem title={item.title} desc={item.desc} time={item.time} tone={item.tone} />
                </div>
              ))}
            </div>
          </article>

          <article className="card panel">
            <h3>Focus Areas</h3>
            <div className="step-grid step-grid--single">
              {focusAreas.map((item, index) => (
                <StepCard key={item.id || item.title} index={['A', 'B', 'C'][index] || `${index + 1}`} title={item.title} text={item.text} />
              ))}
            </div>
          </article>
        </section>
      )}
    </AppShell>
  );
}

function PracticePage() {
  const [practiceData, setPracticeData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/practice`, { headers: getAuthHeaders() })
      .then((response) => response.json())
      .then((data) => setPracticeData(data))
      .catch(() => setPracticeData(null));
  }, []);

  const tracks = practiceData?.tracks || [];

  return (
    <AppShell
      title="Practice Hub"
      subtitle="Coding, aptitude, and interview-style drills to build your problem-solving metrics."
      actions={<button type="button" className="ghost-button"><Icon name="spark" />Personalized Sets</button>}
    >
      {tracks.length === 0 ? (
        <section className="card panel" style={{ marginTop: '24px' }}>
          <EmptyState
            title="No practice tracks active"
            message="Complete coding or aptitude challenges to earn XP and build your problem-solving metrics."
            icon="code"
          />
        </section>
      ) : (
        <section className="practice-grid">
          {tracks.map((track) => (
            <article key={track.id || track.title} className="card panel">
              <div className="panel__header panel__header--tight">
                <div className={`feature-card__icon feature-card__icon--${track.accent}`}>
                  <Icon name={track.title.includes('Coding') ? 'code' : 'brain'} />
                </div>
                <div>
                  <h3>{track.title}</h3>
                  <p className="panel-copy">{track.subtitle}</p>
                </div>
              </div>
              <strong className="panel-metric">{track.metric}</strong>
              <div className="resource-panel__items">
                {track.items.map((item) => (
                  <article key={item} className="resource-item">
                    <div>
                      <h4>{item}</h4>
                      <p>Curated by CareerPrep AI</p>
                    </div>
                    <button type="button" className="primary-square">
                      <Icon name="arrowRight" />
                    </button>
                  </article>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}
    </AppShell>
  );
}

function InterviewReportPage() {
  const [interviewData, setInterviewData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/interview-report`, { headers: getAuthHeaders() })
      .then((response) => response.json())
      .then((data) => setInterviewData(data))
      .catch(() => setInterviewData(null));
  }, []);

  const metrics = interviewData?.metrics || [];

  return (
    <AppShell
      title="Interview Report"
      subtitle="Replay your latest mock interview with strengths, risks, and coaching priorities."
      actions={<button type="button" className="primary-button">Download Report</button>}
    >
      {metrics.length === 0 ? (
        <section className="card panel" style={{ marginTop: '24px' }}>
          <EmptyState
            title="No mock interview reports"
            message="Take a mock interview session with AI to generate confidence scores, feedback, and STAR response analysis."
            actionLabel="Start AI Mock Interview"
            onAction={() => navigate('/coach')}
            icon="mic"
          />
        </section>
      ) : (
        <>
          <section className="analysis-results__grid">
            {metrics.map((metric) => (
              <article key={metric.label} className="card panel metric-panel">
                <p>{metric.label}</p>
                <div className={`ring ring--small ring--${metric.accent || 'blue'}`}>
                  <div className="ring__inner">
                    <strong>{metric.value}</strong>
                  </div>
                </div>
                <span>{metric.detail}</span>
              </article>
            ))}
          </section>

          <section className="roadmap-grid">
            <article className="card panel">
              <h3>Top Strengths</h3>
              <div className="step-grid step-grid--single">
                {(interviewData?.strengths || []).map((item, index) => (
                  <StepCard key={item.title} index={`${index + 1}`} title={item.title} text={item.text} />
                ))}
              </div>
            </article>

            <article className="card panel">
              <h3>Coach Notes</h3>
              <div className="timeline">
                {(interviewData?.notes || []).map((item) => (
                  <TimelineItem key={item.title} title={item.title} desc={item.desc} time={item.time} tone={item.tone} />
                ))}
              </div>
            </article>
          </section>
        </>
      )}
    </AppShell>
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

function ProfilePage() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const loadProfile = () => {
    fetch(`${API_BASE_URL}/profile`, { headers: getAuthHeaders() })
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
        setDraft(data.name || '');
      })
      .catch(() => setProfile(null));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: draft }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save profile');
      setProfile((current) => ({ ...current, name: data.name }));
      updateUser({ name: data.name });
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <AppShell title="Profile" subtitle="Loading your profile details..." actions={null}><p className="text-muted">Loading profile…</p></AppShell>;
  }

  const initials = profile.name ? profile.name.trim().split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'US';

  return (
    <AppShell
      title="Profile"
      subtitle="Personal brand, skill graph, and recruiter-facing summary."
      actions={<button type="button" className="primary-button" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>}
    >
      <section className="profile-grid">
        <article className="card panel profile-card">
          <div className="profile-card__header">
            <div className="profile-card__avatar">
              <span>{initials}</span>
            </div>
            <div>
              <input aria-label="Profile name" value={draft} onChange={(event) => setDraft(event.target.value)} className="large-textarea" style={{ minHeight: '2.5rem', marginBottom: '0.4rem' }} />
              <p>{profile.title || 'Target Role Not Set'}</p>
            </div>
          </div>
          <div className="tag-list">
            {(profile.skills || []).map((skill) => (
              <span key={skill} className="tag">{skill}</span>
            ))}
          </div>
          <div className="profile-card__meta">
            <span><strong>{(profile.skills || []).length}</strong> verified skills</span>
            <span><strong>{profile.skills?.length ? '84%' : '20%'}</strong> profile complete</span>
          </div>
        </article>
        <article className="card panel">
          <h3>About</h3>
          <p className="panel-copy">{profile.about || 'No bio specified. Update your profile to describe your background.'}</p>
          <div className="score-grid">
            {(profile.metrics || []).map((metric) => (
              <ScoreCard key={metric.label} label={metric.label} value={metric.value} accent={metric.accent} />
            ))}
          </div>
        </article>
      </section>
      <section className="profile-grid profile-grid--details">
        <article className="card panel">
          <div className="panel__header panel__header--tight"><h3>Career Focus</h3><span className="chip chip--blue">This quarter</span></div>
          <div className="profile-list">
            {(profile.focusAreas || []).map((item) => (
              <div key={item.label}><strong>{item.label}</strong><span>{item.value}</span></div>
            ))}
          </div>
        </article>
        <article className="card panel">
          <div className="panel__header panel__header--tight"><h3>Recruiter Snapshot</h3><span className="text-button">Updated today</span></div>
          <p className="panel-copy">{profile.recruiterSnapshot || 'Complete your career goals to generate recruiter insights.'}</p>
        </article>
      </section>
    </AppShell>
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
