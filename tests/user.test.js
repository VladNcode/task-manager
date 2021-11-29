require('dotenv').config({ path: './test.env' });
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

//* Connect to the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('Connected to DB'));

test('Should signup a new user', async () => {
  await request(app)
    .post('/api/v1/users/')
    .send({ name: 'Pikachu', age: '25', email: 'pika@example.com', password: 'test1234' })
    .expect(201);
});
