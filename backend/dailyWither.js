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
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let updated = 0;

    for (let habit of habits) {
      const completedYesterday = habit.completions?.some(
        (date) => new Date(date).toDateString() === yesterdayStr
      );

      // If NOT completed yesterday and wither level is below the limit
      if (!completedYesterday && (habit.witherLevel ?? 0) < 3) {
        habit.witherLevel = (habit.witherLevel ?? 0) + 1;
        await habit.save();
        updated++;
        console.log(`🌿 "${habit.name}" withered to level ${habit.witherLevel}`);
      } else if (completedYesterday) {
        console.log(`✅ "${habit.name}" was completed yesterday`);
      } else {
        console.log(`⚠️ "${habit.name}" already at max wither level`);
      }
    }

    console.log(`🌱 Withered ${updated} habit(s) due to inactivity yesterday.`);
  } catch (err) {
    console.error('❌ Error in witherHabitsDaily:', err);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

witherHabitsDaily();