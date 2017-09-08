const passport = require('passport')
const InstagramStrategy = require('passport-instagram').Strategy
const keys = require('../config/keys')
const mongoose = require('mongoose')
// mongoose.Promise = require('bluebird')
const User = mongoose.model('users')

passport.serializeUser((user, done) => {
  console.log('serializeUser: ' + user.id)
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      console.log(user)
      done(null, user)
    })
})

passport.use(
  new InstagramStrategy({
    clientID: keys.instagramClientID,
    clientSecret: keys.instagramClientSecret,
    callbackURL: '/auth/instagram/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ instaID: profile.id })
    if (existingUser) {
      done(null, existingUser)
    } else {
      const user = await new User({ instaID: profile.id }).save()
      done(null, user)
    }
  })
)
