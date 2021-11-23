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

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

exports.updateUser = catchAsync(async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'age'];
  const isValidOperation = updates.every(item => allowedUpdates.includes(item));
  if (!isValidOperation)
    return next(
      new AppError(
        `You can only update NAME and AGE by using this route! Please exclude everything else if you want to proceed`,
        404
      )
    );

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});
