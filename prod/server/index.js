// ORDER OF OPERATIONS

// import express for managing Node
const express = require('express')

// import mongoose for managing MongoDB
const mongoose = require('mongoose')

// import cookie session manager
const cookieSession = require('cookie-session')

// import passport authentication
const passport = require('passport')

// import config keys
const keys = require('./config/keys')

// build mongo model User
require('./models/User')

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

// invoke Google authentication with passport
require('./services/passport')

// declare routes to use in Express app
require('./routes/authRoutes')(app)

// connect to mongoDB with mongoose
mongoose.connect(keys.mongoURI)

// set port to have express app listen
const PORT = process.env.PORT || 5000
app.listen(PORT)
