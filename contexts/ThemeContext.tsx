import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { StorageUtils } from '../utils/StorageUtils';
import { StorageKeys } from '../constants/StorageKeys';

export interface Theme {
  background: string;
  surface: string;
  surfaceElevated: string;
  primary: string;
  primaryVariant: string;
  secondary: string;
  /// Foreground for content sitting on `primary`. White reads fine on the blue
  /// themes but not on Classic's neon green, so it varies per theme.
  onPrimary: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  success: string;
  warning: string;
  error: string;
  shadow: string;
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
  modalBackground: string;
  inputBackground: string;
  inputBorder: string;
  cardBackground: string;
  /**
   * Rotating accent colours for lists that want visual variety — the dashboard
   * feature icons, for one. Index into it; callers should tolerate any length.
   * Each theme opens with its own primary so the first item stays on-brand.
   */
  accents: string[];
}

const lightTheme: Theme = {
  background: '#f5f5f5',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  primary: '#4285F4',
  primaryVariant: '#1a73e8',
  secondary: '#34a853',
  onPrimary: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  textMuted: '#999999',
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#ff4444',
  shadow: '#000000',
  tabBarBackground: '#ffffff',
  tabBarActive: '#4285F4',
  tabBarInactive: '#999999',
  modalBackground: 'rgba(0,0,0,0.5)',
  inputBackground: '#ffffff',
  inputBorder: '#dddddd',
  cardBackground: '#ffffff',
  // Deeper tones so they hold contrast against a white card.
  accents: [
    '#4285F4',
    '#0891b2',
    '#059669',
    '#65a30d',
    '#d97706',
    '#ea580c',
    '#dc2626',
    '#db2777',
    '#7c3aed',
  ],
};

const darkTheme: Theme = {
  background: '#121212',
  surface: '#1e1e1e',
  surfaceElevated: '#2d2d2d',
  primary: '#4285F4',
  primaryVariant: '#1a73e8',
  secondary: '#34a853',
  onPrimary: '#ffffff',
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  textMuted: '#808080',
  border: '#3a3a3a',
  borderLight: '#2a2a2a',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#ff5252',
  shadow: '#000000',
  tabBarBackground: '#1e1e1e',
  tabBarActive: '#4285F4',
  tabBarInactive: '#808080',
  modalBackground: 'rgba(0,0,0,0.7)',
  inputBackground: '#2d2d2d',
  inputBorder: '#3a3a3a',
  cardBackground: '#1e1e1e',
  accents: [
    '#4285F4',
    '#22d3ee',
    '#34d399',
    '#a3e635',
    '#fbbf24',
    '#fb923c',
    '#f87171',
    '#f472b6',
    '#c084fc',
  ],
};

/**
 * Classic — the neon-green-on-near-black look from the original web demo.
 * Core values are its Tailwind `zippy.*` tokens and `:root` custom properties;
 * the state colors come from the Tailwind palette entries that demo used
 * (emerald/amber/red 500) and the greys from its slate text classes.
 */
const classicTheme: Theme = {
  background: '#050a12', // --zippy-bg
  surface: '#0d1420', // --zippy-surface
  surfaceElevated: '#111827', // --zippy-surface-2
  primary: '#39e639', // --zippy-green
  primaryVariant: '#2cbd2c', // zippy.green-dark
  secondary: '#5ff05f', // zippy.green-light
  onPrimary: '#050a12', // near-black on neon green
  text: '#e2e8f0', // demo body color
  textSecondary: '#94a3b8', // slate-400
  textMuted: '#64748b', // slate-500
  border: 'rgba(57, 230, 57, 0.15)', // --zippy-border
  borderLight: 'rgba(255, 255, 255, 0.06)', // --zippy-border-dim
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  shadow: '#000000',
  tabBarBackground: '#0d1420',
  tabBarActive: '#39e639',
  tabBarInactive: '#64748b',
  modalBackground: 'rgba(5, 10, 18, 0.8)',
  inputBackground: '#111827',
  inputBorder: 'rgba(57, 230, 57, 0.15)',
  cardBackground: '#0d1420',
  accents: [
    '#39e639',
    '#22d3ee',
    '#38bdf8',
    '#a3e635',
    '#fbbf24',
    '#fb923c',
    '#f472b6',
    '#c084fc',
    '#5ff05f',
  ],
};

/**
 * Basic — the palette from the myzippy.app marketing site, so the app matches
 * what visitors see on the web. Core values are that site's design tokens
 * (`--green`, `--green2`, `--ink`, `--panel`, `--muted`); the state colours are
 * shared with Classic since the site defines none of its own.
 *
 * Note this is a *different* green from Classic: lime `#a8ef00` on `#050705`
 * rather than Classic's `#39e639` on `#050a12`.
 */
const basicTheme: Theme = {
  background: '#050705', // --ink
  surface: '#0b100d', // --panel
  surfaceElevated: '#111812',
  primary: '#a8ef00', // --green
  primaryVariant: '#71b900', // --green2
  secondary: '#71b900',
  onPrimary: '#050705', // near-black on lime, as the site's buttons render
  text: '#eef2ec',
  textSecondary: '#aab4ad', // --muted
  textMuted: '#6f7a72',
  border: 'rgba(168, 239, 0, 0.14)',
  borderLight: 'rgba(255, 255, 255, 0.07)',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  shadow: '#000000',
  tabBarBackground: '#0b100d',
  tabBarActive: '#a8ef00',
  tabBarInactive: '#6f7a72',
  modalBackground: 'rgba(5, 7, 5, 0.82)',
  inputBackground: '#111812',
  inputBorder: 'rgba(168, 239, 0, 0.14)',
  cardBackground: '#0b100d',
  accents: [
    '#a8ef00',
    '#22d3ee',
    '#38bdf8',
    '#34d399',
    '#fbbf24',
    '#fb923c',
    '#f472b6',
    '#c084fc',
    '#71b900',
  ],
};

export type ThemeMode = 'system' | 'light' | 'dark' | 'classic' | 'basic';

/** Every mode that maps directly to a palette. 'system' picks light or dark. */
const THEMES: Record<Exclude<ThemeMode, 'system'>, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  classic: classicTheme,
  basic: basicTheme,
};

/**
 * Theme used before any stored preference is read, and when none is saved.
 * Basic matches the myzippy.app site, so the app looks continuous with the web
 * experience a new user just came from.
 */
export const DEFAULT_THEME_MODE: ThemeMode = 'basic';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  // Both the initial value and the storage fallback use the same default, so the
  // first paint matches what loads a tick later and the theme doesn't flash.
  const [themeMode, setThemeModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);

  useEffect(() => {
    StorageUtils.getItem<ThemeMode>(StorageKeys.themeMode, DEFAULT_THEME_MODE).then(
      setThemeModeState,
    );
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    StorageUtils.setItem(StorageKeys.themeMode, mode);
  }, []);

  // Every named theme except 'light' is dark, which drives status-bar styling.
  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode !== 'light';
  const theme =
    themeMode === 'system' ? (isDark ? darkTheme : lightTheme) : THEMES[themeMode];

  return (
    <ThemeContext.Provider value={{ theme, themeMode, isDark, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
