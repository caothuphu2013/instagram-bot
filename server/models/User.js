const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  accessToken: String,
  instagramID: String,
  displayName: String,
  username: String,
  profile_picture: String,
  bio: String,
  media: Number,
  follows: Number,
  followed_by: Number
})

mongoose.model('users', userSchema)
