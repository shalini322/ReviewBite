const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  // ✅ FIX: Changed from ObjectId to String to support storing usernames
  owner: { 
    type: String, 
    required: true 
  },
  ownerUsername: {
    type: String,
    required: true
  },
  ownerName: String,
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true 
  },
  cuisine_type: { 
    type: String,
    required: true
  },
  location: { 
    type: String, 
    required: true,
    default: "Not Specified"
  },
  about: {
    type: String,
    required: true
  },
  description: { 
    type: String,
    required: true
  },
  image_url: { 
    type: String,
    default: "/default-restaurant.jpg"
  },
  sentiment_score: { 
    type: Number,
    default: 0
  },
  review_count: { 
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);