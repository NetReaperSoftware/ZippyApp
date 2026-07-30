/**
 * Web stand-in for the `@env` module.
 *
 * On native, `react-native-dotenv` is a Babel transform that rewrites
 * `import { X } from '@env'` at build time. Vite does not run that transform,
 * so `vite.config.ts` aliases `@env` to this file instead.
 *
 * Values come from Vite's `import.meta.env`, i.e. `VITE_`-prefixed variables in
 * a `.env` file or the host's build settings.
 *
 * The fallbacks must be a syntactically valid URL and a non-empty key:
 * `supabaseClient.ts` calls `createClient` at module scope, and supabase-js
 * throws "supabaseUrl is required." on an empty string. That throw happens
 * during import, before React mounts, and renders as a blank white page.
 *
 * Nothing actually talks to this host. The demo runs entirely on the fixtures in
 * services/mockData, and `SKIP_AUTH_FOR_UI_DEV` keeps the auth screens out of
 * the navigator, so the only call is a session restore that fails harmlessly and
 * is caught in AuthContext.
 *
 * Only ever put publishable values here. Anything referenced becomes part of the
 * client bundle and is readable by anyone who loads the page.
 */
const DEMO_PLACEHOLDER_URL = 'https://demo.invalid.supabase.co';
const DEMO_PLACEHOLDER_KEY = 'demo-anon-key-not-a-real-credential';

export const SUPABASE_URL: string =
  import.meta.env.VITE_SUPABASE_URL || DEMO_PLACEHOLDER_URL;
export const SUPABASE_ANON_KEY: string =
  import.meta.env.VITE_SUPABASE_ANON_KEY || DEMO_PLACEHOLDER_KEY;
export const BACKEND_API: string = import.meta.env.VITE_BACKEND_API || '';
