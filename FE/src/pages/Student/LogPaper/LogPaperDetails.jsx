import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "@/api/axios";
import { Calendar, Clock, FileText } from "lucide-react";

export default function LogPaperDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(`/logpaper/${id}`);
        setLog(data);
      } catch (err) {
        console.error("Error fetching log:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!log) return <div className="p-6 text-red-600">Log not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-indigo-600 hover:underline"
      >
        ← Back to My Logs
      </button>

      {/* Student log details */}
      <div className="bg-white border rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-indigo-700">
          Practicum Log Entry
        </h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Date:</strong> {new Date(log.date).toLocaleDateString()}</p>
          <p><strong>Activity:</strong> {log.activity}</p>
          <p><strong>Total Hours:</strong> {log.totalHours ?? "-"}</p>
          <p><strong>Description:</strong> {log.description}</p>

          {log.attachments?.length > 0 && (
            <div>
              <strong>Attachments:</strong>
              <ul className="list-disc list-inside">
                {log.attachments.map((a, i) => (
                  <li key={i}>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {a.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs ${
              log.status === "Verified"
                ? "bg-green-100 text-green-700"
                : log.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {log.status}
          </span>
        </div>
      </div>

      {/* Mentor comment */}
      <div className="bg-white border rounded-xl shadow p-6">
        <h3 className="font-semibold mb-2 text-indigo-700">
          Mentor Comment
        </h3>
        {log.mentorComment ? (
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {log.mentorComment}
          </p>
        ) : (
          <p className="text-sm text-gray-500 italic">No comments yet.</p>
        )}
      </div>

      {/* Tutor feedback */}
      <div className="bg-white border rounded-xl shadow p-6">
        <h3 className="font-semibold mb-2 text-indigo-700">
          Tutor Feedback
        </h3>
        {log.tutorFeedback ? (
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {log.tutorFeedback}
          </p>
        ) : (
          <p className="text-sm text-gray-500 italic">No tutor feedback yet.</p>
        )}
      </div>
    </div>
  );
}
