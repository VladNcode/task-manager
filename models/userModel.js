const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');

const SALT_WORK_FACTOR = 12;

// console.log(new ObjectId());
// console.log(mongoose.Types.ObjectId());

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: mongoose.Types.ObjectId(),
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'A user must have a name!'],
  },
  age: {
    type: Number,
    // required: [true, 'A user must have an age!'],
    default: 1,
    min: [1, 'User age must be between 1 and 130'],
    max: [130, 'User age must be between 1 and 130'],
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number!');
      }
    },
  },
  email: {
    type: String,
    required: [true, 'A user must have an email address!'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'A user must have a password!'],
    trim: true,
    minLength: [7, 'Password must be at least 7 characters long'],
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain "password"!');
      }
    },
    select: false,
  },
  tokens: [
    {
      token: {
        type: String,
        required: [true, 'A user must have a token'],
      },
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findOrCreate = async function findOrCreate(profile) {
  try {
    let user = await User.findById(profile.id);
    if (!user) {
      user = await User.create({
        _id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        password: process.env.GOOGLE_SECRET_DEFAULT_PASSWORD,
      });
    }
    await user.generateAuthToken();
    return user;
  } catch (err) {
    return err;
  }
};

// Password encryption
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    // this.passwordConfirm = undefined;
    return next();
  } catch (err) {
    return next(err);
  }
});

// Pass validation
userSchema.methods.validatePassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
