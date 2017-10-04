const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const passportLocalMongoose = require('passport-local-mongoose')
const mongoose = require('mongoose')
const User = mongoose.model('users')

// use static serialize and deserialize of model for passport session support
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user))
})

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()))
