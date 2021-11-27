const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').post(userController.createUser);

router.route('/login').post(authController.login);
router.route('/logout').get(authController.protect, authController.userLogOut);
router.route('/updatePassword').patch(authController.protect, authController.updatePassword);

// Protecting the routes
router.use(authController.protect);

router.route('/').get(userController.getAllUsers);
router.route('/me').get(authController.getMe);
router.route('/deleteMe').delete(authController.deleteMe);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.uploadMult, userController.resizeUserPhoto, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
