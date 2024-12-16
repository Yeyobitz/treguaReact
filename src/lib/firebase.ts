import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyARKrdbiAb7QwNKY4tss9XC0YXLZ9sSihQ",
  authDomain: "tregua-6fe9e.firebaseapp.com",
  projectId: "tregua-6fe9e",
  storageBucket: "tregua-6fe9e.firebasestorage.app",
  messagingSenderId: "456357954548",
  appId: "1:456357954548:web:76b978da52fe591b9b2fa1",
  measurementId: "G-PW4B3FC4ME"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Enable offline persistence only if we're not in an admin route
if (!window.location.pathname.startsWith('/admin')) {
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser doesn\'t support persistence.');
      }
    });
}

export default app;