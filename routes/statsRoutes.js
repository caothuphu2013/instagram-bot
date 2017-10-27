const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const Stats = require('../models/Stats')

module.exports = (app) => {
  // get latest stats
  app.get('/stats/latest', (req, res) => {
    console.log('stats')
    const getStats = Stats.findOne(
      { email: req.body.email }).exec()

    getStats.then(stats => {
      res.status(200).send(stats)
    }).catch(err => {
      res.status(500).send(err)
    })
  })
}
