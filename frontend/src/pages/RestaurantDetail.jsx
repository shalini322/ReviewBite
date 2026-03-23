import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import { MapPin, ThumbsUp } from 'lucide-react';
import { buildApiUrl } from '../config/api';

export default function RestaurantDetail() {
  const { slug } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch restaurant data by slug
  const fetchRestaurantData = async () => {
    try {
      const response = await fetch(buildApiUrl(`/api/restaurants/${slug}`));
      const data = await response.json();
      setRestaurant(data);
    } catch (err) {
      console.error("Error fetching restaurant:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, [slug]);

  if (loading) return <div className="p-20 text-center text-gray-500">Loading restaurant details...</div>;
  if (!restaurant) return <div className="p-20 text-center text-red-500">Restaurant not found.</div>;

  // Calculate percentage of positive reviews
  const positivePercentage = restaurant.reviews?.length
    ? Math.round((restaurant.reviews.filter(r => r.sentimentScore > 0).length / restaurant.reviews.length) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Restaurant Info */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <img
            src={restaurant.image_url || '/default-restaurant.jpg'}
            className="w-full h-80 object-cover"
            alt={restaurant.name}
            onError={(e) => { e.target.src = '/default-restaurant.jpg'; }}
          />
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 capitalize">{restaurant.name}</h1>

            {/* Tags: Cuisine, Location, Positive Feedback */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold">
                {restaurant.cuisine_type}
              </span>

              <div className="flex items-center bg-gray-50 text-gray-600 px-4 py-1.5 rounded-full text-sm font-medium border border-gray-100">
                <MapPin className="w-4 h-4 mr-1.5 text-indigo-500" />
                {restaurant.location || "Nearby"}
              </div>

              <div className="flex items-center bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold border border-emerald-100">
                <ThumbsUp className="w-4 h-4 mr-1.5" />
                {positivePercentage}% Positive Feedback
              </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* About Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">About this Restaurant</h3>
              <div className="about-text text-gray-700 leading-relaxed text-lg">
                {restaurant.about}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Review Form */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            <ReviewForm
              restaurantSlug={slug}
              onReviewSubmitted={fetchRestaurantData}
            />
          </div>
          <p className="mt-4 text-center text-xs text-gray-400 px-4">
            Your review will be processed using AI sentiment analysis to update the restaurant's ranking.
          </p>
        </div>
      </div>
    </div>
  );
}