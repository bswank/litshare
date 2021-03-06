const express = require('express')
const router = express.Router()
const community = require('../controllers/communityController')
const user = require('../controllers/userController')
const auth = require('../controllers/authController')
const library = require('../controllers/libraryController')
const book = require('../controllers/bookController')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' })
})

router.get('/communities/', auth.isLoggedIn, catchErrors(community.getMyCommunities))

router.get('/communities/all', auth.isLoggedIn, catchErrors(community.getAllCommunities))

router.post('/communities/new', catchErrors(community.saveNewCommunity))

router.get('/communities/:slug', auth.isLoggedIn, catchErrors(community.communityPage))

router.get('/login', catchErrors(user.login))

router.get('/signup', catchErrors(user.signup))

router.post('/signup',
  user.validateSignup,
  user.saveNewUser,
  auth.login
)

router.post('/login', auth.login)

router.get('/logout', auth.isLoggedIn, auth.logout)

router.post('/communities/:id/delete', catchErrors(community.deleteCommunity))

router.get('/account', auth.isLoggedIn, catchErrors(user.account))

router.post('/account', catchErrors(user.editUser))

router.post('/communities/:id/edit', catchErrors(community.saveEditCommunity))

router.post('/account/forgot', catchErrors(auth.forgot))

router.get('/account/reset/:token', catchErrors(auth.reset))

router.post('/account/reset/:token', auth.confirmedPasswords, catchErrors(auth.updatePassword))

router.get('/communities/search', community.searchCommunitiesPage)

router.get('/communities/near', community.nearCommunitiesPage)

router.post('/communities/:id/join', catchErrors(user.postJoinCommunity))

router.post('/communities/:id/leave', catchErrors(user.postLeaveCommunity))

router.get('/communities/close', catchErrors(community.nearCommunitiesPage))

router.get('/libraries/addbooks', catchErrors(library.addBooks))

router.get('/libraries/', catchErrors(library.libraries))

router.get('/libraries/:id', catchErrors(library.library))

router.post('/libraries/new', catchErrors(library.saveNewLibrary))

router.post('/books/add', catchErrors(book.saveNewBook))

router.post('/books/quick-add', catchErrors(book.saveNewBookQuick))

// Plan Management

router.post('/plan-management/upgrade-account', catchErrors(user.upgradeAccount))

router.post('/plan-management/update-card', catchErrors(user.updateCard))

router.post('/plan-management/downgrade-account', catchErrors(user.downgradeAccount))

// API

router.get('/api/search', catchErrors(community.searchCommunities))

router.get('/api/near', catchErrors(community.nearCommunities))

module.exports = router
