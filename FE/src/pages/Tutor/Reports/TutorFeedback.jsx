import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "@/api/axios";

export default function TutorFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [log, setLog] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        // Fetch log details
        const logRes = await API.get(`/logpaper/${id}`);
        if (!active) return;
        setLog(logRes.data || null);
      } catch (err) {
        console.error("Error loading log details:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  // ✅ Submit Tutor Feedback + Show Popup
  const handleSubmit = async () => {
    try {
      await API.patch(`/api/tutor-feedback/${id}`, { feedback });
      setSubmitted(true);
      setShowSuccess(true);

      // Auto-close popup after 2s
      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("❌ Error submitting feedback");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!log || Object.keys(log).length === 0)
    return <p className="p-6 text-red-600">No log found.</p>;

  const isVerified = log.status === "Verified";
  const isReviewed = log.status === "Reviewed";
  const isPending = log.status === "Pending";
  const hasMentorFeedback = Boolean(log.mentorComment);

  return (
    <motion.div
      className="relative p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        onClick={() => navigate("/tutor/reports")}
        className="text-sm text-indigo-600 hover:underline mb-4"
      >
        ← Back to History Logs
      </button>

      <h2 className="text-2xl font-bold text-indigo-800 mb-6">Tutor Feedback</h2>

      {/* 🧾 Student Log Details */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-6">
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
          <strong>Status:</strong> {log.status}
        </p>
      </div>

      {/* 👩‍🏫 Mentor Feedback */}
      {hasMentorFeedback ? (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-green-700">
            Mentor Feedback
          </h3>
          <div className="border p-3 mb-2 rounded bg-green-50 border-green-200">
            <p>
              <strong>Comment:</strong> {log.mentorComment}
            </p>
            <p className="text-xs text-gray-500">
              {log.updatedAt
                ? new Date(log.updatedAt).toLocaleString()
                : ""}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 font-medium">
            ⚠️ Mentor feedback not yet provided.
          </p>
          <p className="text-yellow-700 text-sm">
            Tutor feedback will be enabled once the mentor verifies this log.
          </p>
        </div>
      )}

      {/* 🧑‍🏫 Tutor Feedback Section */}
      {isVerified && !isReviewed ? (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-indigo-700">
            Add Your Feedback (Verified Log)
          </h3>
          {submitted ? (
            <p className="text-green-700 font-medium">
              ✅ Feedback submitted successfully.
            </p>
          ) : (
            <>
              <textarea
                className="w-full border p-3 rounded mb-3"
                rows="4"
                placeholder="Enter tutor feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
              >
                Submit Feedback
              </button>
            </>
          )}
        </div>
      ) : isPending ? (
        <p className="text-gray-500 mt-4 italic">
          Mentor has not yet verified this log. Tutor feedback will be enabled
          once it’s verified.
        </p>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6">
          <h3 className="font-semibold text-blue-700 mb-1">Tutor Feedback</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {log.tutorFeedback || "No feedback yet."}
          </p>
        </div>
      )}

      {/* ✅ Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-sm">
              <h3 className="text-2xl font-semibold text-green-600 mb-3">
                ✅ Feedback Submitted Successfully!
              </h3>
              <p className="text-gray-600">
                Your tutor feedback has been recorded and saved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
