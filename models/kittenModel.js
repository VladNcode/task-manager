const mongoose = require('mongoose');

const kittySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A kitten must have a name!'],
    unique: true,
  },
});

kittySchema.methods.speak = function speak() {
  const greeting = this.name === 'Shikaka' ? 'Dimka milashka <3' : 'Meow name is ' + this.name;
  console.log(greeting);
};

const Kitten = mongoose.model('Kitten', kittySchema);
module.exports = Kitten;
