const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModel');

exports.login = async (req, res) => {
  // Check if user is Already logged in
  // if (!req.cookies.jwt || req.cookies.jwt === 'loggedOut') {
  //   return res.render('login', { message: req.flash('message') });
  // }

  let token = req.cookies.jwt;
  try {
    await jwt.verify(token, process.env.JWT_SECRET);
    res.redirect('/');
  } catch (err) {
    res.render('login', {
      message: req.flash('message'),
      error: req.flash('error'),
    });
  }

  // console.log('hi');
  // 2 Check if token is valid
};

exports.signup = catchAsync(async (req, res, next) => {
  if (!req.cookies.jwt || req.cookies.jwt === 'loggedOut') {
    return res.render('signup', {
      message: req.flash('message'),
      error: req.flash('error'),
    });
  }

  res.redirect('/');
  // await User.create({
  //   name: 'Umad Ahmad',
  //   email: 'umadahmad1928@gmail.com',
  //   password: 'pass1234',
  //   passwordConfirm: 'pass1234',
  //   bio:
  //     'This is my bio...I am Very Gooo at web dev...I havs basic experience and skillsl at node js and react js I am very Good at progamming ',
  // });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  res.render('forgotPassword', {
    message: req.flash('message'),
    error: req.flash('error'),
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1 Find the  user based on Token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2 Check if user still exists and token is NOT Expired
  if (!user) {
    req.flash('error', 'Token is invalid or expired');
    return res.render('resetPassword', {
      // message: req.flash('message'),
      passError: req.flash('passError'),
      success: req.flash('success'),
    });
  }
  res.render('resetPassword', {
    // message: req.flash('message'),
    passError: req.flash('passError'),
    success: req.flash('success'),
  });
});

exports.confirmMail = catchAsync(async (req, res) => {
  res.render('confirmMail');
});
