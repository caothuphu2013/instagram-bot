const findOrCreate = require('mongoose-find-or-create')
const mongoose = require('mongoose')
const { Schema } = mongoose

const UserParameters = new Schema({
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
  instagram_id: String,
  access_token: String,
  name: String,
  email: String,
  created_at: Number
})

UserParameters.plugin(findOrCreate)

module.exports = mongoose.model('user_parameters', UserParameters)
