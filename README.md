# ZippyApp

React Native 0.79.2 app (TypeScript), structured to mirror the base project layout.

## Setup

```sh
npm install
cp .env.example .env    # fill in real Supabase values
cd ios && bundle install && bundle exec pod install && cd ..
```

## Run

```sh
npm start          # Metro
npm run ios
npm run android
npm test
npm run lint
```

## Structure

| Path          | Purpose |
| ------------- | ------- |
| `App.tsx`     | Provider tree + root stack/tab navigation |
| `screens/`    | Full-screen route components |
| `components/` | Reusable UI, grouped by feature (`common/` for shared) |
| `contexts/`   | React context providers (theme, auth, …) |
| `hooks/`      | Reusable stateful logic |
| `services/`   | Data access and platform integrations |
| `utils/`      | Pure helpers |
| `types/`      | Shared TypeScript types |
| `constants/`  | Static values (storage keys, options) |
| `config/`     | Runtime configuration objects |
| `database/`   | Local DB schema, migrations, seeds |
| `supabase/`   | Supabase edge functions and migrations |
| `backend/`    | Optional Node API (routes, middleware, services) |
| `assets/`     | Images and sounds |
| `docs/`       | Design notes and feature plans |
| `__tests__/`  | Jest tests |
| `__mocks__/`  | Jest module mocks (`@env`, native modules) |

## Environment

Variables are read through `react-native-dotenv` as the `@env` module. Declare new
keys in `env.d.ts`, add them to `.env.example`, and mock them in `__mocks__/@env.js`.
