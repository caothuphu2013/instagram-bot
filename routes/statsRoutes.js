const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const Stats = require('../models/Stats')

module.exports = (app) => {
  // get latest stats
  app.get('/api/stats', (req, res) => {
    const getStats = Stats.findOne(
      { email: req.user.email }).exec()

    getStats.then(stats => {
      res.status(200).send(stats)
    }).catch(err => {
      res.status(500).send(err)
    })
  })
}
