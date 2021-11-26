const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');

exports.getAllTasks = factory.getAll(Task);
exports.getTask = factory.getOne(Task);
// exports.createTask = factory.createOne(Task);
// exports.updateTask = factory.updateOne(Task);
// exports.deleteTask = factory.deleteOne(Task);

exports.createTask = catchAsync(async (req, res, next) => {
  const task = await Task.create({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      task,
    },
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every(item => allowedUpdates.includes(item));
  if (!isValidOperation)
    return next(
      new AppError(
        `You can only update: '${[...allowedUpdates]
          .join(',')
          .replace(/,/g, ', ')
          .toUpperCase()}' fields by using this route! Please exclude everything else if you want to proceed`,
        400
      )
    );

  if (Object.keys(req.body).length === 0) {
    next(new AppError('Provide some data to update.', 400));
  }

  let task = await Task.findById(req.params.id);

  if (!task) return next(new AppError(`No task found with this id ${req.params.id}`, 404));

  if (task.owner.toString() !== req.user.id)
    return next(new AppError(`This task doesn't belong to current user`));

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  let task = await Task.findById(req.params.id);
  if (!task) return next(new AppError(`No task found with this id ${req.params.id}`, 404));

  if (task.owner.toString() !== req.user.id)
    return next(new AppError(`This task doesn't belong to current user`));

  task = await Task.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});
