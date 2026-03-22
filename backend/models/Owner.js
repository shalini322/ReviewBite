const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  ownerUsername: { type: String, required: true, unique: true },
  restaurantName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "OWNER" }
}, { timestamps: true });

module.exports = mongoose.model('Owner', ownerSchema);