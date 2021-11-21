const base = require('./server');
const Kitten = require('./model/kittenModel');
const User = require('./model/userModel');
const Task = require('./model/taskModel');
const kittenController = require('./controllers/kittenController');
const userController = require('./controllers/userController');
const taskController = require('./controllers/taskController');

base();

const main = async () => {
  await userController.createUser('DimaAAAAA', 22, 'hii@lol.com', 'PaSsWoRD');
  // await taskController.createTask('Get rid of the trash');
  // await kittenController.createKitten('Sunny');
  // const shikaka = await Kitten.findOne({ name: 'Sunny' });
  // shikaka.speak();
  // await kittenController.updateKitten('peter', 'Pryanik');
  // const kittens = await Kitten.find();
  // kittens.forEach(kitten => kitten.speak());
};

main().catch(e => console.log(e.message));
