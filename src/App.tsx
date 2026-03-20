import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Attendance from "./pages/attendance/Attendance";
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
        <Route path="/leave" element={<div className="p-8 text-slate-800 text-2xl font-bold">Leave coming soon!</div>} />
        <Route path="/employees" element={<div className="p-8 text-slate-800 text-2xl font-bold">Employees coming soon!</div>} />
        <Route path="/payroll" element={<div className="p-8 text-slate-800 text-2xl font-bold">Payroll coming soon!</div>} />
        <Route path="/announcements" element={<div className="p-8 text-slate-800 text-2xl font-bold">Announcements coming soon!</div>} />
        <Route path="/documents" element={<div className="p-8 text-slate-800 text-2xl font-bold">Documents coming soon!</div>} />
        <Route path="/chatbot" element={<div className="p-8 text-slate-800 text-2xl font-bold">AI Assistant coming soon!</div>} />
      </Route>
    </Routes>
  );
}

