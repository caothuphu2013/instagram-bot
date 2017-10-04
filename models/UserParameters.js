const mongoose = require('mongoose')
const { Schema } = mongoose

const userParameters = new Schema({
  hashtags: Array,
  username: String,
  instagram_id: String,
  access_token: String,
  user_id: String,
  email: String
})

mongoose.model('user_parameters', userParameters)
