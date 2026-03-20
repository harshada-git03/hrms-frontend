import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, Plus, X, Clock,
  Users, Shield, User, Gift,
  PartyPopper, Calendar, Star,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";

const audienceConfig: Record<string, { gradient: string; bg: string; color: string; icon: any }> = {
  ALL: { gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)", bg: "rgba(99,102,241,0.1)", color: "#6366f1", icon: Users },
  EMPLOYEE: { gradient: "linear-gradient(135deg, #10b981, #059669)", bg: "rgba(16,185,129,0.1)", color: "#10b981", icon: User },
  HR_MANAGER: { gradient: "linear-gradient(135deg, #f59e0b, #d97706)", bg: "rgba(245,158,11,0.1)", color: "#f59e0b", icon: Users },
  ADMIN: { gradient: "linear-gradient(135deg, #ec4899, #be185d)", bg: "rgba(236,72,153,0.1)", color: "#ec4899", icon: Shield },
};

const upcomingHolidays = [
  { name: "Gudi Padwa", date: "Mar 30", emoji: "🪁", color: "#f59e0b" },
  { name: "Ram Navami", date: "Apr 6", emoji: "🙏", color: "#ec4899" },
  { name: "Ambedkar Jayanti", date: "Apr 14", emoji: "🇮🇳", color: "#6366f1" },
  { name: "Good Friday", date: "Apr 18", emoji: "✝️", color: "#10b981" },
  { name: "Maharashtra Day", date: "May 1", emoji: "🎉", color: "#f59e0b" },
  { name: "Buddha Purnima", date: "May 12", emoji: "☮️", color: "#8b5cf6" },
];

