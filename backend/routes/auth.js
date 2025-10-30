const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ValidationMiddleware = require('../middleware/validation');

/**
 * Auth Routes
 * Handles user authentication
 */

// POST /api/auth/register - Register new user
router.post('/register', 
  ValidationMiddleware.validateEmail,
  ValidationMiddleware.validatePassword,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user (password will be hashed by pre-save hook)
      const user = new User({ email, password });
      await user.save();

      // Set session
      req.session.userId = user._id;

      // Return user without password
      res.status(201).json({
        message: 'User registered successfully',
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        message: 'Registration failed', 
        error: error.message 
      });
    }
});

// POST /api/auth/login - Login user
router.post('/login',
  ValidationMiddleware.validateEmail,
  ValidationMiddleware.validatePassword,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Set session
      req.session.userId = user._id;

      res.json({
        message: 'Login successful',
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        message: 'Login failed', 
        error: error.message 
      });
    }
});

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

// GET /api/auth/me - Get current user
router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ 
        message: 'Not authenticated',
        authenticated: false
      });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      authenticated: true,
      user: user.toJSON() 
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;