const express = require('express');
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');

const router = express.Router();

router
  .route('/')
  .get(userController.isLoggedIn, taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
