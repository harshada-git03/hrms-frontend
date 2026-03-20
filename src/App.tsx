import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Attendance from "./pages/attendance/Attendance";
import Leave from "./pages/leave/Leave";
import Employees from "./pages/employees/Employees";
import Payroll from "./pages/payroll/Payroll";
import Announcements from "./pages/announcements/Announcements";
import Documents from "./pages/documents/Documents";
import Chatbot from "./pages/chatbot/Chatbot";
import { useAuthStore } from "./store/useAuthStore";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance" element={<Attendance />} />
       <Route path="/leave" element={<Leave />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/payroll" element={<Payroll />} />
       <Route path="/announcements" element={<Announcements />} />
       <Route path="/documents" element={<Documents />} />
       <Route path="/chatbot" element={<Chatbot />} />
      </Route>
    </Routes>
  );
}

