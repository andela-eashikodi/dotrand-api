'use strict';

var app = require('./config/express')(),
    db = require('./config/mongoose')(),
    port = process.env.PORT || 2016;

app.listen( port, function (error) {
  if (error) {
    console.log(error);
  }
  console.log('App started on port: ' + port);
});

module.exports = app;
