const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:github.strategy');

module.exports = function facebookStrategy() {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:4000/auth/github/callback",
    profileFields: ['id', 'displayName', 'email']
  },
    function (accessToken, refreshToken, profile, done) {
      const url = 'mongodb+srv://kay:ololade@notes-ptviz.mongodb.net/test?retryWrites=true&w=majority';
      const dbName = 'Library';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url, { useUnifiedTopology: true });
          debug('Succsessfully connected to the server');
          const db = client.db(dbName);
          const col = await db.collection('users');
          const user = await col.findOne({ username: 'lollyk' });

          debug(profile)

          if (!user) {
            return done(null, false)
          }
          return done(null, user);

        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    }
  ))
};