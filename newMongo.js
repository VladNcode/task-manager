const { MongoClient } = require('mongodb');

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

  const insertResult = await collection.insertMany([
    { description: 'task1', completed: true },
    { description: 'task2', completed: false },
    { description: 'task3', completed: true },
  ]);

  // const insertResult = await collection.insertOne({ name: 'Vlad', age: 28 });

  console.log('Inserted documents =>', insertResult);

  return 'done.';
}

// Running main function
main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
