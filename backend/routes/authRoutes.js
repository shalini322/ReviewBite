const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  registerOwner, 
  registerAdmin, 
  login 
} = require('../controllers/authController');

// Standard User & Owner Routes
router.post('/signup/user', registerUser);
router.post('/signup/owner', registerOwner);

// ✅ Admin Specific Route
// This points to the registerAdmin function we added to the controller
router.post('/signup/admin', registerAdmin); 

// ✅ Unified Login Route
// This one function handles User, Owner, and Admin based on the 'role' in req.body
router.post('/login', login);

module.exports = router;