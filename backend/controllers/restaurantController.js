const Restaurant = require("../models/Restaurants");
const generateSlug = require("../services/slugService");
const cloudinary = require("../config/cloudinary"); 

exports.createRestaurant = async (req, res) => {
  try {
    const { 
      name, cuisine_type, location, description, 
      image_url, about, owner, ownerUsername, ownerName 
    } = req.body;

    let finalImageUrl = image_url;

    // Upload to Cloudinary if image_url exists and looks like a Base64 string
    if (image_url && image_url.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(image_url, {
        folder: "reviewbite/restaurants", // Optional: organizes images in Cloudinary
      });
      finalImageUrl = uploadResponse.secure_url; // Use the Cloudinary HTTPS link
    }

    const slug = generateSlug(name);

    const restaurant = new Restaurant({
      name,
      slug,
      owner: owner || ownerUsername,         
      ownerUsername: ownerUsername || owner, 
      ownerName: ownerName || (ownerUsername || owner),
      cuisine_type, 
      location,
      description, 
      about,      
      image_url: finalImageUrl // 3. Save the actual URL
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const { slug } = req.params;
    let updateData = { ...req.body };

    // 4. If the user is updating the image with a new Base64 string
    if (req.body.image_url && req.body.image_url.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(req.body.image_url, {
        folder: "reviewbite/restaurants",
      });
      updateData.image_url = uploadResponse.secure_url;
    }

    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { slug },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedRestaurant) return res.status(404).json({ message: "Not found" });
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    if (!restaurant) return res.status(404).json({ message: "Not found" });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndDelete({ slug: req.params.slug });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};