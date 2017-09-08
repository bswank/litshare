const mongoose = require('mongoose')
const User = mongoose.model('User')
const Community = mongoose.model('Community')
const Library = mongoose.model('Library')

exports.addBooks = (req, res) => {
  res.render('searchLibraries', { title:
  'Search for Books' })
}

exports.libraries = (req, res) => {
  res.render('libraries', { title: 'Libraries' })
}

exports.saveNewLibrary = async (req, res) => {
  // Add user as owner of library
  req.body.owner = req.user._id

  // Create & save new library
  const library = await (new Library(req.body)).save()

  req.flash('success', `Successfully created ${library.name}.`)
  res.redirect('/libraries/')
}
