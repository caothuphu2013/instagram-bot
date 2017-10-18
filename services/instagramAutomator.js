const axios = require('axios')
const keys = require('../config/keys')
const determine = require('./determineParameters')

exports.automate = (params) => {
  console.log(params)
  // account
  const instagramID = params.instagram_id
  const accessToken = params.access_token
  const instagramUsername = params.username
  // modes
  const likeMode = params.param_like_mode
  const followMode = params.param_follow_mode
  // hashtags & usernames
  const hashtags = params.param_hashtags
  const usernames = params.param_usernames
  const blacklistHashtags = params.param_blacklist_hashtags
  const blacklistUsernames = params.param_blacklist_usernames
  // LOCATIONS
  const longitude = params.param_longitude
  const latitude = params.param_latitude
  const timezone = params.param_timezone
  // intervals
  const perHour = (process.env.NODE_ENV === 'production') ? 60 : 30
  const oneHour = 3600000
  const globalRateLimit = keys.globalRateLimit // 500 sandbox / 5000 prod
  /*-----------------------
  // Types
  -------------------------*/
  const types = determine.parameters(params)
  // param type
  // 0 = has neither
  // 1 = has hashtags only
  // 2 = has usernames only
  // 3 = has hashtags & usernames

  // location type
  // 0 = has neither
  // 1 = has timezone only
  // 2 = has lat/long only
  // 3 = has timezone & lat/long

  // automator type
  // 0 = has neither
  // 1 = has follow only
  // 2 = has like only
  // 3 = has follow and like

  /*-----------------------
  // Interval
  -------------------------*/
  // return setInterval(() => {
  let locationData
  let usernamesData = []
  let hashtagsData = []

  async function getData () {
    // get location
    locationData = (latitude && longitude) && await locationSearch()

    // get usernames
    // access a user id = usernamesData[0][0].id
    if (usernames[0] !== '') {
      for (var a = 0; a < usernames.length; a++) {
        usernamesData[a] = await userSearch(usernames[a])
      }
    }

    // get hashtag info
    // access a media object id = hashtagsData[0][0].id
    // if (hashtags[0] !== '') {
    //   for (var b = 0; b < hashtags.length; b++) {
    //     hashtagsData[b] = await recentHashtags(hashtags[b])
    //   }
    // }
  }

  getData()
  // }, 1000)

  /********************************/
  /*           LOCATIONS          */
  /********************************/
  // get media based off latitude and longitude coordinates
  function locationSearch () {
    return axios.get('https://api.instagram.com/v1/locations/search', {
      params: { lat: latitude, lng: longitude, access_token: accessToken }
    })
    .then(res => {
      return res.data
    })
    .catch(err => {
      console.log('location search err: ' + err)
    })
  }

  /* -----------------------
  // Self User Endpoints
  -------------------------*/
  function getUserSelf () {
    axios.get('https://api.instagram.com/v1/users/self', {
      params: { access_token: accessToken }
    })
    .then(res => {
      console.log(res.data)
    })
    .catch(err => {
      console.log('get user err: ' + err)
    })
  }

  function userSelfFeed () {
    axios.get('https://api.instagram.com/v1/users/self/media/recent', {
      params: { access_token: accessToken }
    })
    .then(res => {
      console.log(res.data)
    })
    .catch(err => {
      console.log('user self feed err: ' + err)
    })
  }

  function userSelfLiked () {
    axios.get('https://api.instagram.com/v1/users/self/media/liked', {
      params: { access_token: accessToken }
    })
    .then(res => {
      console.log(res.data)
    })
    .catch(err => {
      console.log('user self liked err: ' + err)
    })
  }

  /* -----------------------
  // User Endpoints
  -------------------------*/
  function userRecentMedia (userID) {
    axios.get(`https://api.instagram.com/v1/users/${userID}/media/recent/`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      console.log(res.data)
    })
    .catch(err => {
      console.log('err: ' + err)
    })
  }

  function userSearch (username) {
    return axios.get('https://api.instagram.com/v1/users/search', {
      params: { q: username, access_token: accessToken }
    })
    .then(res => {
      return res.data.data
    })
    .catch(err => {
      console.log('user search err: ' + err)
    })
  }

  /* -----------------------
  // Like Endpoints
  -------------------------*/
  function addLike (mediaID) {
    return axios.post(`https://api.instagram.com/v1/media/${mediaID}/likes`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      console.log('res: ' + res)
    })
    .catch(err => {
      console.log('add like err: ' + err)
    })
  }

  /* -----------------------
  // Comment Endpoints
  -------------------------*/

  /* -----------------------
  // Tag Endpoints
  -------------------------*/
  function recentHashtags (hashtag) {
    return axios.get(`https://api.instagram.com/v1/tags/${hashtag}/media/recent`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      return res.data.data
    })
    .catch(err => {
      console.log('recent hashtags err: ' + err)
    })
  }
}
