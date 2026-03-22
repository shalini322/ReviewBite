import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Utensils, UserPlus, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import SignupModal from '../components/SignupModal'; 

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Controls login/signup modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Listen for global event to open login modal
  useEffect(() => {
    const openLogin = () => setIsModalOpen(true);
    document.addEventListener("openLoginModal", openLogin);
    return () => document.removeEventListener("openLoginModal", openLogin);
  }, []);

  // Clear auth data and redirect to home
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload(); // Force UI refresh
  };

  // Format user display name with role badge
  const getUserDisplayName = () => {
    if (!user) return null;

    // Resolve name from multiple possible fields
    const rawName =
      user.ownerName ||
      user.name ||
      user.ownerUsername ||
      user.username ||
      'User';

    const firstName = rawName.split(' ')[0];

    // Append role label
    if (user.role === 'ADMIN') return `${firstName} (Admin)`;
    if (user.role === 'OWNER') return `${firstName} (Owner)`;

    return firstName;
  };

  // Check active route for styling
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-white/70 backdrop-blur-xl border-b border-white/30 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo + Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <Utensils className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-rose-500 font-brand">
                ReviewBite
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex items-center space-x-1">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isActive('/') ? 'text-violet-600 bg-violet-50' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/restaurants"
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isActive('/restaurants') ? 'text-violet-600 bg-violet-50' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Restaurants
                </Link>

                <Link
                  to="/leaderboard"
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isActive('/leaderboard') ? 'text-violet-600 bg-violet-50' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Leaderboard
                </Link>
              </div>

              {/* Authentication Section */}
              {user ? (
                <div className="flex items-center gap-4">

                  {/* User Profile Pill */}
                  <div className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm hover:border-violet-200 transition-all">
                    
                    {/* Profile Avatar */}
                    <div
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center ${
                        user.role === 'ADMIN' ? 'bg-indigo-100' : 'bg-violet-100'
                      }`}
                    >
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt="User profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/default-pfp.png';
                          }}
                        />
                      ) : user.role === 'ADMIN' ? (
                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-violet-600" />
                      )}
                    </div>

                    {/* User Name + Role */}
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                      {getUserDisplayName()}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all group"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              ) : (
                // Login Button (when user not logged in)
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <SignupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}