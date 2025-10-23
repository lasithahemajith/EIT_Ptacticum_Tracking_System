import React, { useEffect, useState, useMemo } from "react";
import API from "@/api/axios";

export default function HistoryLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await API.get("/logpaper/all");
        if (active) setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading logs:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return logs;
    const q = query.toLowerCase();
    return logs.filter(
      (l) =>
        (l.activity || "").toLowerCase().includes(q) ||
        (l.description || "").toLowerCase().includes(q) ||
        String(l.studentId || "").includes(q) ||
        (l.status || "").toLowerCase().includes(q)
    );
  }, [logs, query]);

  return (
    <div>
      <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
        <input
          type="text"
          placeholder="Search by activity, description, student ID, or status..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-80 max-w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="text-sm text-slate-600">
          {loading ? "Loading logs..." : `${filtered.length} record(s)`}
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 border-b text-left">Student ID</th>
              <th className="px-3 py-2 border-b text-left">Date</th>
              <th className="px-3 py-2 border-b text-left">Hours</th>
              <th className="px-3 py-2 border-b text-left">Activity</th>
              <th className="px-3 py-2 border-b text-left">Description</th>
              <th className="px-3 py-2 border-b text-left">Status</th>
              <th className="px-3 py-2 border-b text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-slate-500">
                  No logs found.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r._id} className="odd:bg-white even:bg-slate-50">
                  <td className="px-3 py-2 border-b">{r.studentId ?? "-"}</td>
                  <td className="px-3 py-2 border-b">
                    {r.date ? new Date(r.date).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-3 py-2 border-b">{r.totalHours ?? "-"}</td>
                  <td className="px-3 py-2 border-b">{r.activity ?? "-"}</td>
                  <td className="px-3 py-2 border-b max-w-[400px]">
                    <div className="line-clamp-2">{r.description ?? "-"}</div>
                  </td>
                  <td className="px-3 py-2 border-b">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${
                        r.status === "Verified"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : r.status === "Reviewed"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {r.status ?? "Pending"}
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
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
