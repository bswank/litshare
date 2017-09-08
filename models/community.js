const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const slug = require('slugs')

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required.',
    unique: true
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  private: Boolean,
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    address: {
      type: String,
      required: 'Location is required.'
    },
    coordinates: [{
      type: Number,
    }]
  },
  admin: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }]
});

communitySchema.index({
  name: 'text',
  description: 'text'
});

communitySchema.index({
  location: '2dsphere'
});

// Make sure slug is equal to the name of the community
communitySchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next();
    return // stop this from running
  }
  this.slug = slug(this.name);
  next();
});

module.exports = mongoose.model('Community', communitySchema);
