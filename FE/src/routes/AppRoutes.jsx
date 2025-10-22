import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Layout
import DashboardLayout from "@/layouts/DashboardLayout";

// Pages
import Login from "@/pages/Auth/Login";
import Home from "@/pages/Home/Home";
import LogPaperTabs from "@/pages/LogPaper/LogPaperTabs";
import UserTabs from "@/pages/Users/UserTabs"; // ✅ Added import

function ProtectedRoute({ children, allowedRoles }) {
  const { token, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;

  // ✅ Optional role-based restriction
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default function AppRoutes() {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* 🔓 Public Login Route */}
      <Route
        path="/login"
        element={!token ? <Login /> : <Navigate to="/home" replace />}
      />

      {/* 🔐 Protected Layout (Sidebar + Navbar) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* ✅ Existing dashboard routes */}
        <Route path="home" element={<Home />} />
        <Route path="logpapers" element={<LogPaperTabs />} />

        {/* ✅ NEW: Tutor-only Users route */}
        <Route
          path="users"
          element={
            // <ProtectedRoute allowedRoles={["tutor"]}>
              <UserTabs />
            // </ProtectedRoute>
          }
        />
      </Route>

      {/* 🔁 Fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
