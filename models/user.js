const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Email Address is required.'
  },
  name: {
    type: String,
    required: 'Please enter your name.',
    trim: true
  },
  bio: {
    type: String,
    required: false
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    address: {
      type: String,
      required: false
    },
    coordinates: [{
      type: Number,
      required: false
    }]
  },
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date,
  communities: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Community'
  }]
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(uniqueValidator, { message: 'A user with this email address already exists.' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
