import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import {
  Users, Clock, Calendar, DollarSign,
  CheckCircle, ArrowUpRight, Zap,
  Bell, ChevronRight, TrendingUp,
} from "lucide-react";

const stats = [
  { label: "Total Employees", value: "1", icon: Users, change: "+2 this month", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  { label: "Present Today", value: "1", icon: Clock, change: "100% attendance", gradient: "linear-gradient(135deg, #10b981, #059669)" },
  { label: "On Leave", value: "0", icon: Calendar, change: "No leaves today", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
  { label: "Payroll Due", value: "₹67,500", icon: DollarSign, change: "March 2026", gradient: "linear-gradient(135deg, #ec4899, #be185d)" },
];

const recentActivity = [
  { action: "Harshada Patil clocked in", time: "9:00 AM", type: "attendance" },
  { action: "Leave request approved", time: "Yesterday", type: "leave" },
  { action: "Payroll generated for March", time: "2 days ago", type: "payroll" },
  { action: "NDA document signed", time: "3 days ago", type: "document" },
];

const quickActions = [
  { label: "Clock In", icon: Clock, gradient: "linear-gradient(135deg, #10b981, #059669)", path: "/attendance" },
  { label: "Apply Leave", icon: Calendar, gradient: "linear-gradient(135deg, #f59e0b, #d97706)", path: "/leave" },
  { label: "View Payslip", icon: DollarSign, gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)", path: "/payroll" },
  { label: "AI Assistant", icon: Zap, gradient: "linear-gradient(135deg, #ec4899, #be185d)", path: "/chatbot" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function Dashboard() {
  const { user } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: "#131c2e" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              {getGreeting()}, {user?.fullName?.split(" ")[0]} 👋
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}
          >
            <Bell size={18} style={{ color: "#f59e0b" }} />
          </motion.div>
        </motion.div>

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden mb-8 p-8"
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #1a2744 50%, #1e293b 100%)",
            border: "1px solid rgba(148,163,184,0.1)"
          }}
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148,163,184,0.04) 1px, transparent 0)`,
            backgroundSize: "32px 32px"
          }}/>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #f59e0b, transparent)", transform: "translate(30%, -40%)" }}/>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #6366f1, transparent)", transform: "translate(-30%, 40%)" }}/>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
              <span className="text-green-400 text-xs font-semibold uppercase tracking-widest">All Systems Operational</span>
            </div>
            <h2 className="text-white text-2xl lg:text-3xl font-bold mb-2">
              Welcome to <span style={{ color: "#f59e0b" }}>NexHR</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-md">
              Your complete HR platform. Manage attendance, payroll, leaves and more — powered by AI.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {[
                { label: "9 Modules", color: "#6366f1" },
                { label: "AI Powered", color: "#f59e0b" },
                { label: "Real-time Data", color: "#10b981" },
              ].map((tag) => (
                <div key={tag.label}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: `${tag.color}18`,
                    border: `1px solid ${tag.color}40`,
                    color: tag.color
                  }}>
                  {tag.label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative rounded-2xl p-5 overflow-hidden cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #1e293b, #162032)",
                border: "1px solid rgba(148,163,184,0.08)"
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: stat.gradient }}/>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-5"
                style={{ background: stat.gradient }}/>

              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: stat.gradient }}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <ArrowUpRight size={16} className="text-slate-600" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400 mb-3">{stat.label}</div>
              <div className="text-xs font-semibold px-2 py-1 rounded-full inline-block"
                style={{
                  background: "rgba(148,163,184,0.08)",
                  color: "#94a3b8"
                }}>
                {stat.change}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #1e293b, #162032)",
              border: "1px solid rgba(148,163,184,0.08)"
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white">Recent Activity</h2>
              <div className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer hover:text-slate-300 transition">
                View all <ChevronRight size={12}/>
              </div>
            </div>
            <div className="space-y-2">
              {recentActivity.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all"
                  style={{ background: "transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(148,163,184,0.05)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        activity.type === "attendance" ? "linear-gradient(135deg,#10b981,#059669)" :
                        activity.type === "leave" ? "linear-gradient(135deg,#f59e0b,#d97706)" :
                        activity.type === "payroll" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" :
                        "linear-gradient(135deg,#ec4899,#be185d)"
                    }}>
                    <CheckCircle size={15} className="text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-300 flex-1">{activity.action}</p>
                  <span className="text-xs text-slate-600 flex-shrink-0">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white">Quick Actions</h2>
              <TrendingUp size={16} className="text-slate-600" />
            </div>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <motion.a
                  key={action.label}
                  href={action.path}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                  style={{ background: "transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(148,163,184,0.05)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: action.gradient }}>
                    <action.icon size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-300 flex-1">{action.label}</span>
                  <ChevronRight size={14} className="text-slate-600" />
                </motion.a>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-700/50">
              <div className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                <span className="text-xs text-slate-400">Signed in as</span>
                <span className="text-xs font-bold ml-auto" style={{ color: "#f59e0b" }}>{user?.role}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}