const findOrCreate = require('mongoose-find-or-create')
const mongoose = require('mongoose')
const { Schema } = mongoose

const Stats = new Schema({
  name: String,
  email: String,
  created_at: Number,
  last_login: Number,
  current_login: Number,
  instagram_current_following: Number,
  instagram_current_followers: Number,
  instagram_lastLogin_following: Number,
  instagram_lastLogin_followers: Number,
  instagram_likes_since_lastLogin: Number,
  instagram_follows_requested_since_lastLogin: Number
})

Stats.plugin(findOrCreate)

module.exports = mongoose.model('stats', Stats)
