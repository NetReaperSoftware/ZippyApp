/**
 * Every AsyncStorage key the app owns. Keeping them in one place avoids
 * silent typos and makes it obvious what gets wiped on sign-out.
 */
export const StorageKeys = {
  themeMode: '@zippy/theme_mode',
  onboardingComplete: '@zippy/onboarding_complete',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
