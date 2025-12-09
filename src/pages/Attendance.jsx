import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

export default function Attendance() {
  const [rows, setRows] = useState([]);

  const attendanceCollection = collection(db, "attendance");

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(attendanceCollection);
      const formatted = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRows(formatted);
    };
    fetchData();
  }, []);

  // تعديل أي خلية وحفظها في Firebase
  const handleChange = async (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);

    const rowDoc = doc(db, "attendance", newRows[index].id);
    await updateDoc(rowDoc, { [field]: value });
  };

  // إضافة صف جديد
  const addRow = async () => {
    const newRow = { name: "", present: false, absent: false, date: "" };
    const docRef = await addDoc(attendanceCollection, newRow);
    setRows([...rows, { id: docRef.id, ...newRow }]);
  };

  return (
    <div className="min-h-screen p-6 bg-[url('/church-bg.jpg')] bg-cover bg-center bg-fixed">
      <Card className="backdrop-blur-md bg-white/80 p-6 rounded-2xl shadow-xl">
        <CardContent>
          <h1 className="text-3xl font-bold mb-6 text-center text-red-900">
            📘 حضور و غياب – ملائكة كنيسة السيدة العذراء محرم بك
          </h1>

          <table className="w-full border shadow rounded-xl overflow-hidden text-center">
            <thead className="bg-red-800 text-white text-lg">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">اسم الطفل</th>
                <th className="p-3">الحضور</th>
                <th className="p-3">الغياب</th>
                <th className="p-3">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id} className="even:bg-gray-100 text-lg">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => handleChange(i, "name", e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      placeholder="اسم الطفل"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={row.present}
                      onChange={(e) => handleChange(i, "present", e.target.checked)}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={row.absent}
                      onChange={(e) => handleChange(i, "absent", e.target.checked)}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) => handleChange(i, "date", e.target.value)}
                      className="p-2 border rounded-lg"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addRow}
            className="mt-4 bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-xl"
          >
            ➕ إضافة صف جديد
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
