'use strict';

var mongoose = require("mongoose"),
  config = require('./config');

module.exports = function() {
  return mongoose.connect(config.db);
};
