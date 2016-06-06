'use strict';

var express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  config = require('./config'),
  passport = require('passport'),
  app = express();

module.exports = function() {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', "Origin, Accept, Content-Type, Access-Control-Allow-Headers, x_access_admin, Authorization, X-Requested-With");
    res.header('Access-Control-Allow-Methods', "POST, PUT, DELETE, GET");
    next();
  });
  require('./passport')(passport);
  require('../app/routes/')(app, passport);
  return app;

};
