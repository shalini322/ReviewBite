import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Leaderboard from './pages/Leaderboard';
import UserAuth from './components/UserAuth';
import OwnerAuth from './components/OwnerAuth';
import AdminAuth from './components/AdminAuth';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:slug" element={<RestaurantDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/auth/user" element={<UserAuth />} />
          <Route path="/auth/owner" element={<OwnerAuth />} />
          <Route path="/auth/admin" element={<AdminAuth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;