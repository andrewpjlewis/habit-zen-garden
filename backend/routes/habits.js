const express = require('express');
const Habit = require('../models/Habit');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// 🔐 Protected route - only logged-in users can add habits
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { name, plantType } = req.body;
    const userId = req.user._id; // Comes from token

    const newHabit = new Habit({ name, plantType, userId });
    await newHabit.save();

    res.status(201).json(newHabit);
  } catch (err) {
    next(err);
  }
});

// Get all habits for the logged-in user
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const habits = await Habit.find({ userId }).lean();
    res.json(habits);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/complete', async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    habit.progress += 1;
    await habit.save();

    res.json(habit);
  } catch (err) {
    next(err);
  }
});

module.exports = router;