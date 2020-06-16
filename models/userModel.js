const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User must has a name'],
  },
  email: {
    type: String,
    required: [true, 'A User must has a email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'A User must has a password'],
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Confirm Password Does NOT match with Password',
    },
  },
  image: {
    type: String,
    default: 'avatar.png',
  },
  bio: {
    type: String,
    required: [true, 'A User must has a Bio'],
    minlength: [30, 'A Bio must NOT be less than 30 characters long'],
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  activated: {
    type: Boolean,
    default: false,
  },
  activationLink: {
    type: String,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 11);

  this.passwordConfirm = undefined;
  this.email = this.email.toLowerCase();
  next();
});

// No need to send  __v as response
userSchema.pre(/^find/, function (next) {
  // this - is query
  this.select('-__v');
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  const result = await bcrypt.compare(candidatePassword, userPassword);
  return result;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  console.log(resetToken);

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createAccountActivationLink = function () {
  const activationToken = crypto.randomBytes(32).toString('hex');

  // console.log(activationToken);

  this.activationLink = crypto
    .createHash('sha256')
    .update(activationToken)
    .digest('hex');

  // console.log({ activationToken }, this.activationLink);

  return activationToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
