const requireLogin = require('../middlewares/requireLogin')
const cron = require('node-cron')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const UserParameters = mongoose.model('user_parameters')
const Instagram = require('../services/instagramAutomator')
const keys = require('../config/keys')

module.exports = app => {
  // Save user parameters to DB
  app.post('/api/save_params', requireLogin, (req, res) => {
    let {
      param_hashtags,
      param_like_mode,
      param_blacklist_hashtags,
      param_blacklist_usernames,
      param_follow_mode,
      param_usernames,
      param_longitude,
      param_latitude,
      param_timezone,
      username,
      instagram_id,
      access_token,
      user_id,
      email
    } = req.body

    param_hashtags = param_hashtags.replace(/[#]|\s/ig, '').split(',')
    param_usernames = param_usernames.replace(/[@]|\s/ig, '').split(',')
    param_blacklist_hashtags = param_blacklist_hashtags.replace(/[#]|\s/ig, '').split(',')
    param_blacklist_usernames = param_blacklist_usernames.replace(/[@]|\s/ig, '').split(',')

    const params = {
      param_hashtags,
      param_like_mode,
      param_blacklist_hashtags,
      param_blacklist_usernames,
      param_follow_mode,
      param_usernames,
      param_longitude,
      param_latitude,
      param_timezone,
      param_automator_running: false,
      username,
      instagram_id,
      access_token,
      user_id,
      email
    }

    const saveParams = UserParameters.findOneAndUpdate(
      { email },
      params,
      { new: true, upsert: true }).exec()

    saveParams.then(params => {
      res.status(200).send(params)
    }).catch(err => {
      res.status(500).send(err)
    })
  })

  let intervals = {}

  app.post('/api/run_params', requireLogin, (req, res) => {
    const runParams = UserParameters.findOneAndUpdate(
      { email: req.user.email },
      { param_automator_running: true },
      { new: true, upsert: true }).exec()

    runParams.then(params => {
      intervals[req.user.email] = Instagram.automate(params)
        // cron.schedule('* * * * *', () => Instagram.automate(params)).start()
      res.status(200).send('Successfully started!')
    }).catch(err => {
      console.log(err)
      res.status(500).send(err)
    })
  })

  app.post('/api/stop_params', requireLogin, (req, res) => {
    const stopParams = UserParameters.findOneAndUpdate(
      { email: req.user.email },
      { param_automator_running: false },
      { new: true, upsert: true }).exec()

    stopParams.then(params => {
      intervals[req.user.email] = ''
      // intervals[req.user.email].stop()
      res.status(200).send('Successfully stopped!')
    }).catch(err => {
      res.status(500).send(err)
    })
  })

  app.get('/api/current_params', requireLogin, (req, res) => {
    const currentParams = UserParameters.findOne({ email: req.user.email }).exec()

    currentParams.then(params => {
      res.status(200).send(params)
    }).catch(err => {
      res.status(400).send(err)
    })
  })

  // function trimParam (param) {
  //   let bool
  //   if (param[param.length - 1] === '' || param[param.length - 1] === ' ' || param[param.length - 1] === ',') {
  //     bool = true
  //     param.pop()
  //   } else {
  //     bool = false
  //   }

    // while (bool) {
    //   trimParam(param)
    // }
  // }
  //
  // trimParam(param_hashtags)
}
