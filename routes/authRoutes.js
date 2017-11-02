const passport = require('passport')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const crypto = require('crypto')
const InstagramAccount = require('../models/InstagramAccount')
const User = require('../models/User')
const ig = require('instagram-node').instagram()

module.exports = (app) => {
  // landing page
  app.get('/', (req, res) => {})

  // register and login a new user
  app.post('/auth/signup', (req, res) => {
    User.register(new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      created_at: req.body.createdAt,
      current_login: req.body.createdAt,
      last_login: null,
      random_hash: crypto.randomBytes(20).toString('hex'),
      verified: false,
      instagram_accessToken: '',
      instagram_id: '',
      instagram_username: '',
      instagram_current_following: null,
      instagram_current_followers: null,
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

  // login a existing user
  app.post('/auth/login', (req, res) => {
    User.authenticate()(req.body.email, req.body.password, (err, user, options) => {
      if (err) return res.send(err)

      req.login(user, (err) => {
        if (err) return res.send(err)

        // make instagram api call to get users latest data
        ig.use({ access_token: user.instagram_accessToken })
        ig.user(user.instagram_id, (err, medias, pagination, remaining, limit) => {
          if (err) return res.send(err)

          const updateUser = User.findOneAndUpdate(
            { email: user.email },
            {
              last_login: user.current_login,
              current_login: Date.now()
            },
            { new: true, upsert: true }).exec()

          updateUser.then(user => {
            updateInstagramAccount
          }).catch(err => {
            res.status(500).send(err)
          })

          const updateInstagramAccount = InstagramAccount.findOneAndUpdate(
            { email: user.email },
            {
              last_login: user.current_login,
              current_login: Date.now(),
              instagram_current_following: medias.counts.follows,
              instagram_current_followers: medias.counts.followed_by,
              instagram_lastLogin_following: user.instagram_current_following,
              instagram_lastLogin_followers: user.instagram_current_followers
            },
            { new: true, upsert: true }).exec()

          updateInstagramAccount.then(user => {
            res.status(200).send()
          }).catch(err => {
            res.status(500).send(err)
          })
        })
      })
    })
  })

  // authenticate new instagram account
  app.get('/auth/instagram', passport.authenticate('instagram'), (req, res) => {})

  // callback after authenticating instagram
  app.get('/auth/instagram/callback',
    passport.authenticate('instagram', { failureRedirect: '/' }),
    function (req, res) {
      res.redirect('/dashboard')
    })

  // verify user email
  app.get('/auth/verify', (req, res) => {})

  // reset password
  app.get('/auth/reset_password', (req, res) => {})

  // logout current user
  app.get('/auth/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  // view current logged in user
  app.get('/api/current_user', (req, res) => {
    res.send(req.user)
  })
}
