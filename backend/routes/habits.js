const express = require('express');
const Habit = require('../models/Habit');
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, plantType } = req.body;
    const userId = req.user._id;

    const newHabit = new Habit({ name, plantType, userId });
    await newHabit.save();

    res.status(201).json(newHabit);
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