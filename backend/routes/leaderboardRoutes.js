const express = require("express");
const router = express.Router();
// Import the whole controller object
const leaderboardController = require("../controllers/leaderboardController");

// Use the dot notation to ensure fetchLeaderboard is a valid function
router.get("/", leaderboardController.fetchLeaderboard);

module.exports = router;