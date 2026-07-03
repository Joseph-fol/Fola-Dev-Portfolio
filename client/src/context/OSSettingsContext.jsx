import { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react';
import { getBackground } from '../config/backgrounds';

export const SETTINGS_KEY = 'portfolioOS_settings';

export const DEFAULT_SETTINGS = {
  backgroundId: 'default',
  accentColor: '#1a6ef5',
  darkMode: false,
  brightness: 100,
  fontSize: 'medium',
  clockFormat: '24',
  timeOffset: 0,
  wifiOn: true,
  bluetoothOn: true,
  airplaneMode: false,
  nightLight: false,
  doNotDisturb: false,
  volume: 62,
};

const FONT_SIZES = {
  small: '12px',
  medium: '14px',
  large: '16px',
};

const OSSettingsContext = createContext();

function readSettings() {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    return { ...DEFAULT_SETTINGS, ...saved };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function OSSettingsProvider({ children }) {
  const [settings, setSettingsState] = useState(readSettings);
  const activeBackground = getBackground(settings.backgroundId);

  const setSettings = (patch) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  };

  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    document.documentElement.style.setProperty('--base-font-size', FONT_SIZES[settings.fontSize] || FONT_SIZES.medium);
    document.documentElement.style.setProperty('--surface-text-primary', activeBackground.theme.textPrimary);
    document.documentElement.style.setProperty('--surface-text-secondary', activeBackground.theme.textSecondary);
    document.documentElement.style.setProperty('--surface-bg', activeBackground.theme.surface);
    document.documentElement.style.setProperty('--surface-bg-strong', activeBackground.theme.surfaceStrong);
    document.documentElement.style.setProperty('--surface-border', activeBackground.theme.surfaceBorder);
    document.documentElement.style.setProperty('--surface-muted', activeBackground.theme.surfaceMuted);
    document.documentElement.style.setProperty('--surface-shadow', activeBackground.theme.shadow);
    document.documentElement.style.setProperty('--surface-accent', activeBackground.theme.accentSurface);
  }, [activeBackground, settings.accentColor, settings.fontSize]);

  const value = useMemo(() => ({ settings, setSettings }), [settings]);
  return <OSSettingsContext.Provider value={value}>{children}</OSSettingsContext.Provider>;
}

export function useOSSettings() {
  const context = useContext(OSSettingsContext);
  if (!context) {
    throw new Error('useOSSettings must be used within OSSettingsProvider');
  }
  return context;
}
