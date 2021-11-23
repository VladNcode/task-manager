const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');

exports.getAllTasks = factory.getAll(Task);
exports.getTask = factory.getOne(Task);
exports.createTask = factory.createOne(Task);
exports.updateTask = factory.updateOne(Task);
// exports.deleteTask = factory.deleteOne(Task);

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return next(new AppError('No document found with that ID', 404));
  let count = await Task.countDocuments({ completed: true });
  if (!count) count = 'No documents match this criteria';

  res.status(200).json({
    status: 'success',
    data: {
      task,
      count,
    },
  });
});
