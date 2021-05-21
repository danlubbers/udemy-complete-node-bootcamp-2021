const crypto = require('crypto');
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
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'A user must have an password!'],
    minLength: [8, 'A password must have more or equal than 8 characters.'],
    select: false, // this hides the password from db requests like Postman
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
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

userSchema.pre('save', function (next) {
  if (!this.isModified('password' || this.isNew)) return next();

  this.passwordChangedAt = Date.now() - 1000; // We subtract 1sec from the present time to ensure token is created after the password has been changed
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to current query
  this.find({ active: { $ne: false } }); // find only documents with active not set to false
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword, // not hashed pw
  userPassword // hashed pw
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(
    //   'Time Difference in milliseconds',
    //   changedTimestamp,
    //   JWTTimestamp
    // );
    return JWTTimestamp < changedTimestamp;
  }

  // False means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // resets in 10 min

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
