const mongoose = require('mongoose');
const User = mongoose.model('User');
const Community = mongoose.model('Community');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');
const stripe = require('stripe')('sk_test_TqKd9uZeMtj1ililB7JLB6JD');

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

exports.editUser = async (req, res) => {
  req.body.location.type = 'Point';
  const user = await User.findOneAndUpdate({ _id: req.user._id }, req.body, {
    new: true,
    runValidators: true,
    context: 'query'
  }).exec();
  req.login(user);
  req.flash('success', 'Updated.')
  res.redirect('/account');
};

exports.account = async (req, res) => {
  if (req.user.stripeSubscription) {
    const subscription = await stripe.subscriptions.retrieve(
      req.user.stripeSubscription,
      function(err, subscription) {
        if (err) {
          console.error(err.message);
        } else {
          console.log(subscription.status);
          res.render('account', {
            title: 'Profile',
            subscriptionStatus: subscription.status
          });
        }
      }
    );
  } else {
    res.render('account', {
      title: 'Profile',
    });
  }
};

exports.upgradeAccount = (req, res) => {
  const token = req.body.stripeToken;
  stripe.customers.create({
    source: token,
    email: req.user.email
  }).then(function(customer) {
    User.findOneAndUpdate({ _id: req.user._id }, { stripeCustomer: customer.id }, {
      runValidators: true,
      context: 'query'
    }).exec();
    return stripe.subscriptions.create({
      customer: customer.id,
      plan: 'premium-monthly'
    });
  }).then(function(subscription) {
    User.findOneAndUpdate({ _id: req.user._id }, { stripeSubscription: subscription.id }, {
      runValidators: true,
      context: 'query'
    }).exec();
  }).then(function() {
    mail.send({
      from: 'LitShare <notify@litshareapp.com>',
      to: req.user.email,
      subject: 'Welcome to LitShare Pro',
      filename: 'plan-begin'
    });
    res.redirect('/account');
  }).catch(function(err) {
    req.flash('error', err.message);
    res.redirect('/account');
  });
};

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

exports.postLeaveCommunity = async (req, res) => {
  const user = await User.findOne({
    _id: req.user._id
  }).exec();
  const community = await Community.findOne({
    _id: req.params.id
  }).exec();
  user.communities.pull(community._id);
  await user.save();
  community.admin.pull(user._id);
  await community.save();
  req.flash('success', `You left the community.`);
  res.redirect(`/communities/${community.slug}`);
};
