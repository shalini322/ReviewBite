import React, { useState, useEffect } from 'react';
import { X, Upload, MapPin, User as UserIcon, ShieldCheck } from 'lucide-react';

export default function AddRestaurantModal({ isOpen, onClose, onRefresh, editData }) {
  // 1. Get the current logged-in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [formData, setFormData] = useState({
    name: '',
    ownerName: '', 
    cuisine_type: '',
    location: '',
    image_url: '',
    description: '',
    about: ''
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        ownerName: editData.ownerName || '',
        cuisine_type: editData.cuisine_type || '',
        location: editData.location || '',
        image_url: editData.image_url || '',
        description: editData.description || '',
        about: editData.about || ''
      });
      setPreview(editData.image_url);
    } else {
      setFormData({ 
        name: '', 
        ownerName: currentUser.name || '', 
        cuisine_type: '', 
        location: '', 
        image_url: '', 
        description: '', 
        about: '' 
      });
      setPreview(null);
    }
  }, [editData, isOpen, currentUser.name]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ CRITICAL: Map the unique username to 'owner' and 'ownerUsername'
    // This satisfies the MongoDB "Path owner is required" validation.
    const payload = {
      ...formData,
      owner: currentUser.username, 
      ownerUsername: currentUser.username 
    };

    const url = editData 
      ? `http://localhost:5000/api/restaurants/${editData.slug}` 
      : 'http://localhost:5000/api/restaurants';
    
    const method = editData ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onRefresh();
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Validation failed"}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert("Check if your server is running on localhost:5000");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {editData ? 'Edit Restaurant' : 'Register Restaurant'}
            </h2>
            <p className="text-xs text-slate-500">Linked to account: <b>@{currentUser.username}</b></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Restaurant Banner</label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl transition-all ${preview ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-gray-50'}`}>
              {preview ? (
                <div className="text-center w-full">
                  <img src={preview} alt="Preview" className="mx-auto h-32 w-full object-cover rounded-xl shadow-sm" />
                  <button type="button" onClick={() => {setPreview(null); setFormData({...formData, image_url: ''})}} className="mt-2 text-xs text-red-500 font-bold hover:underline">Remove Photo</button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-10 w-10 text-gray-400" />
                  <label className="cursor-pointer text-indigo-600 hover:text-indigo-500 block text-sm font-bold mt-2">
                    <span>Click to Upload</span>
                    <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Unique Username (Read Only - for DB identification) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Owner Identifier (Unique)</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                <input 
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-100 rounded-xl text-gray-500 cursor-not-allowed text-sm font-mono"
                  value={currentUser.username || 'Not Logged In'}
                />
              </div>
            </div>

            {/* Restaurant Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Restaurant Name</label>
              <input 
                required
                disabled={!!editData}
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${editData ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'}`}
                placeholder="e.g. Olive Garden"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cuisine</label>
              <input 
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Italian, Indian..."
                value={formData.cuisine_type}
                onChange={(e) => setFormData({...formData, cuisine_type: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tagline (Short Description)</label>
            <input 
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Catchy tagline for the card"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">About the Restaurant</label>
            <textarea 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
              placeholder="Full story and history..."
              value={formData.about}
              onChange={(e) => setFormData({...formData, about: e.target.value})}
            />
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-xl transition-all active:scale-[0.98]">
              {editData ? 'Update Details' : 'Launch Restaurant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}