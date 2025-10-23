import React, { useEffect, useState } from "react";
import API from "@/api/axios";
import { useNavigate } from "react-router-dom";

export default function MentorReports() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const navigate = useNavigate();

  const tabs = ["Pending", "Approved", "All"];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await API.get("/logpaper/mentor/reports");
        if (mounted) setLogs(data);
      } catch (err) {
        console.error("Error loading mentor logs:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (activeTab === "Pending") return log.status === "Pending";
    if (activeTab === "Approved")
      return ["Verified", "Reviewed"].includes(log.status);
    return true;
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Reports - Assigned Students</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 rounded-lg border text-sm transition ${
              activeTab === tab
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left">Student</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Activity</th>
              <th className="px-3 py-2 text-left">Hours</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-slate-500">
                  Loading logs...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-slate-500">
                  No {activeTab.toLowerCase()} logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log._id}
                  className="odd:bg-white even:bg-slate-50 hover:bg-indigo-50 transition cursor-pointer"
                >
                  <td className="px-3 py-2 border-b">
                    {log.student?.name || `#${log.studentId}`}
                  </td>
                  <td className="px-3 py-2 border-b">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 border-b">{log.activity}</td>
                  <td className="px-3 py-2 border-b">{log.totalHours ?? "-"}</td>
                  <td className="px-3 py-2 border-b">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${
                        log.status === "Verified"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : log.status === "Reviewed"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b">
                    <button
                      onClick={() => navigate(`/mentor/reports/${log._id}`)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
