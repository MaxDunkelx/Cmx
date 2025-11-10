import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

function assertConfig() {
  const missingKeys = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing Firebase config values: ${missingKeys.join(', ')}. ` +
      `Check your Vite environment variables.`
    );
  }
}

let app;
export function getFirebaseApp() {
  if (!app) {
    if (getApps().length === 0) {
      assertConfig();
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
  }
  return app;
}

let auth;
export function getFirebaseAuth() {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

let analyticsPromise;
export async function getFirebaseAnalytics() {
  if (!analyticsPromise) {
    analyticsPromise = (async () => {
      if (typeof window === 'undefined') return null;
      if (!(await isAnalyticsSupported())) return null;
      if (!firebaseConfig.measurementId) return null;
      return getAnalytics(getFirebaseApp());
    })();
  }
  return analyticsPromise;
}

