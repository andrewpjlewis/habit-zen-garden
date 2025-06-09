const express = require('express');
const Habit = require('../models/Habit');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// 🔐 Protected route - only logged-in users can add habits
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { name, plantType, frequency } = req.body;
    const userId = req.user._id;

    const parsedFrequency = parseInt(frequency, 10);
    if (!name || !plantType || isNaN(parsedFrequency)) {
      return res.status(400).json({ message: 'Missing or invalid required fields' });
    }

    const newHabit = new Habit({ 
      name, 
      plantType, 
      frequency: parsedFrequency, 
      userId 
    });

    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    next(err);
  }
});

// ✅ Get all habits for the logged-in user
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const habits = await Habit.find({ userId }).lean();
    res.json(habits);
  } catch (err) {
    next(err);
  }
});

// ✅ Get a single habit by ID for the logged-in user
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id }).lean();
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.json(habit);
  } catch (err) {
    next(err);
  }
});

// ✅ Mark a habit as complete (increment progress)
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

router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.status(200).json({ message: 'Habit deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
