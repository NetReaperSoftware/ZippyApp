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

export type DashboardStackParamList = {
  Dashboard: undefined;
  MissedCalls: undefined;
  Notifications: undefined;
};

export type InboxStackParamList = {
  Inbox: undefined;
  Conversation: { conversationId: string; contactName: string };
};

export type ZippyStackParamList = {
  ZippyAssistant: undefined;
};

export type CalendarStackParamList = {
  Calendar: undefined;
  AppointmentDetail: { appointmentId: string };
};

export type MoreStackParamList = {
  More: undefined;
  Leads: undefined;
  LeadDetail: { leadId: string };
  SocialPost: undefined;
  WebsiteRequest: undefined;
  Profile: undefined;
  Settings: undefined;
  AdminDashboard: undefined;
  Reps: undefined;
  RepDetail: { repId: string };
};
