const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/userModel');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://127.0.0.1:3000/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      // console.log(profile); google profile
      User.findOrCreate(profile, function (err, user) {
        return done(err, user);
      });
    }
  )
);
