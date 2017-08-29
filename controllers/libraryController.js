const mongoose = require('mongoose')
const User = mongoose.model('User')
const Community = mongoose.model('Community')
const Library = mongoose.model('Library')

exports.searchLibraries = (req, res) => {
  res.render('libraries', { title:
  'Search for Books' })
}

exports.libraries = (req, res) => {
  res.render('libraries', { title:
  'Your Libraries' })
}
