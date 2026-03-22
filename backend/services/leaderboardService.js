const redisClient = require("../config/redis");
const Restaurant = require("../models/Restaurants");
const LEADERBOARD = "restaurant_leaderboard";

const updateLeaderboard = async (slug, newReviewScore) => {
  const restaurant = await Restaurant.findOne({ slug });
  
  if (restaurant) {
    const currentCount = restaurant.review_count || 0;
    const currentScore = restaurant.sentiment_score || 5.5; // Default to neutral 5.5

    const newCount = currentCount + 1;
    const newAverage = ((currentScore * currentCount) + newReviewScore) / newCount;
    
    // Save to MongoDB
    restaurant.sentiment_score = parseFloat(newAverage.toFixed(2));
    restaurant.review_count = newCount;
    await restaurant.save();

    // ✅ Sync to Redis (Member: Name/Slug, Score: 1-10 value)
    await redisClient.zAdd(LEADERBOARD, {
      score: restaurant.sentiment_score,
      value: restaurant.name 
    });
  }
};

async function getLeaderboard() {
  const result = await redisClient.zRangeWithScores(LEADERBOARD, 0, 9, { REV: true });
  return result.map(entry => ({
    name: entry.value,
    score: parseFloat(entry.score).toFixed(1)
  }));
}

module.exports = { updateLeaderboard, getLeaderboard };