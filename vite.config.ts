import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { transformSync } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Several react-native ecosystem packages publish untranspiled JSX inside plain
 * `.js` files (react-native-vector-icons/lib/create-icon-set.js, for one). Vite
 * only applies its JSX transform to app code, so Rollup's parser reaches those
 * files first and fails on the angle bracket.
 *
 * This runs before Vite's own resolvers and transforms just those packages.
 */
function reactNativeJsxInNodeModules(): Plugin {
  const TARGETS = /node_modules[\\/](react-native-|@react-native|react-native$)/;

  return {
    name: 'rn-jsx-in-node-modules',
    enforce: 'pre',
    transform(code, id) {
      const [filepath] = id.split('?');
      if (!TARGETS.test(filepath) || !/\.jsx?$/.test(filepath)) {
        return null;
      }
      // Cheap guard so we only pay for files that actually contain JSX.
      if (!/<[A-Za-z/]/.test(code)) {
        return null;
      }

      const result = transformSync(code, {
        loader: 'jsx',
        jsx: 'automatic',
        format: 'esm',
        target: 'es2020',
        sourcefile: filepath,
      });

      // esbuild yields '' (not null) when sourcemaps are off, and Rollup would
      // try to JSON.parse that. `||` rather than `??` is deliberate here.
      return { code: result.code, map: result.map || null };
    },
  };
}

/**
 * GitHub Pages serves static files with no rewrite rules, so refreshing on a
 * sub-route returns its 404 page. Shipping the app's HTML as 404.html makes
 * Pages hand unknown paths to the SPA, which then routes them client-side.
 *
 * The app shell is used rather than the root redirect so that deep links into
 * the demo survive a refresh. A genuinely mistyped URL therefore lands on the
 * app rather than an error page — an acceptable trade for a demo site.
 *
 * Harmless on hosts that do their own SPA rewrites (Cloudflare, Netlify).
 */
function githubPagesSpaFallback(): Plugin {
  return {
    name: 'gh-pages-spa-fallback',
    apply: 'build',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist-web');
      const appHtml = path.join(outDir, 'free14daytrial', 'index.html');
      if (fs.existsSync(appHtml)) {
        fs.copyFileSync(appHtml, path.join(outDir, '404.html'));
      }
    },
  };
}

/**
 * Web build of the MyZippy app.
 *
 * The same source that ships to iOS/Android is compiled for the browser via
 * react-native-web. Nothing here affects the native build — Metro reads
 * metro.config.js and ignores this file entirely.
 */
export default defineConfig(() => ({
  // Served from the root of the custom domain (myzippy.app), so assets resolve
  // from '/' and the three pages can link to each other with absolute paths.
  // Override only if serving from a subpath, e.g. a github.io project site:
  //   VITE_BASE=/ZippyApp/ npm run build:web
  // Note that the inter-page links in index.html and landing/index.html are
  // absolute, so a subpath deploy needs those updated too.
  base: process.env.VITE_BASE ?? '/',

  plugins: [reactNativeJsxInNodeModules(), react(), githubPagesSpaFallback()],

  resolve: {
    alias: {
      // The core swap: every `from 'react-native'` resolves to the web shim.
      'react-native': 'react-native-web',
      // Native uses a Babel transform for this; web gets a real module.
      '@env': path.resolve(__dirname, 'web/env.ts'),
    },
    // `.web.*` must win over the bare extension so platform-specific files in
    // react-native-screens, gesture-handler, etc. are picked up.
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],
  },

  define: {
    // react-native guards dev-only code on this; without it the bundle throws.
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    global: 'globalThis',
  },

  optimizeDeps: {
    esbuildOptions: {
      // Dependency pre-bundling needs the same platform resolution as the app.
      resolveExtensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
      loader: { '.js': 'jsx' as const },
    },
  },

  build: {
    outDir: 'dist-web',
    emptyOutDir: true,
    rollupOptions: {
      // Three pages. Output paths mirror these source paths, so the app lands at
      // /free14daytrial/ and the landing page at /landing/.
      input: {
        root: path.resolve(__dirname, 'index.html'),
        landing: path.resolve(__dirname, 'landing/index.html'),
        app: path.resolve(__dirname, 'free14daytrial/index.html'),
      },
    },
  },
}));
