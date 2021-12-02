require('dotenv').config({ path: './test.env' });
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Task = require('../models/taskModel');
let { DB, userOne, tokenTask, taskId } = require('./fixtures/config');

//* Connect to the database
beforeAll(async () => {
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connect(DB);

  await mongoose.connection.db.dropDatabase();
  await User.create(userOne);

  const res = await request(app)
    .post('/api/v1/users/login')
    .send({ email: 'pika@example.com', password: 'test1234' });

  tokenTask = res.body.token;
});

beforeEach(async () => {
  const res2 = await request(app)
    .post('/api/v1/tasks/')
    .send({ description: 'BURGIR', completed: true })
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(201);

  taskId = res2.body.data.task._id;
});

afterEach(async () => {
  await Task.deleteOne({ _id: taskId });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

test('Should be able to get all user tasks', async () => {
  await request(app)
    .get('/api/v1/tasks/')
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(200);
});

test('Should be able to create new task', async () => {
  await request(app)
    .post('/api/v1/tasks/')
    .send({ description: 'BURGIR BURGIR', completed: true })
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(201);
});

test('Should be able to get task', async () => {
  await request(app)
    .get('/api/v1/tasks/' + taskId)
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(200);
});

test('Should be able to update task', async () => {
  await request(app)
    .patch('/api/v1/tasks/' + taskId)
    .send({ completed: false })
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(200);
});

test('Should be able to delete task', async () => {
  await request(app)
    .delete('/api/v1/tasks/' + taskId)
    .set('Authorization', 'Bearer ' + tokenTask)
    .expect(200);
});

test('Should be able to visit main page', async () => {
  await request(app).get('/').expect(200);
});
