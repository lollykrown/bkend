const express = require('express');
const adminRouter = express.Router();
const MongoClient = require('mongodb').MongoClient;
const debug = require('debug')('app:adminRoutes');
const books = require('./books');

function router(nav) {
    adminRouter.route('/')
        .get((req, res) => {
            const url = 'mongodb://localhost:27017';
            const dbName = 'Library';
            (async function mongo(){
                let client;
                try {
                    client = await MongoClient.connect(url, {useUnifiedTopology: true});
                    debug('Succsessfully connected to the server');
                    const db = client.db(dbName);
                    const response = await db.collection('books').insertMany(books);
                    res.json(response);
                    debug("Doc inserted = " + response.insertedCount);
                } catch (err) {
                    debug(err.stack);
                }
                client.close
            }());
            
        });
    return adminRouter;
}

module.exports = router;