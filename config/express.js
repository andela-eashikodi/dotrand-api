'use strict';

var express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  config = require('./config'),
  path = require('path'),
  appDir = path.dirname(require.main.filename);

module.exports = function() {
  var app = express();
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

  app.get('/', function(req, res) {
    res.sendFile(appDir + '/404.html');
  });

  return app;

}
