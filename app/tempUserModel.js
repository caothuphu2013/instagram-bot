const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  GENERATED_VERIFYING_URL: String
})

mongoose.model('temp_user_model', userSchema)
