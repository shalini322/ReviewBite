const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  user: { type: String, required: true },
  reviewText: { type: String, required: true }, // Ensure this matches frontend 'rev.reviewText'
  sentimentScore: { type: Number },             // Ensure this matches frontend 'rev.sentimentScore'
  sentiment: { type: String, enum: ["positive", "negative", "neutral"] }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);