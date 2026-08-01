import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  // Signup is intentionally not registered in the navigator right now, but the
  // key stays so screens/SignupScreen.tsx keeps type-checking until it returns.
  Signup: undefined;
  PasswordReset: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};

export type MainTabParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;
  InboxTab: NavigatorScreenParams<InboxStackParamList>;
  ZippyTab: NavigatorScreenParams<ZippyStackParamList>;
  CalendarTab: NavigatorScreenParams<CalendarStackParamList>;
  MoreTab: NavigatorScreenParams<MoreStackParamList>;
};

/**
 * Feature screens with no tab of their own, reachable both from the Dashboard
 * shortcuts and the More menu.
 *
 * They are registered in *both* stacks on purpose. Cross-tab navigation would
 * push them onto the More tab's existing history, so Back would land on
 * whatever was opened previously rather than on the screen you came from.
 * Each stack keeping its own copy makes Back always return to its origin.
 */
export type FeatureRoutes = {
  Leads: undefined;
  LeadDetail: { leadId: string };
  SocialPost: undefined;
  WebsiteRequest: undefined;
  Broadcasts: undefined;
  AIConfig: undefined;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
  Overview: undefined;
  MissedCalls: undefined;
  Notifications: undefined;
} & FeatureRoutes;

export type InboxStackParamList = {
  Inbox: undefined;
  Conversation: { conversationId: string; contactName: string };
};

export type ZippyStackParamList = {
  ZippyAssistant: undefined;
  ChatGPT: undefined;
};

export type CalendarStackParamList = {
  Calendar: undefined;
  AppointmentDetail: { appointmentId: string };
};

export type MoreStackParamList = {
  More: undefined;
  Profile: undefined;
  Settings: undefined;
  AdminDashboard: undefined;
  Reps: undefined;
  RepDetail: { repId: string };
} & FeatureRoutes;
