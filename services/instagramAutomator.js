const axios = require('axios')
const keys = require('../config/keys')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const moment = require('moment-timezone')
const fetch = require('node-fetch')

exports.automate = (params) => {
  // account
  const userEmail = params.email
  const instagramID = params.instagram_id
  const accessToken = params.access_token
  const instagramUsername = params.username
  // modes
  const likeMode = params.param_like_mode
  const followMode = params.param_follow_mode
  const unfollowMode = params.param_unfollow_mode
  // hashtags & usernames
  const hashtags = params.param_hashtags
  const usernames = params.param_usernames
  const blacklistHashtags = params.param_blacklist_hashtags
  const blacklistUsernames = params.param_blacklist_usernames
  // LOCATIONS
  const longitude = params.param_longitude
  const latitude = params.param_latitude
  const timezone = params.param_timezone
  const localHour = (timezone) && Number(moment().tz(timezone).format().split('T')[1].split(':')[0])
  // intervals
  const perHour = (process.env.NODE_ENV === 'production') ? 60 : 30
  const oneHour = 3600000
  const globalRateLimit = keys.globalRateLimit // 500 sandbox / 5000 prod

  /*-----------------------
  //  Automator Variables
  -------------------------*/
  let likesPerHour = 0
  let followsPerHour = 0
  let apiCallsPerHour = 0
  let skip = 5
  let abort = false

  let locationIDs
  let locationMediaIDs = []

  let usernameIDs = []
  let userRecentMediaIDs = []
  let userIDsWhoFollowUsernames = []

  let hashtagRecentMediaIDs = []

  // for Unfollows function
  let userIDsRequestedToFollow = []

  /*-------------------------
  //  START AUTOMATOR      //
  -------------------------*/
  // check if timezone parameter is in place, if not automatically run automate()
  // if so, check if the localHour is before 10pm and after 7am, when it is run automate()
  // if (timezone !== '') {
  //   if (localHour < 20 && localHour > 7) automate()
  // } else {
  //   automate()
  // }

  /*-------------------------
  //  AUTOMATOR PROCESS    //
  -------------------------*/
  async function getData () {
    /********************************/
    /*       LOCATIONS DATA         */
    /********************************/
    // get location IDs based off latitude and longitude coordinates
    locationIDs = (latitude !== '' && longitude !== '') && await locationSearch()
    // // get recent media IDs based off location IDs
    if (locationIDs) {
      for (var z = 0; z < locationIDs.length; z++) {
        locationMediaIDs.push(await locationRecentMedia(locationIDs[z]))
      }
    }

    /********************************/
    /*       USERNAMES DATA         */
    /********************************/
    // get username IDs
    if (usernames[0] !== '') {
      for (var a = 0; a < usernames.length; a++) {
        usernameIDs.push(await userSearch(usernames[a]))
      }
    }
    // get recent media IDs based from the username IDs
    if (usernameIDs) {
      for (var b = 0; b < usernames.length; b++) {
        userRecentMediaIDs.push(await userRecentMedia(usernameIDs[b]))
      }
    }
    // get user's followers IDs based off the recent media they liked
    if (userRecentMediaIDs) {
      for (var c = 0; c < userRecentMediaIDs.length; c++) {
        if (userRecentMediaIDs[c].length > 0) {
          for (var cc = 0; cc < userRecentMediaIDs[c].length; cc += skip) {
            userIDsWhoFollowUsernames.push(await usersWhoLikedThisMedia(userRecentMediaIDs[c][cc]))
          }
        }
      }
    }

    // /********************************/
    /*       HASHTAGS DATA          */
    /********************************/
    // get recent media IDs based from hashtags
    if (hashtags[0] !== '') {
      for (var d = 0; d < hashtags.length; d++) {
        hashtagRecentMediaIDs.push(await recentHashtagMedia(hashtags[d]))
      }
    }
    //
    // console.log(locationIDs)
    // console.log(locationMediaIDs)
    // console.log(usernameIDs)
    // console.log(userRecentMediaIDs)
    // console.log(userIDsWhoFollowUsernames)
    // console.log(hashtagRecentMediaIDs)
  }

  async function addLikes () {
    /********************************/
    /*       LOCATION LIKES         */
    /********************************/
    // loop through location Media IDs and like posts
    if (locationMediaIDs.length > 0) {
      for (var y = 0; y < locationMediaIDs.length; y++) {
        if (locationMediaIDs[y].length > 0) {
          for (var yy = 0; yy < locationMediaIDs[y].length; yy += skip) {
            if (await addLike(locationMediaIDs[y][yy]) === 200) {
              likesPerHour++
              console.log('added location like')
            }
          }
        }
      }
    }

    /********************************/
    /*  USERS RECENT MEDIA LIKES    */
    /********************************/
    // loop through given usernames recent media
    if (userRecentMediaIDs.length > 0) {
      for (var x = 0; x < userRecentMediaIDs.length; x++) {
        if (userRecentMediaIDs[x].length > 0) {
          for (var xx = 0; xx < userRecentMediaIDs[x].length; xx += skip) {
            if (await addLike(userRecentMediaIDs[x][xx]) === 200) {
              likesPerHour++
              console.log('added users recent media like')
            }
          }
        }
      }
    }
  }

  function addFollows () {
    /********************************/
    /*       USERNAMES DATA         */
    /********************************/
    // loop through user IDs who follow usernames given and request to follow
    if (userIDsWhoFollowUsernames.length > 0) {
      for (var z = 0; z < userIDsWhoFollowUsernames.length; z++) {
        if (userIDsWhoFollowUsernames[z].length > 0) {
          for (var zz = 0; zz < userIDsWhoFollowUsernames[z].length; zz++) {
            console.log(userIDsWhoFollowUsernames[z])
            // if (await requestToFollow(userIDsWhoFollowUsernames[z][zz]) === 200) {
            //   followsPerHour++
            //   userIDsRequestedToFollow.push(userIDsWhoFollowUsernames[z][zz])
            //   console.log('add location like worked')
            // }
          }
        }
      }
    }
  }

  function unFollows () {

  }

  function finishAutomation () {
    // const saveData = Stats.findOneAndUpdate(
    //   { email: userEmail },
    //   {
    //     $inc: {
    //       instagram_likes_since_lastLogin: likesPerHour,
    //       instagram_follows_requested_since_lastLogin: followsPerHour
    //     }
    //   },
    //   { returnNewDocument: true, upsert: true }).exec()
    //
    // saveData.then(params => {
    //     console.log('finish: ' + likesPerHour)
    //     console.log('finish: ' + perHour)
    //     // if (likesPerHour < perHour && followsPerHour < perHour) automate()
    //   }).catch(err => {
    //     console.log(err)
    //   })
  }

  async function automate () {
    if (!abort) await getData()
    if (!abort && likeMode) await addLikes()
    if (!abort && followMode) await addFollows()
    if (!abort) await finishAutomation()
  }

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
      return blacklistUsernames.every(blacklist => !username.includes(blacklist))
    }

    return true
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
      apiCallsPerHour++
      return res.data.data.map(data => data.id)
    })
    .catch(err => {
      if (err.response.data.error_type === 'OAuthRateLimitException') abort = true
    })
  }

  // get recent media based off location IDs
  function locationRecentMedia (locationID) {
    return axios.get(`https://api.instagram.com/v1/locations/${locationID}/media/recent`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      apiCallsPerHour++
      return res.data.data
        .filter(data => doesntHaveBlacklistTags(data.tags))
        .map(data => data.id)
    })
    .catch(err => {
      if (err.response.data.error_type === 'OAuthRateLimitException') abort = true
    })
  }

  /********************************/
  /*     USER SELF ENDPOINTS      */
  /********************************/
  // function getUserSelf () {
  //   axios.get('https://api.instagram.com/v1/users/self', {
  //     params: { access_token: accessToken }
  //   })
  //   .then(res => {
  //     console.log(res.data)
  //   })
  //   .catch(err => {
  //     console.log('get user err: ' + err)
  //   })
  // }
  //
  // function userSelfFeed () {
  //   axios.get('https://api.instagram.com/v1/users/self/media/recent', {
  //     params: { access_token: accessToken }
  //   })
  //   .then(res => {
  //     console.log(res.data)
  //   })
  //   .catch(err => {
  //     console.log('user self feed err: ' + err)
  //   })
  // }
  //
  // function userSelfLiked () {
  //   axios.get('https://api.instagram.com/v1/users/self/media/liked', {
  //     params: { access_token: accessToken }
  //   })
  //   .then(res => {
  //     console.log(res.data)
  //   })
  //   .catch(err => {
  //     console.log('user self liked err: ' + err)
  //   })
  // }

  /********************************/
  /*        USER ENDPOINTS        */
  /********************************/
  // get recent media IDs based off a username ID
  function userRecentMedia (userID) {
    return axios.get(`https://api.instagram.com/v1/users/${userID}/media/recent/`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      apiCallsPerHour++
      return res.data.data
        .filter(data => doesntHaveBlacklistTags(data.tags))
        .map(data => data.id)
    })
    .catch(err => {
      if (err.response.data.error_type === 'OAuthRateLimitException') abort = true
    })
  }

  // get user IDs based from the usernames they want to follow
  function userSearch (username) {
    return axios.get('https://api.instagram.com/v1/users/search', {
      params: { q: username, access_token: accessToken }
    })
    .then(res => {
      apiCallsPerHour++
      return res.data.data[0].id
    })
    .catch(err => {
      console.log('user search err: ' + err)
      if (err.response.data.error_type === 'OAuthRateLimitException') abort = true
    })
  }

  /********************************/
  /*        MEDIA ENDPOINTS       */
  /********************************/
  function getMediaObject (mediaID) {
    axios.get(`https://api.instagram.com/v1/media/${mediaID}`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      apiCallsPerHour++
      // return res.data.data
      //   .filter(data => doesntHaveBlacklistTags(data.tags))
      //   .map(data => data.id)
      console.log(res.data.data)
    })
    .catch(err => {
      console.log('recent hashtags err: ' + err)
      if (err.response.data.error_type === 'OAuthRateLimitException') abort = true
    })
  }

  /********************************/
  /*        LIKE ENDPOINTS        */
  /********************************/
  function addLike (mediaID) {
    return axios.post(`https://api.instagram.com/v1/media/${mediaID}/likes?access_token=${accessToken}`)
    .then(res => {
      apiCallsPerHour++
      return res.data.meta.code
    })
    .catch(err => {
      console.log('add like error: ' + err)
      if (err.response.data.error_type === 'OAuthRateLimitException') abort = true
    })
  }

  function usersWhoLikedThisMedia (mediaID) {
    return axios.get(`https://api.instagram.com/v1/media/${mediaID}/likes`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      apiCallsPerHour++
      return res.data.data
        .filter(data => doesntHaveBlacklistUsernames(data.username))
        .map(data => data.id)
    })
    .catch(err => {
      console.log('usersWhoLikedThisMedia err: ' + err)
      if (err.response.data.error_type === 'OAuthRateLimitException') abort = true
    })
  }

  /********************************/
  /*   RELATIONSHIP ENDPOINTS     */
  /********************************/
  function getRelationship (usernameID) {
   axios.get(`https://api.instagram.com/v1/users/${usernameID}/relationship`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      apiCallsPerHour++
      console.log(res.data.data)
    })
    .catch(err => {
      console.log('get relationship err: ' + err)
      if (err.response.data.error_type === 'OAuthRateLimitException') abort = true
    })
  }

  function requestToFollow (usernameID) {
    // return axios.post(`https://api.instagram.com/v1/users/${usernameID}/relationship?access_token=${accessToken}?`, { action: 'follow' })
    // .then(res => {
    //   apiCallsPerHour++
    //   console.log(res)
    // })
    // .catch(err => {
    //   console.log(err)
    //   if (err.response.data.error_type === 'OAuthRateLimitException') abort = true
    // })
    // let action = { 'action': 'follow' }
    // fetch(`https://api.instagram.com/v1/users/${usernameID}/relationship?access_token=${accessToken}`,
    //   { method: 'POST', action: 'follow' })
    // .then(res => {
    //   console.log(res)
    // }).catch(err => {
    //   console.log(err)
    // })
  }

  /********************************/
  /*     HASHTAG ENDPOINTS        */
  /********************************/
  function recentHashtagMedia (hashtag) {
    return axios.get(`https://api.instagram.com/v1/tags/${hashtag}/media/recent`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      apiCallsPerHour++
      return res.data.data
        .filter(data => doesntHaveBlacklistTags(data.tags))
        .map(data => data.id)
    })
    .catch(err => {
      console.log('recent hashtags err: ' + err)
      if (err.response.data.error_type === 'OAuthRateLimitException') abort = true
    })
  }
}
