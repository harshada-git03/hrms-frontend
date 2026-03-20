import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock, MapPin, Wifi, CheckCircle,
  TrendingUp, Calendar, Award, Activity,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";

const workModes = [
  { value: "OFFICE", label: "Office", icon: MapPin, gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  { value: "WFH", label: "WFH", icon: Wifi, gradient: "linear-gradient(135deg, #10b981, #059669)" },
  { value: "ON_DUTY", label: "On Duty", icon: CheckCircle, gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
];

const weekData = [
  { day: "Mon", present: true, wfh: false, hours: 8.5 },
  { day: "Tue", present: true, wfh: true, hours: 7.5 },
  { day: "Wed", present: true, wfh: false, hours: 9 },
  { day: "Thu", present: false, wfh: false, hours: 0 },
  { day: "Fri", present: true, wfh: true, hours: 8 },
];

const monthStats = [
  { label: "Days Present", value: 18, total: 22, color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #059669)" },
  { label: "WFH Days", value: 5, total: 18, color: "#6366f1", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  { label: "Avg Hours", value: 8.2, total: 9, color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
  { label: "On Time", value: 15, total: 18, color: "#ec4899", gradient: "linear-gradient(135deg, #ec4899, #be185d)" },
];

export default function Attendance() {
  const { user } = useAuthStore();
  const [selectedMode, setSelectedMode] = useState("OFFICE");
  const [clockedIn, setClockedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [clockInTime, setClockInTime] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`/api/attendance/clock-in/${user?.employeeId}`, {
        workMode: selectedMode,
      });
      setClockedIn(true);
      setClockInTime(currentTime.toLocaleTimeString());
      setMessage("Clocked in successfully!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Already clocked in!");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`/api/attendance/clock-out/${user?.employeeId}`);
      setClockedIn(false);
      setMessage("Clocked out! Great work today 🎉");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "No active clock-in found!");
    } finally {
      setLoading(false);
    }
  };

  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: "#131c2e" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Attendance</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {currentTime.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Clock In Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 relative rounded-3xl overflow-hidden p-6 flex flex-col items-center justify-center text-center"
            style={{
              background: "linear-gradient(135deg, #1e293b, #1a2744)",
              border: "1px solid rgba(148,163,184,0.08)",
              minHeight: 320
            }}
          >
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full opacity-10"
                style={{ background: clockedIn ? "radial-gradient(circle, #10b981, transparent)" : "radial-gradient(circle, #6366f1, transparent)" }}/>
            </div>

            <div className="relative z-10 w-full">
              {/* Live clock */}
              <div className="flex items-center justify-center gap-1 mb-4">
                {[hours, ":", minutes, ":", seconds].map((unit, i) => (
                  <motion.span
                    key={i}
                    className="text-3xl lg:text-4xl font-bold text-white font-mono"
                    animate={unit !== ":" ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {unit}
                  </motion.span>
                ))}
              </div>

              {/* Status */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 ${
                clockedIn
                  ? "bg-green-500/15 text-green-400 border border-green-500/25"
                  : "bg-slate-700/50 text-slate-400 border border-slate-600/50"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${clockedIn ? "bg-green-400 animate-pulse" : "bg-slate-500"}`}/>
                {clockedIn ? `In since ${clockInTime}` : "Not clocked in"}
              </div>

              {/* Work mode */}
              {!clockedIn && (
                <div className="flex justify-center gap-2 mb-5">
                  {workModes.map((mode) => (
                    <motion.button
                      key={mode.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMode(mode.value)}
                      className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{
                        background: selectedMode === mode.value ? mode.gradient : "rgba(148,163,184,0.08)",
                        color: selectedMode === mode.value ? "#fff" : "#64748b",
                        border: selectedMode === mode.value ? "none" : "1px solid rgba(148,163,184,0.1)"
                      }}
                    >
                      <mode.icon size={14} />
                      {mode.label}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={clockedIn ? handleClockOut : handleClockIn}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-base shadow-lg disabled:opacity-50"
                style={{
                  background: clockedIn
                    ? "linear-gradient(135deg, #ef4444, #dc2626)"
                    : "linear-gradient(135deg, #10b981, #059669)",
                  boxShadow: clockedIn
                    ? "0 8px 24px rgba(239,68,68,0.25)"
                    : "0 8px 24px rgba(16,185,129,0.25)"
                }}
              >
                {loading ? "Processing..." : clockedIn ? "⏹ Clock Out" : "▶ Clock In"}
              </motion.button>

              {message && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-xs font-medium"
                  style={{ color: message.includes("success") || message.includes("Great") ? "#10b981" : "#f59e0b" }}
                >
                  {message}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Stats + Week view */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Monthly Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {monthStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  className="rounded-2xl p-4"
                  style={{
                    background: "linear-gradient(135deg, #1e293b, #162032)",
                    border: "1px solid rgba(148,163,184,0.08)"
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-500">{stat.label}</span>
                    <TrendingUp size={12} style={{ color: stat.color }} />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.value / stat.total) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: stat.gradient }}
                    />
                  </div>
                  <div className="text-xs text-slate-600 mt-1">of {stat.total}</div>
                </motion.div>
              ))}
            </div>

            {/* This Week */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl p-6 flex-1"
              style={{
                background: "linear-gradient(135deg, #1e293b, #162032)",
                border: "1px solid rgba(148,163,184,0.08)"
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-white">This Week</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar size={12} />
                  March 2026
                </div>
              </div>

              <div className="flex items-end justify-between gap-3">
                {weekData.map((day, i) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                    className="flex-1 flex flex-col items-center gap-2"
                    style={{ transformOrigin: "bottom" }}
                  >
                    {/* Hours label */}
                    <span className="text-xs text-slate-500">{day.hours > 0 ? `${day.hours}h` : "-"}</span>

                    {/* Bar */}
                    <div className="w-full rounded-xl overflow-hidden relative" style={{ height: 80, background: "rgba(148,163,184,0.06)" }}>
                      {day.present && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(day.hours / 10) * 100}%` }}
                          transition={{ delay: 0.6 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                          className="absolute bottom-0 left-0 right-0 rounded-xl"
                          style={{
                            background: day.wfh
                              ? "linear-gradient(180deg, #6366f1, #8b5cf6)"
                              : "linear-gradient(180deg, #10b981, #059669)"
                          }}
                        />
                      )}
                    </div>

                    {/* Day label */}
                    <span className="text-xs font-medium" style={{ color: day.present ? "#fff" : "#475569" }}>
                      {day.day}
                    </span>

                    {/* Dot indicator */}
                    <div className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: !day.present ? "#475569" : day.wfh ? "#6366f1" : "#10b981"
                      }}/>
                  </motion.div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
                {[
                  { color: "#10b981", label: "In Office" },
                  { color: "#6366f1", label: "WFH" },
                  { color: "#475569", label: "Absent" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color }}/>
                    <span className="text-xs text-slate-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Activity streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #1e293b, #162032)",
              border: "1px solid rgba(148,163,184,0.08)"
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">Attendance Streak</h2>
              <Award size={16} style={{ color: "#f59e0b" }} />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                <span className="text-white text-2xl font-bold">5</span>
              </div>
              <div>
                <p className="text-white font-semibold">5 Day Streak! 🔥</p>
                <p className="text-slate-400 text-sm mt-1">Keep it up! You're on a roll.</p>
              </div>
            </div>
          </motion.div>

          {/* Today summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #1e293b, #162032)",
              border: "1px solid rgba(148,163,184,0.08)"
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">Today's Summary</h2>
              <Activity size={16} className="text-slate-500" />
            </div>
            <div className="space-y-3">
              {[
                { label: "Clock In", value: clockedIn ? clockInTime : "--:--", color: "#10b981" },
                { label: "Clock Out", value: "--:--", color: "#ef4444" },
                { label: "Work Mode", value: selectedMode, color: "#6366f1" },
                { label: "Hours Logged", value: clockedIn ? "In progress..." : "0h", color: "#f59e0b" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className="text-sm font-semibold" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}