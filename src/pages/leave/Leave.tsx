import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, CheckCircle, XCircle,
  Plus, ChevronRight, AlertCircle,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";

const leaveTypes = [
  { value: "SICK", label: "Sick Leave", color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444, #dc2626)" },
  { value: "CASUAL", label: "Casual Leave", color: "#6366f1", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  { value: "EARNED", label: "Earned Leave", color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #059669)" },
  { value: "UNPAID", label: "Unpaid Leave", color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
];

const leaveBalance = [
  { type: "Sick", used: 2, total: 12, gradient: "linear-gradient(135deg, #ef4444, #dc2626)" },
  { type: "Casual", used: 3, total: 12, gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  { type: "Earned", used: 5, total: 18, gradient: "linear-gradient(135deg, #10b981, #059669)" },
  { type: "Unpaid", used: 0, total: 5, gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
];

export default function Leave() {
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [leaves, setLeaves] = useState<any[]>([]);
  const [form, setForm] = useState({
    leaveType: "SICK",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleApply = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axiosInstance.post(`/api/leaves/apply/${user?.employeeId}`, form);
      setLeaves(prev => [res.data, ...prev]);
      setMessage("Leave request submitted successfully!");
      setShowForm(false);
      setForm({ leaveType: "SICK", startDate: "", endDate: "", reason: "" });
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to apply leave.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "APPROVED") return { bg: "rgba(16,185,129,0.1)", color: "#10b981" };
    if (status === "REJECTED") return { bg: "rgba(239,68,68,0.1)", color: "#ef4444" };
    return { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" };
  };

  const getStatusIcon = (status: string) => {
    if (status === "APPROVED") return <CheckCircle size={12} />;
    if (status === "REJECTED") return <XCircle size={12} />;
    return <Clock size={12} />;
  };

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
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Leave Management</h1>
            <p className="text-slate-400 mt-1 text-sm">Apply and track your leave requests</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            <Plus size={16} />
            Apply Leave
          </motion.button>
        </motion.div>

        {/* Leave Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {leaveBalance.map((balance, i) => (
            <motion.div
              key={balance.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(135deg, #1e293b, #162032)",
                border: "1px solid rgba(148,163,184,0.08)"
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">{balance.type}</span>
                <span className="text-xs text-slate-500">{balance.total - balance.used} left</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{balance.used}</div>
              <div className="text-xs text-slate-500 mb-3">used of {balance.total}</div>
              <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(balance.used / balance.total) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ background: balance.gradient }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Apply Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-2xl p-6"
                style={{
                  background: "linear-gradient(135deg, #1e293b, #1a2744)",
                  border: "1px solid rgba(99,102,241,0.2)"
                }}>
                <h2 className="text-base font-semibold text-white mb-6">Apply for Leave</h2>

                {/* Leave type selector */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                  {leaveTypes.map((type) => (
                    <motion.button
                      key={type.value}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setForm({ ...form, leaveType: type.value })}
                      className="py-2.5 px-4 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: form.leaveType === type.value ? type.gradient : "rgba(148,163,184,0.06)",
                        color: form.leaveType === type.value ? "#fff" : "#64748b",
                        border: form.leaveType === type.value ? "none" : "1px solid rgba(148,163,184,0.1)"
                      }}
                    >
                      {type.label}
                    </motion.button>
                  ))}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Start Date</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white"
                      style={{
                        background: "rgba(148,163,184,0.06)",
                        border: "1px solid rgba(148,163,184,0.1)",
                        colorScheme: "dark"
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">End Date</label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white"
                      style={{
                        background: "rgba(148,163,184,0.06)",
                        border: "1px solid rgba(148,163,184,0.1)",
                        colorScheme: "dark"
                      }}
                    />
                  </div>
                </div>

                {/* Reason */}
                <div className="mb-5">
                  <label className="text-xs text-slate-400 block mb-2">Reason</label>
                  <textarea
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    rows={3}
                    placeholder="Briefly describe your reason..."
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 resize-none"
                    style={{
                      background: "rgba(148,163,184,0.06)",
                      border: "1px solid rgba(148,163,184,0.1)"
                    }}
                  />
                </div>

                {message && (
                  <div className="flex items-center gap-2 mb-4 text-sm"
                    style={{ color: message.includes("success") ? "#10b981" : "#f59e0b" }}>
                    <AlertCircle size={14} />
                    {message}
                  </div>
                )}

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApply}
                    disabled={loading || !form.startDate || !form.endDate || !form.reason}
                    className="flex-1 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    {loading ? "Submitting..." : "Submit Request"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 rounded-xl text-slate-400 text-sm font-medium"
                    style={{ background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.1)" }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leave History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, #1e293b, #162032)",
            border: "1px solid rgba(148,163,184,0.08)"
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-white">Leave History</h2>
            <div className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer hover:text-slate-300">
              View all <ChevronRight size={12} />
            </div>
          </div>

          {leaves.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={40} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 text-sm">No leave requests yet.</p>
              <p className="text-slate-600 text-xs mt-1">Click "Apply Leave" to submit your first request.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaves.map((leave, i) => {
                const statusStyle = getStatusColor(leave.status);
                const leaveType = leaveTypes.find(t => t.value === leave.leaveType);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: "rgba(148,163,184,0.04)", border: "1px solid rgba(148,163,184,0.06)" }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: leaveType?.gradient }}>
                      <Calendar size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{leave.leaveType} Leave</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {leave.startDate} → {leave.endDate} • {leave.totalDays} day(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: statusStyle.bg, color: statusStyle.color }}>
                      {getStatusIcon(leave.status)}
                      {leave.status}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}