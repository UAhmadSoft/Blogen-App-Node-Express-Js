const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('./../models/userModel');
const Post = require('./../models/postModel');

const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const sendMail = require('../utils/email');
// const flash = require()

const signTOken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  return token;
};

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
  ), //* Milliseconds)
  // secure: true,
  httpOnly: true, //? Cookie can NOT be accessed / modified by browser
};

exports.login = catchAsync(async (req, res) => {
  // 1 Check if email and password exists in body
  if (!req.body.email || !req.body.password) {
    req.flash('message', 'Empty Email or Password');
    return res.json({
      status: 'fail',
      message: 'Empty Email or Password',
    });
  }
  const { email, password } = req.body;

  // console.log(email, password);

  // 2 Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    req.flash('message', 'Email Does NOT Exists');
    return res.json({
      status: 'fail',
      message: 'Email  NOT Exists',
    });
  }

  // 3 Check if Account is activated
  if (user.activated === false) {
    req.flash(
      'message',
      'Email Does NOT Activated . Activate your Email from link sent to your Email Account'
    );
    return res.json({
      status: 'fail',
      message: 'Email  NOT Activated!',
    });
  }

  // 4 Check if passwrd is correct
  if (!(await user.comparePassword(password, user.password))) {
    req.flash('message', 'Email and Password NOT Matched');
    return res.json({
      status: 'fail',
      message: 'Email and Password NOT Matched',
    });
  }

  // 5 Sign token and send it
  // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES,
  // });
  const token = signTOken(user.id);

  res.cookie('jwt', token, cookieOptions);

  res.json({
    status: 'success',
  });
  // res.redirect('/');
});

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, bio } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    bio,
  });

  // Generate Account Activation Link
  const activationToken = newUser.createAccountActivationLink();

  newUser.save({ validateBeforeSave: false });

  // 4 Send it to Users Email
  const activationURL = `${req.protocol}://${req.get(
    'host'
  )}/confirmMail/${activationToken}`;

  const message = `GO to this link to activate your Blogen ${activationURL} .Account`;

  sendMail({
    email,
    message,
    subject: 'Your Account Activation Link for Blogen App !',
    user: newUser,
    template: 'signupEmail.ejs',
    url: activationURL,
  });

  req.flash(
    'message',
    'Account Created Successfully ! . Activation Link Sent to Email'
  );

  res.status(200).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'loggedOut', {
    // expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.redirect('/login');
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1 Check if token exists in cookie

  if (!req.cookies.jwt) {
    // console.log('NOT logged in');
    req.flash('message', 'You must Login First');
    return res.redirect('/login');
  }

  // 2 Check if token is valid
  let token = req.cookies.jwt;

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3 Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    req.flash('The user belonging to this token no longer exists');
    return res.redirect('/login');
  }

  // 4 Check if user changed password when after token is issued

  // Grantt Access
  req.user = currentUser;
  next();
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findById(id);

  // Delete / Privatize all posts related to this user
  const posts = await Post.deleteMany({
    user,
  });

  // Delete / deactivate User
  user.active = false;

  await user.save({ runValidators: false });

  res.json({
    status: 'success',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Check if user exists
  const user = await User.findOne({ email: req.user.email });

  if (!user) {
    req.flash('passError', 'No User with this email !');
    return res.json({
      status: 'fail',
    });
  }

  const { passwordCurrent, password, passwordConfirm } = req.body;

  // Check if password is correct
  if (!(await user.comparePassword(passwordCurrent, user.password))) {
    req.flash('passError', 'Wrong Password ! Try again');
    return res.json({
      status: 'fail',
    });
  }

  // Update the password
  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  // Send response
  req.flash('success', 'Password Changed successfully');
  res.redirect(`${req.protocol}://${req.get('host')}/profile`);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1 Check if Email Exists
  const { email } = req.body;

  if (!email) {
    req.flash('error', 'Empty email');
    return res.render('forgotPassword', {
      message: req.flash('message'),
      error: req.flash('error'),
    });
  }

  // 2 Check If User Exists with this email
  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    req.flash('error', 'No User with this email !');
    return res.render('forgotPassword', {
      message: req.flash('message'),
      error: req.flash('error'),
    });
  }

  // 3 Create Password Reset Token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // 4 Send it to Users Email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/resetPassword/${resetToken}`;

  const message = `Forgot Password . Update your Password at this link ${resetURL} if you actually request it
   . If you did NOT forget it , simply ignore this Email`;

  sendMail({
    email,
    message,
    subject: 'Your Password reset token (will expire in 10 minutes)',
    user,
    template: 'forgotPassword.ejs',
    url: resetURL,
  });

  req.flash('message', 'Reset Password Token Successfully Sent to your Email');
  res.render('forgotPassword', {
    message: req.flash('message'),
    error: req.flash('error'),
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  // 1 Find the  user based on Token

  // console.log(req.params.resetToken);

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  // console.log(hashedToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  // 2 Check if user still exists and token is NOT Expired
  if (!user) {
    req.flash('error', 'Token is invalid or expired');
    return res.status(200).json({
      status: 'fail',
    });
  }

  // 3 Change Password and Log the User in
  const { password, passwordConfirm } = req.body;

  // console.log('passwords are', password, passwordConfirm);

  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  const token = signTOken(user._id);

  res.cookie('jwt', token, cookieOptions);

  res.status(200).json({
    status: 'success',
  });

  // res.render('resetPassword', {
  //   // message: req.flash('message'),
  //   passError: req.flash('passError'),
  //   success: req.flash('success'),
  // });
});

exports.confirmMail = catchAsync(async (req, res) => {
  // 1 Hash The Avtivation Link
  // console.log(req.params.activationLink);

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.activationLink)
    .digest('hex');

  // console.log(hashedToken);

  const user = await User.findOne({
    activationLink: hashedToken,
  });

  if (!user) {
    // No Email Found , Redirect to /Login
    return res.redirect('/');
  }

  // 3 Activate his Account
  user.activated = true;
  user.activationLink = undefined;
  await user.save({ validateBeforeSave: false });

  res.render('confirmMail');

  user;
});
