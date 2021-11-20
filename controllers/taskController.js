const Task = require('../model/taskModel');

exports.createTask = async (desc, status = false) => {
  const task = await Task.create({ description: desc, completed: status });
  console.log(task);
};
