// src/pages/MassPage.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function MassPage() {
  const [rows, setRows] = useState([]);
  const massCollection = collection(db, "massAttendance");

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(massCollection);
      setRows(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const addRow = async () => {
    const today = new Date().toISOString().split("T")[0];
    const newRow = { name: "", present: false, absent: false, date: today };
    const docRef = await addDoc(massCollection, newRow);
    setRows(prev => [...prev, { id: docRef.id, ...newRow }]);
  };

  const handleChange = async (id, field, value) => {
    const docRef = doc(db, "massAttendance", id);
    await updateDoc(docRef, { [field]: value });
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleDelete = async (id) => {
    const docRef = doc(db, "massAttendance", id);
    await deleteDoc(docRef);
    setRows(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen p-6 bg-[url('/church-bg.jpg')] bg-cover bg-center">
      <div className="bg-white/80 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-red-900 text-center">⛪ حضور القداس</h1>
        <button onClick={addRow} className="mb-4 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600">➕ إضافة صف جديد</button>
        <table className="w-full border text-center rounded-xl overflow-hidden">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">الاسم</th>
              <th className="p-2">حاضر</th>
              <th className="p-2">غائب</th>
              <th className="p-2">التاريخ</th>
              <th className="p-2">حذف</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="even:bg-gray-100">
                <td className="p-2">{index + 1}</td>
                <td className="p-2"><input value={row.name} onChange={(e)=>handleChange(row.id,"name",e.target.value)} className="border p-1 rounded w-full"/></td>
                <td className="p-2"><input type="checkbox" checked={row.present} onChange={(e)=>handleChange(row.id,"present",e.target.checked)}/></td>
                <td className="p-2"><input type="checkbox" checked={row.absent} onChange={(e)=>handleChange(row.id,"absent",e.target.checked)}/></td>
                <td className="p-2"><input type="date" value={row.date} onChange={(e)=>handleChange(row.id,"date",e.target.value)} className="border p-1 rounded"/></td>
                <td className="p-2"><button onClick={()=>handleDelete(row.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">❌</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
