const passport = require('passport')
const InstagramStrategy = require('passport-instagram').Strategy
// const LocalStrategy = require('passport-local').Strategy
const keys = require('../config/keys')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const InstagramAccount = require('../models/InstagramAccount')
const User = require('../models/User')
const Stats = require('../models/Stats')

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
    // create and save instagram profile to Instagram Account database collection
    const instagramProfile = {
      name: req.user.name,
      email: req.user.email,
      created_at: Date.now(),
      current_login: Date.now(),
      instagram_accessToken: accessToken,
      instagram_id: profile.id,
      instagram_displayName: profile.displayName,
      instagram_username: profile._json.data.username,
      instagram_profile_picture: profile._json.data.profile_picture,
      instagram_bio: profile._json.data.bio,
      instagram_media: profile._json.data.counts.media,
      instagram_current_following: profile._json.data.counts.follows,
      instagram_current_followers: profile._json.data.counts.followed_by,
      instagram_lastLogin_following: null,
      instagram_lastLogin_followers: null,
      instagram_likes_since_lastLogin: null,
      instagram_follows_requested_since_lastLogin: null,
      instagram_account_total: 1,
      instagram_account: 1
    }

    InstagramAccount.findOrCreate(
      { email: req.user.email },
      instagramProfile,
      (err, result) => {
        if (err) done(err, null)
        updateUser
      })


    // Save and update User database collection
    const userProfile = {
      instagram_accessToken: accessToken,
      instagram_id: profile.id,
      instagram_username: profile._json.data.username,
      instagram_current_following: profile._json.data.counts.follows,
      instagram_current_followers: profile._json.data.counts.followed_by
    }

    const updateUser = User.findOneAndUpdate(
      { email: req.user.email },
      userProfile,
      { upsert: true }
    ).exec()

    updateUser.then(user => done(null, user)).catch(err => done(err, null))
  })
)
