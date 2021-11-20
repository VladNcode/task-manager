const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name!'],
  },
  age: {
    type: Number,
    required: [true, 'A user must have an age!'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
