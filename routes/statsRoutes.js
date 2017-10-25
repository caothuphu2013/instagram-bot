const passport = require('passport')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const crypto = require('crypto')
// const nodeMailer = require('../services/nodeMailer')
const User = require('../models/User')
const ig = require('instagram-node').instagram()

module.exports = (app) => {
  // get latest stats
  app.get('/stats/latest', (req, res) => {
    User.register(new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      created_at: req.body.createdAt,
      current_login: req.body.createdAt,
      last_login: null,
      random_hash: crypto.randomBytes(20).toString('hex'),
      verified: false,
      paid: false,
      instagram_accessToken: '',
      instagram_id: '',
      instagram_displayName: '',
      instagram_username: '',
      instagram_profile_picture: '',
      instagram_bio: '',
      instagram_media: null,
      instagram_current_following: null,
      instagram_current_followers: null,
      instagram_lastLogin_following: null,
      instagram_lastLogin_followers: null,
      stripe_customer_id: '',
      stripe_email: '',
      stripe_subscription_id: '',
      stripe_token: ''
    }),
    req.body.password, (err, user) => {
      if (err) return res.send(err)

      req.login(user, (err) => {
        if (err) return res.send(err)
        res.send({
          success: true,
          user: user
        })
      })
    })
  })
}
