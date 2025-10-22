import { useEffect, useState } from "react";
import API from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { FileText, Clock, MessageCircle, Calendar, Loader2 } from "lucide-react";

export default function LogPaperList() {
  const { token, user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get("/logpaper/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch log papers. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [token]);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white p-8">
      <motion.h2
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-semibold text-indigo-800 mb-8"
      >
        My Practicum Logs
      </motion.h2>

      {logs.length === 0 ? (
        <div className="text-center text-gray-500">No logs found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-2xl shadow-md overflow-hidden">
            <thead className="bg-indigo-600 text-white text-sm uppercase tracking-wide">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Activity</th>
                <th className="p-3 text-left">Hours</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Mentor Comments</th>
                <th className="p-3 text-left">Tutor Feedback</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <motion.tr
                  key={log._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-200 hover:bg-indigo-50/50 transition"
                >
                  <td className="p-3 text-sm text-gray-700 flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-500" />
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm font-medium text-gray-800 flex items-center gap-2">
                    <FileText size={16} className="text-indigo-500" />
                    {log.activity}
                  </td>
                  <td className="p-3 text-sm text-gray-700 flex items-center gap-2">
                    <Clock size={16} className="text-blue-500" />
                    {log.hours}
                  </td>
                  <td className="p-3 text-sm text-gray-600">{log.description}</td>
                  <td className="p-3 text-sm text-gray-600 italic">
                    {log.mentorComments || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="p-3 text-sm text-gray-600 italic">
                    {log.tutorFeedback || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="p-3 text-sm font-semibold">
                    <StatusBadge verified={log.verified} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ verified }) {
  return verified ? (
    <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs">
      Verified
    </span>
  ) : (
    <span className="text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-xs">
      Pending
    </span>
  );
}
