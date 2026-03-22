const User = require('../models/User');
const Owner = require('../models/Owner');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require("../config/cloudinary"); 

// Helper function to create JWT
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d', 
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, phoneNumber, password, profilePic } = req.body;
    
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // CLOUDINARY LOGIC FOR PROFILE PIC
    let finalProfilePic = profilePic || "/default-pfp.png";

    if (profilePic && profilePic.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "reviewbite/users", // Organizes user photos in a separate folder
      });
      finalProfilePic = uploadResponse.secure_url;
    }

    const newUser = new User({ 
      name, 
      phoneNumber, 
      password: hashedPassword, 
      profilePic: finalProfilePic // Use the Cloudinary URL
    });

    await newUser.save();

    const token = createToken(newUser._id, 'USER');

    res.status(201).json({ 
      message: "Foodie registered successfully!",
      token,
      user: { 
        id: newUser._id, 
        name: newUser.name, 
        profilePic: newUser.profilePic, 
        role: 'USER' 
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.registerOwner = async (req, res) => {
  try {
    const { ownerName, ownerUsername, restaurantName, phoneNumber, password } = req.body;

    const existingOwner = await Owner.findOne({ 
      $or: [{ phoneNumber }, { ownerUsername }] 
    });

    if (existingOwner) {
      return res.status(400).json({ 
        message: "Owner with this phone number or username already exists" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = new Owner({ 
      ownerName, 
      ownerUsername, 
      restaurantName, 
      phoneNumber, 
      password: hashedPassword 
    });

    await newOwner.save();

    const token = createToken(newOwner._id, 'OWNER');

    res.status(201).json({ 
      message: "Restaurant registered successfully!",
      token,
      owner: { 
        id: newOwner._id, 
        ownerName: newOwner.ownerName, 
        username: newOwner.ownerUsername, 
        role: 'OWNER' 
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { name, password, adminSecret } = req.body;
    const masterKey = process.env.ADMIN_MASTER_KEY;

    if (adminSecret !== masterKey) {
      return res.status(401).json({ message: "Invalid System Master Key. Access Denied." });
    }

    const existingAdmin = await User.findOne({ name, role: 'ADMIN' });
    if (existingAdmin) return res.status(400).json({ message: "Admin username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      name,
      password: hashedPassword,
      role: 'ADMIN', 
      phoneNumber: `ADMIN_${Date.now()}`
    });

    await newAdmin.save();

    const token = createToken(newAdmin._id, 'ADMIN');

    res.status(201).json({
      message: "Root privileges granted successfully!",
      token,
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        role: 'ADMIN'
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const ADMIN_MASTER_KEY = process.env.ADMIN_MASTER_KEY; 
    const { phoneNumber, name, username, password, role, adminMasterKey } = req.body;

    let query;
    let Model = User; 

    if (role === 'ADMIN') {
      if (adminMasterKey !== ADMIN_MASTER_KEY) {
        return res.status(401).json({ message: "Admin authentication failed" });
      }
      query = { name, role: 'ADMIN' }; 
    } 
    else if (role === 'OWNER') {
      Model = Owner;
      query = { 
        ownerUsername: username || req.body.ownerUsername, 
        phoneNumber: phoneNumber 
      };
    }
    else {
      query = { name, role: 'USER' }; 
    }

    const account = await Model.findOne(query);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(account._id, role);

    res.status(200).json({ 
      message: "Login successful", 
      token,
      account: {
        id: account._id,
        name: role === 'OWNER' ? account.ownerName : account.name,
        role: role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};