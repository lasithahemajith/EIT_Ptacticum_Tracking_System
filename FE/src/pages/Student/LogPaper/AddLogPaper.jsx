import { useState } from "react";
import API from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function AddLogPaper() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    hours: "",
    activity: "",
    description: "",
    attachments: null,
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 🧮 Automatically calculate hours
  const calculateHours = (start, end) => {
    if (!start || !end) return "";
    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    const diff = (endTime - startTime) / (1000 * 60 * 60);
    return diff > 0 ? diff.toFixed(2) : "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachments") {
      setForm({ ...form, attachments: files });
    } else if (name === "startTime" || name === "endTime") {
      const updated = { ...form, [name]: value };
      updated.hours = calculateHours(updated.startTime, updated.endTime);
      setForm(updated);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "attachments" && value) {
          Array.from(value).forEach((file) => data.append("attachments", file));
        } else {
          data.append(key, value);
        }
      });

      await API.post("/logpaper", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);

      setForm({
        date: "",
        startTime: "",
        endTime: "",
        hours: "",
        activity: "",
        description: "",
        attachments: null,
      });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add log paper. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 w-full min-h-[calc(100vh-100px)] flex justify-center items-start p-10"
    >
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-10 w-full max-w-5xl border border-indigo-100">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          Add Practicum Log Entry
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>

          {/* Start & End Time */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>
          </div>

          {/* Hours (auto-calculated) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Total Hours
            </label>
            <input
              type="number"
              name="hours"
              value={form.hours}
              onChange={handleChange}
              placeholder="Auto-calculated or enter manually"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>

          {/* Activity */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Activity Type
            </label>
            <select
              name="activity"
              value={form.activity}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-200 outline-none"
            >
              <option value="">Select an activity</option>
              <option value="Observation">Observation</option>
              <option value="Documentation">Documentation</option>
              <option value="Case Discussion">Case Discussion</option>
              <option value="Supervision">Supervision</option>
              <option value="Client Interaction">Client Interaction</option>
              <option value="Assessment">Assessment</option>
            </select>
          </div>

          {/* Description (scrollable) */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your work or learning experience..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 focus:ring-2 focus:ring-indigo-200 outline-none resize-y"
              required
            ></textarea>
          </div>

          {/* Attachments */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Attachments (photo, PDF, or video)
            </label>
            <input
              type="file"
              name="attachments"
              accept="image/*,application/pdf,video/*"
              multiple
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-lg font-medium transition-all shadow-md"
            >
              {loading ? "Submitting..." : "Submit Log Entry"}
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Success Popup */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
        >
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-sm">
            <h3 className="text-2xl font-semibold text-green-600 mb-3">
              ✅ Log Added Successfully!
            </h3>
            <p className="text-gray-600">Your practicum entry has been recorded.</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
