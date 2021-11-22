const express = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');

const router = express.Router();

router
  .route('/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router
  .route('/google/callback')
  .get(
    passport.authenticate('google', { failureRedirect: '/auth/failed' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/auth/good');
    }
  );

router.route('/failed').get(authController.failedLogin);
router.route('/good').get(authController.protect, authController.successLogin);

router.route('/logout').get(authController.userLogOut);
router.route('/login').post(authController.login);

module.exports = router;
