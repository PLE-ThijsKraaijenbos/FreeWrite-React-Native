# FreeWrite (Mobile App)

The React Native (Expo) app for FreeWrite, a mobile self-help app built around
narrative therapy. It talks to the [Django API](../FreeWrite-Django).

## Description

The app has three bottom tabs (Home, Journey, Community), plus the onboarding
flow and the avatar editor screens:

| Area | What it does |
| --- | --- |
| **Onboarding** | Creating an account (register/login), a multi-step questionnaire that shapes the experience, avatar setup, and a step that can point you to professional help. |
| **Home / Avatar** | Your avatar and coin balance. Coins you earn in minigames get spent in the avatar editor to unlock and equip items. |
| **Journey** | The main part. The phases shown as a progress map of steps that unlock one after another. Each step is a minigame (journal, letter, choice story, speech bubble, bubble pop, scale). Finishing one saves progress and pays out coins. |
| **Community** | A shared feed to post, read, tag and like writing. Posts can have an image. |

### The avatar

Avatars are rendered with the DiceBear Avataaars API. The avatar editor items
are DiceBear customisation params (hair, clothing, accessories, colours, and so
on) that you unlock with coins and equip. The app builds the DiceBear URL from
whatever's currently equipped.

## Tech stack

- Expo / React Native / React
- Expo Router for file-based routing (typed routes)
- NativeWind (Tailwind for RN) for styling
- React Hook Form + Zod for the multi-step forms and validation
- TanStack Query for server state, Context API for auth state
- Axios for the API client, expo-secure-store for storing JWTs
- DiceBear Avataaars for the avatars
- expo-dev-client for local dev, EAS Build for distribution

## Installation

The app uses native modules (like `expo-secure-store`) that aren't in the stock
Expo Go app, so it runs in a development build instead. That's basically your own
version of Expo Go with those native modules baked in. The MVP targets Android.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your env file and point the app at a running backend (the
   [backend README](../FreeWrite-Django) covers starting one):

   ```bash
   cp .env.example .env.local
   ```

   ```env
   # local backend exposed via ngrok, so a real phone can reach it
   EXPO_PUBLIC_FREEWRITE_API_URL=https://your-subdomain.ngrok-free.app
   ```

3. Get a development build onto your device or emulator. The first time, build
   one with EAS (or just install an existing build if someone already shared the
   APK):

   ```bash
   eas build --profile development --platform android
   ```

4. From then on, you don't rebuild. Just start the bundler and open the
   development build:

   ```bash
   npx expo start
   ```

### When you need a new build

A development build only needs rebuilding when the native side of the app
changes, for example:

- adding, removing, or upgrading a package that ships native code
- changing native config in `app.json` (plugins, permissions, icons, scheme)

Plain JS/TS changes don't need a rebuild. `npx expo start` picks those up live,
so most day-to-day work never touches EAS.

## How auth works

Auth is JWT. When you log in or register, the API hands back an `access` and a
`refresh` token, both stored with expo-secure-store. The Axios client adds
`Authorization: Bearer <access>` to requests. Access tokens only live 5 minutes,
so when one runs out the refresh token is used to quietly grab a new one instead
of kicking the user back to the login screen.

## Environment variables

| Variable | What it's for |
| --- | --- |
| `EXPO_PUBLIC_FREEWRITE_API_URL` | Base URL of the FreeWrite API. |

`.env.local` holds this for local dev (the ngrok URL pointing at your local
backend).

## Builds (EAS)

Builds go through EAS Build (`eas.json`):

| Profile | When you'd use it |
| --- | --- |
| `development` | Internal dev client build. |
| `preview` | Internal Android APK. |

```bash
eas build --profile preview --platform android
```

## Design system

NativeWind for styling, with the design tokens (fonts, colours, spacing) in
`src/constants/tokens.js` and wired through `tailwind.config.js`. Fonts are
Unbounded for headings and Inter for body.

## Project structure

```
src/
├── app/          # Screens & routes (expo-router): tabs (home, journey, community),
│                 #   onboarding, journey, community, shop, avatar-editor, add/edit-post...
├── api/          # API calls (auth, user, journey, community, onboarding, avatar-items)
├── components/   # Reusable UI components
├── hooks/        # Custom hooks (journey, community, theme)
├── lib/          # Auth context/storage, avatar (DiceBear) logic
├── types/        # Shared TypeScript types
└── constants/    # Theme tokens, shadows
```
