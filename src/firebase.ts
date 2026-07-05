import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Config loaded from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyB5rdO2s_k5DXqkTVCVmhzYGJUfEneqxiQ",
  authDomain: "ascendant-nectar-x6tp2.firebaseapp.com",
  projectId: "ascendant-nectar-x6tp2",
  storageBucket: "ascendant-nectar-x6tp2.firebasestorage.app",
  messagingSenderId: "867754628382",
  appId: "1:867754628382:web:cfc26bf3837fafab04650f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth Helpers
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile
};
export type { FirebaseUser };
