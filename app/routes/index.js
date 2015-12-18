'use strict';

module.exports = function(app) {

  app.use(function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(
      {
        "get all users": "https://dotrand-api.herokuapp.com/users",
        "get user": "https://dotrand-api.herokuapp.com/user/:id",
        "get 1user": "https://dotrand-api.herokuapp.com/user/:id",
        "get 2user": "https://dotrand-api.herokuapp.com/user/:id",
        "get 3user": "https://dotrand-api.herokuapp.com/user/:id"
      }, null, 3));
  });
}
