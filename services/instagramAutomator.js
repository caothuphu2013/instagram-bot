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
  let likesPerHour = 0
  let skip = 5

  let locationIDs
  let locationMediaIDs = []

  let usernameIDs = []
  let userRecentMediaIDs = []
  let userIDsWhoFollowUsernames = []

  let hashtagRecentMediaIDs = []

  async function getData () {
    /********************************/
    /*       LOCATIONS DATA         */
    /********************************/
    // get location IDs based off latitude and longitude coordinates
    // locationIDs = (latitude && longitude) && await locationSearch()
    // // get recent media IDs based off location IDs
    // if (locationIDs) {
    //   for (var z = 0; z < locationIDs.length; z++) {
    //     locationMediaIDs.push(await locationRecentMedia(locationIDs[z]))
    //   }
    // }

    /********************************/
    /*       USERNAMES DATA         */
    /********************************/
    // get username IDs
    if (usernames[0] !== '') {
      for (var a = 0; a < usernames.length; a++) {
        usernameIDs.push(await userSearch(usernames[a]))
      }
    }
    // // get recent media IDs based from the username IDs
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

    console.log(userIDsWhoFollowUsernames)

    // /********************************/
    /*       HASHTAGS DATA          */
    /********************************/
    // get recent media IDs based from hashtags
    // if (hashtags[0] !== '') {
    //   for (var d = 0; d < hashtags.length; d++) {
    //     hashtagRecentMediaIDs.push(await recentHashtagMedia(hashtags[d]))
    //   }
    // }
    //
    // console.log(locationIDs)
    // console.log(locationMediaIDs)
    // console.log(usernameIDs)
    // console.log(userRecentMediaIDs)
    // console.log(hashtagRecentMediaIDs)
  }

  async function addLikes () {
    /********************************/
    /*       LOCATIONS DATA         */
    /********************************/
    // loop through location Media IDs and like posts
    if (locationMediaIDs.length > 0) {
      for (var y = 0; y < locationMediaIDs.length; y++) {
        if (locationMediaIDs[y].length > 0) {
          for (var yy = 0; yy < locationMediaIDs[y].length; yy += skip) {
            if (await addLike(locationMediaIDs[y][yy]) === 200) {
              likesPerHour++
              console.log('add location like worked')
            }
          }
        }
      }
    }

    // if (userIDsWhoFollowUsernames.length > 0) {
    //   for (var z = 0; z < userIDsWhoFollowUsernames.length; z++) {
    //     if (userIDsWhoFollowUsernames[z].length > 0) {
    //       for (var zz = 0; zz < userIDsWhoFollowUsernames[z].length; zz += skip) {
    //         // if (await requestToFollow(userIDsWhoFollowUsernames[z][zz]) === 200) {
    //         //   likesPerHour++
    //         //   console.log('add location like worked')
    //         // }
    //       }
    //     }
    //   }
    // }
  }

  async function automate () {
    await getData()
    await addLikes()
  }

  // automate()

  requestToFollow('20516057')

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
      return res.data.data.map(data => data.id)
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
      return res.data.data
        .filter(data => doesntHaveBlacklistTags(data.tags))
        .map(data => data.id)
    })
    .catch(err => {
      console.log('location search err: ' + err)
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
      return res.data.data
        .filter(data => doesntHaveBlacklistTags(data.tags))
        .map(data => data.id)
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
  /*        MEDIA ENDPOINTS       */
  /********************************/
  function getMediaObject (mediaID) {
    axios.get(`https://api.instagram.com/v1/media/${mediaID}`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      // return res.data.data
      //   .filter(data => doesntHaveBlacklistTags(data.tags))
      //   .map(data => data.id)
      console.log(res.data.data)
    })
    .catch(err => {
      console.log('recent hashtags err: ' + err)
    })
  }

  /********************************/
  /*        LIKE ENDPOINTS        */
  /********************************/
  function addLike (mediaID) {
    return axios.post(`https://api.instagram.com/v1/media/${mediaID}/likes?access_token=${accessToken}`)
    .then(res => res.data.meta.code)
    .catch(err => err)
  }

  function usersWhoLikedThisMedia (mediaID) {
    return axios.get(`https://api.instagram.com/v1/media/${mediaID}/likes`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      return res.data.data
        .filter(data => doesntHaveBlacklistUsernames(data.username))
        .map(data => data.id)
    })
    .catch(err => {
      console.log('usersWhoLikedThisMedia err: ' + err)
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
      console.log(res.data.data)
    })
    .catch(err => {
      console.log('usersWhoLikedThisMedia err: ' + err)
    })
  }

  function requestToFollow (usernameID) {
    axios.post(`https://api.instagram.com/v1/users/${usernameID}/relationship?access_token=${accessToken}`, {'action': 'follow'})
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }

  /********************************/
  /*     HASHTAG ENDPOINTS        */
  /********************************/
  function recentHashtagMedia (hashtag) {
    return axios.get(`https://api.instagram.com/v1/tags/${hashtag}/media/recent`, {
      params: { access_token: accessToken }
    })
    .then(res => {
      return res.data.data
        .filter(data => doesntHaveBlacklistTags(data.tags))
        .map(data => data.id)
    })
    .catch(err => {
      console.log('recent hashtags err: ' + err)
    })
  }
}
