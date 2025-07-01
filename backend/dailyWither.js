require('dotenv').config();
const mongoose = require('mongoose');
const Habit = require('./models/Habit'); // adjust path as needed

async function witherHabitsDaily() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const todayStr = new Date().toDateString();
    const habits = await Habit.find({});

    for (let habit of habits) {
      const completedToday = habit.completions?.some(
        (date) => new Date(date).toDateString() === todayStr
      );

      if (!completedToday && habit.witherLevel < 3) {
        habit.witherLevel += 1;
        await habit.save();
        console.log(`Withered "${habit.name}" to level ${habit.witherLevel}`);
      }
    }

    console.log('✅ Wither check complete.');
  } catch (err) {
    console.error('❌ Error during withering:', err);
  } finally {
    mongoose.disconnect();
  }
}

witherHabitsDaily();