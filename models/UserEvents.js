const mongoose = require('mongoose')
const { Schema } = mongoose

const UserEvents = new Schema({
  event_like: Number,
  event_follow: Number,
  event_comment: Number,
  last_login: Number,
  current_login: Number,
  username: String,
  instagram_id: String,
  access_token: String,
  user_id: String,
  email: String
})

mongoose.model('user_events', UserEvents)
