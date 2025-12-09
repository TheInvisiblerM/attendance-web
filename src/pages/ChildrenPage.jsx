// src/pages/ChildrenPage.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function ChildrenPage() {
  const [children, setChildren] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const childrenCollection = collection(db, "children");

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(childrenCollection);
      setChildren(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const addChild = async () => {
    if (!name.trim() || !phone.trim()) return;
    const newChild = { name, phone };
    const docRef = await addDoc(childrenCollection, newChild);
    setChildren(prev => [...prev, { id: docRef.id, ...newChild }]);
    setName(""); setPhone("");
  };

  const handleChange = async (id, field, value) => {
    const docRef = doc(db, "children", id);
    await updateDoc(docRef, { [field]: value });
    setChildren(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleDelete = async (id) => {
    const docRef = doc(db, "children", id);
    await deleteDoc(docRef);
    setChildren(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen p-6 bg-[url('/church-bg.jpg')] bg-cover bg-center">
      <div className="bg-white/80 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-red-900 text-center">👼 إدارة بيانات الأطفال</h1>

        <div className="mb-4 flex gap-2">
          <input placeholder="الاسم" value={name} onChange={e=>setName(e.target.value)} className="border p-2 rounded w-full"/>
          <input placeholder="رقم التليفون" value={phone} onChange={e=>setPhone(e.target.value)} className="border p-2 rounded w-full"/>
          <button onClick={addChild} className="bg-green-500 text-white px-4 rounded hover:bg-green-600">إضافة</button>
        </div>

        <table className="w-full border text-center rounded-xl overflow-hidden">
          <thead className="bg-red-800 text-white">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">الاسم</th>
              <th className="p-2">رقم التليفون</th>
              <th className="p-2">حذف</th>
            </tr>
          </thead>
          <tbody>
            {children.map((c, idx) => (
              <tr key={c.id} className="even:bg-gray-100">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2"><input value={c.name} onChange={e=>handleChange(c.id,"name",e.target.value)} className="border p-1 rounded w-full"/></td>
                <td className="p-2"><input value={c.phone} onChange={e=>handleChange(c.id,"phone",e.target.value)} className="border p-1 rounded w-full"/></td>
                <td className="p-2"><button onClick={()=>handleDelete(c.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">❌</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
