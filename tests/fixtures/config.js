const app = require('../../app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const userOne = { name: 'Pikachu', age: '25', email: 'pika@example.com', password: 'test1234' };
const userTwo = { name: 'Bulbasaur', age: '25', email: 'bulba@example.com', password: 'test1234' };

const url = '127.0.0.1:4000';
const port = process.env.PORT || 4000;

let server;
let token;
let tokenTask;
let tokenTaskUserTwo;
let taskId;
let taskTwoId;
let taskThreeId;
let id;

const startServer = () => {
  return (server = app.listen(port, (req, res) => {
    console.log(`Listening at port ${port}`);
    console.log(`Currently in: ${process.env.NODE_ENV}`);
  }));
};

const closeServer = () => {
  return server.close();
};

module.exports = {
  DB,
  userOne,
  userTwo,
  url,
  port,
  server,
  token,
  id,
  startServer,
  closeServer,
  tokenTask,
  tokenTaskUserTwo,
  taskId,
  taskTwoId,
  taskThreeId,
};
