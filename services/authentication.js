const passport = require('passport')
const InstagramStrategy = require('passport-instagram').Strategy
// const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model('users')

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, id))
})

passport.use(
  new InstagramStrategy({
    clientID: keys.instagramClientID,
    clientSecret: keys.instagramClientSecret,
    callbackURL: '/auth/instagram/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ instagramID: profile.id })
    if (existingUser) {
      done(null, existingUser)
    } else {
      const user = await new User({
        accessToken: accessToken,
        instagramID: profile.id,
        displayName: profile.displayName,
        username: profile._json.data.username,
        profile_picture: profile._json.data.profile_picture,
        bio: profile._json.data.bio,
        media: profile._json.data.counts.media,
        follows: profile._json.data.counts.follows,
        followed_by: profile._json.data.counts.followed_by,
        paid: false,
        chargeToken: '',
        createdAt: Date.now()
      }).save()

      done(null, user)
    }
  })
)
