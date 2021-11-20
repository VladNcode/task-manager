const { MongoClient, ObjectId } = require('mongodb');

// const id = new ObjectId();
// console.log(id);

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'task-manager';

// Main function
async function main() {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('users');

  // const insertResult = await collection.insertMany([
  //   {
  //   { description: 'task1', completed: true },
  //   { description: 'task2', completed: false },
  //   { description: 'task3', completed: true },
  // ]);

  // const insertResult = await collection.deleteMany({ name: { $ne: 'Vlad' } });

  // const insertResult = await collection.findOne({
  //   _id: new ObjectId('619795a90e1b8ad3a4a5342c'),
  // });

  const insertResult = await collection.findOneAndUpdate(
    { name: 'Vlad' },
    { $set: { name: 'Vladyslav' } }
  );

  console.log('Inserted documents =>', insertResult);

  return 'done.';
}

// Running main function
main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
