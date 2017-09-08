const mongoose = require('mongoose')
const User = mongoose.model('User')
// const Community = mongoose.model('Community')
const Library = mongoose.model('Library')
const Book = mongoose.model('Book')

const confirmOwner = (library, user) => {
  for (let i = 0; i < user.libraries.length; i++) {
    if (user.libraries[i].toString() === library) {
      return 1
    }
  }
}

exports.saveNewBook = async (req, res) => {
  // Confirm user owns library before adding a book to it
  const isOwner = await confirmOwner(req.body.libraries, req.user)

  if (isOwner === 1) {
    req.body.owner = req.user._id

    // Create & save new book
    const book = await (new Book(req.body)).save()

    req.flash('success', `Successfully added ${book.title}.`)
    res.redirect('back')
  } else {
    req.flash('error', `Nice try, jackass.`)
    res.redirect('/libraries')
  }
}
