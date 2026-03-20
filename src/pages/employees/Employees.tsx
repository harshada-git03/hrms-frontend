import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Shield, User,
  Mail, ChevronRight, UserPlus, X, Eye, EyeOff,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const roleColors: Record<string, { gradient: string; bg: string; color: string }> = {
  ADMIN: { gradient: "linear-gradient(135deg, #ec4899, #be185d)", bg: "rgba(236,72,153,0.1)", color: "#ec4899" },
  HR_MANAGER: { gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)", bg: "rgba(99,102,241,0.1)", color: "#6366f1" },
  EMPLOYEE: { gradient: "linear-gradient(135deg, #10b981, #059669)", bg: "rgba(16,185,129,0.1)", color: "#10b981" },
};

const getRoleIcon = (role: string) => {
  if (role === "ADMIN") return Shield;
  if (role === "HR_MANAGER") return Users;
  return User;
};

export default function Employees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get("/api/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    setFormLoading(true);
    setFormMessage("");
    try {
      await axiosInstance.post("/api/auth/register", form);
      setFormMessage("Employee added successfully! ✅");
      await fetchEmployees();
      setTimeout(() => {
        setShowModal(false);
        setForm({ fullName: "", email: "", password: "", role: "EMPLOYEE" });
        setFormMessage("");
      }, 1500);
    } catch (err: any) {
      setFormMessage(err.response?.data?.message || "Failed to add employee.");
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = employees.filter(emp => {
    const matchSearch = emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = selectedRole === "ALL" || emp.role === selectedRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: "#131c2e" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Employees</h1>
            <p className="text-slate-400 mt-1 text-sm">{employees.length} total employees</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            <UserPlus size={16} />
            Add Employee
          </motion.button>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-600"
              style={{
                background: "rgba(148,163,184,0.06)",
                border: "1px solid rgba(148,163,184,0.1)"
              }}
            />
          </div>
          <div className="flex gap-2">
            {["ALL", "ADMIN", "HR_MANAGER", "EMPLOYEE"].map((role) => (
              <motion.button
                key={role}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRole(role)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: selectedRole === role
                    ? role === "ALL" ? "linear-gradient(135deg, #1e293b, #334155)" : roleColors[role]?.gradient
                    : "rgba(148,163,184,0.06)",
                  color: selectedRole === role ? "#fff" : "#64748b",
                  border: selectedRole === role ? "none" : "1px solid rgba(148,163,184,0.1)"
                }}
              >
                {role === "HR_MANAGER" ? "HR" : role}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {[
            { label: "Total", value: employees.length, gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
            { label: "Active", value: employees.filter(e => e.status === "ACTIVE").length, gradient: "linear-gradient(135deg, #10b981, #059669)" },
            { label: "Admins", value: employees.filter(e => e.role === "ADMIN").length, gradient: "linear-gradient(135deg, #ec4899, #be185d)" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl p-4 text-center"
              style={{
                background: "linear-gradient(135deg, #1e293b, #162032)",
                border: "1px solid rgba(148,163,184,0.08)"
              }}>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
              <div className="h-0.5 rounded-full mt-3 mx-6" style={{ background: stat.gradient }} />
            </div>
          ))}
        </motion.div>

        {/* Employee Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl p-5 animate-pulse"
                style={{ background: "linear-gradient(135deg, #1e293b, #162032)", height: 160 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users size={40} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">No employees found.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((emp, i) => {
              const roleStyle = roleColors[emp.role] || roleColors.EMPLOYEE;
              const RoleIcon = getRoleIcon(emp.role);
              return (
                <motion.div
                  key={emp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-5 cursor-pointer relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #1e293b, #162032)",
                    border: "1px solid rgba(148,163,184,0.08)"
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: roleStyle.gradient }} />
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ background: roleStyle.gradient }}>
                      {emp.fullName?.charAt(0)}
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: roleStyle.bg, color: roleStyle.color }}>
                      <RoleIcon size={10} />
                      {emp.role === "HR_MANAGER" ? "HR" : emp.role}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{emp.fullName}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-3">
                    <Mail size={11} />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${emp.status === "ACTIVE" ? "bg-green-400 animate-pulse" : "bg-slate-500"}`} />
                      <span className="text-xs" style={{ color: emp.status === "ACTIVE" ? "#10b981" : "#64748b" }}>
                        {emp.status}
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-slate-600" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md rounded-3xl p-8"
                style={{
                  background: "linear-gradient(135deg, #1e293b, #162032)",
                  border: "1px solid rgba(148,163,184,0.12)"
                }}>

                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">Add New Employee</h2>
                    <p className="text-slate-400 text-xs mt-1">Fill in the details to register</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition"
                    style={{ background: "rgba(148,163,184,0.08)" }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600"
                      style={{
                        background: "rgba(148,163,184,0.06)",
                        border: "1px solid rgba(148,163,184,0.1)"
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600"
                      style={{
                        background: "rgba(148,163,184,0.06)",
                        border: "1px solid rgba(148,163,184,0.1)"
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 6 characters"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-white placeholder-slate-600"
                        style={{
                          background: "rgba(148,163,184,0.06)",
                          border: "1px solid rgba(148,163,184,0.1)"
                        }}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["EMPLOYEE", "HR_MANAGER", "ADMIN"].map((role) => (
                        <motion.button
                          key={role}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setForm({ ...form, role })}
                          className="py-2.5 rounded-xl text-xs font-semibold transition-all"
                          style={{
                            background: form.role === role
                              ? roleColors[role]?.gradient
                              : "rgba(148,163,184,0.06)",
                            color: form.role === role ? "#fff" : "#64748b",
                            border: form.role === role ? "none" : "1px solid rgba(148,163,184,0.1)"
                          }}
                        >
                          {role === "HR_MANAGER" ? "HR Manager" : role}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Message */}
                {formMessage && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-sm text-center font-medium"
                    style={{ color: formMessage.includes("success") ? "#10b981" : "#f59e0b" }}
                  >
                    {formMessage}
                  </motion.p>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddEmployee}
                    disabled={formLoading || !form.fullName || !form.email || !form.password}
                    className="flex-1 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    {formLoading ? "Adding..." : "Add Employee"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 rounded-xl text-slate-400 text-sm font-medium"
                    style={{ background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.1)" }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}