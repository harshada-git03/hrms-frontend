import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore";
const BASE_URL = "https://hrms-java-production.up.railway.app";

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
      const res = await fetch(
        `${BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();

      
      localStorage.setItem("token", data.token);

      
      setUser({
        token: data.token,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        employeeId: data.employeeId,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.08) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-400 to-transparent opacity-60" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center font-bold">
              N
            </div>
            <span className="text-xl font-semibold">NexHR</span>
          </div>

          <div>
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Manage your <span className="text-amber-400">workforce</span>{" "}
              smarter.
            </h2>
            <p className="text-slate-400 max-w-sm">
              A complete HR platform built for modern teams. Attendance,
              payroll, leaves and more — all in one place.
            </p>
          </div>

          <p className="text-slate-500 text-sm">
            © 2026 NexHR. All rights reserved.
          </p>
        </div>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center p-8 bg-slate-50"
      >
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-6">Sign in to your account</p>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border p-3 rounded"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border p-3 rounded"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}