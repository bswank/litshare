const mongoose = require('mongoose')
const User = mongoose.model('User')
const Community = mongoose.model('Community')

exports.newCommunity = (req, res) => {
  res.render('editCommunity', {
    title: 'Create a New Community'
  })
}

exports.saveNewCommunity = async (req, res) => {
  // Add user as admin in community
  req.body.admin = req.user._id
  // Craete & save new community
  const community = await (new Community(req.body)).save()
  // Add community to communities in user (join)
  const user = await User.findOne({
    _id: req.user._id
  }).exec()
  user.communities.push(community._id)
  await user.save()

  req.flash('success', `Successfully created ${community.name}.`)
  res.redirect(`/communities/${community.slug}`)
}

exports.deleteCommunity = async (req, res) => {
  await Community.findOneAndRemove({ _id: req.params.id }).exec()
  req.flash('success', `Successfully deleted.`)
  res.redirect('/communities')
}

// Get all communities
exports.getAllCommunities = async (req, res) => {
  const communities = await Community.find()
  res.render('allCommunities', {
    title: 'All Communities',
    communities
  })
}

// Get my communities
exports.getMyCommunities = async (req, res) => {
  const communities = await Community.find({
    _id: { $in: req.user.communities }
  })
  res.render('myCommunities', {
    title: 'My Communities',
    communities
  })
}

const confirmAdmin = (community, user) => {
  for (let i = 0; i < community.admin.length; i++) {
    if (community.admin[i].toString() === user._id) {
      return 1
    } else {
      return 0
    }
  }
}

exports.saveEditCommunity = async (req, res) => {
  let community = await Community.findOne({ _id: req.params.id })
  let user = req.user
  const isAdmin = await confirmAdmin(community, user)
  if (isAdmin === 1) {
    req.body.location.type = 'Point'
    community = await Community.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true
    }).exec()
    req.flash('success', `Successfully updated ${community.name}.`)
    res.redirect(`/communities/all`)
  } else if (isAdmin === 0) {
    req.flash('error', `Nice try, jackass.`)
    res.redirect(`/communities/all`)
  }
}

exports.communityPage = async (req, res, next) => {
  const community = await Community.findOne({ slug: req.params.slug })
  if (!community) {
    return next()
  }
  res.render('community', {
    title: community.name,
    community
  })
}

exports.searchCommunitiesPage = (req, res) => {
  res.render('searchCommunities', { title: 'Search for Communities' })
}

exports.nearCommunitiesPage = async (req, res) => {
  const coordinates = req.user.location.coordinates
  const q = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: 10000 // 10000m = 10km
      }
    }
  }
  const communities = await Community.find(q).select(/*name description -location etc.*/)
  res.render('closeCommunities', {
    title: 'See close Communities',
    communities
  })
}
exports.searchCommunities = async (req, res) => {
  const communities = await Community
  .find({
    $text: {
      $search: req.query.q
    }
  }, {
    score: { $meta: 'textScore' }
  })
  .sort({
    score: { $meta: 'textScore' }
  })
  .limit(5)
  res.json(communities)
}

exports.findClosePage = (req, res) => {
  res.render('closeCommunities', { title: 'Close Communities' })
}

exports.addAdminToCommunity = async (req, res) => {
  const community = await Community.findOne({
    _id: req.params.id
  }).exec()
  community.admin.push(req.user._id)
  await community.save()
  req.flash('success', `Added you as an Admin to ${community.name}.`)
  res.redirect('/testy')
}
