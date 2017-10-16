const mongoose = require('mongoose')
const { Schema } = mongoose

const InstagramAccount = new Schema({
  name: String,
  email: String,
  created_at: Number,
  last_run: Number,
  instagram_accessToken: String,
  instagram_id: String,
  instagram_displayName: String,
  instagram_username: String,
  instagram_profile_picture: String,
  instagram_bio: String,
  instagram_media: Number,
  instagram_current_following: Number,
  instagram_current_followers: Number,
  instagram_lastLogin_following: Number,
  instagram_lastLogin_followers: Number,
  instagram_account_total: Number,
  instagram_account: Number
})

module.exports = mongoose.model('instagram_account', InstagramAccount)
