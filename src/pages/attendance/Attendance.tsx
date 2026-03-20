import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Wifi, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";

const workModes = [
  { value: "OFFICE", label: "In Office", icon: MapPin, gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  { value: "WFH", label: "Work From Home", icon: Wifi, gradient: "linear-gradient(135deg, #10b981, #059669)" },
  { value: "ON_DUTY", label: "On Duty", icon: CheckCircle, gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
];

export default function Attendance() {
  const { user } = useAuthStore();
  const [selectedMode, setSelectedMode] = useState("OFFICE");
  const [clockedIn, setClockedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [clockInTime, setClockInTime] = useState("");
  const [logs, setLogs] = useState<any[]>([]);

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/api/attendance/clock-in/${user?.employeeId}`, {
        workMode: selectedMode,
      });
      setClockedIn(true);
      setClockInTime(new Date().toLocaleTimeString());
      setMessage("Successfully clocked in!");
      setLogs(prev => [res.data, ...prev]);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Already clocked in today!");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`/api/attendance/clock-out/${user?.employeeId}`);
      setClockedIn(false);
      setMessage("Successfully clocked out! Have a great day!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "No active clock-in found!");
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const timeString = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const dateString = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: "#131c2e" }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Attendance</h1>
          <p className="text-slate-400 mt-1 text-sm">Track your daily attendance and work mode</p>
        </motion.div>

        {/* Clock Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden mb-6 p-8 text-center"
          style={{
            background: "linear-gradient(135deg, #1e293b, #1a2744)",
            border: "1px solid rgba(148,163,184,0.08)"
          }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full opacity-5"
              style={{ background: clockedIn ? "radial-gradient(circle, #10b981, transparent)" : "radial-gradient(circle, #6366f1, transparent)" }}/>
          </div>

          <div className="relative z-10">
            {/* Live clock */}
            <div className="text-5xl lg:text-7xl font-bold text-white mb-2 tracking-tight">
              {timeString}
            </div>
            <p className="text-slate-400 text-sm mb-6">{dateString}</p>

            {/* Status badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 ${
              clockedIn
                ? "bg-green-500/15 text-green-400 border border-green-500/25"
                : "bg-slate-700/50 text-slate-400 border border-slate-600/50"
            }`}>
              <div className={`w-2 h-2 rounded-full ${clockedIn ? "bg-green-400 animate-pulse" : "bg-slate-500"}`}/>
              {clockedIn ? `Clocked in at ${clockInTime}` : "Not clocked in"}
            </div>

            {/* Work mode selector */}
            {!clockedIn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap justify-center gap-3 mb-8"
              >
                {workModes.map((mode) => (
                  <motion.button
                    key={mode.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMode(mode.value)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: selectedMode === mode.value ? mode.gradient : "rgba(148,163,184,0.08)",
                      color: selectedMode === mode.value ? "#fff" : "#94a3b8",
                      border: selectedMode === mode.value ? "none" : "1px solid rgba(148,163,184,0.12)"
                    }}
                  >
                    <mode.icon size={15} />
                    {mode.label}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Clock button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={clockedIn ? handleClockOut : handleClockIn}
              disabled={loading}
              className="px-12 py-4 rounded-2xl text-white font-bold text-lg shadow-lg disabled:opacity-50"
              style={{
                background: clockedIn
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : "linear-gradient(135deg, #10b981, #059669)",
                boxShadow: clockedIn
                  ? "0 8px 32px rgba(239,68,68,0.3)"
                  : "0 8px 32px rgba(16,185,129,0.3)"
              }}
            >
              {loading ? "Processing..." : clockedIn ? "Clock Out" : "Clock In"}
            </motion.button>

            {/* Message */}
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm font-medium"
                style={{ color: message.includes("Successfully") ? "#10b981" : "#f59e0b" }}
              >
                {message}
              </motion.p>
            )}
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
            { label: "Days Present", value: "18", gradient: "linear-gradient(135deg, #10b981, #059669)" },
            { label: "Days Absent", value: "2", gradient: "linear-gradient(135deg, #ef4444, #dc2626)" },
            { label: "WFH Days", value: "5", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl p-4 text-center"
              style={{ background: "linear-gradient(135deg, #1e293b, #162032)", border: "1px solid rgba(148,163,184,0.08)" }}>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
              <div className="h-0.5 rounded-full mt-3 mx-4" style={{ background: stat.gradient }}/>
            </div>
          ))}
        </motion.div>

        {/* Recent logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-6"
          style={{ background: "linear-gradient(135deg, #1e293b, #162032)", border: "1px solid rgba(148,163,184,0.08)" }}
        >
          <h2 className="text-base font-semibold text-white mb-4">Recent Logs</h2>
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No attendance logs yet. Clock in to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl"
                  style={{ background: "rgba(148,163,184,0.04)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-300">{log.workMode}</p>
                    <p className="text-xs text-slate-500">{new Date(log.clockIn).toLocaleTimeString()}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full"
                    style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
                    PRESENT
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}