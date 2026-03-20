import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, TrendingUp, Download,
  Calendar, CheckCircle, Clock, ChevronRight, Plus,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";

const mockPayslips = [
  { month: "March", year: 2026, basic: 50000, hra: 20000, allowances: 5000, deductions: 7500, net: 67500, status: "GENERATED" },
  { month: "February", year: 2026, basic: 50000, hra: 20000, allowances: 5000, deductions: 7500, net: 67500, status: "PAID" },
  { month: "January", year: 2026, basic: 48000, hra: 19200, allowances: 4500, deductions: 7200, net: 64500, status: "PAID" },
];

export default function Payroll() {
  const { user } = useAuthStore();
  const [selected, setSelected] = useState(mockPayslips[0]);
  const [showForm, setShowForm] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [genMessage, setGenMessage] = useState("");
  const [genForm, setGenForm] = useState({
    employeeId: "",
    month: "",
    year: "",
    basicSalary: "",
    hra: "",
    allowances: "",
    deductions: "",
  });

  const handleGenerate = async () => {
    setGenLoading(true);
    setGenMessage("");
    try {
      await axiosInstance.post("/api/payroll/generate", {
        employeeId: Number(genForm.employeeId),
        month: Number(genForm.month),
        year: Number(genForm.year),
        basicSalary: Number(genForm.basicSalary),
        hra: Number(genForm.hra),
        allowances: Number(genForm.allowances),
        deductions: Number(genForm.deductions),
      });
      setGenMessage("Payroll generated successfully! ✅");
      setShowForm(false);
    } catch (err: any) {
      setGenMessage(err.response?.data?.message || "Failed to generate payroll.");
    } finally {
      setGenLoading(false);
    }
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
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Payroll</h1>
            <p className="text-slate-400 mt-1 text-sm">Your salary and payslip history</p>
          </div>
          {(user?.role === "ADMIN" || user?.role === "HR_MANAGER") && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
            >
              <Plus size={16} />
              Generate Payroll
            </motion.button>
          )}
        </motion.div>

        {/* Generate Payroll Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-2xl p-6"
                style={{
                  background: "linear-gradient(135deg, #1e293b, #1a2744)",
                  border: "1px solid rgba(16,185,129,0.2)"
                }}>
                <h2 className="text-base font-semibold text-white mb-6">Generate Payroll</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {[
                    { key: "employeeId", label: "Employee ID", placeholder: "1" },
                    { key: "month", label: "Month (1-12)", placeholder: "3" },
                    { key: "year", label: "Year", placeholder: "2026" },
                    { key: "basicSalary", label: "Basic Salary", placeholder: "50000" },
                    { key: "hra", label: "HRA", placeholder: "20000" },
                    { key: "allowances", label: "Allowances", placeholder: "5000" },
                    { key: "deductions", label: "Deductions", placeholder: "7500" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-xs text-slate-400 block mb-2">{field.label}</label>
                      <input
                        type="number"
                        placeholder={field.placeholder}
                        value={genForm[field.key as keyof typeof genForm]}
                        onChange={(e) => setGenForm({ ...genForm, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600"
                        style={{
                          background: "rgba(148,163,184,0.06)",
                          border: "1px solid rgba(148,163,184,0.1)"
                        }}
                      />
                    </div>
                  ))}
                </div>

                {genMessage && (
                  <p className="text-sm mb-4" style={{ color: genMessage.includes("success") ? "#10b981" : "#f59e0b" }}>
                    {genMessage}
                  </p>
                )}

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    disabled={genLoading}
                    className="flex-1 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                  >
                    {genLoading ? "Generating..." : "Generate Payroll"}
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

        {/* Net Salary Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden mb-6 p-8"
          style={{
            background: "linear-gradient(135deg, #1e293b, #1a2744)",
            border: "1px solid rgba(148,163,184,0.08)"
          }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #10b981, transparent)" }}/>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-slate-400 text-sm mb-2">Current Month Net Salary</p>
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                ₹{selected.net.toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={14} style={{ color: "#10b981" }} />
                <span className="text-sm" style={{ color: "#10b981" }}>+4.6% from last month</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Basic", value: selected.basic, color: "#6366f1" },
                { label: "HRA", value: selected.hra, color: "#10b981" },
                { label: "Allowances", value: selected.allowances, color: "#f59e0b" },
                { label: "Deductions", value: selected.deductions, color: "#ef4444" },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 rounded-xl"
                  style={{ background: "rgba(148,163,184,0.06)" }}>
                  <div className="text-sm font-bold text-white">₹{item.value.toLocaleString()}</div>
                  <div className="text-xs mt-1" style={{ color: item.color }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Salary Breakdown + Monthly Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #1e293b, #162032)",
              border: "1px solid rgba(148,163,184,0.08)"
            }}
          >
            <h2 className="text-base font-semibold text-white mb-6">Salary Breakdown</h2>
            <div className="space-y-4">
              {[
                { label: "Basic Salary", value: selected.basic, total: selected.net, gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
                { label: "HRA", value: selected.hra, total: selected.net, gradient: "linear-gradient(135deg, #10b981, #059669)" },
                { label: "Allowances", value: selected.allowances, total: selected.net, gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
                { label: "Deductions", value: selected.deductions, total: selected.net, gradient: "linear-gradient(135deg, #ef4444, #dc2626)" },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-white font-semibold">₹{item.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / item.total) * 100}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ background: item.gradient }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #1e293b, #162032)",
              border: "1px solid rgba(148,163,184,0.08)"
            }}
          >
            <h2 className="text-base font-semibold text-white mb-6">Monthly Trend</h2>
            <div className="flex items-end justify-between gap-2 h-32">
              {mockPayslips.slice().reverse().map((p, i) => (
                <motion.div
                  key={p.month}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="flex-1 flex flex-col items-center gap-2"
                  style={{ transformOrigin: "bottom" }}
                >
                  <span className="text-xs text-slate-500">₹{(p.net / 1000).toFixed(0)}k</span>
                  <div
                    className="w-full rounded-xl cursor-pointer transition-all"
                    onClick={() => setSelected(p)}
                    style={{
                      height: `${(p.net / 70000) * 100}%`,
                      background: selected.month === p.month
                        ? "linear-gradient(180deg, #6366f1, #8b5cf6)"
                        : "rgba(148,163,184,0.1)",
                      border: selected.month === p.month ? "none" : "1px solid rgba(148,163,184,0.08)",
                      minHeight: 40
                    }}
                  />
                  <span className="text-xs text-slate-500">{p.month.slice(0, 3)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Payslip History */}
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
            <h2 className="text-base font-semibold text-white">Payslip History</h2>
            <div className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer hover:text-slate-300">
              View all <ChevronRight size={12} />
            </div>
          </div>
          <div className="space-y-3">
            {mockPayslips.map((payslip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                onClick={() => setSelected(payslip)}
                className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  background: selected.month === payslip.month
                    ? "rgba(99,102,241,0.08)"
                    : "rgba(148,163,184,0.04)",
                  border: selected.month === payslip.month
                    ? "1px solid rgba(99,102,241,0.2)"
                    : "1px solid rgba(148,163,184,0.06)"
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  <DollarSign size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{payslip.month} {payslip.year}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Net: ₹{payslip.net.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: payslip.status === "PAID" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                    color: payslip.status === "PAID" ? "#10b981" : "#f59e0b"
                  }}>
                  {payslip.status === "PAID"
                    ? <><CheckCircle size={10} /> PAID</>
                    : <><Clock size={10} /> PENDING</>
                  }
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(148,163,184,0.08)" }}
                >
                  <Download size={14} className="text-slate-400" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}