import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "@/api/axios";

export default function MentorLogDetails() {
  const { id } = useParams(); // logPaperId
  const navigate = useNavigate();

  const [log, setLog] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(`/logpaper/${id}`);
        setLog(data);
      } catch (err) {
        console.error("Error loading log:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/mentor-feedback", {
        logPaperId: id,
        comment: feedback,
        approved,
      });
      setSaved(true);
    } catch (err) {
      console.error("Error saving feedback:", err);
      alert("Error saving feedback.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!log) return <div className="p-4">Log not found</div>;

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 text-sm hover:underline mb-3"
      >
        ← Back to Reports
      </button>

      <h2 className="text-xl font-semibold">Log Details</h2>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <p>
          <strong>Student ID:</strong> {log.studentId}
        </p>
        <p>
          <strong>Date:</strong> {new Date(log.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Activity:</strong> {log.activity}
        </p>
        <p>
          <strong>Description:</strong> {log.description}
        </p>
        <p>
          <strong>Total Hours:</strong> {log.totalHours ?? "-"}
        </p>
        <p>
          <strong>Status:</strong> {log.status}
        </p>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="font-medium mb-2">Mentor Feedback</h3>
        {saved ? (
          <p className="text-green-700">✅ Feedback saved successfully.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your comments..."
              required
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={approved}
                onChange={(e) => setApproved(e.target.checked)}
                id="approved"
              />
              <label htmlFor="approved" className="text-sm text-slate-700">
                Mark as Approved
              </label>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
