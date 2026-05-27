/**
 * Lightweight environment variable validator.
 *
 * Goals:
 *  - Make required envs explicit and fail fast at server startup with a
 *    clear message instead of crashing later with `undefined.foo`.
 *  - Treat optional integrations (Spotify, OpenAI, WakaTime, etc.) as
 *    truly optional — the rest of the app must not crash if they're empty.
 *  - Avoid pulling in a new dependency (e.g. zod) just for this.
 *
 * Usage:
 *   import { env, isFeatureEnabled } from '@/common/libs/env';
 *   if (isFeatureEnabled.spotify) { ... }
 */

type EnvKey = string;

const isServer = typeof window === 'undefined';

function readEnv(key: EnvKey): string | undefined {
  const value = process.env[key];
  if (value === undefined || value === '') return undefined;
  return value;
}

function requireEnv(key: EnvKey): string {
  const value = readEnv(key);
  if (!value) {
    // Only throw on the server. On the client, NEXT_PUBLIC_* values are
    // inlined at build time; if they're missing we still warn but don't
    // hard-crash the browser bundle.
    const message = `[env] Missing required environment variable: ${key}`;
    if (isServer && process.env.NODE_ENV !== 'test') {
      throw new Error(message);
    }
    // eslint-disable-next-line no-console
    console.warn(message);
    return '';
  }
  return value;
}

/**
 * Default owner email used as a fallback when NEXT_PUBLIC_OWNER_EMAIL is not
 * set. Kept in sync with the historical hardcoded value to preserve admin
 * permissions on the guestbook for existing installs.
 */
const DEFAULT_OWNER_EMAIL = 'mhdxr.dev@gmail.com';

/**
 * Required envs. These MUST be set for the app to function correctly.
 * Note: NEXTAUTH_SECRET is required in production for next-auth to sign
 * cookies; we tolerate its absence in development to ease local setup.
 */
export const env = {
  SITE_URL: readEnv('SITE_URL') ?? 'https://mhdxr.me',
  NODE_ENV: process.env.NODE_ENV ?? 'development',

  // Database (required at runtime for Prisma)
  DATABASE_URL: requireEnv('DATABASE_URL'),
  DIRECT_URL: readEnv('DIRECT_URL'),

  // NextAuth
  NEXTAUTH_URL: readEnv('NEXTAUTH_URL') ?? 'http://localhost:3000',
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === 'production'
      ? requireEnv('NEXTAUTH_SECRET')
      : readEnv('NEXTAUTH_SECRET'),

  // Optional integrations — never throw, just expose presence flags.
  BLOG_API_URL: readEnv('BLOG_API_URL'),
  DEVTO_KEY: readEnv('DEVTO_KEY'),

  OPENAI_API_KEY: readEnv('OPENAI_API_KEY'),

  SPOTIFY_CLIENT_ID: readEnv('SPOTIFY_CLIENT_ID'),
  SPOTIFY_CLIENT_SECRET: readEnv('SPOTIFY_CLIENT_SECRET'),
  SPOTIFY_REFRESH_TOKEN: readEnv('SPOTIFY_REFRESH_TOKEN'),

  WAKATIME_API_KEY: readEnv('WAKATIME_API_KEY'),

  GITHUB_READ_USER_TOKEN_PERSONAL: readEnv('GITHUB_READ_USER_TOKEN_PERSONAL'),
  GITHUB_READ_USER_TOKEN_WORK: readEnv('GITHUB_READ_USER_TOKEN_WORK'),

  CONTACT_FORM_API_KEY: readEnv('CONTACT_FORM_API_KEY'),

  GOOGLE_CLIENT_ID: readEnv('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: readEnv('GOOGLE_CLIENT_SECRET'),
  GITHUB_ID: readEnv('GITHUB_ID'),
  GITHUB_SECRET: readEnv('GITHUB_SECRET'),

  // Public site config — exposed to the browser. Falls back to the historical
  // owner email so existing deployments keep working without a config change.
  NEXT_PUBLIC_OWNER_EMAIL:
    readEnv('NEXT_PUBLIC_OWNER_EMAIL') ?? DEFAULT_OWNER_EMAIL,

  // Firebase (Realtime Database) — all NEXT_PUBLIC_* so they're inlined into
  // the client bundle. Treated as optional so the app doesn't crash when the
  // guestbook is intentionally unconfigured (CI, previews, fresh local
  // checkouts).
  NEXT_PUBLIC_FIREBASE_API_KEY: readEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: readEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  NEXT_PUBLIC_FIREBASE_DB_URL: readEnv('NEXT_PUBLIC_FIREBASE_DB_URL'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: readEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: readEnv(
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  ),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: readEnv(
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  ),
  NEXT_PUBLIC_FIREBASE_APP_ID: readEnv('NEXT_PUBLIC_FIREBASE_APP_ID'),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: readEnv(
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  ),
  NEXT_PUBLIC_FIREBASE_CHAT_DB: readEnv('NEXT_PUBLIC_FIREBASE_CHAT_DB'),
};

/**
 * Boolean flags for optional features. Components and API routes can
 * gate their behavior on these without hard-crashing when an integration
 * is unconfigured.
 */
export const isFeatureEnabled = {
  spotify: Boolean(
    env.SPOTIFY_CLIENT_ID &&
      env.SPOTIFY_CLIENT_SECRET &&
      env.SPOTIFY_REFRESH_TOKEN,
  ),
  openai: Boolean(env.OPENAI_API_KEY),
  wakatime: Boolean(env.WAKATIME_API_KEY),
  github: Boolean(
    env.GITHUB_READ_USER_TOKEN_PERSONAL || env.GITHUB_READ_USER_TOKEN_WORK,
  ),
  blog: Boolean(env.BLOG_API_URL),
  devto: Boolean(env.DEVTO_KEY),
  contactForm: Boolean(env.CONTACT_FORM_API_KEY),
  googleAuth: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
  githubAuth: Boolean(env.GITHUB_ID && env.GITHUB_SECRET),
  // Firebase Realtime DB — minimum set required to actually talk to RTDB.
  // We require apiKey, projectId, and the databaseURL because that's what
  // `firebase/database` needs to bootstrap. The chat node path is also
  // required because every guestbook read/write is namespaced under it.
  firebase: Boolean(
    env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      env.NEXT_PUBLIC_FIREBASE_DB_URL &&
      env.NEXT_PUBLIC_FIREBASE_CHAT_DB,
  ),
};

/**
 * Convenience alias mirroring the firebase feature flag. Exposed because the
 * guestbook code reads more naturally as `isFirebaseConfigured` than
 * `isFeatureEnabled.firebase`.
 */
export const isFirebaseConfigured = (): boolean => isFeatureEnabled.firebase;

export type FeatureFlag = keyof typeof isFeatureEnabled;
