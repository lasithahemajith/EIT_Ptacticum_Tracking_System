import React, { useEffect, useState, useMemo } from "react";
import API from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MentorReports() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Read ?tab=Pending from URL on load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/logpaper/mentor/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data || []);
      } catch (err) {
        console.error("Error loading mentor logs:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const filteredLogs = useMemo(() => {
    if (activeTab === "All") return logs;
    return logs.filter((l) => l.status === activeTab);
  }, [logs, activeTab]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-indigo-900 mb-6">
        Mentor Reports
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6 border-b border-indigo-200">
        {["Pending", "Verified", "All"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              navigate(`?tab=${tab}`);
            }}
            className={`px-5 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-3 py-2 text-left">Student</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Activity</th>
              <th className="px-3 py-2 text-left">Hours</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Mentor Comment</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No logs found for this category.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, i) => (
                <tr
                  key={log._id || i}
                  className={`transition ${
                    log.status === "Verified"
                      ? "bg-green-50 hover:bg-green-100"
                      : log.status === "Reviewed"
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "bg-yellow-50 hover:bg-yellow-100"
                  }`}
                >
                  <td className="px-3 py-2">{log.studentId || "—"}</td>
                  <td className="px-3 py-2">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">{log.activity}</td>
                  <td className="px-3 py-2">{log.totalHours ?? "-"}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        log.status === "Verified"
                          ? "bg-green-100 text-green-700"
                          : log.status === "Reviewed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-600">
                    {log.mentorComment ? (
                      log.mentorComment.slice(0, 50) + "…"
                    ) : (
                      <span className="italic text-gray-400">
                        Pending mentor feedback
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => navigate(`/mentor/reports/${log._id}`)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      {log.status === "Pending" ? "Verify" : "View"}
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
