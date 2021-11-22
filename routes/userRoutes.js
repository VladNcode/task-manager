const express = require('express');
const userController = require('../controllers/userController');
const passport = require('passport');

const router = express.Router();

router
  .route('/auth/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router
  .route('/auth/google/callback')
  .get(
    passport.authenticate('google', { failureRedirect: '/failed' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/good');
    }
  );

router.route('/failed').get(userController.failedLogin);
router
  .route('/good')
  .get(userController.isLoggedIn, userController.successLogin);

router.route('/logout').get(userController.userLogOut);

module.exports = router;
