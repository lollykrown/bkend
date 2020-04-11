const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');
const bcrypt = require('bcrypt');
const chalk = require('chalk');


module.exports = function localSsrategy() {
    passport.use(new Strategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        }, (username, password, done) => {
            const url = 'mongodb+srv://kay:ololade@notes-ptviz.mongodb.net/test?retryWrites=true&w=majority';
            const dbName = 'Library';
            (async function mongo() {
                let client;
                try {
                    client = await MongoClient.connect(url, { useUnifiedTopology: true });
                    debug('Succsessfully connected to the server');
                    const db = client.db(dbName);
                    const col = await db.collection('users');
                    const user = await col.findOne({username});

                    const pwd = await bcrypt.compare(password, user.hashedPassword);
                    debug(chalk.red(pwd));

                    if (!user) {
                        return done(null, false, {message: `Invalid Username: ${username}`})
                    }
                    if(!pwd) {
                        return done(null, false, {message: 'Invalid Password'}) 
                    } 
                    return done(null, user);
                    
                } catch (err) {
                    debug(err.stack);
                }
                //client.close();
            }());
        }    ));
};
