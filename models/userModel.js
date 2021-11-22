const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const validator = require('validator');

// console.log(new ObjectId());

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: new ObjectId(),
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

userSchema.statics.findOrCreate = function findOrCreate(profile, cb) {
  const userObj = new this();
  this.findOne({ _id: profile.id }, function (err, result) {
    if (!result) {
      userObj._id = profile.id;
      userObj.name = profile.displayName;
      userObj.email = profile.emails[0].value;
      userObj.password = 'defaultGooglePass';
      //....
      userObj.save(cb);
    } else {
      cb(err, result);
    }
  });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
