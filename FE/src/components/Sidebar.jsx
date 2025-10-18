import { Link, useLocation } from "react-router-dom";
import { Home, ClipboardList, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: "Home", path: "/home", icon: <Home size={18} /> },
    { label: "My Logs", path: "/logpapers", icon: <ClipboardList size={18} /> },
    { label: "Reports", path: "#", icon: <FileText size={18} /> },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 70 : 230 }}
      transition={{ duration: 0.3 }}
      className="bg-indigo-800 text-white flex flex-col shadow-2xl h-screen sticky top-0 overflow-hidden"
    >
      {/* Collapse Button */}
      <div className="flex justify-end items-center p-3 border-b border-indigo-700">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-indigo-800">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
              }`}
            >
              <div
                className={`p-1.5 rounded-md transition ${
                  isActive ? "bg-white/20" : "bg-transparent group-hover:bg-white/10"
                }`}
              >
                {item.icon}
              </div>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer (optional) */}
      <div className="p-3 text-center border-t border-indigo-700 text-xs text-indigo-200">
        {!collapsed && <p className="opacity-70">EIT Practicum © 2025</p>}
      </div>
    </motion.aside>
  );
}
