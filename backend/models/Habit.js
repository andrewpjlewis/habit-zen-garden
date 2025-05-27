const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plantType: { type: String, required: true }, // e.g., 'sunflower', 'cactus'
  progress: { type: Number, default: 0 }, // Number of times the habit was completed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Habit', habitSchema);
