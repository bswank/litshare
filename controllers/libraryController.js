const mongoose = require('mongoose')
const User = mongoose.model('User')
// const Community = mongoose.model('Community')
const Library = mongoose.model('Library')
const Book = mongoose.model('Book')

exports.addBooks = (req, res) => {
  res.render('searchLibraries', { title:
  'Search for Books' })
}

exports.libraries = async (req, res) => {
  const libraries = await Library.find({
    _id: { $in: req.user.libraries }
  })
  res.render('libraries', {
    title: 'Libraries',
    libraries
  })
}

const confirmOwner = (library, user) => {
  for (let i = 0; i < user.libraries.length; i++) {
    if (user.libraries[i].toString() === library._id.toString()) {
      return 1
    }
  }
}

exports.library = async (req, res) => {
  const library = await Library.findOne({ _id: req.params.id })

  // Confirm user owns library before displaying it
  const isOwner = await confirmOwner(library, req.user)

  if (isOwner === 1) {
    // Get all books in library
    const books = await Book.find({
      libraries: library._id
    })
    console.log(books)
    res.render('library', {
      title: library.name,
      library,
      books
    })
  } else {
    req.flash('error', 'Nice try, jackass.')
    res.redirect('back')
  }
}

exports.saveNewLibrary = async (req, res) => {
  // Create & save new library
  const library = await (new Library(req.body)).save()

  // Add library to libraries in user
  const user = await User.findOne({
    _id: req.user._id
  }).exec()
  user.libraries.push(library._id)
  await user.save()

  req.flash('success', `Successfully created ${library.name}.`)
  res.redirect('/libraries/')
}
