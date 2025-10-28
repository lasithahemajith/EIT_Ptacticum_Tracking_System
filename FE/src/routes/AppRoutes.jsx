import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Layout
import DashboardLayout from "@/layouts/DashboardLayout";

// Auth
import Login from "@/pages/Auth/Login";

// STUDENT
import StudentHome from "@/pages/Student/Home/StudentHome";
import LogPaperTabs from "@/pages/Student/LogPaper/LogPaperTabs";
import LogPaperDetails from "@/pages/Student/LogPaper/LogPaperDetails";

// MENTOR
import MentorHome from "@/pages/Mentor/Home/MentorHome";
import MentorStudents from "@/pages/Mentor/MentorStudents";
import MentorReports from "@/pages/mentor/Reports/MentorReports";
import MentorLogDetails from "@/pages/mentor/Reports/MentorLogDetails";

// TUTOR
import TutorHome from "@/pages/Tutor/Home/TutorHome";
import UserTabs from "@/pages/Tutor/Users/UserTabs";
import ReportsTabs from "@/pages/Tutor/Reports/ReportsTabs";
import TutorFeedback from "@/pages/Tutor/Reports/TutorFeedback";

function ProtectedRoute({ children, allowedRoles }) {
  const { token, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/student/home" replace />;
  }

  return children;
}

export default function AppRoutes() {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={!token ? <Login /> : <Navigate to="/student/home" replace />}
      />

      {/* Protected Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* ---------- STUDENT ---------- */}
        <Route path="student/home" element={<StudentHome />} />
        <Route path="student/logpapers" element={<LogPaperTabs />} />
        <Route path="student/logpapers/:id" element={<LogPaperDetails />} />

        {/* ---------- MENTOR ---------- */}
        <Route
          path="mentor/home"
          element={
            <ProtectedRoute allowedRoles={["Mentor"]}>
              <MentorHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="mentor/students"
          element={
            <ProtectedRoute allowedRoles={["Mentor"]}>
              <MentorStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="mentor/reports"
          element={
            <ProtectedRoute allowedRoles={["Mentor"]}>
              <MentorReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="mentor/reports/:id"
          element={
            <ProtectedRoute allowedRoles={["Mentor"]}>
              <MentorLogDetails />
            </ProtectedRoute>
          }
        />

        {/* ---------- TUTOR (nested reports + feedback details) ---------- */}
        <Route
          path="tutor/home"
          element={
            <ProtectedRoute allowedRoles={["Tutor"]}>
              <TutorHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="tutor/users"
          element={
            <ProtectedRoute allowedRoles={["Tutor"]}>
              <UserTabs />
            </ProtectedRoute>
          }
        />
        <Route
          path="tutor/reports"
          element={
            <ProtectedRoute allowedRoles={["Tutor"]}>
              <ReportsTabs />
            </ProtectedRoute>
          }
        >
          {/* Child route renders inside <ReportsTabs /> via <Outlet /> */}
          <Route
            path=":id"
            element={
              <ProtectedRoute allowedRoles={["Tutor"]}>
                <TutorFeedback />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/student/home" replace />} />
    </Routes>
  );
}
