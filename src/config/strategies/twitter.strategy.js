const passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function facebookStrategy() {
  passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:4000/auth/twitter/callback"
  },
    function (accessToken, refreshToken, profile, done) {
      debug(process.env.FACEBOOK_APP_ID)
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