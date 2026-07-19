import { useEffect, useState } from 'react';
import { Icon } from './components/Icon.jsx';

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
              <span>JA</span>
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim() || (!isLogin && !form.name.trim())) {
      setError('Please complete all required fields.');
      return;
    }
    setError('');
    navigate('/dashboard');
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
            <button type="submit" className="primary-button primary-button--full">
              {isLogin ? 'Log in to your account' : 'Get started for free'}
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
  return (
    <AppShell
      title="Hello, Alex"
      subtitle="Ready to land your dream role? Here's your prep summary."
      actions={<button type="button" className="ghost-button"><Icon name="calendar" />Last 7 Days</button>}
    >
      <section className="dashboard-grid">
        <article className="card readiness-card">
          <p className="eyebrow">Career Readiness</p>
          <div className="ring">
            <div className="ring__inner">
              <strong>92</strong>
              <span>%</span>
            </div>
          </div>
          <h3>Excellent Progress</h3>
          <p>You're in the top 3% of candidates this week.</p>
        </article>

        <div className="dashboard-grid__stack">
          <div className="mini-stats">
            {stats.map((item) => (
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
            <h3>Daily Goals</h3>
            <div className="goal-list">
              <GoalItem done={false} title="3 Coding Problems" status="1 / 3 Done" />
              <GoalItem done title="Review Resume Feedback" status="Complete" />
              <GoalItem done={false} title="1 Mock Interview Session" status="Pending" />
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

function GoalItem({ done, title, status }) {
  return (
    <div className="goal-item">
      <div className="goal-item__title">
        <span className={`checkbox ${done ? 'checkbox--done' : ''}`}>
          {done ? <Icon name="check" /> : null}
        </span>
        <span className={done ? 'text-strike' : ''}>{title}</span>
      </div>
      <span className={done ? 'text-blue' : 'text-muted'}>{status}</span>
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
  const [suggestions, setSuggestions] = useState([
    { id: 1, title: 'Quantify achievements in your Stripe role.', desc: 'Specific percentages increase credibility with ATS filters by 22%.', accent: 'blue' },
    { id: 2, title: 'Rewrite summary for a "leadership" focus.', desc: 'Shift the summary from task-based language to strategic outcomes.', accent: 'violet' },
    { id: 3, title: 'Fix consistent hyphenation in dates.', desc: 'Mixed punctuation can look unpolished to recruiters.', accent: 'slate' },
  ]);

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
              {['Python', 'AWS', 'Kubernetes'].map((item) => (
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
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  return (
    <AppShell
      title="JD Analyzer"
      subtitle="Paste a job description and compare it against your default resume in seconds."
      actions={<button type="button" className="ghost-button"><Icon name="search" />Search insights</button>}
    >
      <section className="analyzer-grid">
        <article className="card panel analyzer-panel">
          <div className="panel__header panel__header--tight">
            <h3>Analyze New Role</h3>
            <button type="button" className="ghost-button">Browse Files</button>
          </div>
          <textarea className="large-textarea" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the job description text here..." />
          <div className="analyzer-panel__footer">
            <span>Analysis will run against: Senior_Product_Designer_2024.pdf</span>
            <button type="button" className="primary-button" onClick={() => setHasAnalyzed(true)} disabled={!jobDescription.trim()}>
              Analyze with AI
            </button>
          </div>
        </article>

        <article className="card panel visual-panel">
          <h3>Quick Insights Overview</h3>
          <div className="mini-stats mini-stats--two">
            <article className="card mini-stat mini-stat--blue">
              <span>Weekly Scans</span>
              <strong>12 / 20</strong>
            </article>
            <article className="card mini-stat mini-stat--violet">
              <span>Avg. Match</span>
              <strong>74%</strong>
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
        {!hasAnalyzed ? <p className="analysis-results__hint">Paste a job description and run an analysis to refresh these recommendations.</p> : null}
        <div className="panel__header">
          <h3>Analysis: Senior UX Designer @ TechFlow</h3>
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
                <strong>82%</strong>
              </div>
            </div>
            <span>14 of 17 core keywords identified.</span>
          </article>

          <article className="card panel metric-panel">
            <p>ATS Compatibility</p>
            <div className="ring ring--small ring--violet">
              <div className="ring__inner">
                <strong>91%</strong>
              </div>
            </div>
            <span>Your document structure is highly readable.</span>
          </article>

          <article className="card panel compare-panel">
            <h3>Your Resume vs Requirements</h3>
            <CompareRow tone="success" label="Figma Prototyping" value="Expert Match" />
            <CompareRow tone="success" label="Design Systems" value="High Match" />
            <CompareRow tone="danger" label="User Research Synthesis" value="Missing" />
            <CompareRow tone="muted" label="Stakeholder Management" value="Partial" />
          </article>
        </div>

        <article className="card panel">
          <div className="panel__header panel__header--tight">
            <h3>Optimization Roadmap</h3>
            <Icon name="bulb" />
          </div>
          <div className="step-grid">
            <StepCard index="1" title="Add research keywords" text='Integrate "Usability Testing" and "Contextual Inquiry" into your experience bullets.' />
            <StepCard index="2" title="Quantify leadership" text='Add scope metrics like team size, user reach, or revenue impact.' />
            <StepCard index="3" title="Tailor summary" text='Mention product-led growth directly because it appears as a key hiring signal.' />
          </div>
          <div className="panel__actions panel__actions--end">
            <button type="button" className="primary-button">Apply All Suggestions</button>
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
  const sendMessage = (text = message) => {
    const content = text.trim();
    if (!content) return;
    setMessages((current) => [...current, { id: Date.now(), role: 'user', content }, { id: Date.now() + 1, role: 'assistant', content: 'Great question. Start by tying that skill to a concrete outcome, then describe the collaborators and measurable impact.' }]);
    setMessage('');
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
            <h3>Hi, Jordan</h3>
            <p>I reviewed your recent job searches. Let’s sharpen your profile for a Senior Product role.</p>
          </div>
        </div>

        <div className="chip-row">
          {['Review my resume', 'Prep for Google', 'Find gaps in my skills'].map((item) => (
            <button key={item} type="button" className="chip-action" onClick={() => sendMessage(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="message-list">
          <MessageBubble role="assistant">
            I see you're aiming for a transition from Marketing to Product Management. We
            should focus on your data analytics and stakeholder management stories first.
          </MessageBubble>
          {messages.map((item) => <MessageBubble key={item.id} role={item.role}>{item.content}</MessageBubble>)}
          <MessageBubble role="user">
            Yes, especially the technical skills section. Can you help me frame basic Python
            knowledge in a way that appeals to PM recruiters?
          </MessageBubble>
          <MessageBubble role="assistant">
            Absolutely. Frame it around outcomes:
            <ul>
              <li>Automated reporting workflows with Python and reduced weekly reporting time.</li>
              <li>Bridged engineering and marketing by translating technical constraints.</li>
            </ul>
          </MessageBubble>
        </div>

        <div className="chat-input">
          <button type="button" className="icon-button" aria-label="Attach a file"><Icon name="paperclip" /></button>
          <textarea rows="1" value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder="Ask me anything about your career..." />
          <button type="button" className="icon-button" aria-label="Use voice input"><Icon name="mic" /></button>
          <button type="button" className="primary-square" aria-label="Send message" onClick={() => sendMessage()} disabled={!message.trim()}><Icon name="send" /></button>
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
              <p className="eyebrow">Target Transition</p>
              <h3>Marketing Lead → Senior Product Manager</h3>
              <p>Projected readiness: October 2026 at your current pace.</p>
            </div>
          </div>
          <button type="button" className="ghost-button">Update Goal</button>
        </article>
      </section>

      <section className="roadmap-grid roadmap-grid--career">
        <article className="card panel">
          <h3>Milestone Timeline</h3>
          <div className="timeline">
            <TimelineItem title="Research foundations" desc="Completed JTBD and user interview basics." time="Done" tone="mint" />
            <TimelineItem title="Analytics fluency" desc="Finish SQL + experimentation module." time="In progress" tone="blue" />
            <TimelineItem title="Leadership stories" desc="Build 3 promotion-ready case studies." time="Next up" tone="violet" />
            <TimelineItem title="Mock interview series" desc="Complete 5 PM interview simulations." time="Scheduled" tone="slate" />
          </div>
        </article>

        <article className="card panel">
          <h3>Focus Areas</h3>
          <div className="step-grid step-grid--single">
            <StepCard index="A" title="Product strategy depth" text="Add stronger examples of prioritization and roadmap tradeoff decisions." />
            <StepCard index="B" title="Technical fluency" text="Ship one analytics mini-project and one API integration case study." />
            <StepCard index="C" title="Executive communication" text="Practice concise narratives for leadership and stakeholder alignment." />
          </div>
        </article>
      </section>
    </AppShell>
  );
}

function PracticePage() {
  return (
    <AppShell
      title="Practice Hub"
      subtitle="Coding, aptitude, and interview-style drills from the CareerPrep mockup pack."
      actions={<button type="button" className="ghost-button"><Icon name="spark" />Personalized Sets</button>}
    >
      <section className="practice-grid">
        {practiceTracks.map((track) => (
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
  return (
    <AppShell
      title="Interview Report"
      subtitle="Replay your latest mock interview with strengths, risks, and coaching priorities."
      actions={<button type="button" className="primary-button">Download Report</button>}
    >
      <section className="analysis-results__grid">
        <article className="card panel metric-panel">
          <p>Confidence Score</p>
          <div className="ring ring--small">
            <div className="ring__inner">
              <strong>89%</strong>
            </div>
          </div>
          <span>Strong executive presence with clear structure.</span>
        </article>
        <article className="card panel metric-panel">
          <p>Technical Depth</p>
          <div className="ring ring--small ring--violet">
            <div className="ring__inner">
              <strong>76%</strong>
            </div>
          </div>
          <span>Good baseline, but system examples need more detail.</span>
        </article>
        <article className="card panel metric-panel">
          <p>Story Quality</p>
          <div className="ring ring--small ring--slate">
            <div className="ring__inner">
              <strong>84%</strong>
            </div>
          </div>
          <span>Your STAR answers are coherent and memorable.</span>
        </article>
      </section>

      <section className="roadmap-grid">
        <article className="card panel">
          <h3>Top Strengths</h3>
          <div className="step-grid step-grid--single">
            <StepCard index="1" title="Calm communication" text="You answered follow-up questions without rushing or overexplaining." />
            <StepCard index="2" title="Strong prioritization" text="Your product case studies showed clear decision-making under constraints." />
            <StepCard index="3" title="Leadership signals" text="You consistently referenced ownership and cross-functional alignment." />
          </div>
        </article>

        <article className="card panel">
          <h3>Coach Notes</h3>
          <div className="timeline">
            <TimelineItem title="Sharpen metrics" desc="Add numeric outcomes to your redesign story." time="High impact" tone="blue" />
            <TimelineItem title="System design specificity" desc="Name tradeoffs, bottlenecks, and monitoring choices." time="Medium impact" tone="violet" />
            <TimelineItem title="Behavioral close" desc="End stories with business impact more consistently." time="Quick win" tone="slate" />
          </div>
        </article>
      </section>
    </AppShell>
  );
}

function NotificationsPage() {
  return (
    <AppShell
      title="Notifications"
      subtitle="A consolidated feed of reminders, AI suggestions, and progress milestones."
      actions={<button type="button" className="ghost-button">Mark all as read</button>}
    >
      <section className="stack-section">
        {notificationGroups.map((item) => (
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
  return (
    <AppShell
      title="Profile"
      subtitle="Personal brand, skill graph, and recruiter-facing summary."
      actions={<button type="button" className="primary-button">Edit Profile</button>}
    >
      <section className="profile-grid">
        <article className="card panel profile-card">
          <div className="profile-card__header">
            <div className="profile-card__avatar">
              <span>JA</span>
            </div>
            <div>
              <h3>Jordan Avery</h3>
              <p>Transitioning into Senior Product Management</p>
            </div>
          </div>
          <div className="tag-list">
            {profileSkills.map((skill) => (
              <span key={skill} className="tag">{skill}</span>
            ))}
          </div>
          <div className="profile-card__meta">
            <span><strong>6</strong> verified skills</span>
            <span><strong>84%</strong> profile complete</span>
          </div>
        </article>
        <article className="card panel">
          <h3>About</h3>
          <p className="panel-copy">
            Product-minded operator with a background in growth, experimentation, and
            stakeholder leadership. Focused on translating customer insight into measurable
            business outcomes.
          </p>
          <div className="score-grid">
            <ScoreCard label="Profile Strength" value="91%" accent="blue" />
            <ScoreCard label="Recruiter Fit" value="86%" accent="violet" />
          </div>
        </article>
      </section>
      <section className="profile-grid profile-grid--details">
        <article className="card panel">
          <div className="panel__header panel__header--tight"><h3>Career Focus</h3><span className="chip chip--blue">This quarter</span></div>
          <div className="profile-list">
            <div><strong>Target role</strong><span>Senior Product Manager</span></div>
            <div><strong>Target companies</strong><span>Google, Stripe, Figma</span></div>
            <div><strong>Next milestone</strong><span>Complete SQL experimentation module</span></div>
          </div>
        </article>
        <article className="card panel">
          <div className="panel__header panel__header--tight"><h3>Recruiter Snapshot</h3><span className="text-button">Updated today</span></div>
          <p className="panel-copy">Strong product and growth foundation. Add two quantified leadership stories to make your transition narrative more compelling.</p>
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

  useEffect(() => {
    document.documentElement.dataset.theme = theme.toLowerCase();
  }, [theme]);

  return (
    <AppShell
      title="Settings"
      subtitle="Customize your account, notifications, and interface preferences."
      actions={null}
    >
      <section className="settings-layout">
        <nav className="settings-tabs">
          {settingsTabs.map((tab) => (
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
                {['Light', 'Dark', 'System'].map((option) => (
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
          ) : <SettingsDetail tab={activeTab} />}

          <div className="panel__actions panel__actions--end">
            <button type="button" className="ghost-button">Cancel</button>
            <button type="button" className="primary-button">Save Changes</button>
          </div>
        </article>
      </section>
    </AppShell>
  );
}

function SettingsDetail({ tab }) {
  const content = {
    Profile: [['Name', 'Jordan Avery'], ['Career goal', 'Senior Product Manager'], ['Location', 'New York, NY']],
    Account: [['Email', 'jordan.avery@example.com'], ['Plan', 'CareerPrep Pro'], ['Member since', 'July 2025']],
    Notifications: [['Interview reminders', '15 minutes before sessions'], ['Weekly summary', 'Every Monday at 9:00 AM'], ['Product updates', 'Only important releases']],
    Security: [['Password', 'Last changed 42 days ago'], ['Two-factor authentication', 'Enabled'], ['Active sessions', '2 devices']],
    Billing: [['Current plan', 'Pro · $19/month'], ['Next billing date', 'August 18, 2026'], ['Payment method', 'Visa ending in 4242']],
  };

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
          {adminStats.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </section>

        <section className="content-grid">
          <div className="content-grid__main">
            <UserTable />
            <div className="resource-grid">
              {resourceGroups.map((group) => (
                <ResourcePanel key={group.title} group={group} />
              ))}
            </div>
          </div>
          <aside className="content-grid__side">
            <ReportsCard />
            <SystemHealthCard />
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

function UserTable() {
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
            {userActivity.map((user) => (
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

function ReportsCard() {
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

function SystemHealthCard() {
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
