import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Zap, User, Sparkles,
  Clock, Calendar, DollarSign, RefreshCw,
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";

const suggestions = [
  { text: "How many leaves do I have left?", icon: Calendar },
  { text: "What is my net salary this month?", icon: DollarSign },
  { text: "How many days have I attended this month?", icon: Clock },
  { text: "What is the leave policy?", icon: Sparkles },
];

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

export default function Chatbot() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi ${user?.fullName?.split(" ")[0]} 👋 I'm your NexHR AI Assistant. I have access to your attendance, leave, and payroll data. Ask me anything!`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axiosInstance.post(`/api/chatbot/${user?.employeeId}`, {
        message: messageText,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: `Hi ${user?.fullName?.split(" ")[0]} 👋 I'm your NexHR AI Assistant. How can I help you today?`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 lg:p-8" style={{ background: "#131c2e" }}>
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}>
              <Zap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white">AI Assistant</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-slate-400">Powered by Gemini • Online</span>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 text-sm"
            style={{ background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.1)" }}
          >
            <RefreshCw size={14} />
            Clear
          </motion.button>
        </motion.div>

        {/* Context Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-4 mb-4 flex items-center gap-3"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.1))",
            border: "1px solid rgba(99,102,241,0.2)"
          }}
        >
          <Sparkles size={16} style={{ color: "#6366f1" }} />
          <p className="text-xs text-slate-300">
            I have access to your <span style={{ color: "#6366f1" }}>attendance</span>,{" "}
            <span style={{ color: "#10b981" }}>leave balance</span>, and{" "}
            <span style={{ color: "#f59e0b" }}>payroll data</span> — ask me anything about your HR info!
          </p>
        </motion.div>

        {/* Chat Window */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 rounded-2xl p-4 mb-4 overflow-y-auto"
          style={{
            background: "linear-gradient(135deg, #1e293b, #162032)",
            border: "1px solid rgba(148,163,184,0.08)",
            minHeight: 400,
            maxHeight: 500
          }}
        >
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: msg.role === "assistant"
                        ? "linear-gradient(135deg, #6366f1, #ec4899)"
                        : "linear-gradient(135deg, #1e293b, #334155)",
                      border: msg.role === "user" ? "1px solid rgba(148,163,184,0.2)" : "none"
                    }}>
                    {msg.role === "assistant"
                      ? <Zap size={14} className="text-white" />
                      : <User size={14} className="text-slate-300" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-xs lg:max-w-md ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div
                      className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                      style={{
                        background: msg.role === "user"
                          ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                          : "rgba(148,163,184,0.08)",
                        color: "#fff",
                        borderRadius: msg.role === "user"
                          ? "20px 20px 4px 20px"
                          : "20px 20px 20px 4px"
                      }}
                    >
                      {msg.content}
                    </div>
                    <span className="text-xs text-slate-600 px-1">{msg.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}>
                  <Zap size={14} className="text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl flex items-center gap-1"
                  style={{ background: "rgba(148,163,184,0.08)", borderRadius: "20px 20px 20px 4px" }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ background: "#6366f1" }}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </motion.div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-2 mb-4"
          >
            {suggestions.map((s, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => sendMessage(s.text)}
                className="flex items-center gap-2 p-3 rounded-xl text-left text-xs text-slate-300 transition-all"
                style={{
                  background: "rgba(148,163,184,0.06)",
                  border: "1px solid rgba(148,163,184,0.1)"
                }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  <s.icon size={13} className="text-white" />
                </div>
                {s.text}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your leave, attendance, salary..."
            className="flex-1 px-5 py-4 rounded-2xl text-sm text-white placeholder-slate-600"
            style={{
              background: "rgba(148,163,184,0.06)",
              border: "1px solid rgba(148,163,184,0.1)"
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-14 h-14 rounded-2xl flex items-center justify-center disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}
          >
            <Send size={18} className="text-white" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}