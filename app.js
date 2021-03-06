const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const compression = require('compression');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');


const url = 'mongodb+srv://kay:ololade@notes-ptviz.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'Library';

require('dotenv').config()


const app = express();
const port = process.env.PORT || 4000;

// app.set('trust proxy', 1);

const sessionOptions = {
    saveUninitialized: true,
    resave: false,
    secret: 'library',
    cookie:{
        //secure: true,
        path: '/',
        httpOnly: true,
        maxAge:60000
           },
    store: new MongoStore({url: url, database: dbName, ttl: 1*60}),
    name: 'id'
}

app.use(compression());
app.use(helmet());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(flash());

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
    req.flash('info', 'Welcome');
    req.flash('info', 'Just testing');

    res.render(
        'signin',
        {
            nav: [{ link: '/books', title: 'Books' }],
            //{ link: '/admin', title: 'Add Books' }],
            title: 'Lollykrown'
        });
});

app.listen(port, () => {
    debug(`listening on port ${port}...`)
});