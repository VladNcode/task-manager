const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/userModel');
require('dotenv').config({ path: './config.env' });

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
      callbackURL: 'https://vlad-taskapp.herokuapp.com/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
      // console.log(accessToken);
      // console.log(profile); google profile
      let user = await User.findOrCreate(profile);
      return done(null, user);
    }
  )
);
