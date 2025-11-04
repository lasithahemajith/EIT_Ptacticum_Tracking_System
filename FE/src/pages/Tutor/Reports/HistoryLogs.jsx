import React, { useEffect, useState } from "react";
import API from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { Loader2, Download, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function HistoryLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  // ✅ Fetch all logs
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/logpaper/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data || []);
      } catch (err) {
        console.error("Error loading logs:", err);
        setError("Failed to load logs.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const filtered = logs.filter((log) =>
    statusFilter === "All" ? true : log.status === statusFilter
  );

  // ---------- Export helpers ----------
  const filenameFromDisposition = (disposition, fallback) => {
    if (!disposition) return fallback;
    const match = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(disposition);
    if (match && match[1]) {
      try {
        return decodeURIComponent(match[1].replace(/\"/g, ""));
      } catch {
        return match[1].replace(/\"/g, "");
      }
    }
    return fallback;
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    try {
      setExporting(true);
      const map = {
        excel: { url: "/api/export/logs/excel", name: "practicum_logs.xlsx" },
        csv: { url: "/api/export/logs/csv", name: "practicum_logs.csv" },
        json: { url: "/api/export/logs/json", name: "practicum_logs.json" },
      };
      const cfg = map[type];
      if (!cfg) return;

      const res = await API.get(cfg.url, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const contentDisp = res.headers?.["content-disposition"];
      const filename = filenameFromDisposition(contentDisp, cfg.name);
      downloadBlob(res.data, filename);
      setShowExportMenu(false);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };
  // ------------------------------------

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
      </div>
    );
  }

  if (error) return <div className="text-center text-red-600 p-6">{error}</div>;

  return (
    <div className="p-4 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-indigo-900">
          Tutor Log History
        </h2>

        {/* ✅ Export Button (Top Right) */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <Download size={18} />
            <span>Export</span>
          </button>

          {/* Export Menu */}
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="flex justify-between items-center border-b px-3 py-2">
                <span className="text-sm font-semibold text-gray-700">
                  Choose Format
                </span>
                <button
                  onClick={() => setShowExportMenu(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>

              <ul className="p-2 text-sm text-gray-700 space-y-1">
                <li>
                  <button
                    disabled={exporting}
                    onClick={() => handleExport("excel")}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-indigo-50 ${
                      exporting ? "text-gray-400" : ""
                    }`}
                  >
                    📘 Excel (.xlsx)
                  </button>
                </li>
                <li>
                  <button
                    disabled={exporting}
                    onClick={() => handleExport("csv")}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-indigo-50 ${
                      exporting ? "text-gray-400" : ""
                    }`}
                  >
                    📄 CSV (.csv)
                  </button>
                </li>
                <li>
                  <button
                    disabled={exporting}
                    onClick={() => handleExport("json")}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-indigo-50 ${
                      exporting ? "text-gray-400" : ""
                    }`}
                  >
                    🗂 JSON (.json)
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-medium text-gray-700">
          Filter by Status:
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Reviewed">Reviewed</option>
        </select>
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No logs found.
                </td>
              </tr>
            ) : (
              filtered.map((log, i) => (
                <tr
                  key={log._id || i}
                  className={`transition ${
                    log.status === "Verified"
                      ? "bg-green-50 hover:bg-green-100"
                      : log.status === "Reviewed"
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "odd:bg-white even:bg-gray-50 hover:bg-indigo-50"
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
                      type="button"
                      onClick={() => navigate(`/tutor/reports/${log._id}`)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      {log.status === "Verified" ? "Review Now" : "View"}
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
