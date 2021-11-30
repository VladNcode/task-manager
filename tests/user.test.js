require('dotenv').config({ path: './test.env' });
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/userModel');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const userOne = { name: 'Pikachu', age: '25', email: 'pika@example.com', password: 'test1234' };
const userTwo = { name: 'Bulbasaur', age: '25', email: 'bulba@example.com', password: 'test1234' };

let token;
let id;

//* Connect to the database
beforeAll(async () => {
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
  await mongoose.connection.close();
});

// test('Should not be able to login with wrong credentials', async () => {
//   await request('https://vlad-taskapp.herokuapp.com')
//     .post('/api/v1/users/login/')
//     .send({ email: 'test@example.com', password: 'test12345' })
//     .expect(401);
// }, 2000);

// ? Not working in development
// test('Should not be able to login with wrong credentials', async () => {
//   request(app)
//     .post('/api/v1/users/login/')
//     .send({ email: 'test@example.com', password: 'test12345' })
//     .expect(200);
// });

test('Should be able to signup a new user', async () => {
  await request(app).post('/api/v1/users/').send(userTwo).expect(201);
});

test('Should be able to login', async () => {
  await request(app)
    .post('/api/v1/users/login')
    .send({ email: 'pika@example.com', password: 'test1234' })
    .expect(200);
});

test('Should be able to get /me page', async () => {
  await request(app)
    .get('/api/v1/users/me')
    .set('Authorization', 'Bearer ' + token)
    .expect(200);
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
});

test('Should be able to delete user', async () => {
  await request(app)
    .delete('/api/v1/users/' + id)
    .set('Authorization', 'Bearer ' + token)
    .expect(204);
});
