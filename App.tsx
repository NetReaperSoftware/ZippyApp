import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';
// SignupScreen still exists but is intentionally not registered.

// Dashboard tab
import DashboardScreen from './screens/DashboardScreen';
import MissedCallsScreen from './screens/MissedCallsScreen';
import NotificationsScreen from './screens/NotificationsScreen';

// Inbox tab
import InboxScreen from './screens/InboxScreen';
import ConversationScreen from './screens/ConversationScreen';

// Zippy tab
import ZippyAssistantScreen from './screens/ZippyAssistantScreen';

// Calendar tab
import CalendarScreen from './screens/CalendarScreen';
import AppointmentDetailScreen from './screens/AppointmentDetailScreen';

// More tab
import MoreScreen from './screens/MoreScreen';
import LeadsScreen from './screens/LeadsScreen';
import LeadDetailScreen from './screens/LeadDetailScreen';
import SocialPostScreen from './screens/SocialPostScreen';
import WebsiteRequestScreen from './screens/WebsiteRequestScreen';
import BroadcastsScreen from './screens/BroadcastsScreen';
import AIConfigScreen from './screens/AIConfigScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import RepsScreen from './screens/RepsScreen';
import RepDetailScreen from './screens/RepDetailScreen';

import type {
  CalendarStackParamList,
  DashboardStackParamList,
  InboxStackParamList,
  MainTabParamList,
  MoreStackParamList,
  RootStackParamList,
  ZippyStackParamList,
} from './types/Navigation';

const RootStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
const InboxStack = createNativeStackNavigator<InboxStackParamList>();
const ZippyStack = createNativeStackNavigator<ZippyStackParamList>();
const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();
const MoreStack = createNativeStackNavigator<MoreStackParamList>();

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

// Screens supply their own AppBar, so the stack headers stay off throughout.
const stackOptions = { headerShown: false } as const;

function DashboardStackNavigator(): React.JSX.Element {
  return (
    <DashboardStack.Navigator screenOptions={stackOptions}>
      <DashboardStack.Screen name="Dashboard" component={DashboardScreen} />
      <DashboardStack.Screen name="MissedCalls" component={MissedCallsScreen} />
      <DashboardStack.Screen name="Notifications" component={NotificationsScreen} />
    </DashboardStack.Navigator>
  );
}

function InboxStackNavigator(): React.JSX.Element {
  return (
    <InboxStack.Navigator screenOptions={stackOptions}>
      <InboxStack.Screen name="Inbox" component={InboxScreen} />
      <InboxStack.Screen name="Conversation" component={ConversationScreen} />
    </InboxStack.Navigator>
  );
}

function ZippyStackNavigator(): React.JSX.Element {
  return (
    <ZippyStack.Navigator screenOptions={stackOptions}>
      <ZippyStack.Screen name="ZippyAssistant" component={ZippyAssistantScreen} />
    </ZippyStack.Navigator>
  );
}

function CalendarStackNavigator(): React.JSX.Element {
  return (
    <CalendarStack.Navigator screenOptions={stackOptions}>
      <CalendarStack.Screen name="Calendar" component={CalendarScreen} />
      <CalendarStack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
    </CalendarStack.Navigator>
  );
}

function MoreStackNavigator(): React.JSX.Element {
  const { role } = useAuth();
  const isAdmin = role === 'admin' || role === 'rep';

  return (
    <MoreStack.Navigator screenOptions={stackOptions}>
      <MoreStack.Screen name="More" component={MoreScreen} />
      <MoreStack.Screen name="Leads" component={LeadsScreen} />
      <MoreStack.Screen name="LeadDetail" component={LeadDetailScreen} />
      <MoreStack.Screen name="SocialPost" component={SocialPostScreen} />
      <MoreStack.Screen name="WebsiteRequest" component={WebsiteRequestScreen} />
      <MoreStack.Screen name="Broadcasts" component={BroadcastsScreen} />
      <MoreStack.Screen name="AIConfig" component={AIConfigScreen} />
      <MoreStack.Screen name="Profile" component={ProfileScreen} />
      <MoreStack.Screen name="Settings" component={SettingsScreen} />
      {/* Admin routes are not registered at all for owners, so they can't be
          reached even by a stray navigate() call. */}
      {isAdmin && (
        <>
          <MoreStack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <MoreStack.Screen name="Reps" component={RepsScreen} />
          <MoreStack.Screen name="RepDetail" component={RepDetailScreen} />
        </>
      )}
    </MoreStack.Navigator>
  );
}

const TAB_ICONS: Record<keyof MainTabParamList, string> = {
  DashboardTab: 'grid',
  InboxTab: 'chatbubbles',
  ZippyTab: 'sparkles',
  CalendarTab: 'calendar',
  MoreTab: 'ellipsis-horizontal',
};

const TAB_LABELS: Record<keyof MainTabParamList, string> = {
  DashboardTab: 'Dashboard',
  InboxTab: 'Inbox',
  ZippyTab: 'Zippy',
  CalendarTab: 'Calendar',
  MoreTab: 'More',
};

function MainTabNavigator(): React.JSX.Element {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: TAB_LABELS[route.name],
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
      <Tab.Screen name="DashboardTab" component={DashboardStackNavigator} />
      <Tab.Screen name="InboxTab" component={InboxStackNavigator} />
      <Tab.Screen name="ZippyTab" component={ZippyStackNavigator} />
      <Tab.Screen name="CalendarTab" component={CalendarStackNavigator} />
      <Tab.Screen name="MoreTab" component={MoreStackNavigator} />
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
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {loading && !SKIP_AUTH_FOR_UI_DEV ? (
          <RootStack.Screen name="Splash" component={SplashScreen} />
        ) : user || SKIP_AUTH_FOR_UI_DEV ? (
          <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
        ) : (
          <>
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="PasswordReset" component={PasswordResetScreen} />
          </>
        )}
      </RootStack.Navigator>
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
