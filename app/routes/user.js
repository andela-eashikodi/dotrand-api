'use strict';

var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user');
var ctrl = new UserController();

module.exports = function(app, passport) {

  router.route('/users')
    .get(ctrl.getAll)
    .post(ctrl.signUp('local', passport))
    .delete(ctrl.deleteAll);

  router.route('/user/authenticate')
    .post(ctrl.signIn('local-signin', passport))

  router.route('/user/:id')
    .get(ctrl.findOne)
    .delete(ctrl.deleteOne);

  app.use('', router);
}
