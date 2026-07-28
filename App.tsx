import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Screens
// SignupScreen and HomeScreen still exist but are not registered below.
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';
import DashboardScreen from './screens/DashboardScreen';
import MessagesScreen from './screens/MessagesScreen';
import ContactsScreen from './screens/ContactsScreen';
import AppointmentsScreen from './screens/AppointmentsScreen';
import SettingsScreen from './screens/SettingsScreen';

import type { RootStackParamList, MainTabParamList } from './types/Navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Temporary, for building out the in-app UI: boot straight into the tab
// navigator instead of the Splash/Login flow. Set back to false to restore the
// auth gate. Screens still read `useAuth()`, which returns a null user here, so
// anything user-specific renders its signed-out fallback.
const SKIP_AUTH_FOR_UI_DEV = true;

// Deep link configuration
const linking = {
  prefixes: ['https://zippyapp.com', 'zippyapp://'],
  config: {
    screens: {
      PasswordReset: 'reset-password',
      Login: 'login',
    },
  },
};

const TAB_ICONS: Record<keyof MainTabParamList, string> = {
  Dashboard: 'grid',
  Messages: 'chatbubbles',
  Contacts: 'people',
  Appointments: 'calendar',
  Settings: 'settings',
};

function MainTabNavigator(): React.JSX.Element {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const base = TAB_ICONS[route.name];
          return (
            <Ionicons
              name={focused ? base : `${base}-outline`}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          borderTopColor: theme.border,
        },
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator(): React.JSX.Element {
  const { user, loading } = useAuth();
  const { theme, isDark } = useTheme();

  return (
    <NavigationContainer linking={linking}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {loading && !SKIP_AUTH_FOR_UI_DEV ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : user || SKIP_AUTH_FOR_UI_DEV ? (
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
