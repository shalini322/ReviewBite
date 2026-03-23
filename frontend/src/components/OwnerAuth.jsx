import React, { useState } from "react";
import { Store, User, Phone, Lock, Utensils, ArrowRight, AtSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from '../config/api';

export default function OwnerAuth() {
  const navigate = useNavigate();
  const [isExistingOwner, setIsExistingOwner] = useState(false);
  const [loading, setLoading] = useState(false); 
  
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    ownerUsername: "",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loading
    
    const endpoint = isExistingOwner
      ? "/api/auth/login"
      : "/api/auth/signup/owner";

    try {
      // ✅ Step 2: Mapping payload for backend consistency
      const payload = isExistingOwner
        ? {
            username: formData.ownerUsername, 
            phoneNumber: formData.phoneNumber, 
            password: formData.password,
            role: "OWNER",
          }
        : {
            ...formData,
            role: "OWNER",
          };

      const { data } = await axios.post(buildApiUrl(endpoint), payload);

      localStorage.setItem("token", data.token);
      const userToSave = data.owner || data.user || data.account;
      localStorage.setItem("user", JSON.stringify(userToSave));

      alert(`Welcome back, ${userToSave.ownerName || userToSave.name || 'Partner'}!`);
      navigate("/restaurants");
      
    } catch (err) {
      console.error("Owner Auth Error:", err.response?.data || err.message);
      // ✅ Better error feedback for Render "Cold Starts"
      const errorMsg = err.response?.data?.message || "Server unreachable. It might be waking up from sleep mode—please try again in 30 seconds.";
      alert(errorMsg);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px]"></div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/95 dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 mb-4 shadow-inner">
            <Store className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white font-brand">
            {isExistingOwner ? "Owner Login" : "Partner with Us"}
          </h2>
        </div>

        <div className="space-y-4">
          {/* Username */}
          <div className="relative">
            <AtSign className="absolute left-4 top-3.5 w-5 h-5 text-rose-400" />
            <input
              name="ownerUsername"
              onChange={handleChange}
              value={formData.ownerUsername}
              placeholder="Unique Username"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none dark:text-white font-mono text-sm"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="relative">
            <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              name="phoneNumber"
              onChange={handleChange}
              value={formData.phoneNumber}
              placeholder="Phone Number"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none dark:text-white"
              required
            />
          </div>

          {!isExistingOwner && (
            <>
              <div className="relative">
                <Utensils className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  name="restaurantName"
                  onChange={handleChange}
                  value={formData.restaurantName}
                  placeholder="Restaurant Name"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none dark:text-white"
                  required
                />
              </div>

              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  name="ownerName"
                  onChange={handleChange}
                  value={formData.ownerName}
                  placeholder="Owner Full Name"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none dark:text-white"
                  required
                />
              </div>
            </>
          )}

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              name="password"
              onChange={handleChange}
              value={formData.password}
              placeholder="Password"
              type="password"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none dark:text-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? 'bg-slate-500' : 'bg-rose-500 hover:bg-rose-600'} text-white font-bold py-4 rounded-2xl mt-8 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-rose-500/25`}
        >
          {loading ? "Authenticating..." : (isExistingOwner ? "Login to Dashboard" : "Register Restaurant")}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>

        <p className="text-sm mt-6 text-center text-slate-500">
          {isExistingOwner ? "New here? " : "Already have an account? "}
          <button
            type="button"
            className="text-rose-500 font-bold hover:underline underline-offset-4"
            onClick={() => setIsExistingOwner(!isExistingOwner)}
          >
            {isExistingOwner ? "Sign Up" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}