router.post('/', async (req, res) => {
  const { name, plantType } = req.body;
  const userId = req.user._id;

  try {
    const newHabit = new Habit({ name, plantType, userId });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create habit' });
  }
});

router.patch('/:id/complete', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    habit.progress += 1;
    await habit.save();

    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update habit progress' });
  }
});