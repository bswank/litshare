const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: 'Email Address is required.'
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
});

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Library', userSchema);
