// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Shop = require('../models/Shop');

// 🟢 Sign Up
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { username, password, role, shopName } = req.body;
  console.log('POST /auth/signup - request body:', req.body); // Debug log

  try {
    // Only block if same username, password, role, and shop already exists
    const existing = await User.findOne({ username, password, role, shop: shopName });
    console.log('POST /auth/signup - existing user check:', existing); // Debug log
    if (existing) {
      return res.status(400).json({
        message: `User already exists for this shop with these credentials.`,
      });
    }

    // Save shop name directly
    const newUser = new User({ username, password, role, shop: shopName });
    await newUser.save();
    console.log('POST /auth/signup - user created successfully'); // Debug log

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// routes/authRoutes.js
router.post('/login', async (req, res) => {
  const { username, password, role, shopName } = req.body;
  console.log('POST /auth/login - request body:', req.body); // Debug log

  try {
    // Check all 4 fields
    const user = await User.findOne({ username, password, role, shop: shopName });
    console.log('POST /auth/login - user found:', user); // Debug log

    if (user) {
      res.json({ role: user.role }); // success
    } else {
      res.status(401).json({ message: 'Invalid credentials, role, or shop' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
