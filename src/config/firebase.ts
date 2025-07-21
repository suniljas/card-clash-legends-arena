// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging } from 'firebase/messaging';

// Check if Firebase config is available
const hasValidFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                               import.meta.env.VITE_FIREBASE_PROJECT_ID &&
                               import.meta.env.VITE_FIREBASE_API_KEY !== 'your_firebase_api_key_here' &&
                               import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'your_project_id_here';

const firebaseConfig = hasValidFirebaseConfig ? {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
} : {
  // Demo configuration - replace with your actual Firebase config
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo"
};

// Initialize Firebase
const app = hasValidFirebaseConfig ? initializeApp(firebaseConfig) : null;

// Initialize Firebase services with error handling
export let auth: any = null;
export let db: any = null;
export let functions: any = null;

if (hasValidFirebaseConfig && app) {
  try {
    auth = getAuth(app);
    db = getFirestore(app);
    functions = getFunctions(app);
    console.log('Firebase services initialized successfully');
  } catch (error) {
    console.warn('Firebase services not available:', error);
    console.log('Running in demo mode - some features may be limited');
  }
} else {
  console.log('Running in demo mode - some features may be limited');
}

// Initialize Analytics and Messaging (with error handling for environments where they might not work)
export let analytics: any = null;
export let messaging: any = null;

if (hasValidFirebaseConfig && app) {
  try {
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.warn('Analytics not available:', error);
  }
}

if (hasValidFirebaseConfig && app) {
  try {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      messaging = getMessaging(app);
    }
  } catch (error) {
    console.warn('Messaging not available:', error);
  }
}

export default app;