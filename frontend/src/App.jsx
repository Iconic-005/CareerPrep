import { useEffect, useState } from 'react';
import { Icon } from './components/Icon.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

const stats = [
  { title: 'Resume Score', value: '85 / 100', accent: 'blue', icon: 'document' },
  { title: 'Interview Rank', value: 'Top 5%', accent: 'violet', icon: 'mic' },
  { title: 'Coding XP', value: '2,400 pts', accent: 'slate', icon: 'code' },
];

const practiceTracks = [
  {
    title: 'Coding Arena',
    subtitle: 'Algorithms, system design, frontend debugging, and timed contests.',
    accent: 'blue',
    metric: '17 challenges active',
    items: ['Data Structures Sprint', 'React Bug Bash', 'System Design Drills'],
  },
  {
    title: 'Aptitude Lab',
    subtitle: 'Quant, logical reasoning, and recruiter-style problem sets.',
    accent: 'violet',
    metric: '420 questions ready',
    items: ['Quantitative Reasoning', 'Logical Deduction', 'Pattern Analysis'],
  },
];

const notificationGroups = [
  { title: 'Interview reminder', time: 'Today, 4:45 PM', detail: 'Google PM mock interview starts in 15 minutes.', accent: 'blue' },
  { title: 'Resume suggestion', time: 'Today, 1:12 PM', detail: 'AI found 3 impact metrics to strengthen your Stripe case study.', accent: 'violet' },
  { title: 'Roadmap milestone', time: 'Yesterday', detail: 'You completed the Product Strategy module ahead of schedule.', accent: 'mint' },
  { title: 'New report ready', time: 'July 15, 2026', detail: 'Your latest mock interview confidence report is ready to review.', accent: 'slate' },
];

const profileSkills = ['Product Strategy', 'Figma', 'Python Basics', 'SQL', 'Leadership', 'Research Ops'];

const settingsTabs = [
  'Profile',
  'Account',
  'Theme',
  'Notifications',
  'Security',
  'Billing',
];

const userActivity = [
  {
    initials: 'JD',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    status: 'Active',
    statusTone: 'green',
    subscription: 'Pro Tier',
    activity: '2h ago',
    accent: 'blue',
  },
  {
    initials: 'MS',
    name: 'Michael Smith',
    email: 'm.smith@dev.co',
    status: 'Interviewing',
    statusTone: 'amber',
    subscription: 'Free',
    activity: '5m ago',
    accent: 'violet',
  },
  {
    initials: 'AW',
    name: 'Alex Wong',
    email: 'alex.w@uxdesign.com',
    status: 'Offline',
    statusTone: 'gray',
    subscription: 'Enterprise',
    activity: '1d ago',
    accent: 'slate',
  },
];

const adminStats = [
  {
    title: 'Total Users',
    value: '42,892',
    icon: 'users',
    tone: 'blue',
    change: '+12.5%',
    trend: 'up',
    progress: 74,
  },
  {
    title: 'Active Interviews',
    value: '1,402',
    icon: 'broadcast',
    tone: 'violet',
    change: '+8.2%',
    trend: 'up',
    progress: 52,
  },
  {
    title: 'Monthly Revenue',
    value: '$128,450',
    icon: 'wallet',
    tone: 'slate',
    change: '-2.4%',
    trend: 'down',
    progress: 61,
  },
  {
    title: 'Success Rate',
    value: '76.4%',
    icon: 'badge',
    tone: 'sky',
    change: '98%',
    trend: 'neutral',
    progress: 78,
  },
];

const reports = [
  { label: 'Resume Score Avg.', value: 78, tone: 'blue' },
  { label: 'Interview AI Confidence', value: 92, tone: 'violet' },
];

