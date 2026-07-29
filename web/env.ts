/**
 * Web stand-in for the `@env` module.
 *
 * On native, `react-native-dotenv` is a Babel transform that rewrites
 * `import { X } from '@env'` at build time. Vite does not run that transform,
 * so `vite.config.ts` aliases `@env` to this file instead.
 *
 * Values come from Vite's `import.meta.env`, i.e. `VITE_`-prefixed variables in
 * a `.env` file or the host's build settings. They fall back to empty strings so
 * the demo boots without any configuration — every screen renders mock data and
 * nothing calls Supabase while `SKIP_AUTH_FOR_UI_DEV` is on.
 *
 * Only ever put publishable values here. Anything referenced becomes part of the
 * client bundle and is readable by anyone who loads the page.
 */
export const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
export const BACKEND_API: string = import.meta.env.VITE_BACKEND_API ?? '';
