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
};

export type ThemeMode = 'system' | 'light' | 'dark' | 'classic';

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
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    StorageUtils.getItem<ThemeMode>(StorageKeys.themeMode, 'system').then(setThemeModeState);
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    StorageUtils.setItem(StorageKeys.themeMode, mode);
  }, []);

  // Classic is a dark theme, so it counts as dark for status-bar styling.
  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode !== 'light';
  const theme =
    themeMode === 'classic' ? classicTheme : isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, isDark, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
