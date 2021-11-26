const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

//! COOOKIE AND JWT
const signToken = id =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarderd-proto'] === 'https',
  });

  // Remove the password from the output
  user.password = undefined;
  user.active = undefined;
  user.role = undefined;
  user.loginAttempts = undefined;
  user.lockUntil = undefined;
  user.passwordChangedAt = undefined;
  user.__v = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
      userTasks: user.tasks,
    },
  });
};

///////////////////////////////////////////////////////////

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
      userTasks: req.user.tasks,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from Collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if posted password is correct
  if (!user || !(await user.validatePassword(req.body.password, user.password))) {
    return next(new AppError('Email or password is incorrect, please try again', 401));
  }
  // 3) If so, update the
  user.password = req.body.newPassword;
  // user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});

///////////////////////////////////////////////////////////////

//! LOGIN
exports.login = catchAsync(async (req, res, next) => {
  // 1) Check if email and password exist
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please enter email and password', 400));
  }

  // 2) Find user
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError('Please enter correct email and password', 401));

  // 3) Check if password is valid, if not inc log attempts
  if (!(await user.validatePassword(password, user.password))) {
    return next(new AppError('Please enter correct email and password', 401));
  }

  // 4) If everything is ok, send token to client and reset login attempts
  await User.findById(user.id);

  createSendToken(user, 200, req, res);
});

//! LOGOUT
exports.userLogOut = catchAsync(async (req, res, next) => {
  req.session = null;
  req.logout();
  res.clearCookie('jwt');
  // res.redirect('/');

  res.status(200).json({
    status: 'success',
    message: 'You have successfully logged out',
  });
});

//! PROTECT
exports.protect = catchAsync(async (req, res, next) => {
  // Checking if user is logged in via google
  if (req.isAuthenticated()) {
    return next();
  }

  // 1) Getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

//! PASSPORT STUFF
exports.failedLogin = (req, res) => {
  res.status(404).send('You failed to login');
};

exports.successLogin = (req, res) => {
  // console.log(req.user);
  res.status(200).send(`Welcome mr ${req.user}!`);
};
