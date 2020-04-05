const { MongoClient, ObjectID } = require('mongodb');
const interns = require('./books');
const debug = require('debug')('app:booksRepo');
const url = 'mongodb://localhost:27017';
const dbName = 'Library';

function booksRepo() {
  function getBooks(query, limit) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, {useUnifiedTopology: true});
      try {
        await client.connect();
        const db = client.db(dbName);

        let items = db.collection('books').find(query);
        
        if (limit > 0) {
          items = items.limit(limit);
        }
        resolve(await items.toArray());
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }
  function getBookById(id) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, {useUnifiedTopology: true});
      debug(id);
      try {
        await client.connect();
        const db = client.db(dbName);
        const item = await db.collection('books').findOne({ _id: ObjectID(id) });
        resolve(item);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }
  function addBooks(data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, {useUnifiedTopology: true});
      try {
        await client.connect();
        const db = client.db(dbName);

        results = await db.collection('books').insertMany(data);
        resolve(results);
        client.close();
      } catch (error) {
        reject(error)
      }
    })
  }
  function addBook(item) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const addedItem = await db.collection('books').insertOne(item);

        resolve(addedItem.ops[0]);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }
  function update(id, newItem) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const updatedItem = await db.collection('books')
          .findOneAndReplace({_id: ObjectID(id)}, newItem, {returnOriginal:false});
        
        resolve(updatedItem.value);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }
  function deleteAll(){
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const removed = await db.collection('books').deleteMany();

        resolve(removed.result.n);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }
  function remove(id){
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);
        const removed = await db.collection('books').deleteOne({_id: ObjectID(id)});

        resolve(removed.deletedCount === 1);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }
  return { getBooks, getBookById, addBooks, addBook, update, deleteAll, remove }
}

module.exports = booksRepo();  