const leaderboardService = require("../services/leaderboardService");

// This name must match exactly what the Router expects
exports.fetchLeaderboard = async (req, res) => {
  try {
    const data = await leaderboardService.getLeaderboard();
    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};