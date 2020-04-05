const express = require('express');
const searchRouter = express.Router();
const chalk = require('chalk');
const debug = require('debug')('app:searchRoutes');
const bookController = require('../controllers/bookController');
const bookService = require('../services/goodreadsService');
const { MongoClient, ObjectID } = require('mongodb');

function router(nav) {
    const {middleware, getById} = bookController(bookService, nav);
    //searchRouter.use(middleware);
    searchRouter.route('/')
    .post((req, res) => {
        const {search} = req.body;
        debug(chalk.red(search));
        (async function query() {
            try {
                const bk = await bookService.getBookByTitle(search);
                debug(bk);
                res.render(
                    'resultsView',
                    {
                        nav,
                        title: 'Lollykrown',
                        bk
                    });
            } catch (err) {
                debug(err.stack);
            }
        }());
    });
    searchRouter.route('/:id').get((req, res) =>{
        const { id } = req.params;
        debug(id);
        (async function mongoo() {
            try {                
                const bk = await bookService.getBookById(id);
                const book = {
                    title: bk.title,
                    genre: bk.genre,
                    author: bk.authors.author.name,
                    bookId: bk.id,
                    read: false
                }
                book.details = await bookService.getBookById(bk.id);
                //debug(book);
                //res.json(book);
                res.render(
                    'bookView',
                    {
                        nav,
                        title: 'Lollykrown',
                        book
                    });
            } catch (err) {
                debug(err.stack);
            }
            client.close();
        }());
    });
    return searchRouter;
};

module.exports = router;