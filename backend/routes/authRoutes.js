const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Number of salt rounds for bcrypt hashing
const SALT_ROUNDS = 10;

router.post('/register', async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,  // store hashed password
    });

    await newUser.save();

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare plain password with hashed password stored
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful', userId: user._id });
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

module.exports = router;
