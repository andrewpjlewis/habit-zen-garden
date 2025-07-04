const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /register
router.post('/register', async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      firstname,
      lastname,
      email,
      password
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      userId: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    });
  } catch (err) {
    next(err);
  }
});

router.get('/all', async (req, res, next) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.delete('/email/:email', async (req, res, next) => {
  try {
    const deletedUser = await User.findOneAndDelete({ email: req.params.email });
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /profile - get current user's profile (protected route)
router.get('/profile', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE /profile - delete current user's account (protected route)
router.delete('/profile', verifyToken, async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;