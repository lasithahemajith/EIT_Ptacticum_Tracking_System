import { motion } from "framer-motion";
import { ClipboardList, Clock, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function StudentHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100">
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 p-10 overflow-y-auto">
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-semibold text-indigo-900 mb-3"
          >
            Welcome, {user?.name || "Student"}
          </motion.h2>
          <p className="text-gray-600 mb-10 max-w-2xl">
            This is your Practicum Tracker Dashboard. You can record your daily
            practicum activities, review your previous submissions, and monitor
            your overall progress. Keep your logs up-to-date to ensure accurate
            tracking of your practicum hours.
          </p>

          {/* Student Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <DashboardCard
              icon={<Clock size={28} />}
              title="Add Practicum Log"
              desc="Record your daily practicum activities, reflections, and hours completed."
              color="from-purple-500 to-pink-500"
              action={() => navigate("/student/logpapers")}
            />
            <DashboardCard
              icon={<History size={28} />}
              title="View Log History"
              desc="Check your submitted logs, their mentor feedback, and verification status."
              color="from-blue-500 to-indigo-600"
              action={() => navigate("/student/logpapers")}
            />
          </div>

          {/* Summary Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100"
          >
            <h3 className="text-xl font-semibold text-indigo-800 mb-4">
              Practicum Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <SummaryCard
                label="Total Logs Submitted"
                value="14"
                color="text-indigo-600"
              />
              <SummaryCard
                label="Total Hours Completed"
                value="72"
                color="text-green-600"
              />
              <SummaryCard
                label="Mentor Feedbacks Received"
                value="5"
                color="text-purple-600"
              />
            </div>
          </motion.section>
        </main>

        {/* Footer */}
        <footer className="text-center py-6 text-indigo-600 text-sm opacity-80">
          © 2025 EIT Practicum Tracker | Student Dashboard
        </footer>
      </div>
    </div>
  );
}

/* 🔹 Reusable DashboardCard Component */
function DashboardCard({ icon, title, desc, color, action }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.2 }}
      onClick={action}
      className={`cursor-pointer bg-gradient-to-r ${color} text-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition`}
    >
      <div>
        <div className="mb-3">{icon}</div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-sm opacity-90">{desc}</p>
      </div>
      <button
        onClick={action}
        className="mt-5 bg-white/20 hover:bg-white/30 text-sm font-semibold px-4 py-2 rounded-md transition"
      >
        Open
      </button>
    </motion.div>
  );
}

/* 🔹 Reusable SummaryCard Component */
function SummaryCard({ label, value, color }) {
  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm">
      <p className="text-gray-600 text-sm mb-2">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
