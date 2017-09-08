// ORDER OF OPERATIONS
// import express for managing Node
const express = require('express')
const mongoose = require('mongoose')
// mongoose.Promise = require('bluebird')
const cookieSession = require('cookie-session')
const passport = require('passport')
const keys = require('./config/keys')
mongoose.connect(keys.mongoURI)
require('./models/User')
require('./services/authentication')
// connect to mongoDB with mongoose


// invoke express
const app = express()

// tell app to handle cookie storage
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)

// tell passport to make use of cookies to handle authentication
app.use(passport.initialize())
app.use(passport.session())

// routes
// instagram routes
app.get('/auth/instagram', passport.authenticate('instagram'),
(req, res) => {
  console.log(req)
  console.log(res)
})

app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/dashboard')
  })

// log out
app.get('/api/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.get('/api/current_user', (req, res) => {
  res.send(req.user)
})

app.get('/', (req, res) => {
  res.send('working')
  console.log('working')
})

// set port to have express app listen
// const PORT = process.env.PORT || 5000
app.listen(5000)

module.exports = app
