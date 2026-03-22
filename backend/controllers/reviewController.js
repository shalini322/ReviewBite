const Review = require("../models/Review");
const Restaurant = require("../models/Restaurants");

const analyzeSentiment = require("../services/sentimentService");
const { updateLeaderboard } = require("../services/leaderboardService");

exports.addReview = async (req, res) => {
  try {
    const { user, reviewText } = req.body; 
    const { slug } = req.params;

    const restaurant = await Restaurant.findOne({ slug });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const sentimentResult = analyzeSentiment(reviewText);

    const review = new Review({
      restaurantId: restaurant._id,
      user: user || "Anonymous",
      // CHANGE THESE TO MATCH FRONTEND EXPECTATIONS:
      reviewText: reviewText,        
      sentimentScore: sentimentResult.score, 
      sentiment: sentimentResult.sentiment
    });

    await review.save();
    await updateLeaderboard(slug, sentimentResult.score);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviews = async (req, res) => {

  try {
    const { slug } = req.params;

    const restaurant = await Restaurant.findOne({ slug });

    if (!restaurant) {  
        return res.status(404).json({ 
          message: "Restaurant not found" 
        }); 
      } 

    const reviews = await Review.find({ restaurantId: restaurant._id });

    res.status(200).json(reviews);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.deleteReview = async (req, res) => {

  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.status(200).json({
      message: "Review deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
