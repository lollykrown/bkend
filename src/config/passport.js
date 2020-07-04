const passport = require('passport');
require('./strategies/local.strategy')();
require('./strategies/fb.strategy')();
// require('./strategies/twitter.strategy')();


module.exports = function passportConfig(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    //stores user in session
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    //Retrieves user from session
    passport.deserializeUser((user, done) => {
        //if (err) { return done(err); }
        done(null, user);
    });
}