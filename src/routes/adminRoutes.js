const express = require('express');
const adminRouter = express.Router();
const debug = require('debug')('app:adminRoutes');
const books = require('./books');
const booksRepo = require('../repos/booksRepo');

function router(nav) {
    adminRouter.route('/')
        .get((req, res) => {
            (async function mongo(){
                try {
                    const response = await booksRepo.addBooks(books);
                    res.json(response);
                    debug("Doc inserted = " + response.insertedCount);
                } catch (err) {
                    debug(err.stack);
                }
            }());
            
        });
    return adminRouter;
}

module.exports = router;