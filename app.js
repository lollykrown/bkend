const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const compression = require('compression');
const helmet = require('helmet');
const url = 'mongodb://localhost:27017';
//const mongoDb = 'mongodb+srv://lollykrown:password@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true';

const app = express();
const port = process.env.PORT || 3000;
//const mongoDb= process.env.MONGODB_URI || url;

const sessionOptions = {
    saveUninitialized: true,
    resave: false,
    secret: 'library',
    //cookie: {secure: true}
}

app.use(compression());
app.use(helmet());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session(sessionOptions));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [{ link: '/books', title: 'Books' },]
//{ link: '/search', title: 'Result' }];

const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);
const searchRouter = require('./src/routes/searchRoutes')(nav);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/search', searchRouter);

app.get('/', (req, res) => {
    res.render(
        'signin',
        {
            nav: [{ link: '/books', title: 'Books' }],
            //{ link: '/admin', title: 'Add Books' }],
            title: 'Lollykrown'
        });
});

app.listen(port, () => {
    debug(`listening on port ${chalk.yellow(port)}...`)
});