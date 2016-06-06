'use strict';

var mongoose = require('mongoose'),
    validate = require('mongoose-validator'),
    schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');
    
var passwordValidator = [
  validate({
    validator: 'isLength',
    arguments: [6, 50],
    message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

var userSchema = new schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true,
    validate: passwordValidator
  },
  fullname: {
    type: String,
    required: true
  },
  phone: String,
  profilePic: String,
  dateOfBirth: String,
  gender: String,
  email: String,
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
