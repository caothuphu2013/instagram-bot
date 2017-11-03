const findOrCreate = require('mongoose-find-or-create')
const mongoose = require('mongoose')
const { Schema } = mongoose

const InstagramAccount = new Schema({
  name: String,
  email: String,
  created_at: Number,
  current_login: Number,
  last_login: Number,
  instagram_accessToken: String,
  instagram_id: String,
  instagram_displayName: String,
  instagram_username: String,
  instagram_profile_picture: String,
  instagram_bio: String,
  instagram_current_media: Number,
  instagram_lastLogin_media: Number,
  instagram_current_following: Number,
  instagram_current_followers: Number,
  instagram_lastLogin_following: Number,
  instagram_lastLogin_followers: Number,
  instagram_likes_since_lastLogin: Number,
  instagram_follows_requested_since_lastLogin: Number,
  instagram_account_total: Number,
  instagram_account: Number
})

InstagramAccount.plugin(findOrCreate)

module.exports = mongoose.model('instagram_account', InstagramAccount)
