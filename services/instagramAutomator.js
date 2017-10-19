const axios = require('axios')
const keys = require('../config/keys')
const determine = require('./determineParameters')

exports.automate = (params) => {
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
  // Interval Function
  -------------------------*/
  // return setInterval(() => {
  let locationIDs
  let locationMediaIDs

  let usernameIDs = []
  let userRecentMediaIDs = []
  let usersFollowedByIDs

  let hashtagRecentMediaIDs = []

  async function getData () {
    /********************************/
    /*       LOCATIONS DATA         */
    /********************************/
    // get location IDs based off latitude and longitude coordinates
    locationIDs = (latitude && longitude) && await locationSearch()
    // get recent media IDs, that dont include blacklisted hashtags, based off location IDs
    locationMediaIDs = (locationIDs.length > 0) && await locationRecentMedia(locationIDs[0])

    /********************************/
    /*       USERNAMES DATA         */
    /********************************/
    // get username IDs
    if (usernames[0] !== '') {
      for (var a = 0; a < usernames.length; a++) {
        usernameIDs[a] = await userSearch(usernames[a])
      }
    }
    // get recent media IDs based from the username IDs
    if (usernameIDs) {
      for (var b = 0; b < usernames.length; b++) {
        userRecentMediaIDs[b] = await userRecentMedia(usernameIDs[b])
      }
    }
    // get user follwers IDs based off the recent media they liked
    if (userRecentMediaIDs) {

    }

    // /********************************/
    /*       HASHTAGS DATA          */
    /********************************/
    // get recent media IDs based from hashtags
    if (hashtags[0] !== '') {
      for (var d = 0; d < hashtags.length; d++) {
        hashtagRecentMediaIDs[d] = await recentHashtagMedia(hashtags[d])
      }
    }

  }
  // getData()
  // }, 1000)
  /********************************/
  /*           HELPERS            */
  /********************************/
  function doesntHaveBlacklistTags (arr) {
    if (blacklistHashtags[0] !== '') {
      return blacklistHashtags.every(blacklist => !arr.includes(blacklist))
    }

    return true
  }

  function doesntHaveBlacklistUsernames (username) {
    if (blacklistUsernames[0] !== '') {
      for (var x = 0; x < blacklistUsernames.length; x++) {
        return !blacklistUsernames[x].includes(username)
      }
    } else {
      return true
    }
  }

  /********************************/
  /*     LOCATIONS ENDPOINTS      */
  /********************************/
  // get location IDs based off latitude and longitude coordinates
  function locationSearch () {
    return axios.get('https://api.instagram.com/v1/locations/search', {
      params: { lat: latitude, lng: longitude, access_token: accessToken }
    })
    .then(res => {
      const locationIDs = []
      for (var x = 0; x < res.data.data.length; x++) {
        locationIDs[x] = res.data.data[x].id
      }
      return locationIDs
    })
    .catch(err => {
      console.log('location search err: ' + err)
    })
  }

  // get recent media based off location IDs
  function locationRecentMedia (locationID) {
    return axios.get(`https://api.instagram.com/v1/locations/${locationID}/media/recent`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      const data = res.data.data
      const locationMediaIDs = []

      for (var x = 0; x < data.length; x++) {
        if (doesntHaveBlacklistTags(data[x].tags)) {
          locationMediaIDs[x] = data[x].id
        }
      }
      return locationMediaIDs
    })
    .catch(err => {
      console.log('location search err: ' + err)
    })
  }

  /********************************/
  /*     USER SELF ENDPOINTS      */
  /********************************/
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

  /********************************/
  /*        USER ENDPOINTS        */
  /********************************/
  // get recent media IDs based off a username ID
  function userRecentMedia (userID) {
    return axios.get(`https://api.instagram.com/v1/users/${userID}/media/recent/`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      return res.data.data
        .filter(row => doesntHaveBlacklistTags(row.tags))
        .map(row => row.id)

      // const data = res.data.data
      // let userRecentMediaIDs = []
      //
      // for (var x = 0; x < data.length; x++) {
      //   if (doesntHaveBlacklistTags(data[x].tags)) {
      //     userRecentMediaIDs.push(data[x].id)
      //   }
      // }

      return userRecentMediaIDs
    })
    .catch(err => {
      console.log('err: ' + err)
    })
  }

  // get user IDs based from the usernames they want to follow
  function userSearch (username) {
    return axios.get('https://api.instagram.com/v1/users/search', {
      params: { q: username, access_token: accessToken }
    })
    .then(res => {
      return res.data.data[0].id
    })
    .catch(err => {
      console.log('user search err: ' + err)
    })
  }

  /********************************/
  /*        LIKE ENDPOINTS        */
  /********************************/
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

  function usersWhoLikedThisMedia (mediaID) {
    return axios.get(`https://api.instagram.com/v1/media/${mediaID}/likes`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      const data = res.data.data
      let usersWhoLikedThisMediaIDs = []

      for (var x = 0; x < data.length; x++) {
        // console.log(data[x].username)
        // console.log(doesntHaveBlacklistUsernames(data[x].username))
        // if (doesntHaveBlacklistUsernames(data[x].username)) {
          usersWhoLikedThisMediaIDs[x] = data[x].id
        // }
      }

      console.log(usersWhoLikedThisMediaIDs)
      return usersWhoLikedThisMediaIDs
    })
    .catch(err => {
      console.log('usersWhoLikedThisMedia err: ' + err)
    })
  }
  /********************************/
  /*     COMMENT ENDPOINTS        */
  /********************************/

  /********************************/
  /*     HASHTAG ENDPOINTS        */
  /********************************/
  function recentHashtagMedia (hashtag) {
    return axios.get(`https://api.instagram.com/v1/tags/${hashtag}/media/recent`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      const data = res.data.data
      let hashtagRecentMediaIDs = []

      for (var x = 0; x < data.length; x++) {
        if (doesntHaveBlacklistTags(data[x].tags)) {
          hashtagRecentMediaIDs[x] = data[x].id
        }
      }

      return hashtagRecentMediaIDs
    })
    .catch(err => {
      console.log('recent hashtags err: ' + err)
    })
  }
}
