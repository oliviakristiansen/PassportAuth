const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const models = require('../models');


passport.use('local', new LocalStrategy(
    function (username, password, done) {
        // console.log(username)
        models.users.findOne({
            where: {
                username: username
            }
        }).then(user => {
            // console.log(user)
            if (!user) {
                console.log('not user');
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            if (user.password !== password) {
                console.log('not valid password');
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);

        }).catch(err => {
            if (err) {
                console.log('error');
                return done(err);
            }

        })

    }));

passport.serializeUser((user, cb) => {
    cb(null, user.UserId)
});

passport.deserializeUser((id, cb) => {
    models.users.findOne({
        where: {
            UserId: id
        }
    }).then(user => {
        cb(null, user);
    }).catch(err => {;
        cb(err);
    })
})