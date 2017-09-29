const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  accessToken: String,
  instagramID: String,
  displayName: String,
  username: String,
  profile_picture: String,
  bio: String,
  media: Number,
  follows: Number,
  followed_by: Number,
  paid: Boolean,
  chargeToken: String,
  createdAt: Number,
  stripe_customer_id: String,
  stripe_email: String,
  stripe_subscription_id: String
})

mongoose.model('users', userSchema)
