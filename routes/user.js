const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Create user endpoint
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET);
    res.status(201).json({ user, accessToken });
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

// Get user by Id endpoint (requires authentication)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
      res.status(404).json({ message: 'User not found' });
  }
});

// Update user endpoint
router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user by Id endpoint
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(404).json({ message: 'User not found' });
  }
});

// Get all users endpoint
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all male users endpoint (requires authentication)
router.get('/male', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({ gender: 'Male' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;
