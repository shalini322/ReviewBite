import React, { useEffect, useState } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import AddRestaurantModal from '../components/AddRestaurantModal'; 
import { Loader2, Plus, MapPin } from 'lucide-react';
import axios from 'axios';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwner = user.role === 'OWNER';

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/restaurants');
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      const data = await response.json();
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  // Owner-only delete function
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/restaurants/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRestaurants();
    } catch (error) {
      alert(error.response?.data?.message || "Unauthorized or failed to delete");
    }
  };

  const handleEdit = (restaurant) => {
    if (!isOwner) return;
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    if (!isOwner) return;
    setSelectedRestaurant(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium font-brand">
            Decoding flavors...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-fuchsia-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight font-brand">
              All <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-rose-500">Restaurants</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
              Browse our collection of AI-ranked spots across all locations.
            </p>
          </div>

          {/* Owner-only Add Button */}
          {isOwner && (
            <button 
              onClick={handleAddNew}
              className="group flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-violet-200 dark:hover:shadow-none hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span>Add Restaurant</span>
            </button>
          )}
        </div>

        {/* Restaurants Grid */}
        {restaurants.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <RestaurantCard 
                key={restaurant._id || restaurant.slug}
                restaurant={restaurant} 
                onEdit={isOwner ? handleEdit : null} 
                onDelete={isOwner ? handleDelete : null} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <MapPin className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-6" />
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-6">No restaurants found.</p>
            {isOwner && (
              <button 
                onClick={handleAddNew}
                className="text-violet-600 dark:text-violet-400 font-bold text-lg hover:underline"
              >
                Be the first to list a spot
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isOwner && (
        <AddRestaurantModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setSelectedRestaurant(null); }} 
          onRefresh={fetchRestaurants} 
          editData={selectedRestaurant}
        />
      )}
    </div>
  );
}