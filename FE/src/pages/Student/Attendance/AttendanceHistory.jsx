import React, { useEffect, useState } from "react";
import API from "@/api/axios";

export default function AttendanceHistory() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/attendance/my");
        setRecords(res.data);
      } catch (err) {
        console.error("Error loading attendance:", err);
      }
    })();
  }, []);

  return (
    <div>
      {records.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No attendance records yet.</p>
      ) : (
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Reason</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b hover:bg-indigo-50 transition-all">
                <td className="p-3">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{r.type}</td>
                <td
                  className={`p-3 font-semibold ${
                    r.attended === "Yes" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {r.attended}
                </td>
                <td className="p-3">{r.reason || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
