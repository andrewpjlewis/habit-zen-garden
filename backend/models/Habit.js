const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plantType: { type: String, required: true },
  frequency: { type: Number, default: 1 }, // times per week
  streak: { type: Number, default: 0 }, // full weeks where user hit goal
  level: { type: Number, default: 0 },
  experience: { type: Number, default: 0 },
  completions: { type: [Date], default: [] }, // timestamps of completions
  lastWeekStart: { type: Date, default: null }, // when we started tracking this week
  createdAt: { type: Date, default: Date.now },
});

habitSchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model('Habit', habitSchema);