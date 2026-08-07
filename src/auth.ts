import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, getRedirectResult, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

// Add Workspace scopes for Drive, Picker, and Classroom
provider.addScope('https://www.googleapis.com/auth/drive.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly');
provider.addScope('https://www.googleapis.com/auth/classroom.courses.readonly');
provider.addScope('https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly');
provider.addScope('https://www.googleapis.com/auth/classroom.coursework.students.readonly');
provider.addScope('https://www.googleapis.com/auth/classroom.topics.readonly');

// Cache the access token in memory, backed by sessionStorage so it survives
// page refreshes within the tab session. OAuth access tokens for these scopes
// expire after roughly one hour, so an expired cached token is discarded.
const TOKEN_STORAGE_KEY = 'tattva_gws_token';
const TOKEN_TTL_MS = 55 * 60 * 1000;

let cachedAccessToken: string | null = null;

try {
  const raw = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    if (parsed?.token && Date.now() - parsed.savedAt < TOKEN_TTL_MS) {
      cachedAccessToken = parsed.token;
    } else {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }
} catch {
  // storage unavailable or corrupt — start with a fresh token
}

const persistToken = (token: string) => {
  try {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify({ token, savedAt: Date.now() }));
  } catch {
    // storage unavailable — keep token in memory only
  }
};

// Initialize auth state listener.
// This does NOT process redirect results — call resolveRedirectSignIn() once
// at startup (before registering this listener) so the access token is cached
// when onAuthStateChanged fires.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  console.log('[Auth] Registering auth state listener. cachedAccessToken:', !!cachedAccessToken);
  return onAuthStateChanged(auth, (user: User | null) => {
    console.log('[Auth] onAuthStateChanged. user:', user?.email ?? 'null', 'hasToken:', !!cachedAccessToken);
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Resolve a pending Google redirect sign-in (returns from Google OAuth).
// Call once at app startup so the access token is captured reliably.
export const resolveRedirectSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    console.log('[Auth] Checking for pending Google redirect result...');
    const result = await getRedirectResult(auth);
    if (!result) {
      console.log('[Auth] No pending redirect result.');
      return null;
    }
    console.log('[Auth] Got redirect result! User:', result.user.email);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      console.warn('[Auth] No access token in credential.');
      return null;
    }
    console.log('[Auth] Access token captured. Persisting...');
    cachedAccessToken = credential.accessToken;
    persistToken(cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('[Auth] Failed to resolve Google redirect sign-in:', error);
    return null;
  }
};

// Sign in with Google. Uses a popup window (more reliable than full-page
// redirect for localhost + custom domains, and errors surface immediately
// instead of after a page round-trip).
export const googleSignIn = async (): Promise<void> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
      persistToken(cachedAccessToken);
      console.log('[Auth] Popup sign-in success. Token captured.');
    }
  } catch (error: any) {
    console.error('[Auth] Sign in error:', error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  try {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // ignore storage errors on logout
  }
};
