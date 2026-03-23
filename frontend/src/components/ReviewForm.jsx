import React, { useState } from 'react';
import { Send, CheckCircle, ShieldAlert, Lock, UserPlus } from 'lucide-react';
import { buildApiUrl } from '../config/api';

export default function ReviewForm({ restaurantSlug, onReviewSubmitted }) {

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  
  // Form + UI states
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Permission checks
  const isLoggedIn = !!currentUser;
  const canReview = currentUser?.role === 'USER';

  // Trigger global login modal (via Navbar listener)
  const promptLogin = () => {
    document.dispatchEvent(new CustomEvent("openLoginModal"));
  };

  // Handle review submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canReview) return;

    setError('');
    setShowSuccess(false);

    // Validate input
    if (!reviewText.trim()) {
      setError('Please write something in the review box.');
      return;
    }

    setIsSubmitting(true);

    try {
      // API request to submit review
      const response = await fetch(
        buildApiUrl(`/api/restaurants/${restaurantSlug}/reviews`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            user: userName,
            reviewText: reviewText,
          }),
        }
      );

      if (!response.ok) throw new Error('Submission failed');

      // Reset form on success
      setReviewText('');
      setShowSuccess(true);

      // Notify parent to refresh reviews
      if (onReviewSubmitted) onReviewSubmitted();

      // Auto-hide success message
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error("Review Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- UI STATES ---------- //

  // 1. User not logged in
  if (!isLoggedIn) {
    return (
      <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-8 text-center shadow-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-4 shadow-sm">
          <UserPlus className="w-6 h-6 text-indigo-600" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Share your experience!
        </h3>

        <p className="text-slate-600 text-sm max-w-xs mx-auto mb-6">
          You must be logged in as a Foodie to write a review.
        </p>

        <button
          onClick={promptLogin}
          className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200"
        >
          Login Now
        </button>
      </div>
    );
  }

  // 2. Logged in but restricted (Admin/Owner)
  if (!canReview) {
    return (
      <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-200 rounded-full mb-4">
          <ShieldAlert className="w-6 h-6 text-slate-500" />
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-2">
          Reviewing Restricted
        </h3>

        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          {currentUser?.role === 'ADMIN'
            ? "Admins cannot post reviews."
            : "Owners are restricted from reviewing their own platform."}
        </p>
      </div>
    );
  }

  // 3. Logged in user (allowed to review)
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Write a Review
        </h3>

        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">
          Foodie Verified
        </span>
      </div>

      {/* Error / Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {showSuccess && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Review submitted successfully!
        </div>
      )}

      <div className="space-y-4">

        {/* Username (readonly) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reviewing as:
          </label>

          <div className="relative">
            <input
              type="text"
              value={userName}
              readOnly
              disabled
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed font-medium"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Review Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Feedback
          </label>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            placeholder="Tell us about your dining experience..."
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg active:scale-95"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Analyzing...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Review</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}