// src/pages/Attendance.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function AttendancePage() {
  const [rows, setRows] = useState([]);

  const attendanceCollection = collection(db, "attendance");

  // تحميل البيانات عند فتح الصفحة
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(attendanceCollection);
      setRows(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  // إضافة صف جديد
  const addRow = async () => {
    const newRow = { name: "", present: false, absent: false, date: "" };
    const docRef = await addDoc(attendanceCollection, newRow);
    setRows(prev => [...prev, { id: docRef.id, ...newRow }]);
  };

  // تعديل أي حقل
  const handleChange = async (id, field, value) => {
    const docRef = doc(db, "attendance", id);
    await updateDoc(docRef, { [field]: value });
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // حذف صف
  const handleDelete = async (id) => {
    const docRef = doc(db, "attendance", id);
    await deleteDoc(docRef);
    setRows(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen p-6 bg-[url('/church-bg.jpg')] bg-cover bg-center bg-fixed">
      <div className="backdrop-blur-md bg-white/80 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-red-900">📘 حضور و غياب – ملائكة كنيسة السيدة العذراء محرم بك</h1>
        <button onClick={addRow} className="mb-4 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition">
          ➕ إضافة صف جديد
        </button>
        <table className="w-full border shadow rounded-xl overflow-hidden text-center">
          <thead className="bg-red-800 text-white text-lg">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">اسم الطفل</th>
              <th className="p-3">الحضور</th>
              <th className="p-3">الغياب</th>
              <th className="p-3">التاريخ</th>
              <th className="p-3">حذف</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="even:bg-gray-100 text-lg">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => handleChange(row.id, "name", e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={row.present}
                    onChange={(e) => handleChange(row.id, "present", e.target.checked)}
                  />
                </td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={row.absent}
                    onChange={(e) => handleChange(row.id, "absent", e.target.checked)}
                  />
                </td>
                <td className="p-3">
                  <input
                    type="date"
                    value={row.date}
                    onChange={(e) => handleChange(row.id, "date", e.target.value)}
                    className="p-1 border rounded"
                  />
                </td>
                <td className="p-3">
                  <button onClick={() => handleDelete(row.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AttendancePage from "./pages/Attendance";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/attendance" element={<AttendancePage />} />
      </Routes>
    </Router>
  );
}
