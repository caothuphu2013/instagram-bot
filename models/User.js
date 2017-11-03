const mongoose = require('mongoose')
const { Schema } = mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  instagram_accessToken: String,
  instagram_id: String,
  instagram_username: String,
  instagram_current_following: Number,
  instagram_current_followers: Number,
  instagram_current_media: Number,
  verified: Boolean,
  random_hash: String,
  created_at: Number,
  last_login: Number,
  current_login: Number,
  stripe_customer_id: String,
  stripe_email: String,
  stripe_subscription_id: String,
  stripe_token: String
})

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  hashField: 'password'
})

module.exports = mongoose.model('users', userSchema)
