const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(userController.getAllUsers).post(userController.createUser);

// Protecting the routes
// router.use(authController.protect);

router.route('/login').post(authController.login);
router.route('/logout').get(authController.userLogOut);
router.route('/updatePassword').patch(authController.protect, authController.updatePassword);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
