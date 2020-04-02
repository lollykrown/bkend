const express = require('express');
const bookRouter = express.Router();
const bookController = require('../controllers/bookController');
const bookService = require('../services/goodreadsService')

function router(nav) {
    const {middleware, getIndex, getById} = bookController(bookService, nav);
    bookRouter.use(middleware);
    bookRouter.route('/').get(getIndex);
    bookRouter.route('/:id').get(getById);
    return bookRouter;
}

module.exports = router;