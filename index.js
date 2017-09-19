// ORDER OF OPERATIONS
// import express for managing Node
const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const bodyParser = require('body-parser')
const keys = require('./config/keys')
require('./models/User')
require('./services/authentication')
mongoose.connect(keys.mongoURI)

// invoke express
const app = express()

app.use(bodyParser.json())

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
require('./routes/authRoutes')(app)
require('./routes/billingRoutes')(app)

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  app.use(express.static('client/build'))

  // express will serve up the index.html file
  // if it doesnt recognize route
  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

// set port to have express app listen
const PORT = process.env.PORT || 5000
app.listen(PORT)

// module.exportss = app
