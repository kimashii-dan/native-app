// firebaseConfig/config.js
import { initializeApp } from "firebase/app";

// IMPORTANT: We must use the React Native entry point for Firebase Auth.
// If your module resolution or TS config is interfering, see steps below.
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnRb0_P0E-1DrRnX7uqw0fXer7FCGdJYk",
  authDomain: "bruh-d6aed.firebaseapp.com",
  projectId: "bruh-d6aed",
  storageBucket: "bruh-d6aed.firebasestorage.app",
  messagingSenderId: "888953550412",
  appId: "1:888953550412:web:973330dea2a2c8b0e826e9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with native persistence:
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
