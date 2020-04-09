const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redis = require('redis');
const compression = require('compression');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')(session);

const urll = 'mongodb+srv://kay:ololade@notes-ptviz.mongodb.net/test?retryWrites=true&w=majority';

//let RedisStore = require('connect-redis')(session)
//let RedisClient = redis.createClient()

const app = express();
const port = process.env.PORT || 4000;

// app.set('trust proxy', 1);

const sessionOptions = {
    saveUninitialized: true,
    resave: false,
    secret: 'library',
    cookie:{
        //secure: true,
        maxAge:60000
           },
    store: new MongoStore({url: urll, ttl: 14 * 24 * 60 * 60})
}

app.use(compression());
app.use(helmet());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session(sessionOptions));

// RedisClient.on('error', function(err) {
//     console.log('Redis error: ' + err);
// });

// RedisClient.on("ready",function () {
//     console.log("Redis is ready");
// });

// app.use(function(req,res,next){
//     if(!req.session){
//         return next(new Error('Oh no')) //handle error
//     }
//     next() //otherwise continue
//     });

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
    debug(`listening on port ${port}...`)
});