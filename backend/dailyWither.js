const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Habit = require('./models/Habit');

// Load env vars from .env if running locally
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'your fallback URI here';

async function witherHabitsDaily() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const habits = await Habit.find({});
    const todayStr = new Date().toDateString();

    let updated = 0;

    for (let habit of habits) {
      const completedToday = habit.completions?.some(
        (date) => new Date(date).toDateString() === todayStr
      );

      if (!completedToday && (habit.witherLevel ?? 0) < 3) {
        habit.witherLevel = (habit.witherLevel ?? 0) + 1;
        await habit.save();
        updated++;
      }
    }

    console.log(`🌿 Withered ${updated} habit(s)`);
  } catch (err) {
    console.error('❌ Error in witherHabitsDaily:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

witherHabitsDaily();