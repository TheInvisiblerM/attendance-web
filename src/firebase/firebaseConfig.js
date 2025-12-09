import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAfLqHhzTdjG3eH2jaubt1kZ_WCvG3FZw",
  authDomain: "angles-attendance-web.firebaseapp.com",
  projectId: "angles-attendance-web",
  storageBucket: "angles-attendance-web.firebasestorage.app",
  messagingSenderId: "416084006492",
  appId: "1:416084006492:web:29c8c3d68d09e49b59b899",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
