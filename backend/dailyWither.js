const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Habit = require('./models/Habit');

// Load env vars from .env if running locally
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'your fallback URI here';

// Helper function to safely compare dates (ignoring time)
const isSameDate = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

// Main function to apply withering to habits not completed yesterday
async function witherHabitsDaily() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const habits = await Habit.find({});
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let updated = 0;

    for (let habit of habits) {
      console.log(`🌱 Checking habit: "${habit.name}"`);
      console.log(`   Current witheredLevel: ${habit.witheredLevel}`);
      console.log(`   Completions: ${habit.completions.map(d => new Date(d).toISOString())}`);

      const completedYesterday = habit.completions?.some(date =>
        isSameDate(new Date(date), yesterday)
      );

      if (!completedYesterday && (habit.witheredLevel ?? 0) < 3) {
        habit.witheredLevel = (habit.witheredLevel ?? 0) + 1;
        const saved = await habit.save();
        updated++;
        console.log(`🌿 "${habit.name}" withered to level ${saved.witheredLevel}`);
      } else if (completedYesterday) {
        console.log(`✅ "${habit.name}" was completed yesterday`);
      } else {
        console.log(`⚠️ "${habit.name}" is already at max witheredLevel`);
      }
    }

    console.log(`🌾 Total habits withered: ${updated}`);
  } catch (err) {
    console.error('❌ Error in witherHabitsDaily:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

witherHabitsDaily();
