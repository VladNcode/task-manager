require('dotenv').config({ path: './test.env' });
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
let {
  DB,
  userOne,
  userTwo,
  url,
  token,
  id,
  startServer,
  closeServer,
} = require('./fixtures/config');

jest.mock('../utils/email');

//* Connect to the server and  database
beforeAll(async () => {
  startServer();

  process.env.NODE_ENV = 'development';

  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connect(DB);

  await mongoose.connection.db.dropDatabase();
});

beforeEach(async () => {
  await User.create(userOne);

  const res = await request(app)
    .post('/api/v1/users/login')
    .send({ email: 'pika@example.com', password: 'test1234' });
  token = res.body.token;
  id = res.body.data.user._id;
});

afterEach(async () => {
  await User.deleteOne({ _id: id });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();

  closeServer();
});

test('Should not be able to login with wrong credentials', async () => {
  await request(url)
    .post('/api/v1/users/login/')
    .send({ email: 'test@example.com', password: 'test12345' })
    .expect(401);
});

test('Should be able to signup a new user', async () => {
  const res = await request(app).post('/api/v1/users/').send(userTwo).expect(201);
  const user = await User.findOne({ email: 'bulba@example.com' });

  // Checking if user is in DB
  expect(user).not.toBeNull();

  // Checking if password is hashed
  expect(user.password).not.toBe('test1234');

  // Checking if req contains correct info
  expect(res.body.data.user).toMatchObject({
    name: 'Bulbasaur',
    age: 25,
    email: 'bulba@example.com',
  });
});

test('Should be able to login and token must be correct', async () => {
  const res = await request(app)
    .post('/api/v1/users/login')
    .send({ email: 'pika@example.com', password: 'test1234' })
    .expect(200);

  let token2 = res.body.token;

  const decoded = await promisify(jwt.verify)(token2, process.env.JWT_SECRET);
  expect(decoded.id).toEqual(res.body.data.user._id);
});

test('Should be able to get /me page', async () => {
  await request(app)
    .get('/api/v1/users/me')
    .set('Authorization', 'Bearer ' + token)
    .expect(200);
});

test('Should not be able to get /me page while unauthenticated', async () => {
  await request(url).get('/api/v1/users/me').expect(401);
});

test('Should be able to get all users', async () => {
  await request(app)
    .get('/api/v1/users/')
    .set('Authorization', 'Bearer ' + token)
    .expect(200);
});

test('Should be able to get one user', async () => {
  await request(app)
    .get('/api/v1/users/' + id)
    .set('Authorization', 'Bearer ' + token)
    .expect(200);
});

test('Should be able to update user', async () => {
  await request(app)
    .patch('/api/v1/users/' + id)
    .send({ name: 'Bulb' })
    .set('Authorization', 'Bearer ' + token)
    .expect(200);

  const user = await User.findById(id);
  expect(user.name).toBe('Bulb');
});

test('Should not be able to update user forbirden fields', async () => {
  await request(url)
    .post('/api/v1/users/login')
    .send({ email: 'pika@example.com', password: 'test1234' });

  await request(url)
    .patch('/api/v1/users/' + id)
    .send({ active: false })
    .set('Authorization', 'Bearer ' + token)
    .expect(400);
});

test('Should be able to upload avatar', async () => {
  process.env.NODE_ENV = 'test';

  await request(app)
    .patch('/api/v1/users/' + id)
    .attach('avatar', 'public/img/avatars/user-61a1d72c77ea5407e1111a3b-1638008819594.jpeg')
    .set('Authorization', 'Bearer ' + token)
    .expect(200);

  const user = await User.findById(id);
  expect(user.avatar).toEqual(expect.any(String));

  process.env.NODE_ENV = 'development';
});

test('Should be able to logout', async () => {
  await request(app)
    .get('/api/v1/users/logout')
    .set('Authorization', 'Bearer ' + token)
    .expect(200);
});

test('Should be able to update password', async () => {
  await request(app)
    .patch('/api/v1/users/updatePassword')
    .send({ email: 'pika@example.com', password: 'test1234', newPassword: 'test1234' })
    .set('Authorization', 'Bearer ' + token)
    .expect(200);
});

test('Should be able to delete me', async () => {
  await request(app)
    .delete('/api/v1/users/deleteMe')
    .set('Authorization', 'Bearer ' + token)
    .expect(204);

  // Checking if user active is false
  const user = await User.findById(id);
  expect(user).toBeFalsy();
});

test('Should not be able to delete me while unauthenticated', async () => {
  await request(url).delete('/api/v1/users/deleteMe').expect(401);
});

test('Should be able to delete user', async () => {
  await request(app)
    .delete('/api/v1/users/' + id)
    .set('Authorization', 'Bearer ' + token)
    .expect(204);
});

test('Should not be able to delete user while unauthenticated', async () => {
  await request(url)
    .delete('/api/v1/users/' + id)
    .expect(401);
});
