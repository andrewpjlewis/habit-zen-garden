const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },  // added first name
  lastname: { type: String, required: true },   // added last name
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true }); // adds createdAt and updatedAt automatically

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);