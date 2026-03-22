const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");

router.post("/restaurants/:slug/reviews", reviewController.addReview);
router.get("/restaurants/:slug/reviews", reviewController.getReviews);
router.delete("/restaurants/:slug/reviews/:id", reviewController.deleteReview);

module.exports = router;