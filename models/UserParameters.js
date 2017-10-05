const mongoose = require('mongoose')
const { Schema } = mongoose

const userParameters = new Schema({
  param_hashtags: Array,
  param_usernames: Array,
  param_like_mode: Boolean,
  param_follow_mode: Boolean,
  username: String,
  instagram_id: String,
  access_token: String,
  user_id: String,
  email: String
})

mongoose.model('user_parameters', userParameters)
