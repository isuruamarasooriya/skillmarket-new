const mongoose = require('mongoose');
const Service = require('./Service');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  university: { type: String, required: true }
}, { timestamps: true });

userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    const userId = this._id;
    console.log(`Deleting all gigs for user: ${userId}`);
    await Service.deleteMany({ seller: userId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);