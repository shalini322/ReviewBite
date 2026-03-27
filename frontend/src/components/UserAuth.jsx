import React, { useState } from "react";
import { Camera, User, Phone, Lock, ArrowRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from '../config/api';

export default function UserAuth() {
  const navigate = useNavigate();
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [profilePic, setProfilePic] = useState(null); // Base64 string for backend
  const [preview, setPreview] = useState(null); // Local URL for UI preview

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Step 2: Convert Image to Base64 for Cloudinary
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // For UI display
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfilePic(reader.result); // This is the Base64 string
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isExistingUser ? "/api/auth/login" : "/api/auth/signup/user";

    try {
      const payload = isExistingUser
        ? {
            name: formData.name,
            password: formData.password,
            role: "USER",
          }
        : {
            ...formData,
            role: "USER",
            profilePic: profilePic || "", // Send Base64 or empty
          };

      const { data } = await axios.post(buildApiUrl(endpoint), payload);

      localStorage.setItem("token", data.token);
      const userToSave = data.user || data.account;
      localStorage.setItem("user", JSON.stringify(userToSave));

      alert(`Welcome to ReviewBite, ${userToSave.name}!`);
      navigate("/restaurants");

    } catch (err) {
      console.error("User Auth Error:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || "Connection failed. The backend might be starting up—try again in a moment.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/95 dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800 relative z-10"
      >
        <h2 className="text-3xl font-black mb-2 text-center text-slate-900 dark:text-white">
          {isExistingUser ? "Welcome Back" : "Join Foodies"}
        </h2>

        <p className="text-center text-slate-500 mb-8">
          {isExistingUser ? "Login with your name" : "Discover and review the best bites"}
        </p>

        {!isExistingUser && (
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center overflow-hidden border-4 border-emerald-500/20">
                <img
                  src={preview || "/default-pfp.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <label className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors shadow-lg">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
            <p className="text-xs text-slate-400 mt-2">Add a profile picture</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
              required
            />
          </div>

          {!isExistingUser && (
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
                required
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              type="password"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${loading ? 'bg-slate-500' : 'bg-emerald-500 hover:bg-emerald-600'} text-white font-bold py-4 rounded-2xl mt-8 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20`}
        >
          {loading ? "Processing..." : (isExistingUser ? "Login" : "Create Account")}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>

        <p className="text-sm mt-6 text-center text-slate-500">
          {isExistingUser ? "New to ReviewBite? " : "Already have an account? "}
          <span
            className="text-emerald-600 font-bold cursor-pointer hover:underline underline-offset-4"
            onClick={() => setIsExistingUser(!isExistingUser)}
          >
            {isExistingUser ? "Sign Up" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
}