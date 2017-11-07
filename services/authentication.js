const passport = require('passport')
const InstagramStrategy = require('passport-instagram').Strategy
// const LocalStrategy = require('passport-local').Strategy
const keys = require('../config/keys')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const InstagramAccount = require('../models/InstagramAccount')
const User = require('../models/User')
const UserParameters = require('../models/UserParameters')

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
      last_login: null,
      instagram_accessToken: accessToken,
      instagram_id: profile.id,
      instagram_displayName: profile.displayName,
      instagram_username: profile._json.data.username,
      instagram_profile_picture: profile._json.data.profile_picture,
      instagram_bio: profile._json.data.bio,
      instagram_current_media: profile._json.data.counts.media,
      instagram_lastLogin_media: null,
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
        userParams
      })

    // create and save an empty user parameters profile to database collection
    const paramsProfile = {
      name: req.user.name,
      email: req.user.email,
      created_at: Date.now(),
      param_hashtags: [],
      param_usernames: [],
      param_blacklist_hashtags: [],
      param_blacklist_usernames: [],
      param_like_mode: false,
      param_follow_mode: false,
      param_unfollow_mode: false,
      param_automator_running: false,
      param_longitude: '',
      param_latitude: '',
      param_timezone: '',
      instagram_id: profile.id,
      access_token: accessToken
    }

    const userParams = UserParameters.findOneAndUpdate(
      { email: req.user.email },
      paramsProfile,
      { upsert: true }
    ).exec()

    userParams.then(user => updateUser).catch(err => done(err, null))

    // Save and update User database collection
    const userProfile = {
      instagram_accessToken: accessToken,
      instagram_id: profile.id,
      instagram_username: profile._json.data.username,
      instagram_current_following: profile._json.data.counts.follows,
      instagram_current_followers: profile._json.data.counts.followed_by,
      instagram_current_media: profile._json.data.counts.media
    }

    const updateUser = User.findOneAndUpdate(
      { email: req.user.email },
      userProfile,
      { upsert: true }
    ).exec()

    updateUser.then(user => done(null, user)).catch(err => done(err, null))
  })
)
