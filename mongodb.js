// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database!');
  }
  const db = client.db(databaseName);

  // db.collection('users').updateOne({
  //   _id: new ObjectID("5ffdc90600e980355c9bf239")
  // }, {
  //   $inc: {
  //     age: 1
  //   }
  // }).then((result) => {
  //   console.log(result);
  // }).catch((error) => {
  //   console.log(error);
  // })

  // db.collection('tasks').updateMany({}, {
  //   $set: {
  //     completed: true
  //   }
  // }).then((result) => {
  //   console.log(result.modifiedCount);
  // }).catch((error) => {
  //   console.log(error);
  // })

  // db.collection('users').deleteMany({
  //   age: 27
  // }).then((result) => {
  //   console.log(result)
  // }).catch((error) => {
  //   console.log(error)
  // })

  db.collection('tasks').deleteOne({
    description: 'Apples'
  }).then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })
});