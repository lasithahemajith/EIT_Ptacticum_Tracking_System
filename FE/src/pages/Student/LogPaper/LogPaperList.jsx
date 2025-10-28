import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Calendar, Clock, FileText, Filter } from "lucide-react";

export default function LogPaperList() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch student's logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get("/logpaper/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data || []);
        setFilteredLogs(res.data || []);
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError("Failed to load logs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [token]);

  // 🔹 Apply status filter
  useEffect(() => {
    if (statusFilter === "All") setFilteredLogs(logs);
    else setFilteredLogs(logs.filter((log) => log.status === statusFilter));
  }, [statusFilter, logs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 🔹 Header + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-indigo-900">
          My Practicum Logs
        </h2>

        <div className="flex items-center gap-3">
          <Filter className="text-gray-500" size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Logs</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Reviewed">Reviewed</option>
          </select>
        </div>
      </div>

      {/* 🔹 Empty State */}
      {!filteredLogs.length ? (
        <div className="text-center text-gray-600 mt-20">
          <FileText className="mx-auto mb-3 text-gray-400" size={40} />
          <p>No {statusFilter !== "All" ? statusFilter.toLowerCase() : ""} logs found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredLogs.map((log) => (
            <div
              key={log._id}
              onClick={() => navigate(`/student/logpapers/${log._id}`)}
              className="cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-200"
            >
              {/* Top Section */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-indigo-700 mb-1">
                    {log.activity || "Untitled Activity"}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(log.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <Clock size={16} />
                    {log.totalHours ?? log.hours ?? "-"} hours
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    log.status === "Verified"
                      ? "text-green-700 bg-green-100"
                      : log.status === "Pending"
                      ? "text-yellow-700 bg-yellow-100"
                      : "text-blue-700 bg-blue-100"
                  }`}
                >
                  {log.status || "Pending"}
                </span>
              </div>

              {/* 🔹 Student’s Short Description */}
              {log.description && (
                <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                  {log.description.slice(0, 100)}
                  {log.description.length > 100 && "..."}
                </p>
              )}

              {/* Divider and Mentor Comment */}
              {log.mentorComment && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <p className="text-sm text-gray-700">
                    <strong>Mentor:</strong> {log.mentorComment.slice(0, 80)}
                    {log.mentorComment.length > 80 && "..."}
                  </p>
                </>
              )}

              {/* ✅ Lock message for verified logs */}
              {log.status === "Verified" && (
                <p className="text-xs text-green-700 mt-2">
                  This log has been verified by your mentor and is locked for editing.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
