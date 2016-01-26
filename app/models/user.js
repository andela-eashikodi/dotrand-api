'use strict';

var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

    var userSchema = new schema({
      username: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        index: {
          unique: true
        }
      },
      password: {
        type: String,
        required: true
      },
      profilePic: {
        type: String
      },
      dateOfBirth: {
        type: Date
      },
      gender: {
        type: String
      },
      email: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now()
      },
      otp: Number,
      resetPasswordToken: String,
      resetPasswordExpires: Date
    }, {
      versionKey: false
    });

    //hash password
    userSchema.pre('save', function(next) {
      var user = this;
      //hash the password only if the password has been changed or user is new
      if (!user.isModified('password')) {
        return next();
      }
      //generate the hash
      bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) {
          return next(err);
        }
        //change the password to the hashed version
        user.password = hash;
        next();
      });
    });

    userSchema.methods.comparePassword = function(password) {
      return bcrypt.compareSync(password, this.password);
    };

    var User = mongoose.model('User', userSchema);

    module.exports = User;
