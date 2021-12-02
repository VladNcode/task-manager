const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const userOne = { name: 'Pikachu', age: '25', email: 'pika@example.com', password: 'test1234' };
const userTwo = { name: 'Bulbasaur', age: '25', email: 'bulba@example.com', password: 'test1234' };

let server;
let token;
let tokenTask;
let tokenTaskUserTwo;
let taskId;
let taskTwoId;
let taskThreeId;
let id;

module.exports = {
  DB,
  userOne,
  userTwo,
  server,
  token,
  id,
  tokenTask,
  tokenTaskUserTwo,
  taskId,
  taskTwoId,
  taskThreeId,
};
