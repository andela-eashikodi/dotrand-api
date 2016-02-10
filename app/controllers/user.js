'use strict';

var User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto'),
    twilio = require('twilio'),
    config = require('../../config/config');

var client = twilio(config.twilio.ACCOUNT_SID, config.twilio.AUTH_TOKEN);

var UserController = function() {};

UserController.prototype.sendSms = function(smsInfo) {
  client.sendMessage({
    to: smsInfo.recipient, // Any number Twilio can deliver to
    from: config.twilio.myNumber, // A number you bought from Twilio and can use for outbound communication
    body: smsInfo.message // body of the SMS message
  }, function(err, responseData) {
    if (err) {
      console.log(err);
      return false;
    }
    else {
      console.log(responseData.body);
      return true;
    }
  });
};

UserController.prototype.usernameAvail = function(req, res) {
  User.findOne({username: req.body.username}, function(err, user) {
    if(user) {
      res.status(417).json({message: 'username is taken'});
    }
    else {
      res.json({message: 'available'});
    }
  });
};

UserController.prototype.phoneAvail = function(req, res) {
  User.findOne({phone: req.body.phone}, function(err, user) {
    if(user) {
      res.status(417).json({message: 'phone number in use'});
    }
    else {
      res.json({message: 'available'});
    }
  });
};

UserController.prototype.signUp = function(strategy, passport) {
  return function(req, res, next) {
    passport.authenticate(strategy, function(err, user, message) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(400).json(message);
      }
      else {
        User.create(req.body, function(err, user) {
          if (err) {
            return res.json(err);
          }
          var info = {
            recipient: user.phone,
            message: 'Thank you for registering to dotrand'
          };
          UserController.prototype.sendSms(info);
          return res.json(user);
        });
      }
    })(req, res, next);
  };
};

UserController.prototype.signIn = function(strategy, passport) {
  return function(req, res, next) {
    passport.authenticate(strategy, function(err, user, message) {
      if(err) {
        return next(err);
      }
      if (!user) {
        res.status(400).send(message);
      }
      else {
        var token = jwt.sign(user, config.sessionSecret, {
          expiresIn: 86400 //24hr expiration
        });
        //return info including token in JSON format
        return res.json({
          success: true,
          token: token
        });
      }
    })(req, res, next);
  };
};

UserController.prototype.verifyToken = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        //if all checks are passed, save decoded info to request
        req.decoded = decoded;
        next();
      }
    });
  } else {
    //show http 403 message when token is not provided
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
};

UserController.prototype.forgotPass = function(req, res) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({phone: req.body.phone}, function(err, user) {
        if (!user) {
          return res.json({
            message: 'No user found'
          });
        }
        else {
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save(function(err) {
            done(err, token, user);
          });
        }
      });
    },
    function(token, user, done) {
      var info = {
        recipient: user.phone,
        message: 'Reset password confirmation code is ' + token + '. Enter this in our app to reset your account password.'
      }
      var res = UserController.prototype.sendSms(info);
      done(res);
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
    res.json({
      message: 'Message Sent!'
    });
  });
};

UserController.prototype.resetPass = function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function(err, user) {
        if (!user) {
          return res.json({
            'message': 'User does not exist'
          });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err, result) {
          if (err) {
            return res.json(err);
          }
          res.json(result);
        });
      });
    },
    function(user, done) {

      var mailOptions = {
        to: user.email,
        from: 'World tree ✔ <no-reply@worldtreeinc.com>',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        if (err) {
          console.log(err);
        }
        done(err);
      });
    }
  ], function(err) {
    if (err) return err;
    res.json({
      message: 'Password changed!'
    });
  });
};


UserController.prototype.getAll = function(req, res) {
  User.find(function(err, users) {
    if (err) {
      return res.json(err);
    }
    return res.json(users);
  });
};

UserController.prototype.deleteOne = function(req, res) {
  User.remove({_id: req.params.id}, function(error) {
    if (error) {
      res.json({message: 'Error occured!', status: false});
    } else {
      res.json({message: 'Success', status: true});
    }
  });
};

UserController.prototype.deleteAll = function(req, res) {
  User.remove(function(error, users) {
    if (error) {
      res.json({message: 'Error occured!', status: false});
    } else {
      // res.json({message: 'Success', status: true});
      res.json(users);
    }
  });
};

UserController.prototype.findOne = function(req, res) {
  User.find({_id: req.params.id}, function(error, user) {
    if (error) {
      res.json({message: 'Error occured!', status: false});
    }
    else {
      res.json(user);
    }
  });
};

module.exports = UserController;
