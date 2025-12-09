// Firebase Setup (src/firebase.js)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAfLqHhzTdjG3eH2jaubt1kZ_WCvG3FZw",
  authDomain: "angles-attendance-web.firebaseapp.com",
  projectId: "angles-attendance-web",
  storageBucket: "angles-attendance-web.firebasestorage.app",
  messagingSenderId: "416084006492",
  appId: "1:416084006492:web:29c8c3d68d09e49b59b899"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// -------------------------------------------------------------
// Attendance Page (src/pages/Attendance.jsx)
// -------------------------------------------------------------
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

export default function Attendance() {
  const [name, setName] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "attendance"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setStudents(list);
    });
    return () => unsub();
  }, []);

  const addStudent = async () => {
    if (!name.trim()) return;
    await addDoc(collection(db, "attendance"), { name });
    setName("");
  };

  const removeStudent = async (id) => {
    await deleteDoc(doc(db, "attendance", id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Attendance</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
        style={{ padding: 8, marginRight: 10 }}
      />

      <button onClick={addStudent} style={{ padding: "8px 15px" }}>
        Add
      </button>

      <ul style={{ marginTop: 20 }}>
        {students.map((s) => (
          <li key={s.id} style={{ marginBottom: 10 }}>
            {s.name}
            <button
              onClick={() => removeStudent(s.id)}
              style={{ marginLeft: 15, padding: "4px 10px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// -------------------------------------------------------------
// App Router (src/App.jsx)
// -------------------------------------------------------------
import Attendance from "./pages/Attendance";

export default function App() {
  return (
    <>
      <Attendance />
    </>
  );
}
