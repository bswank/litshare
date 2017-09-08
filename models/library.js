const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const librarySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'A name is required.'
  },
  private: Boolean
})

librarySchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('Library', librarySchema)
