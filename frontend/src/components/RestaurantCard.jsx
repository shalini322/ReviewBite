import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, MapPin, Pencil, Trash2, User, ShieldCheck } from 'lucide-react';

export default function RestaurantCard({ restaurant, onEdit, onDelete }) {
  
  // Get logged-in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Normalize usernames for consistent comparison
  const loggedInUsername =
    currentUser.ownerUsername || currentUser.username || "";

  const restaurantOwnerIdentifier = restaurant.owner || "";

  // Role checks
  const isAdmin = currentUser.role === 'ADMIN';

  // Check if logged-in owner owns this restaurant
  const isSpecificOwner =
    currentUser.role === 'OWNER' &&
    loggedInUsername &&
    loggedInUsername === restaurantOwnerIdentifier;

  // Final permission flag
  const canManage = isAdmin || isSpecificOwner;

  // Convert sentiment score (-1 to 1) → percentage
  const sentimentPercentage =
    ((restaurant.sentiment_score + 1) / 2) * 100;

  // Dynamic sentiment color
  const getSentimentColor = (score) => {
    if (score >= 0.6) return 'text-green-600 bg-green-50';
    if (score >= 0.3) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  // Prevent card navigation when clicking edit
  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(restaurant);
  };

  // Prevent navigation + confirm before delete
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm(`Delete ${restaurant.name}?`)) {
      onDelete(restaurant.slug || restaurant._id);
    }
  };

  return (
    <Link
      to={`/restaurants/${restaurant.slug}`}
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image_url || '/default-restaurant.jpg'}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/default-restaurant.jpg';
          }}
        />

        {/* Sentiment Badge */}
        <div className="absolute top-3 right-3">
          <div
            className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm ${getSentimentColor(
              restaurant.sentiment_score
            )}`}
          >
            {sentimentPercentage.toFixed(0)}%
          </div>
        </div>

        {/* Edit/Delete Actions (Admin or Owner only) */}
        {canManage && (
          <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            
            {/* Edit */}
            <button
              onClick={handleEditClick}
              className="p-2 bg-white/95 hover:bg-white text-gray-700 rounded-lg shadow-md backdrop-blur-sm hover:text-indigo-600 active:scale-90"
              title={isAdmin ? "Admin Edit" : "Edit Your Restaurant"}
            >
              <Pencil className="w-4 h-4" />
            </button>

            {/* Delete */}
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-white/95 hover:bg-white text-gray-700 rounded-lg shadow-md backdrop-blur-sm hover:text-red-600 active:scale-90"
              title={isAdmin ? "Admin Delete" : "Delete Your Restaurant"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Title + Owner */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 capitalize">
            {restaurant.name}
          </h3>

          <div className="flex flex-col items-end">
            
            {/* Owner Name */}
            <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <User className="w-3 h-3 mr-1" />
              {restaurant.ownerName || restaurant.owner || "Partner"}
            </div>

            {/* Admin Label */}
            {isAdmin && (
              <div className="flex items-center text-[9px] text-indigo-500 font-bold uppercase mt-1 bg-indigo-50 px-1.5 py-0.5 rounded">
                <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                Admin View
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          
          {/* Cuisine */}
          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded">
            {restaurant.cuisine_type}
          </span>

          {/* Location */}
          <span className="flex items-center px-2 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded border border-gray-100">
            <MapPin className="w-3 h-3 mr-1" />
            {restaurant.location || "Nearby"}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {restaurant.description}
        </p>

        {/* Footer Stats */}
        <div className="flex items-center justify-between text-sm pt-4 mt-auto">
          <div className="flex items-center space-x-4">
            
            {/* Rating */}
            <div className="flex items-center space-x-1 text-gray-500 font-medium">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>{restaurant.sentiment_score.toFixed(2)}</span>
            </div>

            {/* Reviews */}
            <div className="flex items-center space-x-1 text-gray-400">
              <MessageSquare className="w-4 h-4" />
              <span>{restaurant.review_count || 0} reviews</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}