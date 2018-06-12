var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3').verbose();
var models = require('../models');
const passport = require("passport");
const connectEnsure = require('connect-ensure-login');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get("/signup", function (req, res, next) {
  res.render('signup')
});

router.post('/signup', function (req, res, next) {
  models.users.findOrCreate({
    where: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }
  }).spread(function (result, created) {
    if (created) {
      res.redirect('/users/login')
    } else {
      res.send('this user already exists')
    }
  });

});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login'
}), function (req, res, next) {
  res.redirect('profile/' + req.user.UserId)
});

router.get('/profile/:id', connectEnsure.ensureLoggedIn(), function (req, res, next) {
  if (req.user.UserId === parseInt(req.params.id)) {
    res.render('profile', {
      FirstName: req.user.firstName,
      LastName: req.user.lastName,
      Email: req.user.email,
      UserId: req.user.UserId,
      Username: req.user.username
    });
  } else {
    res.send('This is not your profile')
  }
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/users/login');
});

module.exports = router;