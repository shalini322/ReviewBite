const express = require("express");
const router = express.Router();

const restaurantController = require("../controllers/restaurantController");

router.post("/restaurants", restaurantController.createRestaurant);
router.get("/restaurants/:slug", restaurantController.getRestaurant);
router.get("/restaurants", restaurantController.getAllRestaurants);
router.delete("/restaurants/:slug", restaurantController.deleteRestaurant);
router.put("/restaurants/:slug", restaurantController.updateRestaurant);

module.exports = router;