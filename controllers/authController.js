const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Login Failed',
  successRedirect: '/',
  successFlash: 'Successfully logged in.'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out.');
  res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  } else {
    req.flash('info', 'Please log in.');
    res.redirect('/login');
  }
};

exports.forgot = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'No account found with that Email Address.');
    return res.redirect('/login');
  } else {
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordTokenExpires = Date.now() + 3600000; // one hour
    await user.save();
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    await mail.send({
      from: 'LitShare <security@litshareapp.com>',
      to: user.email,
      subject: 'Password Reset',
      resetURL,
      filename: 'password-reset'
    });
    req.flash('success', `You have been emailed a password reset link.`);
    res.redirect('/login');
  }
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordTokenExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('error', 'Password reset token is invalid or has expired.');
    return res.redirect('/login');
  }
  res.render('reset', { title: 'Reset Password' });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    next();
    return;
  }
  req.flash('error', 'Passwords do not match.');
  res.redirect('back');
}

exports.updatePassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordTokenExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('error', 'Password reset token is invalid or has expired.');
    return res.redirect('/login');
  }
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('success', 'Your password has been reset.')
  res.redirect('/');
};
