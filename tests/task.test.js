require('dotenv').config({ path: './test.env' });
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Task = require('../models/taskModel');
let {
  DB,
  userOne,
  userTwo,
  tokenTask,
  tokenTaskUserTwo,
  taskId,
  taskTwoId,
  taskThreeId,
} = require('./fixtures/config');

//* Connect to the database
beforeAll(async () => {
  process.env.NODE_ENV = 'development';

  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await mongoose.connection.db.dropDatabase();

  await User.create(userOne);
  await User.create(userTwo);

  const userone = await request(app)
    .post('/api/v1/users/login')
    .send({ email: 'pika@example.com', password: 'test1234' });

  const usertwo = await request(app)
    .post('/api/v1/users/login')
    .send({ email: 'bulba@example.com', password: 'test1234' });

  tokenTask = userone.body.token;
  tokenTaskUserTwo = usertwo.body.token;
});

beforeEach(async () => {
  const taskone = await request(app)
    .post('/api/v1/tasks/')
    .send({ description: 'BURGIR', completed: true })
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(201);

  const tasktwo = await request(app)
    .post('/api/v1/tasks/')
    .send({ description: 'BURGIR TWO', completed: true })
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(201);

  const taskthree = await request(app)
    .post('/api/v1/tasks/')
    .send({ description: 'BURGIR THREE', completed: false })
    .set('Authorization', 'Bearer ' + tokenTaskUserTwo)
    .expect(201);

  taskId = taskone.body.data.task._id;
  taskTwoId = tasktwo.body.data.task._id;
  taskThreeId = taskthree.body.data.task._id;
});

afterEach(async () => {
  await Task.deleteMany({ description: { $ne: true } });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

test('Should be able to create new task', async () => {
  const res = await request(app)
    .post('/api/v1/tasks/')
    .send({ description: 'BURGIR BURGIR', completed: false })
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(201);

  const task = await Task.findById(res.body.data.task._id);
  expect(task.description).toEqual('BURGIR BURGIR');
});

test('Should not be able to create new task without description', async () => {
  await request(app)
    .post('/api/v1/tasks/')
    .send({ completed: false })
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(400);
});

test('Should be able to get all (currently two created) userOne tasks', async () => {
  const res = await request(app)
    .get('/api/v1/tasks/')
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(200);

  expect(res.body.data.tasks.length).toEqual(2);
});

test('Should be able to get all user tasks', async () => {
  await request(app)
    .get('/api/v1/tasks/')
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(200);
});

test('Should be able to get task', async () => {
  await request(app)
    .get('/api/v1/tasks/' + taskId)
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(200);

  const task = await Task.findById(taskId);
  expect(task.description).toEqual('BURGIR');
});

test('Should not be able to get other users tasks', async () => {
  await request(app)
    .get('/api/v1/tasks/' + taskId)
    .set('Authorization', 'Bearer ' + tokenTaskUserTwo)
    .expect(400);
});

test('Should not be able to get task if not authenticated', async () => {
  await request(app)
    .get('/api/v1/tasks/' + taskId)
    .expect(401);
});

test('Should be able to update task', async () => {
  await request(app)
    .patch('/api/v1/tasks/' + taskId)
    .send({ completed: false })
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(200);

  const task = await Task.findById(taskId);
  expect(task.completed).toEqual(false);
});

test('Should not be able to update other user task', async () => {
  await request(app)
    .patch('/api/v1/tasks/' + taskId)
    .send({ completed: false })
    .set('Authorization', 'Bearer ' + tokenTaskUserTwo)
    .expect(401);

  const task = await Task.findById(taskId);
  expect(task.completed).toEqual(true);
});

test('Should be able to delete task', async () => {
  await request(app)
    .delete('/api/v1/tasks/' + taskId)
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(200);

  const task = await Task.findById(taskId);
  expect(task).toBeFalsy();
});

test('Should not be able to delete task if not authenticated', async () => {
  await request(app)
    .delete('/api/v1/tasks/' + taskId)
    .expect(401);

  const task = await Task.findById(taskId);
  expect(task.description).toEqual('BURGIR');
});

test('Should be able to visit main page', async () => {
  await request(app).get('/').expect(200);
});

test('Second user should not be able to delete a task created by first user', async () => {
  await request(app)
    .delete('/api/v1/tasks/' + taskId)
    .set('Authorization', 'Bearer ' + tokenTaskUserTwo)
    .expect(401);

  const task = await Task.findById(taskId);
  expect(task.description).toEqual('BURGIR');
});

test('Should fetch only completed tasks', async () => {
  const res = await request(app)
    .get('/api/v1/tasks?completed=false')
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(200);

  expect(res.body.data.tasks.length).toEqual(0);
});

test('Should fetch only incomplete tasks', async () => {
  const res = await request(app)
    .get('/api/v1/tasks?completed=true')
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(200);

  expect(res.body.data.tasks.length).toEqual(2);
});

test('Should sort by createdAt', async () => {
  const res = await request(app)
    .get('/api/v1/tasks?sort=createdAt')
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(200);

  expect(res.body.data.tasks[0].description).toEqual('BURGIR');
});

test('Should be able to select fields', async () => {
  const res = await request(app)
    .get('/api/v1/tasks?select=completed,description,-_id,-owner')
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(200);

  expect(res.body.data.tasks[0]).toEqual({ description: 'BURGIR TWO', completed: true });
});
