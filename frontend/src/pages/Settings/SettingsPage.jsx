import { useState } from 'react';
import { useSettings } from '../../hooks/useSettings.js';
import { AppShell } from '../../components/Layout/AppShell.jsx';
import { Icon } from '../../components/Icon.jsx';

function ToggleRow({ title, desc, enabled, onToggle }) {
  return (
    <div className="toggle-row">
      <div>
        <strong>{title}</strong>
        <p>{desc}</p>
      </div>
      <button
        type="button"
        className={`toggle ${enabled ? 'toggle--on' : ''}`}
        onClick={onToggle}
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
      >
        <span />
      </button>
    </div>
  );
}

function NotificationsTab({ preferences, setPreferences }) {
  return (
    <div className="toggle-list">
      <ToggleRow
        title="Email Notifications"
        desc="Receive updates about your progress, weekly reports, and critical alerts."
        enabled={preferences.email}
        onToggle={() => setPreferences((current) => ({ ...current, email: !current.email }))}
      />
      <ToggleRow
        title="Interview Reminders"
        desc="Get notified 15 minutes before scheduled AI mock interview sessions."
        enabled={preferences.reminders}
        onToggle={() => setPreferences((current) => ({ ...current, reminders: !current.reminders }))}
      />
      <ToggleRow
        title="Weekly Career Insights"
        desc="A personalized summary of your skill growth, readiness score, and practice streak."
        enabled={preferences.insights}
        onToggle={() => setPreferences((current) => ({ ...current, insights: !current.insights }))}
      />
      <ToggleRow
        title="Job Target Alerts"
        desc="Instant notifications when your target company roles or requirements update."
        enabled={preferences.jobAlerts ?? true}
        onToggle={() => setPreferences((current) => ({ ...current, jobAlerts: !(current.jobAlerts ?? true) }))}
      />
      <ToggleRow
        title="AI Coach Recommendations"
        desc="Receive daily practice prompts tailored to your identified weak areas."
        enabled={preferences.aiPrompts ?? true}
        onToggle={() => setPreferences((current) => ({ ...current, aiPrompts: !(current.aiPrompts ?? true) }))}
      />
    </div>
  );
}

function BillingTab() {
  const invoices = [
    { id: 'INV-2026-003', date: 'Jul 01, 2026', amount: '$19.00', status: 'Paid', plan: 'Pro CareerPrep Plan' },
    { id: 'INV-2026-002', date: 'Jun 01, 2026', amount: '$19.00', status: 'Paid', plan: 'Pro CareerPrep Plan' },
    { id: 'INV-2026-001', date: 'May 01, 2026', amount: '$19.00', status: 'Paid', plan: 'Pro CareerPrep Plan' },
  ];

  return (
    <div className="billing-tab-content">
      <div className="settings-billing-grid">
        <div className="billing-plan-card">
          <div className="plan-card-header">
            <span className="plan-card-label" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>Current Plan</span>
            <span className="plan-status-badge">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
              Active
            </span>
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--heading)', margin: '0 0 4px 0' }}>Pro CareerPrep Plan</h3>
            <p className="plan-price-num">$19 <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>/ month</span></p>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0 }}>Renews automatically on Aug 01, 2026.</p>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '8px' }}>
            <button type="button" className="primary-button" style={{ fontSize: '0.85rem' }}>Upgrade Plan</button>
            <button type="button" className="ghost-button" style={{ fontSize: '0.85rem' }}>Cancel</button>
          </div>
        </div>

        <div className="billing-payment-card">
          <div className="plan-card-header">
            <span className="plan-card-label" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>Payment Method</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>Default</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ padding: '6px 10px', background: 'var(--panel)', border: '1px solid var(--stroke)', borderRadius: '8px', fontWeight: 800, fontSize: '0.88rem', color: 'var(--primary)' }}>
                VISA
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--heading)' }}>•••• •••• •••• 4242</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Expires 12 / 2028</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button type="button" className="ghost-button" style={{ fontSize: '0.85rem', width: '100%' }}>Update Card Details</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.75rem' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--heading)', margin: '0 0 1rem 0' }}>Billing History & Receipts</h4>
        <div style={{ overflowX: 'auto' }}>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <strong>{inv.id}</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)' }}>{inv.plan}</span>
                  </td>
                  <td>{inv.date}</td>
                  <td>{inv.amount}</td>
                  <td>
                    <span className="plan-status-badge">{inv.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button type="button" className="text-button" style={{ fontSize: '0.82rem' }}>Download PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="security-tab-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke)', borderRadius: '16px', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--heading)', margin: '0 0 1rem 0' }}>Change Password</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '6px' }}>Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--stroke)', background: 'var(--panel)', color: 'var(--text)', outline: 'none', minHeight: '44px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '6px' }}>New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--stroke)', background: 'var(--panel)', color: 'var(--text)', outline: 'none', minHeight: '44px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '6px' }}>Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--stroke)', background: 'var(--panel)', color: 'var(--text)', outline: 'none', minHeight: '44px' }}
            />
          </div>
        </div>
        <button type="button" className="primary-button" style={{ fontSize: '0.85rem' }}>Update Password</button>
      </div>

      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke)', borderRadius: '16px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ fontSize: '0.98rem', color: 'var(--heading)' }}>Two-Factor Authentication (2FA)</strong>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: '4px 0 0 0' }}>Add an extra layer of security using an authenticator app (e.g. Google Authenticator).</p>
          </div>
          <button
            type="button"
            className={`toggle ${twoFA ? 'toggle--on' : ''}`}
            onClick={() => setTwoFA(!twoFA)}
            aria-label="Toggle 2FA"
          >
            <span />
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke)', borderRadius: '16px', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--heading)', margin: '0 0 0.85rem 0' }}>Active Sessions</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--panel)', border: '1px solid var(--stroke)', borderRadius: '10px' }}>
            <div>
              <strong style={{ fontSize: '0.88rem', color: 'var(--heading)', display: 'block' }}>Chrome on Windows 11</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Current Session • Mumbai, India</span>
            </div>
            <span className="plan-status-badge">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const {
    activeTab, setActiveTab,
    preferences, setPreferences,
    settingsData,
    saving,
    handleSave,
  } = useSettings();

  if (!settingsData) {
    return (
      <AppShell title="Settings" subtitle="Loading your preferences..." actions={null}>
        <p className="text-muted">Loading settings…</p>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Settings"
      subtitle="Customize your account, notifications, and preferences."
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
              {activeTab === 'Notifications' && 'Manage your notifications options and preferences.'}
              {activeTab === 'Billing' && 'Manage your subscription plan, payment methods, and invoice receipts.'}
              {activeTab === 'Security' && 'Manage your password, two-factor authentication, and active sessions.'}
            </p>
          </div>

          {activeTab === 'Notifications' && (
            <NotificationsTab preferences={preferences} setPreferences={setPreferences} />
          )}

          {activeTab === 'Billing' && <BillingTab />}

          {activeTab === 'Security' && <SecurityTab />}

          <div className="panel__actions panel__actions--end">
            <button type="button" className="ghost-button">Cancel</button>
            <button type="button" className="primary-button" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
