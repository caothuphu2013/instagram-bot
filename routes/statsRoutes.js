const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const InstagramAccount = require('../models/InstagramAccount')

module.exports = (app) => {
  // get latest InstagramAccount
  app.get('/api/stats', (req, res) => {
    const getInstagramAccount = InstagramAccount.findOne(
      { email: req.user.email }).exec()

    getInstagramAccount.then(InstagramAccount => {
      console.log(InstagramAccount)
      res.status(200).send(InstagramAccount)
    }).catch(err => {
      res.status(500).send(err)
    })
  })
}