const birthdays = [
  { name: "Harshada Patil", date: "Today 🎂", avatar: "H", gradient: "linear-gradient(135deg, #ec4899, #be185d)" },
  { name: "Rahul Sharma", date: "Mar 25", avatar: "R", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  { name: "Priya Desai", date: "Apr 2", avatar: "P", gradient: "linear-gradient(135deg, #10b981, #059669)" },
  { name: "Amit Joshi", date: "Apr 15", avatar: "A", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
];

const companyEvents = [
  { title: "Holi Celebration 🎨", date: "Mar 14, 2026", desc: "Office Holi party — colors, sweets & fun!", gradient: "linear-gradient(135deg, #ec4899, #f59e0b)" },
  { title: "Q1 Team Outing 🏖️", date: "Apr 5, 2026", desc: "Team building day at Lonavala", gradient: "linear-gradient(135deg, #10b981, #6366f1)" },
  { title: "Annual Day 🏆", date: "May 20, 2026", desc: "Awards, performances & dinner gala", gradient: "linear-gradient(135deg, #f59e0b, #ec4899)" },
];

export default function Announcements() {
  const { user } = useAuthStore();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "holidays" | "birthdays" | "events">("all");
  const [form, setForm] = useState({
    title: "",
    body: "",
    targetAudience: "ALL",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axiosInstance.get("/api/announcements");
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setFormLoading(true);
    setMessage("");
    try {
      await axiosInstance.post(`/api/announcements/${user?.employeeId}`, form);
      setMessage("Announcement posted! ✅");
      await fetchAnnouncements();
      setTimeout(() => {
        setShowModal(false);
        setForm({ title: "", body: "", targetAudience: "ALL" });
        setMessage("");
      }, 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to post.");
    } finally {
      setFormLoading(false);
    }
  };

  const isHRorAdmin = user?.role === "ADMIN" || user?.role === "HR_MANAGER";

  const tabs = [
    { key: "all", label: "All", icon: Megaphone },
    { key: "holidays", label: "Holidays", icon: Calendar },
    { key: "birthdays", label: "Birthdays", icon: Gift },
    { key: "events", label: "Events", icon: PartyPopper },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ background: "#131c2e" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Announcements</h1>
            <p className="text-slate-400 mt-1 text-sm">Stay updated with company news & celebrations</p>
          </div>
          {isHRorAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              <Plus size={16} />
              Post Announcement
            </motion.button>
          )}
        </motion.div>

        {/* Today's Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden mb-6 p-6"
          style={{
            background: "linear-gradient(135deg, #1e1a2e, #2d1f3d)",
            border: "1px solid rgba(236,72,153,0.2)"
          }}
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(236,72,153,0.04) 1px, transparent 0)`,
            backgroundSize: "24px 24px"
          }}/>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #ec4899, transparent)", transform: "translate(30%, -30%)" }}/>

          <div className="relative z-10 flex items-center gap-6">
            <div className="text-5xl">🎂</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star size={14} style={{ color: "#f59e0b" }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#f59e0b" }}>Today's Birthday</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Happy Birthday, Harshada! 🎉</h2>
              <p className="text-slate-400 text-sm">Wishing you a wonderful day filled with joy and celebration!</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-1"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.key as any)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
              style={{
                background: activeTab === tab.key
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "rgba(148,163,184,0.06)",
                color: activeTab === tab.key ? "#fff" : "#64748b",
                border: activeTab === tab.key ? "none" : "1px solid rgba(148,163,184,0.1)"
              }}
            >
              <tab.icon size={14} />
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">

          {/* Holidays Tab */}
          {activeTab === "holidays" && (
            <motion.div
              key="holidays"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingHolidays.map((holiday, i) => (
                  <motion.div
                    key={holiday.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl p-5 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #1e293b, #162032)",
                      border: "1px solid rgba(148,163,184,0.08)"
                    }}
                  >
                    <div className="text-4xl mb-3">{holiday.emoji}</div>
                    <h3 className="text-white font-semibold mb-1">{holiday.name}</h3>
                    <div className="flex items-center gap-2">
                      <Calendar size={12} style={{ color: holiday.color }} />
                      <span className="text-xs font-semibold" style={{ color: holiday.color }}>{holiday.date}</span>
                    </div>
                    <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full opacity-10"
                      style={{ background: `radial-gradient(circle, ${holiday.color}, transparent)`, transform: "translate(30%, 30%)" }}/>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Birthdays Tab */}
          {activeTab === "birthdays" && (
            <motion.div
              key="birthdays"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {birthdays.map((b, i) => (
                <motion.div
                  key={b.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-5 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #1e293b, #162032)",
                    border: "1px solid rgba(148,163,184,0.08)"
                  }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: b.gradient }}>
                    {b.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{b.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Gift size={12} style={{ color: "#ec4899" }} />
                      <span className="text-xs" style={{ color: "#ec4899" }}>{b.date}</span>
                    </div>
                  </div>
                  <div className="text-3xl">{b.date.includes("Today") ? "🎂" : "🎁"}</div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {companyEvents.map((event, i) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl p-6 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #1e293b, #162032)",
                    border: "1px solid rgba(148,163,184,0.08)"
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: event.gradient }}/>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-5"
                    style={{ background: event.gradient }}/>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: event.gradient }}>
                      <PartyPopper size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base mb-1">{event.title}</h3>
                      <p className="text-slate-400 text-sm mb-3">{event.desc}</p>
                      <div className="flex items-center gap-2">
                        <Calendar size={12} style={{ color: "#f59e0b" }} />
                        <span className="text-xs font-semibold" style={{ color: "#f59e0b" }}>{event.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* All Announcements Tab */}
          {activeTab === "all" && (
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="rounded-2xl p-6 animate-pulse"
                      style={{ background: "#1e293b", height: 120 }} />
                  ))}
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <Megaphone size={36} style={{ color: "#6366f1" }} />
                  </div>
                  <p className="text-white font-semibold text-lg mb-2">No announcements yet</p>
                  <p className="text-slate-500 text-sm">
                    {isHRorAdmin ? "Click 'Post Announcement' to create one." : "Check back later!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((ann, i) => {
                    const config = audienceConfig[ann.targetAudience] || audienceConfig.ALL;
                    const AudienceIcon = config.icon;
                    return (
                      <motion.div
                        key={ann.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        whileHover={{ y: -2 }}
                        className="rounded-2xl p-6 relative overflow-hidden"
                        style={{
                          background: "linear-gradient(135deg, #1e293b, #162032)",
                          border: "1px solid rgba(148,163,184,0.08)"
                        }}
                      >
                        <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                          style={{ background: config.gradient }} />
                        <div className="flex items-start gap-4 pl-2">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: config.gradient }}>
                            <Megaphone size={16} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold mb-2">{ann.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{ann.body}</p>
                            <div className="flex items-center gap-4 mt-4">
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Clock size={11} />
                                {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric"
                                }) : "Just now"}
                              </div>
                              {ann.createdByName && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                  <User size={11} />
                                  {ann.createdByName}
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                                style={{ background: config.bg, color: config.color }}>
                                <AudienceIcon size={10} />
                                {ann.targetAudience}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg rounded-3xl p-8"
                style={{
                  background: "linear-gradient(135deg, #1e293b, #162032)",
                  border: "1px solid rgba(148,163,184,0.12)"
                }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">New Announcement</h2>
                    <p className="text-slate-400 text-xs mt-1">Post an update to your team</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white"
                    style={{ background: "rgba(148,163,184,0.08)" }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Holi Celebration Tomorrow! 🎨"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600"
                      style={{ background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.1)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Write your announcement here..."
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 resize-none"
                      style={{ background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.1)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Target Audience</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["ALL", "EMPLOYEE", "HR_MANAGER", "ADMIN"].map((audience) => {
                        const config = audienceConfig[audience];
                        return (
                          <motion.button
                            key={audience}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setForm({ ...form, targetAudience: audience })}
                            className="py-2.5 rounded-xl text-xs font-semibold"
                            style={{
                              background: form.targetAudience === audience ? config.gradient : "rgba(148,163,184,0.06)",
                              color: form.targetAudience === audience ? "#fff" : "#64748b",
                              border: form.targetAudience === audience ? "none" : "1px solid rgba(148,163,184,0.1)"
                            }}
                          >
                            {audience === "HR_MANAGER" ? "HR" : audience}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {message && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-sm text-center font-medium"
                    style={{ color: message.includes("✅") ? "#10b981" : "#f59e0b" }}
                  >
                    {message}
                  </motion.p>
                )}

                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate}
                    disabled={formLoading || !form.title || !form.body}
                    className="flex-1 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    {formLoading ? "Posting..." : "Post Announcement"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 rounded-xl text-slate-400 text-sm"
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