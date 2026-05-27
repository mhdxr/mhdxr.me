import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';

import { env, isFirebaseConfigured } from '@/common/libs/env';

/**
 * Firebase config object. We pass empty strings when envs are missing so that
 * callers can still type the result as a plain object, but we never call
 * `initializeApp` with that incomplete config — see the guard below.
 */
const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  databaseURL: env.NEXT_PUBLIC_FIREBASE_DB_URL ?? '',
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
  measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',
};

/**
 * Initialize Firebase only when the minimum required envs are present, and
 * only once across HMR/SSR re-imports. Returns `null` when the integration
 * is intentionally unconfigured (CI builds, previews, fresh checkouts) so
 * callers can render a graceful fallback UI instead of crashing.
 */
function initFirebase(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;

  const existing = getApps();
  if (existing.length > 0) return existing[0];

  try {
    return initializeApp(firebaseConfig);
  } catch (error) {
    // Defensive: if Firebase rejects the config at runtime (e.g. malformed
    // databaseURL), don't take the whole app down with us.
    // eslint-disable-next-line no-console
    console.warn(
      '[firebase] initializeApp failed, disabling integration',
      error,
    );
    return null;
  }
}

const firebase = initFirebase();

export { firebase, isFirebaseConfigured };
