const requireLogin = require('../middlewares/requireLogin')
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
      param_follow_mode,
      param_usernames,
      username,
      instagram_id,
      access_token,
      user_id,
      email
    } = req.body
    param_hashtags = param_hashtags.replace(/[#]|\s/ig, '').split(',')
    param_usernames = param_usernames.replace(/[@]|\s/ig, '').split(',')

    const params = {
      param_hashtags,
      param_like_mode,
      param_follow_mode,
      param_usernames,
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
      { new: true,
        upsert: true
      }).exec()

    saveParams.then(params => {
      res.status(200).send(params)
    }).catch(err => {
      res.status(500).send(err)
    })
  })

  app.post('/api/run_params', requireLogin, (req, res) => {
    const runParams = UserParameters.findOneAndUpdate(
      { email: req.user.email },
      { param_automator_running: true },
      { new: true, psert: true }).exec()

    runParams.then(params => {
      res.status(200).send(params)
      Instagram.automate(params)
    }).catch(err => {
      res.status(500).send(err)
    })
  })

  app.post('/api/stop_params', requireLogin, (req, res) => {
    const stopParams = UserParameters.findOneAndUpdate(
      { email: req.user.email },
      { param_automator_running: false },
      { new: true, psert: true }).exec()

    stopParams.then(params => {
      res.status(200).send(params)
      Instagram.automate(params)
    }).catch(err => {
      res.status(500).send(err)
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
  //
  //   // while (bool) {
  //   //   trimParam(param)
  //   // }
  // }
  //
  // trimParam(param_hashtags)
}
