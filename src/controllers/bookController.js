const {MongoClient, ObjectID} = require('mongodb');
const debug = require('debug')('app:bookController');
// const chalk = require('chalk');
const booksRepo = require('../repos/booksRepo');

const url = 'mongodb+srv://kay:ololade@notes-ptviz.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'Library';

function bookController(bookService, nav) {
    function middleware(req, res, next) {
        if (req.user) {
            debug(`Time: ${Date(Date.now()).toString()}`);
            debug(req.user)
            debug(req.cookies)
            next();
        } else {
            //res.send("Login first!");
            res.redirect('/');
        };
    };
    function getIndex(req, res) {
        (async function mongo() {
            try {
                const books = await booksRepo.getBooks();
                res.render(
                    'bookListView', {nav, title: 'Lollykrown', books });
            } catch (err) {
                debug(err.stack);
                res.status(500).json({
                    message: 'Internal Server Error'
                  });
            }
        }());
    };
    function getById(req, res) {
        const { id } = req.params;
        (async function mongoo() {
            try {
                const book = await booksRepo.getBookById(id);
                //debug(book);
                book.details = await bookService.getBookById(book.bookId);
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
        }());
    };

    return {
        middleware,
        getIndex,
        getById,
    };
}

module.exports = bookController;