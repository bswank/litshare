const mongoose = require('mongoose');
const User = mongoose.model('User');
const Community = mongoose.model('Community');
const promisify = require('es6-promisify');

exports.login = async (req, res) => {
  res.render('login', { title: 'Log In' });
}

exports.signup = async (req, res) => {
  res.render('signup', { title: 'Sign Up' });
}

exports.validateSignup = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'Please enter your name.').notEmpty();
  req.checkBody('email', 'Please enter a valid email address.').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    removeExtension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password is required.').notEmpty();
  req.checkBody('password-confirm', 'Confirmed password is required.').notEmpty();
  req.checkBody('password-confirm', 'Your passwords must match.').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('signup', {
      title: 'Sign Up',
      body: req.body,
      flashes: req.flash()
    });
    return;
  }
  next();
};

exports.saveNewUser = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};

// exports.editUser = async (req, res) => {
//   req.body.location.type = 'Point';
//   const user = await User.findOneAndUpdate({ _id: req.user.id }, req.body, {
//     new: true, // return the new db item instead the old one (default gives the old data)
//     runValidators: true, // re-run validators
//     context: 'query'
//   }).exec(); // execute
//   req.flash('success', `Successfully updated profile.`);
//   res.redirect(`/account`);
// };

exports.editUser = async (req, res) => {

  req.body.location.type = 'Point';
  const user = await User.findOneAndUpdate({ _id: req.user._id }, req.body, {
    new: true, // return the new db item instead the old one (default gives the old data)
    runValidators: true, // re-run validators
    context: 'query'
  }).exec(); // execute

  // const updates = {
  //   name: req.body.name,
  //   email: req.body.email,
  //   bio: req.body.bio,
  //   location: req.body.location,
  // };

  // const user = await User.findOneAndUpdate(
  //   { _id: req.user._id },
  //   { $set: updates },
  //   { new: true, runValidators: true, context: 'query' }
  // );
  req.login(user);
  req.flash('success', 'Updated.')
  res.redirect('/account');
};

exports.account = (req, res) => {
  res.render('account', {
    title: 'Profile'
  });
};

// Add community to user when user joins community
exports.postJoinCommunity = async (req, res) => {

  const user = await User.findOne({
    _id: req.user._id
  }).exec();

  const community = await Community.findOne({
    _id: req.params.id
  }).exec();

  user.communities.push(community._id);
  await user.save();

  req.flash('success', `You joined the community.`);
  res.redirect(`/communities/${community.slug}`);

};

// Remove community from user when user leaves community
exports.postLeaveCommunity = async (req, res) => {

  const user = await User.findOne({
    _id: req.user._id
  }).exec();

  const community = await Community.findOne({
    _id: req.params.id
  }).exec();

  user.communities.pull(community._id);
  await user.save();

  // Remove user from community as admin when user leaves
  community.admin.pull(user._id);
  await community.save();

  req.flash('success', `You left the community.`);
  res.redirect(`/communities/${community.slug}`);

};
