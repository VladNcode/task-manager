const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    password: req.body.password,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getUser = factory.getOne(User);
