import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Upload, Shield, BookOpen,
  Download, Eye, CheckCircle, Clock,
  X, Plus, Search, Filter, Lock,
  FileCheck, FileBadge, FileSignature,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";

const docCategories = [
  { key: "all", label: "All Documents", icon: FileText },
  { key: "my", label: "My Documents", icon: FileBadge },
  { key: "policy", label: "Company Policies", icon: BookOpen },
  { key: "esign", label: "E-Sign Requests", icon: FileSignature },
];

const companyPolicies = [
  { title: "Employee Handbook 2026", size: "2.4 MB", type: "PDF", updated: "Jan 2026", icon: "📋", color: "#6366f1" },
  { title: "Code of Conduct", size: "1.1 MB", type: "PDF", updated: "Jan 2026", icon: "⚖️", color: "#10b981" },
  { title: "Leave Policy", size: "0.8 MB", type: "PDF", updated: "Feb 2026", icon: "📅", color: "#f59e0b" },
  { title: "Work From Home Policy", size: "0.6 MB", type: "PDF", updated: "Feb 2026", icon: "🏠", color: "#ec4899" },
  { title: "Anti-Harassment Policy", size: "1.3 MB", type: "PDF", updated: "Jan 2026", icon: "🛡️", color: "#8b5cf6" },
  { title: "IT & Data Security Policy", size: "1.7 MB", type: "PDF", updated: "Mar 2026", icon: "🔒", color: "#06b6d4" },
];

const myDocuments = [
  { title: "Offer Letter", date: "Jan 15, 2026", type: "OFFER_LETTER", icon: "📄", status: "SIGNED", color: "#10b981" },
  { title: "Appointment Letter", date: "Jan 15, 2026", type: "APPOINTMENT", icon: "📃", status: "SIGNED", color: "#6366f1" },
  { title: "ID Card", date: "Jan 20, 2026", type: "ID_CARD", icon: "🪪", status: "ISSUED", color: "#f59e0b" },
  { title: "Salary Slip - Feb 2026", date: "Mar 1, 2026", type: "PAYSLIP", icon: "💰", status: "AVAILABLE", color: "#ec4899" },
  { title: "Salary Slip - Jan 2026", date: "Feb 1, 2026", type: "PAYSLIP", icon: "💰", status: "AVAILABLE", color: "#ec4899" },
];

