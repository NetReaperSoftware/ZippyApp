export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  // Signup is intentionally not registered in the navigator right now, but the
  // key stays so screens/SignupScreen.tsx keeps type-checking until it returns.
  Signup: undefined;
  PasswordReset: undefined;
  MainTabs: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Messages: undefined;
  Contacts: undefined;
  Appointments: undefined;
  Settings: undefined;
};
