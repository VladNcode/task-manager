const base = require('./server');
const Kitten = require('./model/kittenModel');
const User = require('./model/userModel');
const kittenController = require('./controllers/kittenController');
const userController = require('./controllers/userController');

base();

const main = async () => {
  await userController.createUser('Vlad', 28);

  // await kittenController.createKitten('Sunny');
  // const shikaka = await Kitten.findOne({ name: 'Sunny' });
  // shikaka.speak();

  // await kittenController.updateKitten('peter', 'Pryanik');

  // const kittens = await Kitten.find();
  // kittens.forEach(kitten => kitten.speak());
};

main();
