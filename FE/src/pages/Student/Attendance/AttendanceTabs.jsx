import React, { useState } from "react";
import AttendanceForm from "./AttendanceForm";
import AttendanceHistory from "./AttendanceHistory";

export default function AttendanceTabs() {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex justify-center py-8">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl border border-indigo-100">
        {/* Tab Headers */}
        <div className="flex border-b border-indigo-200">
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 py-3 font-semibold text-sm md:text-base transition-all ${
              activeTab === "add"
                ? "bg-indigo-600 text-white shadow-inner"
                : "bg-gray-100 text-gray-600 hover:bg-indigo-50"
            }`}
          >
            🕒 Add Attendance
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 font-semibold text-sm md:text-base transition-all ${
              activeTab === "history"
                ? "bg-indigo-600 text-white shadow-inner"
                : "bg-gray-100 text-gray-600 hover:bg-indigo-50"
            }`}
          >
            📜 Attendance History
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "add" ? <AttendanceForm /> : <AttendanceHistory />}
        </div>
      </div>
    </div>
  );
}
