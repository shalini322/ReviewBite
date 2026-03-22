import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Store, ArrowRight, X, ShieldCheck, AtSign } from 'lucide-react';

export default function SignupModal({ isOpen, onClose }) {
  // Roles: USER, OWNER, or ADMIN
  const [role, setRole] = useState('USER');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleContinue = () => {
    onClose(); 
    // Navigation to specific registration pages
    if (role === 'USER') {
      navigate('/auth/user');
    } else if (role === 'OWNER') {
      navigate('/auth/owner');
    } else {
      navigate('/auth/admin');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-4">
            <AtSign className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 font-brand">
            Join ReviewBite
          </h2>
          <p className="text-slate-500 text-sm px-4">
            Pick your account type. You will create a <span className="text-indigo-600 font-bold underline">unique username</span> to manage your profile and restaurants.
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          
          {/* User Option */}
          <button
            onClick={() => setRole('USER')}
            className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-3 group ${
              role === 'USER' 
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg' 
              : 'border-slate-100 dark:border-slate-800 hover:border-emerald-200'
            }`}
          >
            <User className={`w-8 h-8 transition-transform group-hover:scale-110 ${role === 'USER' ? 'text-emerald-500' : 'text-slate-400'}`} />
            <span className={`font-bold text-xs uppercase tracking-wider ${role === 'USER' ? 'text-emerald-700' : 'text-slate-500'}`}>Foodie</span>
          </button>

          {/* Owner Option */}
          <button
            onClick={() => setRole('OWNER')}
            className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-3 group ${
              role === 'OWNER' 
              ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 shadow-lg' 
              : 'border-slate-100 dark:border-slate-800 hover:border-rose-200'
            }`}
          >
            <Store className={`w-8 h-8 transition-transform group-hover:scale-110 ${role === 'OWNER' ? 'text-rose-500' : 'text-slate-400'}`} />
            <span className={`font-bold text-xs uppercase tracking-wider ${role === 'OWNER' ? 'text-rose-700' : 'text-slate-500'}`}>Owner</span>
          </button>

          {/* Admin Option */}
          <button
            onClick={() => setRole('ADMIN')}
            className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-3 group ${
              role === 'ADMIN' 
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg' 
              : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'
            }`}
          >
            <ShieldCheck className={`w-8 h-8 transition-transform group-hover:scale-110 ${role === 'ADMIN' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className={`font-bold text-xs uppercase tracking-wider ${role === 'ADMIN' ? 'text-indigo-700' : 'text-slate-500'}`}>Admin</span>
          </button>
        </div>

        {/* Helper Note for Owners */}
        {role === 'OWNER' && (
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-start gap-3">
            <div className="bg-rose-100 p-1.5 rounded-lg">
               <Store className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <b>Owner Access:</b> Your username will be linked to every restaurant you register. This allows you to edit or delete your listings later.
            </p>
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={handleContinue}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl active:scale-95 ${
            role === 'USER' ? 'bg-emerald-500 shadow-emerald-500/20' : 
            role === 'OWNER' ? 'bg-rose-500 shadow-rose-500/20' : 
            'bg-indigo-600 shadow-indigo-600/20'
          } text-white`}
        >
          Continue as {
            role === 'USER' ? 'Foodie' : 
            role === 'OWNER' ? 'Restaurant Owner' : 
            'System Admin'
          }
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-center mt-6 text-xs text-slate-400 uppercase tracking-widest font-semibold">
          Secure Registration via MongoDB
        </p>
      </div>
    </div>
  );
}