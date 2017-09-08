const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const bookSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: 'A name is required.'
  },
  author: {
    type: String,
    trim: true,
    required: 'An author is required.'
  },
  subtitle: {
    type: String,
    trim: true
  },
  libraries: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Library'
  }],
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
})

bookSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('Book', bookSchema)
