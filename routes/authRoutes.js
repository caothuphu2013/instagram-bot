const passport = require('passport')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const User = mongoose.model('users')

module.exports = (app) => {
  app.get('/', (req, res) => {})

  app.post('/auth/signup', (req, res) => {
    // console.log(req.body)
    // res.redirect('/dashboard')
    const { name, email, password } = req.body
    User.findOne({ email }, (err, user) => {
      if (err) return res.status(500).send(err)

      if (user === null) {
        // create user
        User.create({
          name,
          email,
          password,
          paid: false,
          createdAt: Date.now()
        }, (err, user) => {
          if (err) return err
          // res.send(user)
          // res.redirect('/auth/instagram')
        })
      } else {
        // return you already have an account
        res.send('You already have an account, please login.')
      }
    })
  })

  app.get('/auth/instagram', passport.authenticate('instagram'), (req, res) => {})

  app.get('/auth/instagram/callback',
    passport.authenticate('instagram', { failureRedirect: '/' }),
    function (req, res) {
      res.redirect('/dashboard')
    })

  app.get('/api/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/api/current_user', (req, res) => {
    res.send(req.user)
  })
}
