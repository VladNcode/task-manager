const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
});

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

userSchema.statics.findOrCreate = function findOrCreate(profile, cb) {
  const userObj = new this();
  this.findOne({ _id: profile.id }, function (err, result) {
    if (!result) {
      userObj._id = profile.id;
      userObj.name = profile.displayName;
      userObj.email = profile.emails[0].value;
      userObj.password = process.env.GOOGLE_SECRET_DEFAULT_PASSWORD;
      //....
      userObj.save(cb);
    } else {
      cb(err, result);
    }
  });
};

// Pass validation
userSchema.methods.validatePassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
