const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name!'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email address!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
    trim: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A user must have an password!'],
    minLength: [8, 'A password must have more or equal than 8 characters.'],
  },
  passwordConfirmation: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      // This only works on .CREATE and .SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match!',
    },
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password is modified or updated!
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirmation field as we don't need this in the DB
  this.passwordConfirmation = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
