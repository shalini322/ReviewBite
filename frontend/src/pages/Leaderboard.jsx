import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Trophy, TrendingUp, Medal } from 'lucide-react';

export default function Leaderboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/restaurants');
      const data = await response.json();
      // Sort restaurants by sentiment score descending
      setRestaurants(data.sort((a, b) => b.sentiment_score - a.sentiment_score) || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Icons for top ranks
  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-300" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
    return null;
  };

  // Badge colors for ranks
  const getRankBadge = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-400';
    if (index === 2) return 'bg-gradient-to-r from-amber-500 to-amber-700';
    return 'bg-gradient-to-r from-gray-600 to-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-6 shadow-xl">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Restaurant Leaderboard</h1>
          <p className="text-xl text-gray-300">
            Real-time rankings powered by AI sentiment analysis
          </p>
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Top Restaurants</h2>
            </div>
          </div>

          <div className="divide-y divide-gray-700">
            {restaurants.map((restaurant, index) => {
              const rating = restaurant.sentiment_score || 0;
              const percentage = Math.min((rating / 10) * 100, 100); // Convert score to percentage

              return (
                <Link
                  key={restaurant._id || restaurant.slug}
                  to={`/restaurants/${restaurant.slug}`}
                  className="block hover:bg-gray-750 transition-colors"
                >
                  <div className="px-8 py-6 flex items-center space-x-6">
                    {/* Rank badge */}
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${getRankBadge(index)} flex items-center justify-center font-bold text-white text-xl shadow-lg`}>
                      {getRankIcon(index) || `#${index + 1}`}
                    </div>

                    {/* Restaurant image */}
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-600">
                      <img
                        src={restaurant.image_url}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name & cuisine */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white mb-1">{restaurant.name}</h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-indigo-400 font-medium">{restaurant.cuisine_type}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-400">{restaurant.review_count || 0} reviews</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-3xl font-bold text-white mb-1">
                        {rating.toFixed(1)}<span className="text-lg text-gray-400">/10</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {percentage.toFixed(0)}% Satisfaction
                      </div>
                    </div>

                    {/* Rating progress bar */}
                    <div className="hidden sm:block flex-shrink-0 w-24">
                      <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}