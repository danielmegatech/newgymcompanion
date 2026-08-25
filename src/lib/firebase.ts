/**
 * Firebase Client Initialization
 * Connects directly to Cloud Firestore with custom database ID from config.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, signInAnonymously } from 'firebase/auth';
import config from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

// Initialize Firebase App instance
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if configured
export const db: Firestore = config.firestoreDatabaseId
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Initialize anonymous auth session if possible
if (typeof window !== 'undefined') {
  signInAnonymously(auth).catch(() => {
    // Ignore if offline or anonymous auth not enabled in console
  });
}

