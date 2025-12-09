// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDAfLqHhzTdjG3eH2jaubt1kZ_WCvG3FZw",
  authDomain: "angles-attendance-web.firebaseapp.com",
  projectId: "angles-attendance-web",
  storageBucket: "angles-attendance-web.appspot.com", // صححت الـ storageBucket
  messagingSenderId: "416084006492",
  appId: "1:416084006492:web:29c8c3d68d09e49b59b899",
  measurementId: "G-JY8H6JJZS0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // تصدير Firestore
export const analytics = getAnalytics(app);