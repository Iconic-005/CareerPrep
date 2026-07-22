import { useSettings } from '../../hooks/useSettings.js';
import { AppShell } from '../../components/Layout/AppShell.jsx';

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

function SettingsDetail({ tab, content = {} }) {
  return (
    <div className="settings-detail">
      {(content[tab] || []).map(([label, value]) => (
        <div key={label} className="settings-detail__row">
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
      {tab === 'Security' ? (
        <button type="button" className="ghost-button">Manage security</button>
      ) : null}
      {tab === 'Billing' ? (
        <button type="button" className="ghost-button">Manage subscription</button>
      ) : null}
    </div>
  );
}

export default function SettingsPage() {
  const {
    activeTab, setActiveTab,
    theme, setTheme,
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
                  <button
                    key={option}
                    type="button"
                    className={`theme-card ${theme === option ? 'theme-card--active' : ''}`}
                    onClick={() => setTheme(option)}
                    aria-pressed={theme === option}
                  >
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
                <ToggleRow
                  title="Email Notifications"
                  desc="Receive updates about your progress and alerts."
                  enabled={preferences.email}
                  onToggle={() => setPreferences((current) => ({ ...current, email: !current.email }))}
                />
                <ToggleRow
                  title="Interview Reminders"
                  desc="Get notified 15 minutes before scheduled sessions."
                  enabled={preferences.reminders}
                  onToggle={() => setPreferences((current) => ({ ...current, reminders: !current.reminders }))}
                />
                <ToggleRow
                  title="Weekly Career Insights"
                  desc="A summary of your skill growth and application status."
                  enabled={preferences.insights}
                  onToggle={() => setPreferences((current) => ({ ...current, insights: !current.insights }))}
                />
              </div>
            </>
          ) : (
            <SettingsDetail tab={activeTab} content={settingsData.content} />
          )}

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
