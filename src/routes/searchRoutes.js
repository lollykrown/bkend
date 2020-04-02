const express = require('express');
const searchRouter = express.Router();
const debug = require('debug')('app:searchRoutes');
const bookController = require('../controllers/bookController');
const bookService = require('../services/goodreadsService')

function router(nav) {
    const {middleware, getByTitle} = bookController(bookService, nav);
    searchRouter.use(middleware);
    searchRouter.route('/').get(getByTitle);
    return searchRouter;
};

module.exports = router;