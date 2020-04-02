const {MongoClient, ObjectID} = require('mongodb');
const debug = require('debug')('app:bookController');
const chalk = require('chalk');

const url = 'mongodb://localhost:27017';
const dbName = 'Library';

function bookController(bookService, nav) {
    function middleware(req, res, next) {
        // if (req.user) {
            debug(`Time: ${chalk.yellowBright(Date(Date.now()).toString())}`);
            next();
        //   } else {
        //     res.redirect('/');
        //   };
    };
    function getIndex(req, res) {
        const url = 'mongodb://localhost:27017';
        const dbName = 'Library';
        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url, { useUnifiedTopology: true });
                debug('Succsessfully connected to the server');
                const db = client.db(dbName);
                const coll = await db.collection('books');
                const books = await coll.find().toArray();
                res.render(
                    'bookListView', {nav, title: 'Lollykrown', books });
            } catch (err) {
                debug(err.stack);
            }
            client.close();
        }());
    };
    function getById(req, res) {
        const { id } = req.params;
        (async function mongoo() {
            let client;
            try {
                client = await MongoClient.connect(url, {useUnifiedTopology: true});
                debug('Successfully connected to the server');
                const db = client.db(dbName);
                const col = await db.collection('books');
                const book = await col.findOne({ _id: new ObjectID(id) });
                debug(book);
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
            client.close();
        }());
    };

    function getByTitle(req, res) {
            //const {searchString} = req.body;
            //debug(searchString);
    
            (async function search() {
                try {
                    const bk = await bookService.getBookByTitle("Childhood");
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
        };
    return {
        middleware,
        getIndex,
        getById,
        getByTitle
    };
}

module.exports = bookController;