export default function Documents() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [esignDocs, setEsignDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadForm, setUploadForm] = useState({
    employeeId: "",
    title: "",
    type: "NDA",
    fileUrl: "",
    remarks: "",
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const isHRorAdmin = user?.role === "ADMIN" || user?.role === "HR_MANAGER";

  useEffect(() => {
    fetchEsignDocs();
  }, []);

  const fetchEsignDocs = async () => {
    try {
      const res = await axiosInstance.get(
        isHRorAdmin ? "/api/documents/pending" : `/api/documents/employee/${user?.employeeId}`
      );
      setEsignDocs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (docId: number) => {
    try {
      await axiosInstance.put(`/api/documents/sign/${docId}`);
      fetchEsignDocs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    setUploadLoading(true);
    setUploadMessage("");
    try {
      await axiosInstance.post(`/api/documents/request/${user?.employeeId}`, {
        employeeId: Number(uploadForm.employeeId),
        title: uploadForm.title,
        type: uploadForm.type,
        fileUrl: uploadForm.fileUrl,
        remarks: uploadForm.remarks,
      });
      setUploadMessage("Document sent for signature! ✅");
      await fetchEsignDocs();
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadForm({ employeeId: "", title: "", type: "NDA", fileUrl: "", remarks: "" });
        setUploadMessage("");
      }, 1500);
    } catch (err: any) {
      setUploadMessage(err.response?.data?.message || "Failed to send document.");
    } finally {
      setUploadLoading(false);
    }
  };

  const filteredPolicies = companyPolicies.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMyDocs = myDocuments.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

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
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Documents</h1>
            <p className="text-slate-400 mt-1 text-sm">Your documents, policies and e-sign requests</p>
          </div>
          {isHRorAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              <Plus size={16} />
              Send for Signature
            </motion.button>
          )}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {[
            { label: "My Documents", value: myDocuments.length, icon: FileBadge, gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
            { label: "Company Policies", value: companyPolicies.length, icon: BookOpen, gradient: "linear-gradient(135deg, #10b981, #059669)" },
            { label: "Pending Signatures", value: esignDocs.filter(d => d.status === "PENDING_SIGNATURE").length, icon: FileSignature, gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
            { label: "Signed Docs", value: esignDocs.filter(d => d.status === "SIGNED").length, icon: FileCheck, gradient: "linear-gradient(135deg, #ec4899, #be185d)" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="rounded-2xl p-4"
              style={{
                background: "linear-gradient(135deg, #1e293b, #162032)",
                border: "1px solid rgba(148,163,184,0.08)"
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: stat.gradient }}>
                <stat.icon size={16} className="text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-6"
        >
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-600"
            style={{
              background: "rgba(148,163,184,0.06)",
              border: "1px solid rgba(148,163,184,0.1)"
            }}
          />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-1"
        >
          {docCategories.map((cat) => (
            <motion.button
              key={cat.key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(cat.key)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap"
              style={{
                background: activeTab === cat.key
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "rgba(148,163,184,0.06)",
                color: activeTab === cat.key ? "#fff" : "#64748b",
                border: activeTab === cat.key ? "none" : "1px solid rgba(148,163,184,0.1)"
              }}
            >
              <cat.icon size={14} />
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">

          {/* All Documents */}
          {activeTab === "all" && (
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* My Docs preview */}
              <div className="rounded-2xl p-6"
                style={{ background: "linear-gradient(135deg, #1e293b, #162032)", border: "1px solid rgba(148,163,184,0.08)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white">My Documents</h2>
                  <button onClick={() => setActiveTab("my")} className="text-xs text-slate-500 hover:text-slate-300">View all →</button>
                </div>
                <div className="space-y-3">
                  {myDocuments.slice(0, 3).map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(148,163,184,0.04)" }}>
                      <span className="text-2xl">{doc.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{doc.title}</p>
                        <p className="text-xs text-slate-500">{doc.date}</p>
                      </div>
                      <motion.button whileHover={{ scale: 1.1 }} className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(148,163,184,0.08)" }}>
                        <Download size={13} className="text-slate-400" />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies preview */}
              <div className="rounded-2xl p-6"
                style={{ background: "linear-gradient(135deg, #1e293b, #162032)", border: "1px solid rgba(148,163,184,0.08)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white">Company Policies</h2>
                  <button onClick={() => setActiveTab("policy")} className="text-xs text-slate-500 hover:text-slate-300">View all →</button>
                </div>
                <div className="space-y-3">
                  {companyPolicies.slice(0, 3).map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(148,163,184,0.04)" }}>
                      <span className="text-2xl">{doc.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{doc.title}</p>
                        <p className="text-xs text-slate-500">{doc.size} • {doc.updated}</p>
                      </div>
                      <motion.button whileHover={{ scale: 1.1 }} className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(148,163,184,0.08)" }}>
                        <Download size={13} className="text-slate-400" />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* My Documents */}
          {activeTab === "my" && (
            <motion.div
              key="my"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {filteredMyDocs.map((doc, i) => (
                <motion.div
                  key={i}
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
                  <div className="text-3xl">{doc.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm">{doc.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.date}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: `${doc.color}18`,
                      color: doc.color
                    }}>
                    <CheckCircle size={10} />
                    {doc.status}
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
                    >
                      <Eye size={14} style={{ color: "#6366f1" }} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
                    >
                      <Download size={14} style={{ color: "#10b981" }} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Company Policies */}
          {activeTab === "policy" && (
            <motion.div
              key="policy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredPolicies.map((doc, i) => (
                <motion.div
                  key={i}
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
                  <div className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: `linear-gradient(135deg, ${doc.color}, transparent)` }}/>

                  <div className="text-4xl mb-4">{doc.icon}</div>
                  <h3 className="text-white font-semibold text-sm mb-1">{doc.title}</h3>
                  <p className="text-xs text-slate-500 mb-4">{doc.size} • Updated {doc.updated}</p>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold"
                      style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.2)" }}
                    >
                      <Eye size={12} /> View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold"
                      style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}
                    >
                      <Download size={12} /> Download
                    </motion.button>
                  </div>

                  {!isHRorAdmin && (
                    <div className="absolute top-3 right-3">
                      <Lock size={12} className="text-slate-600" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* E-Sign Requests */}
          {activeTab === "esign" && (
            <motion.div
              key="esign"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="rounded-2xl p-5 animate-pulse"
                      style={{ background: "#1e293b", height: 80 }} />
                  ))}
                </div>
              ) : esignDocs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <FileSignature size={36} style={{ color: "#6366f1" }} />
                  </div>
                  <p className="text-white font-semibold text-lg mb-2">No e-sign requests</p>
                  <p className="text-slate-500 text-sm">All caught up!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {esignDocs.map((doc, i) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-center gap-4 p-5 rounded-2xl"
                      style={{
                        background: "linear-gradient(135deg, #1e293b, #162032)",
                        border: "1px solid rgba(148,163,184,0.08)"
                      }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                        <FileSignature size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm">{doc.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {doc.type} • Requested by {doc.requestedByName}
                        </p>
                        {doc.remarks && (
                          <p className="text-xs text-slate-600 mt-1 italic">"{doc.remarks}"</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mr-2"
                        style={{
                          background: doc.status === "SIGNED" ? "rgba(16,185,129,0.1)" :
                            doc.status === "REJECTED" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                          color: doc.status === "SIGNED" ? "#10b981" :
                            doc.status === "REJECTED" ? "#ef4444" : "#f59e0b"
                        }}>
                        {doc.status === "SIGNED" ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {doc.status === "PENDING_SIGNATURE" ? "PENDING" : doc.status}
                      </div>

                      {doc.status === "PENDING_SIGNATURE" && !isHRorAdmin && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSign(doc.id)}
                          className="px-4 py-2 rounded-xl text-white text-xs font-semibold"
                          style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                        >
                          Sign Now
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload Modal — HR/Admin only */}
      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
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
                    <h2 className="text-lg font-bold text-white">Send Document for Signature</h2>
                    <p className="text-slate-400 text-xs mt-1">Employee will be notified to sign</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowUploadModal(false)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400"
                    style={{ background: "rgba(148,163,184,0.08)" }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Employee ID</label>
                    <input
                      type="number"
                      placeholder="e.g. 1"
                      value={uploadForm.employeeId}
                      onChange={(e) => setUploadForm({ ...uploadForm, employeeId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600"
                      style={{ background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.1)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Document Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Non-Disclosure Agreement"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600"
                      style={{ background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.1)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Document Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["NDA", "OFFER_LETTER", "APPRAISAL", "OTHER"].map((type) => (
                        <motion.button
                          key={type}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setUploadForm({ ...uploadForm, type })}
                          className="py-2.5 rounded-xl text-xs font-semibold"
                          style={{
                            background: uploadForm.type === type
                              ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                              : "rgba(148,163,184,0.06)",
                            color: uploadForm.type === type ? "#fff" : "#64748b",
                            border: uploadForm.type === type ? "none" : "1px solid rgba(148,163,184,0.1)"
                          }}
                        >
                          {type === "OFFER_LETTER" ? "Offer" : type}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Document URL / Link</label>
                    <input
                      type="text"
                      placeholder="https://docs.company.com/nda.pdf"
                      value={uploadForm.fileUrl}
                      onChange={(e) => setUploadForm({ ...uploadForm, fileUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600"
                      style={{ background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.1)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Remarks (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Please sign before March 25"
                      value={uploadForm.remarks}
                      onChange={(e) => setUploadForm({ ...uploadForm, remarks: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600"
                      style={{ background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.1)" }}
                    />
                  </div>
                </div>

                {uploadMessage && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-sm text-center font-medium"
                    style={{ color: uploadMessage.includes("✅") ? "#10b981" : "#f59e0b" }}
                  >
                    {uploadMessage}
                  </motion.p>
                )}

                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpload}
                    disabled={uploadLoading || !uploadForm.employeeId || !uploadForm.title}
                    className="flex-1 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    {uploadLoading ? "Sending..." : "Send for Signature"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowUploadModal(false)}
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