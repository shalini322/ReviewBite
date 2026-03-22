import React, { useState } from "react";
import { ShieldCheck, Lock, ArrowRight, User, Terminal } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminAuth() {
  const navigate = useNavigate();
  const [isExistingAdmin, setIsExistingAdmin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    adminMasterKey: "",
  });

  // ✅ Step 1: Dynamic API URL Selection
  // It uses the Vercel Environment Variable if available, otherwise defaults to localhost
  const RAW_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const API_BASE_URL = RAW_URL.replace(/\/$/, ""); // Removes trailing slash to prevent //api errors

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isExistingAdmin
      ? "/api/auth/login"
      : "/api/auth/signup/admin";

    try {
      const payload = {
        ...formData,
        role: "ADMIN",
      };

      // ✅ Step 2: Request to your Render Backend
      const { data } = await axios.post(`${API_BASE_URL}${endpoint}`, payload);

      // Save session data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.account || data.user));

      alert(`Admin Access Granted: Welcome, ${data.account?.name || 'Admin'}`);
      navigate("/restaurants");
    } catch (err) {
      console.error("Admin Auth Error:", err.response?.data || err.message);
      
      // Detailed error message for debugging
      const errorMsg = err.response?.data?.message || "Connection refused. Ensure the backend is awake on Render.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]"></div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/95 dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-indigo-100 dark:border-slate-800 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 rotate-3">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white font-brand text-center">
            {isExistingAdmin ? "Admin Portal" : "Register Admin"}
          </h2>

          <p className="text-slate-500 text-sm mt-1 text-center">
            {isExistingAdmin ? "System-level access required" : "Initialize new administrator account"}
          </p>
        </div>

        <div className="space-y-4">
          {/* Username Input */}
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Admin Username"
              className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white font-medium"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Secure Password"
              type="password"
              className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white font-medium"
              required
            />
          </div>

          {/* Master Key Input */}
          <div className="relative">
            <Terminal className="absolute left-4 top-3.5 w-5 h-5 text-indigo-500" />
            <input
              name="adminMasterKey"
              value={formData.adminMasterKey}
              onChange={handleInputChange}
              placeholder="System Master Key"
              type="password"
              className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white italic"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? 'bg-slate-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold py-4 rounded-2xl mt-8 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20`}
        >
          {loading ? "Verifying..." : (isExistingAdmin ? "Verify & Access" : "Grant Privileges")}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>

        <p className="text-sm mt-6 text-center text-slate-500">
          {isExistingAdmin ? "Need to register a new admin? " : "Back to system login? "}
          <span
            className="text-indigo-600 font-bold cursor-pointer hover:underline underline-offset-4"
            onClick={() => setIsExistingAdmin(!isExistingAdmin)}
          >
            {isExistingAdmin ? "Create Root" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
}