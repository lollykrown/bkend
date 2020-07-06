const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');
const bcrypt = require('bcrypt');
const chalk = require('chalk');

const authRouter = express.Router();

function router(nav) {
    authRouter.route('/signup').get((req, res) => {
        res.render('signup', {
                nav,
                title: 'Lollykrown',
            })
        }).post((req, res) => {
        const {username, password} = req.body;
        const url = 'mongodb+srv://kay:ololade@notes-ptviz.mongodb.net/test?retryWrites=true&w=majority';
        
        const dbName = 'Library';

        (async function addUser() {
            let client;
            try {
                const saltRounds = 10;  
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                debug(chalk.red(hashedPassword));

                client = await MongoClient.connect(url, {useUnifiedTopology: true});
                debug('Succsessfully connected to the server');
                const db = client.db(dbName);
                const col = await db.collection('users');
                const user = {username, hashedPassword};
                const response = await col.insertOne(user);
                //debug(response);
                req.login(response.ops[0], () => {
                    res.redirect('/auth/signin');
                });
            } catch (err) {
                debug(err.stack);
            }
            //client.close();
        }());
    });
    authRouter.route('/signin').get((req, res) => {
        debug(req.session);
        res.render('signin', {
                nav,
                title: 'Sign In',
            });
        })
    //     .post(passport.authenticate('local', {
    //         successRedirect: '/books',
    //         failureRedirect: '/',
    //         // failureFlash: true
    //         // failureFlash: 'Invalid username or password.'
    // }));
    
    //custom callback
      .post((req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
          if (err) { return next(err); }
          if (!user) { return res.redirect('/login'); }
          req.logIn(user, function(err) {
            if (err) { return next(err); }
            debug(req.user)
            debug(req.cookies)
            return res.redirect('/books');
          });
        })(req, res, next);
      });

    authRouter.route('/logout').get((req, res)=> {
        req.logout();
        res.redirect('/');
      });

    authRouter.get('/facebook', passport.authenticate('facebook'));

    authRouter.get('/facebook/callback', passport.authenticate('facebook', 
    { successRedirect: '/books', failureRedirect: '/' }));

    authRouter.get('/twitter', passport.authenticate('twitter'));
    authRouter.get('/twitter/callback',
      passport.authenticate('twitter', { successRedirect: '/books',
                                        failureRedirect: '/' }));

    authRouter.get('/google', passport.authenticate('google', { scope: ['profile'] }));

    authRouter.get('/google/callback', 
      passport.authenticate('google', { failureRedirect: '/' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/books');
      });

      authRouter.get('/github', passport.authenticate('github'));

      authRouter.get('/github/callback', 
        passport.authenticate('github', { failureRedirect: '/' }),
        function(req, res) {
          // Successful authentication, redirect home.
          res.redirect('/books');
        });
                                        
    authRouter.route('/profile').all((req, res, next) => {
        if (req.user) {
          next();
        } else {
          res.redirect('/');
        }
      })
      .get((req, res) => {
        res.json(req.user);
      });
    return authRouter;
}

module.exports = router;