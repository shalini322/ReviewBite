const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "/default-pfp.png" }, 
  role: { type: String, default: "USER" }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);