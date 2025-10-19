import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-WcysWf6ruJBzkZtphl6qbi7erhWU5wc",
  authDomain: "padmaishastore.firebaseapp.com",
  projectId: "padmaishastore",
  storageBucket: "padmaishastore.appspot.com",
  messagingSenderId: "465490982451",
  appId: "1:465490982451:web:1a3da21f95eafb0949d546",
  measurementId: "G-RESERTDQL3"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : undefined;
