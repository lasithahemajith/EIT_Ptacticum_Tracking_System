import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Pages
import Login from "@/pages/Auth/Login";
import HomePage from "@/pages/Home/Home";
import LogPaperTabs from "@/pages/LogPaper/LogPaperTabs";
import DashboardLayout from "@/layouts/DashboardLayout";

// ✅ Protected Route wrapper
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/home" replace />}
        />

        {/* Protected Layout Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout /> {/* ✅ Sidebar + Navbar layout */}
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/logpapers" element={<LogPaperTabs />} /> {/* ✅ no nested ProtectedRoute */}
        </Route>

        {/* Default Fallback */}
        <Route
          path="*"
          element={<Navigate to={token ? "/home" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}
