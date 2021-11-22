const AppError = require('../utils/appError');

exports.failedLogin = (req, res) => {
  res.status(404).send('You failed to login');
};

exports.successLogin = (req, res) => {
  res.status(200).send(`Welcome mr ${req.user}!`);
};

exports.isLoggedIn = (req, res, next) => {
  if (!req.user)
    next(new AppError(`'You must be logged in to view this route`, 403));

  next();
};

exports.userLogOut = (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
};
