const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');
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
                client = await MongoClient.connect(url, {useUnifiedTopology: true});
                debug('Succsessfully connected to the server');
                const db = client.db(dbName);
                const col = await db.collection('users');
                const user = {username, password};
                const response = await col.insertOne(user);
                debug(response);
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
        debug(chalk.red(req.session));
        res.render('signin', {
                nav,
                title: 'Sign In',
            });
        })
        .post(passport.authenticate('local', {
            successRedirect: '/books'
    }));
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