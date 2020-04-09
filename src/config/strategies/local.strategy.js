const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

module.exports = function localSsrategy() {
    passport.use(new Strategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        }, (username, password, done) => {
            const url = 'mongodb://localhost:27017';
            const dbName = 'Library';

            (async function mongo() {
                let client;
                try {
                    client = await MongoClient.connect(url, { useUnifiedTopology: true });
                    debug('Succsessfully connected to the server');
                    const db = client.db(dbName);
                    const col = await db.collection('users');
                    const user = await col.findOne({username});

                    if (!user) {
                        return done(null, false, {message: `Invalid Username: ${username}`})
                    }
                    if(user.password !== password) {
                        return done(null, false, {message: 'Invalid Password'}) 
                    } 
                    return done(null, user);
                    
                } catch (err) {
                    debug(err.stack);
                }
                client.close();
            }());
        }    ));
};
