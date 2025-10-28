import { useState } from "react";
import { motion } from "framer-motion";
import AddLogPaper from "@/pages/Student/LogPaper/AddLogPaper";
import LogPaperList from "@/pages/Student/LogPaper/LogPaperList";

export default function LogPaperTabs() {
  const [activeTab, setActiveTab] = useState("add");

  const tabs = [
    { key: "add", label: "➕ Add Log" },
    { key: "history", label: "📜 History Logs" },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-lg shadow-sm border border-indigo-100 px-6 py-4">
      {/* Page Title */}
      <motion.h2
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-semibold text-indigo-800 mb-4 tracking-tight"
      >
        My Practicum Logs
      </motion.h2>

      {/* Tabs */}
      <div className="flex space-x-3 border-b border-indigo-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:text-indigo-700 hover:bg-indigo-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Animated Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="mt-2"
      >
        {activeTab === "add" ? <AddLogPaper /> : <LogPaperList />}
      </motion.div>
    </div>
  );
}
