// .env handler module
declare module '@env' {
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
  export const SUPABASE_SERVICE_ROLE_KEY: string;
  export const BACKEND_API: string;
}

// Image imports. Metro resolves these to an asset id (a number); the Vite web
// build resolves them to a URL string. <Image source> accepts either.
declare module '*.png' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}
