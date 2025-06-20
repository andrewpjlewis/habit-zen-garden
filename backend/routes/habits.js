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
      userId,
      lastLoggedDate: null,
      streak: 0,
      progress: 0,
      level: 0,
      completions: [],
      lastWeekStart: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())) // Sunday of current week
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

// ✅ Mark a habit as complete with weekly frequency logic and decay stages
router.patch('/:id/complete', verifyToken, async (req, res, next) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    const today = new Date();
    const todayStr = today.toDateString();

    // Calculate start of current week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setHours(0,0,0,0);
    startOfWeek.setDate(today.getDate() - today.getDay());

    // Check if we moved to a new week and apply decay based on last week's completions
    if (habit.lastWeekStart && new Date(habit.lastWeekStart) < startOfWeek) {
      const completionsLastWeek = habit.completions.length;
      const frequency = habit.frequency || 1;

      if (completionsLastWeek >= frequency) {
        // 1. No decay: user met or exceeded weekly goal
        habit.streak += 1;
        habit.level += 1;
        habit.progress = 100;
      } else if (completionsLastWeek > 0 && completionsLastWeek < frequency) {
        // 2. Mild decay: partial completions last week
        habit.streak = Math.max(habit.streak - 1, 0);
        habit.progress = Math.max(habit.progress - 20, 0);  // decrease progress by 20%
      } else {
        // 3. Severe decay: no completions last week
        habit.streak = 0;
        habit.level = Math.max(habit.level - 1, 0);          // drop level by 1 but never below 0
        habit.progress = 0;
      }

      // Reset completions array and update lastWeekStart to current week start
      habit.completions = [];
      habit.lastWeekStart = startOfWeek;
    }

    // Prevent double-logging for today
    const alreadyLoggedToday = habit.completions.some(
      (date) => new Date(date).toDateString() === todayStr
    );
    if (alreadyLoggedToday) {
      return res.status(400).json({ message: 'Habit already logged today' });
    }

    // Log today's completion
    habit.completions.push(today);

    // Update progress for current week
    const completedThisWeek = habit.completions.length;
    habit.progress = Math.min((completedThisWeek / habit.frequency) * 100, 100);

    await habit.save();
    res.json(habit);
  } catch (err) {
    next(err);
  }
});

// Delete a habit
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
