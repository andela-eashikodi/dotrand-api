'use strict';

var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport, User) {

  passport.use('local-signin', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function (username, password, done) {
      User.findOne({username: username}, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {message: 'No user found'});
        }
        var validPassword = user.comparePassword(password);
        if (!validPassword) {
          return done(null, false, {message: 'Invalid password'});
        }
        return done(null, user);
      });
    }
  ));

  passport.use('local', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, username, password, done) {
      User.findOne({username: username}, function (err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, {message: 'Username already taken.'});
        }
        return done(null, req.body);
      });
    }
  ));
};
