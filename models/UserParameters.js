const findOrCreate = require('mongoose-find-or-create')
const mongoose = require('mongoose')
const { Schema } = mongoose

const userParameters = new Schema({
  param_hashtags: Array,
  param_usernames: Array,
  param_blacklist_hashtags: Array,
  param_blacklist_usernames: Array,
  param_like_mode: Boolean,
  param_follow_mode: Boolean,
  param_automator_running: Boolean,
  param_longitude: String,
  param_latitude: String,
  param_timezone: String,
  username: String,
  instagram_id: String,
  access_token: String,
  user_id: String,
  email: String
})

userParameters.plugin(findOrCreate)

mongoose.model('user_parameters', userParameters)
