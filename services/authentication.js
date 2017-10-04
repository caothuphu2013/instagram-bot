const passport = require('passport')
const InstagramStrategy = require('passport-instagram').Strategy
// const LocalStrategy = require('passport-local').Strategy
const keys = require('../config/keys')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const User = mongoose.model('users')

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user))
})

passport.use(
  new InstagramStrategy({
    clientID: keys.instagramClientID,
    clientSecret: keys.instagramClientSecret,
    callbackURL: '/auth/instagram/callback',
    passReqToCallback: true
  },
  (req, accessToken, refreshToken, profile, done) => {
    const instagramProfile = {
      accessToken: accessToken,
      instagramID: profile.id,
      displayName: profile.displayName,
      username: profile._json.data.username,
      profile_picture: profile._json.data.profile_picture,
      bio: profile._json.data.bio,
      media: profile._json.data.counts.media,
      follows: profile._json.data.counts.follows,
      followed_by: profile._json.data.counts.followed_by
    }

    const saveInstaProfile = User.findOneAndUpdate({ email: req.user.email }, instagramProfile, { upsert: true }).exec()

    saveInstaProfile.then(user => done(null, user)).catch(err => done(err, null))
  })
)
