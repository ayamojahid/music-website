// Lightweight Firebase helper (client-only). Configure env vars with VITE_ prefix.
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc
} from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase config: prefer Vite env vars (VITE_FIREBASE_*), fallback to embedded values for quick tests
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA-3OnHgkX9JEwy3VUPc0XZUlyOxsf4DqE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'music-fire-a85d4.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'music-fire-a85d4',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'music-fire-a85d4.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '74879288475',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:74879288475:web:25da3bcc96399abf3cb23e'
};

let app = null;
let auth = null;
let db = null;
let storage = null;

export function initFirebase() {
  if (app) return { app, auth, db, storage };
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    return { app, auth, db, storage };
  } catch (err) {
    console.warn('Firebase init failed:', err?.message || err);
    app = null; auth = null; db = null; storage = null;
    return { app: null, auth: null, db: null, storage: null };
  }
}

export function onAuthState(cb) {
  if (!auth) initFirebase();
  if (!auth) return () => {};
  return onAuthStateChanged(auth, cb);
}

export async function signInWithGooglePopup() {
  if (!auth) initFirebase();
  if (!auth) throw new Error('Firebase not configured');
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signInWithGoogleRedirect() {
  if (!auth) initFirebase();
  if (!auth) throw new Error('Firebase not configured');
  const provider = new GoogleAuthProvider();
  // This will redirect the page to Google sign-in; on return onAuthStateChanged will fire
  await signInWithRedirect(auth, provider);
}

export async function signUpWithEmail(email, password) {
  if (!auth) initFirebase();
  if (!auth) throw new Error('Firebase not configured');
  const res = await createUserWithEmailAndPassword(auth, email, password);
  return res.user;
}

export async function signInWithEmail(email, password) {
  if (!auth) initFirebase();
  if (!auth) throw new Error('Firebase not configured');
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
}

export async function signOut() {
  if (!auth) return;
  await firebaseSignOut(auth);
}

export async function uploadSongForUser(file, userId) {
  if (!storage) initFirebase();
  if (!storage) throw new Error('Firebase storage not configured');
  const fileRef = storageRef(storage, `users/${userId}/songs/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(fileRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}

export async function saveSongMetadata(userId, metadata) {
  if (!db) initFirebase();
  if (!db) throw new Error('Firestore not configured');
  const col = collection(db, 'users', userId, 'songs');
  const docRef = await addDoc(col, metadata);
  return { id: docRef.id };
}

export async function getUserSongs(userId) {
  if (!db) initFirebase();
  if (!db) return [];
  const col = collection(db, 'users', userId, 'songs');
  const snaps = await getDocs(col);
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateUserProfile(user, profile) {
  if (!auth) initFirebase();
  if (!auth) throw new Error('Firebase not configured');
  // update auth profile
  try {
    await updateProfile(auth.currentUser, profile);
  } catch (e) {
    // ignore if cannot update auth profile (e.g., provider-only accounts)
    console.warn('updateProfile failed', e);
  }
  // also update user doc in firestore
  if (db) {
    const ref = doc(db, 'users', user.uid || user.id);
    await setDoc(ref, { displayName: profile.displayName, photoURL: profile.photoURL }, { merge: true });
  }
  return { ...user, ...profile };
}

export async function setUserDoc(userId, data) {
  if (!db) initFirebase();
  if (!db) throw new Error('Firestore not configured');
  const ref = doc(db, 'users', userId);
  await setDoc(ref, data, { merge: true });
}

export async function getUserDoc(userId) {
  if (!db) initFirebase();
  if (!db) return null;
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export default {
  initFirebase,
  signInWithGooglePopup,
  signUpWithEmail,
  signInWithEmail,
  signOut,
  uploadSongForUser,
  saveSongMetadata,
  getUserSongs,
  updateUserProfile,
  setUserDoc,
  getUserDoc,
  onAuthState
};