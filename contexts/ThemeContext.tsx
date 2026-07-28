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

export type ThemeMode = 'system' | 'light' | 'dark';

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

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, isDark, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