const topSkills = ['Python', 'Cloud Arch', 'React', 'LLM Tuning', 'Product Logic'];

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
  const [initials, setInitials] = useState('US');

  useEffect(() => {
    fetch(`${API_BASE_URL}/profile`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          const parts = data.name.trim().split(' ');
          const inits = parts.length > 1
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0].slice(0, 2).toUpperCase();
          setInitials(inits);
        }
      })
      .catch(() => {});
  }, []);

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
  const [dashboardData, setDashboardData] = useState(null);
  const [newGoal, setNewGoal] = useState('');
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);

  const loadDashboard = () => {
    fetch(`${API_BASE_URL}/dashboard`)
      .then((response) => response.json())
      .then((data) => setDashboardData(data))
      .catch(() => setDashboardData({ greeting: 'Alex', readiness: 92, stats, goals: [] }));
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !goal.done }),
      });
      loadDashboard();
    } catch (err) {
      console.error('Failed to update goal', err);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await fetch(`${API_BASE_URL}/goals/${goalId}`, { method: 'DELETE' });
      loadDashboard();
    } catch (err) {
      console.error('Failed to delete goal', err);
    }
  };

  if (!dashboardData) {
    return <AppShell title="Loading..." subtitle="Fetching your latest career insights." actions={null}><p className="text-muted">Loading your dashboard…</p></AppShell>;
  }

  return (
    <AppShell
      title={`Hello, ${dashboardData.greeting}`}
      subtitle="Ready to land your dream role? Here's your prep summary."
      actions={<button type="button" className="ghost-button"><Icon name="calendar" />Last 7 Days</button>}
    >
      <section className="dashboard-grid">
        <article className="card readiness-card">
          <p className="eyebrow">Career Readiness</p>
          <div className="ring">
            <div className="ring__inner">
              <strong>{dashboardData.readiness}</strong>
              <span>%</span>
            </div>
          </div>
          <h3>Excellent Progress</h3>
          <p>You're in the top 3% of candidates this week.</p>
        </article>

        <div className="dashboard-grid__stack">
          <div className="mini-stats">
            {dashboardData.stats.map((item) => (
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
          </article>
        </div>
      </section>

      <section className="dashboard-lower">
        <div className="dashboard-lower__main">
          <article className="card spotlight-card">
            <div className="spotlight-card__meta">
              <div className="spotlight-card__icon">
                <Icon name="video" />
              </div>
              <div>
                <h3>Upcoming Interview</h3>
                <p>Google · Senior Product Designer</p>
              </div>
            </div>
            <div className="spotlight-card__footer">
              <div>
                <strong>02</strong>
                <span>Days Left</span>
              </div>
              <button type="button" className="ghost-button ghost-button--inverse">Prepare Now</button>
            </div>
          </article>

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
          </article>
        </div>

        <article className="card panel timeline-card">
          <h3>Recent Activity</h3>
          <div className="timeline">
            <TimelineItem title="Resume updated" desc="ATS optimization applied to Experience section." time="2 hours ago" tone="blue" />
            <TimelineItem title="Mock interview completed" desc="System Design performance: Excellent." time="Yesterday" tone="violet" />
            <TimelineItem title="New badge earned" desc='"Consistent Coder" 7 day streak.' time="2 days ago" tone="slate" />
            <TimelineItem title="Connected with recruiter" desc="Profile shared with Hiring Manager at Figma." time="July 12, 2026" tone="gray" />
          </div>
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
  const [suggestions, setSuggestions] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/resume`)
      .then((response) => response.json())
      .then((data) => {
        setSuggestions(data.suggestions || []);
        setMissingSkills(data.missingSkills || []);
      })
      .catch(() => {
        setSuggestions([
          { id: 1, title: 'Quantify achievements in your Stripe role.', desc: 'Specific percentages increase credibility with ATS filters by 22%.', accent: 'blue' },
          { id: 2, title: 'Rewrite summary for a leadership focus.', desc: 'Shift the summary from task-based language to strategic outcomes.', accent: 'violet' },
        ]);
        setMissingSkills(['Python', 'AWS', 'Kubernetes']);
      });
  }, []);

  return (
    <AppShell
      title="Resume Builder"
      subtitle="Refine your resume with live AI guidance, ATS scoring, and targeted rewrites."
      actions={
        <>
          <button type="button" className="ghost-button"><Icon name="history" />Version History</button>
          <button type="button" className="primary-button">Generate Improved Resume</button>
        </>
      }
    >
      <section className="split-workspace">
        <article className="resume-stage">
          <div className="resume-paper">
            <div className="resume-paper__heading">
              <h3>Alex Thompson</h3>
              <p>Senior Product Designer & Systems Architect</p>
              <div className="resume-paper__meta">
                <span>alex.t@example.com</span>
                <span>+1 (555) 000-1234</span>
                <span>New York, NY</span>
              </div>
            </div>

            <section className="resume-paper__section">
              <p className="resume-paper__label">Professional Experience</p>
              <div className="resume-entry">
                <div className="resume-entry__head">
                  <strong>Stripe</strong>
                  <span>2021 — Present</span>
                </div>
                <p>Senior Product Designer (Checkout & Payments)</p>
                <ul>
                  <li>Led the redesign of the Stripe Checkout flow, increasing mobile conversion by 14%.</li>
                  <li>Built a scalable design system for payment method expansion in emerging markets.</li>
                  <li className="resume-entry__highlight">AI suggestion: quantify leadership impact across the growth program.</li>
                </ul>
              </div>
              <div className="resume-entry">
                <div className="resume-entry__head">
                  <strong>Figma</strong>
                  <span>2018 — 2021</span>
                </div>
                <p>Product Designer (Design Systems Team)</p>
                <ul>
                  <li>Maintained and scaled the internal design system supporting 200+ engineers.</li>
                  <li>Launched Auto-Layout v3 documentation and onboarding tutorials.</li>
                </ul>
              </div>
            </section>
          </div>
        </article>

        <aside className="resume-insights">
          <article className="card panel">
            <h3>Resume Analysis</h3>
            <div className="score-grid">
              <ScoreCard label="ATS Score" value="82" accent="blue" />
              <ScoreCard label="Skill Match" value="88%" accent="violet" />
            </div>
          </article>

          <article className="card panel">
            <h3>Missing Skills</h3>
            <div className="tag-list">
              {missingSkills.map((item) => (
                <span key={item} className="tag tag--alert">{item}</span>
              ))}
            </div>
            <h3 className="panel__subhead">Missing Sections</h3>
            <button type="button" className="outline-row">
              <Icon name="folder" />
              <span>Projects Section</span>
              <Icon name="plusCircle" />
            </button>
          </article>

          <article className="card panel">
            <div className="panel__header panel__header--tight">
              <h3>AI Suggestions</h3>
              <span className="chip chip--blue">4 new</span>
            </div>
            <div className="suggestion-list">
              {suggestions.length ? suggestions.map((suggestion) => (
                <SuggestionCard key={suggestion.id} {...suggestion} onDismiss={() => setSuggestions((current) => current.filter((item) => item.id !== suggestion.id))} />
              )) : <p className="text-muted">All suggestions have been reviewed.</p>}
            </div>
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
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [coachState, setCoachState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/coach`)
      .then((response) => response.json())
      .then((data) => setCoachState(data))
      .catch(() => setCoachState({ welcome: 'I reviewed your recent job searches. Let’s sharpen your profile for a Senior Product role.', starterPrompts: ['Review my resume', 'Prep for Google', 'Find gaps in my skills'] }));
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content }),
    })
      .then((res) => res.json())
      .then((data) => {
        const replyText = data.reply || data.text || 'Answer received.';
        setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', content: replyText }]);
      })
      .catch(() => {
        setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', content: 'Connection issue. Please retry.' }]);
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
            <h3>Hi, {coachState?.userName || 'there'}</h3>
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
  return (
    <div className={`message message--${role}`}>
      <div className="message__avatar">{role === 'assistant' ? <Icon name="bot" /> : <span>J</span>}</div>
      <div className="message__body">{children}</div>
    </div>
  );
}

function RoadmapPage() {
  const [roadmapData, setRoadmapData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/roadmap`)
      .then((response) => response.json())
      .then((data) => setRoadmapData(data))
      .catch(() => setRoadmapData(null));
  }, []);

  return (
    <AppShell
      title="Career Roadmap"
      subtitle="Track your growth path from current role to target role with milestones and blockers."
      actions={<button type="button" className="ghost-button"><Icon name="calendar" />Next 90 Days</button>}
    >
      <section className="roadmap-hero">
        <article className="card roadmap-banner">
          <div className="roadmap-banner__content">
            <div className="roadmap-banner__icon"><Icon name="roadmap" /></div>
            <div>
              <p className="eyebrow">{roadmapData?.bannerTitle || 'Target Transition'}</p>
              <h3>{roadmapData?.bannerSubtitle || 'Your next role'}</h3>
              <p>{roadmapData?.bannerMeta || 'Projected readiness at your current pace.'}</p>
            </div>
          </div>
          <button type="button" className="ghost-button">Update Goal</button>
        </article>
      </section>

      <section className="roadmap-grid roadmap-grid--career">
        <article className="card panel">
          <h3>Milestone Timeline</h3>
          <div className="timeline">
            {(roadmapData?.milestones || []).map((item) => (
              <TimelineItem key={item.title} title={item.title} desc={item.desc} time={item.time} tone={item.tone} />
            ))}
          </div>
        </article>

        <article className="card panel">
          <h3>Focus Areas</h3>
          <div className="step-grid step-grid--single">
            {(roadmapData?.focusAreas || []).map((item, index) => (
              <StepCard key={item.title} index={['A', 'B', 'C'][index] || `${index + 1}`} title={item.title} text={item.text} />
            ))}
          </div>
        </article>
      </section>
    </AppShell>
  );
}

function PracticePage() {
  const [practiceData, setPracticeData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/practice`)
      .then((response) => response.json())
      .then((data) => setPracticeData(data))
      .catch(() => setPracticeData(null));
  }, []);

  return (
    <AppShell
      title="Practice Hub"
      subtitle="Coding, aptitude, and interview-style drills from the CareerPrep mockup pack."
      actions={<button type="button" className="ghost-button"><Icon name="spark" />Personalized Sets</button>}
    >
      <section className="practice-grid">
        {(practiceData?.tracks || []).map((track) => (
          <article key={track.title} className="card panel">
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
    </AppShell>
  );
}

function InterviewReportPage() {
  const [interviewData, setInterviewData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/interview-report`)
      .then((response) => response.json())
      .then((data) => setInterviewData(data))
      .catch(() => setInterviewData(null));
  }, []);

  return (
    <AppShell
      title="Interview Report"
      subtitle="Replay your latest mock interview with strengths, risks, and coaching priorities."
      actions={<button type="button" className="primary-button">Download Report</button>}
    >
      <section className="analysis-results__grid">
        {(interviewData?.metrics || []).map((metric) => (
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
    </AppShell>
  );
}

function NotificationsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/notifications`)
      .then((response) => response.json())
      .then((data) => setItems(data.groups || []))
      .catch(() => setItems(notificationGroups));
  }, []);

  return (
    <AppShell
      title="Notifications"
      subtitle="A consolidated feed of reminders, AI suggestions, and progress milestones."
      actions={<button type="button" className="ghost-button">Mark all as read</button>}
    >
      <section className="stack-section">
        {items.map((item) => (
          <article key={item.title + item.time} className="card panel notification-row">
            <div className={`feature-card__icon feature-card__icon--${item.accent}`}>
              <Icon name="bell" />
            </div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
            <span>{item.time}</span>
          </article>
        ))}
      </section>
    </AppShell>
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const loadProfile = () => {
    fetch(`${API_BASE_URL}/profile`)
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
        setDraft(data.name || '');
      })
      .catch(() => setProfile({ name: 'Jordan Avery', title: 'Transitioning into Senior Product Management', skills: profileSkills, about: 'Product-minded operator with a background in growth, experimentation, and stakeholder leadership. Focused on translating customer insight into measurable business outcomes.', metrics: [{ label: 'Profile Strength', value: '91%', accent: 'blue' }, { label: 'Recruiter Fit', value: '86%', accent: 'violet' }], focusAreas: [{ label: 'Target role', value: 'Senior Product Manager' }, { label: 'Target companies', value: 'Google, Stripe, Figma' }, { label: 'Next milestone', value: 'Complete SQL experimentation module' }], recruiterSnapshot: 'Strong product and growth foundation. Add two quantified leadership stories to make your transition narrative more compelling.' }));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: draft }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save profile');
      setProfile((current) => ({ ...current, name: data.name }));
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <AppShell title="Profile" subtitle="Loading your profile details..." actions={null}><p className="text-muted">Loading profile…</p></AppShell>;
  }

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
              <span>JA</span>
            </div>
            <div>
              <input aria-label="Profile name" value={draft} onChange={(event) => setDraft(event.target.value)} className="large-textarea" style={{ minHeight: '2.5rem', marginBottom: '0.4rem' }} />
              <p>{profile.title}</p>
            </div>
          </div>
          <div className="tag-list">
            {profile.skills.map((skill) => (
              <span key={skill} className="tag">{skill}</span>
            ))}
          </div>
          <div className="profile-card__meta">
            <span><strong>{profile.skills.length}</strong> verified skills</span>
            <span><strong>84%</strong> profile complete</span>
          </div>
        </article>
        <article className="card panel">
          <h3>About</h3>
          <p className="panel-copy">{profile.about}</p>
          <div className="score-grid">
            {profile.metrics.map((metric) => (
              <ScoreCard key={metric.label} label={metric.label} value={metric.value} accent={metric.accent} />
            ))}
          </div>
        </article>
      </section>
      <section className="profile-grid profile-grid--details">
        <article className="card panel">
          <div className="panel__header panel__header--tight"><h3>Career Focus</h3><span className="chip chip--blue">This quarter</span></div>
          <div className="profile-list">
            {profile.focusAreas.map((item) => (
              <div key={item.label}><strong>{item.label}</strong><span>{item.value}</span></div>
            ))}
          </div>
        </article>
        <article className="card panel">
          <div className="panel__header panel__header--tight"><h3>Recruiter Snapshot</h3><span className="text-button">Updated today</span></div>
          <p className="panel-copy">{profile.recruiterSnapshot}</p>
          <div className="tag-list"><span className="tag">Product strategy</span><span className="tag">Experimentation</span><span className="tag">Stakeholder leadership</span></div>
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
    fetch(`${API_BASE_URL}/settings`)
      .then((response) => response.json())
      .then((data) => {
        setSettingsData(data);
        setTheme(data.theme || 'Light');
        setPreferences(data.preferences || { email: true, reminders: true, insights: false });
      })
      .catch(() => setSettingsData({ tabs: settingsTabs, content: { Profile: [['Name', 'Jordan Avery'], ['Career goal', 'Senior Product Manager'], ['Location', 'New York, NY']], Account: [['Email', 'jordan.avery@example.com'], ['Plan', 'CareerPrep Pro'], ['Member since', 'July 2025']], Notifications: [['Interview reminders', '15 minutes before sessions'], ['Weekly summary', 'Every Monday at 9:00 AM'], ['Product updates', 'Only important releases']], Security: [['Password', 'Last changed 42 days ago'], ['Two-factor authentication', 'Enabled'], ['Active sessions', '2 devices']], Billing: [['Current plan', 'Pro · $19/month'], ['Next billing date', 'August 18, 2026'], ['Payment method', 'Visa ending in 4242']] }, themeOptions: ['Light', 'Dark', 'System'], preferences: { email: true, reminders: true, insights: false }, theme: 'Light' }));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ preferences, theme }) });
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

  return <Page />;
}
