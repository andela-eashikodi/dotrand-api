'use strict';

var express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  config = require('./config');

module.exports = function() {
  var app = express();
  if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret
  }));
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', "Origin, Accept, Content-Type, Access-Control-Allow-Headers, x_access_admin, Authorization, X-Requested-With");
    res.header('Access-Control-Allow-Methods', "POST, PUT, DELETE, GET");
    next();
  });

  return app;

}
