const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  instaID: String
})

mongoose.model('users', userSchema)
