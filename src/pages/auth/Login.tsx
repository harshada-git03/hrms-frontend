import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
import { loginApi } from "../../api/authApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginApi(email, password);
      setUser({
        token: data.token,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        employeeId: data.employeeId,
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* Left Panel — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}
      >
        {/* Subtle grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148,163,184,0.08) 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }}/>

        {/* Gold accent line */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-400 to-transparent opacity-60"/>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-wide">NexHR</span>
          </div>

          {/* Center content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h2 className="text-5xl font-bold text-white leading-tight mb-6">
                Manage your<br />
                <span style={{ color: "#f59e0b" }}>workforce</span><br />
                smarter.
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                A complete HR platform built for modern teams. Attendance, payroll, leaves and more — all in one place.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex gap-8 mt-12"
            >
              {[
                { value: "9+", label: "Modules" },
                { value: "100%", label: "Automated" },
                { value: "AI", label: "Powered" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold" style={{ color: "#f59e0b" }}>{stat.value}</div>
                  <div className="text-slate-500 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom */}
          <p className="text-slate-600 text-sm">© 2026 NexHR. All rights reserved.</p>
        </div>
      </motion.div>

      {/* Right Panel — Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 flex items-center justify-center p-8"
        style={{ background: "#f8fafc" }}
      >
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-semibold text-xl text-slate-800">NexHR</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-500 mb-8">Sign in to your NexHR account</p>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full border border-slate-200 bg-white text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition text-sm"
                  style={{ "--tw-ring-color": "#f59e0b" } as any}
                  onFocus={(e) => e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.15)"}
                  onBlur={(e) => e.target.style.boxShadow = "none"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-slate-200 bg-white text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none transition text-sm"
                  onFocus={(e) => e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.15)"}
                  onBlur={(e) => e.target.style.boxShadow = "none"}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign in →"}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-slate-200"/>
              <span className="text-slate-400 text-xs">SECURED BY NEXHR</span>
              <div className="flex-1 h-px bg-slate-200"/>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {["JWT Auth", "Role Based Access", "AI Powered"].map((f) => (
                <span key={f} className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                  {f}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}