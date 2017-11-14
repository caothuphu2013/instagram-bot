const passport = require('passport')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const crypto = require('crypto')
const InstagramAccount = require('../models/InstagramAccount')
const User = require('../models/User')
const UserParameters = require('../models/UserParameters')
const StripeAccount = require('../models/StripeAccount')
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
      instagram_current_media: null,
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
              instagram_current_media: medias.counts.media,
              instagram_lastLogin_media: user.instagram_current_media,
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
  app.post('/auth/verify_email', (req, res) => {})

  // update user email
  app.post('/auth/update_email', (req, res) => {
    const errorMessage = 'There was an error updating your email. Please try again.'

    const updateUser = User.findOneAndUpdate(
      { email: req.user.email },
      { email: req.body.new_email, stripe_email: req.body.new_email },
      { new: true, upsert: true }).exec()

    const updateInstagramAccount = InstagramAccount.findOneAndUpdate(
      { email: req.user.email },
      { email: req.body.new_email },
      { new: true, upsert: true }).exec()

    const updateStripeAccount = StripeAccount.findOneAndUpdate(
      { email: req.user.email },
      { email: req.body.new_email, stripe_email: req.body.new_email },
      { new: true, upsert: true }).exec()

    const updateUserParameters = UserParameters.findOneAndUpdate(
      { email: req.user.email },
      { email: req.body.new_email },
      { new: true, upsert: true }).exec()

    updateUser.then(user => {
      startInsta()
    }).catch(err => {
      res.status(500).send(err)
    })

    const startInsta = () => {
      updateInstagramAccount.then(user => {
        startStripe()
      }).catch(err => {
        res.status(500).send(errorMessage)
      })
    }

    const startStripe = () => {
      updateStripeAccount.then(user => {
        startParams()
      }).catch(err => {
        res.status(500).send(errorMessage)
      })
    }

    const startParams = () => {
      updateUserParameters.then(user => {
        res.status(200).send('Email updated successfully')
      }).catch(err => {
        res.status(500).send(errorMessage)
      })
    }
  })

  // reset password
  app.post('/auth/update_password', (req, res) => {
    User.authenticate()(req.user.email, req.body.current_password, (err, user) => {
      if (err) return res.status(500).send('There was an error. Please try again.')

      if (user) {
        user.setPassword(req.body.new_password, () => {
          user.save()
          res.status(200).send('Password reset successfully')
        })
      } else {
        res.status(500).send('This user does not exist')
      }
    })
  })

  // logout current user
  app.post('/auth/delete_account', (req, res) => {
    const errorMessage = 'There was an error deleting your account. Please try again.'

    const deleteUser = User.findOneAndRemove({ email: req.body.email }).exec()

    const deleteInstagramAccount = InstagramAccount.findOneAndRemove({ email: req.body.email }).exec()

    const deleteStripeAccount = StripeAccount.findOneAndRemove({ email: req.body.email }).exec()

    const deleteUserParameters = UserParameters.findOneAndRemove({ email: req.body.email }).exec()

    deleteUser.then(user => {
      deleteInsta()
    }).catch(err => {
      res.status(500).send(errorMessage)
    })

    const deleteInsta = () => {
      deleteInstagramAccount.then(user => {
        deleteStripe()
      }).catch(err => {
        res.status(500).send(errorMessage)
      })
    }

    const deleteStripe = () => {
      deleteStripeAccount.then(user => {
        deleteParams()
      }).catch(err => {
        res.status(500).send(errorMessage)
      })
    }

    const deleteParams = () => {
      deleteUserParameters.then(user => {
        req.logout()
        res.redirect('/')
      }).catch(err => {
        res.status(500).send(errorMessage)
      })
    }
  })

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
