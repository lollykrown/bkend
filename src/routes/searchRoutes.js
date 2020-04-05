const express = require('express');
const searchRouter = express.Router();
const chalk = require('chalk');
const debug = require('debug')('app:searchRoutes');
const bookController = require('../controllers/bookController');
const bookService = require('../services/goodreadsService');
const url = require('url');
const queryStr = require('querystring');

function router(nav) {
    const {middleware} = bookController(bookService, nav);
    //searchRouter.use(middleware);
    searchRouter.route('/')
    .post((req, res) => {
        const {search} = req.body;
        //const s = queryStr.stringify(search);
        debug(chalk.red(search));
        (async function search() {
            try {
                const bk = await bookService.getBookByTitle("search");
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
    return searchRouter;
};

module.exports = router;