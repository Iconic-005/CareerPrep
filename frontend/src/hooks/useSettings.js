import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/settingsService.js';

export function useSettings() {
  const [activeTab, setActiveTab] = useState('Theme');
  const [theme, setTheme] = useState('Light');
  const [preferences, setPreferences] = useState({ email: true, reminders: true, insights: false });
  const [settingsData, setSettingsData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme.toLowerCase();
  }, [theme]);

  useEffect(() => {
    getSettings()
      .then((data) => {
        setSettingsData(data);
        setTheme(data.theme || 'Light');
        setPreferences(data.preferences || { email: true, reminders: true, insights: false });
      })
      .catch(() => setSettingsData(null));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await updateSettings({ preferences, theme });
      setSettingsData((current) =>
        current ? { ...current, preferences: data.preferences, theme: data.theme } : current
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    theme,
    setTheme,
    preferences,
    setPreferences,
    settingsData,
    saving,
    handleSave,
  };
}
