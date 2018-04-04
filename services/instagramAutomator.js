const axios = require('axios');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const moment = require('moment-timezone');
const fetch = require('node-fetch');
const InstagramAccount = require('../models/InstagramAccount');
const ig = require('instagram-node').instagram();

exports.automate = (params) => {
  // account
  const userEmail = params.email;
  const instagramID = params.instagram_id;
  const accessToken = params.access_token;
  const instagramUsername = params.username;
  // modes
  const likeMode = params.param_like_mode;
  const followMode = params.param_follow_mode;
  const unfollowMode = params.param_unfollow_mode;
  const boostMode = params.param_boost_mode;
  // hashtags & usernames
  const hashtags = params.param_hashtags;
  const usernames = params.param_usernames;
  const blacklistHashtags = params.param_blacklist_hashtags;
  const blacklistUsernames = params.param_blacklist_usernames;
  // LOCATIONS
  const longitude = params.param_longitude;
  const latitude = params.param_latitude;
  const timezone = params.param_timezone;
  const localHour = (timezone) && Number(moment().tz(timezone).format().split('T')[1].split(':')[0]);
  // intervals
  const likeLimitPerHour = (boostMode) ? 120 : 80;
  const followLimitPerHour = (boostMode) ? 120 : 80;
  /*-----------------------
  //  Automator Variables
  -------------------------*/
  let likesPerHour = 0;
  const followsPerHour = 0;
  let apiCallsPerHour = 0;
  const skip = 4;
  let abort = false;

  // GET DATA
  let locationIDs;
  const locationMediaIDs = [];

  const usernameIDs = [];
  const userRecentMediaIDs = [];
  const userIDsWhoFollowUsernames = [];

  const hashtagRecentMediaIDs = [];

  // UNFOLLOW DATA
  let usersIFollow;
  const notFollowedBy = [];

  /* -------------------------
  //  START AUTOMATOR      //
  ------------------------- */
  // check if timezone parameter is in place, if not automatically run automate()
  // if so, check if the localHour is before 10pm and after 7am, when it is run automate()
  if (timezone !== '') {
    if (localHour < 20 && localHour > 7) automate();
  } else {
    automate();
  }

  /* ------------------------
  //  AUTOMATOR            //
  ------------------------- */
  async function automate() {
    if (!abort) await getData();
    if (!abort && likeMode && (likesPerHour < likeLimitPerHour)) await addLikes();
    if (!abort && followMode && (followsPerHour < followLimitPerHour)) await addFollows();
    if (!abort && unfollowMode) await unFollows();
    await finishAutomation();
  }

  /* -------------------------
  //  AUTOMATOR PROCESS    //
  ------------------------- */
  async function getData() {
    /** ***************************** */
    /*       LOCATIONS DATA         */
    /** ***************************** */
    // get location IDs based off latitude and longitude coordinates
    locationIDs = (latitude !== '' && longitude !== '') && await locationSearch();
    // // // get recent media IDs based off location IDs
    if (locationIDs) {
      for (let z = 0; z < locationIDs.length; z++) {
        locationMediaIDs.push(await locationRecentMedia(locationIDs[z]));
      }
    }

    /** ***************************** */
    /*       USERNAMES DATA         */
    /** ***************************** */
    // get username IDs
    if (usernames[0] !== '') {
      for (let a = 0; a < usernames.length; a++) {
        usernameIDs.push(await userSearch(usernames[a]));
      }
    }
    // get recent media IDs based from the username IDs
    if (usernameIDs.length > 0) {
      for (let b = 0; b < usernames.length; b++) {
        userRecentMediaIDs.push(await userRecentMedia(usernameIDs[b]));
      }
    }
    // // get user's followers IDs based off the recent media they liked
    if (userRecentMediaIDs.length > 0) {
      for (let c = 0; c < userRecentMediaIDs.length; c++) {
        if (userRecentMediaIDs[c].length > 0) {
          for (let cc = 0; cc < userRecentMediaIDs[c].length; cc += skip) {
            userIDsWhoFollowUsernames.push(await usersWhoLikedThisMedia(userRecentMediaIDs[c][cc]));
          }
        }
      }
    }

    // /********************************/
    /*       HASHTAGS DATA          */
    /** ***************************** */
    // get recent media IDs based from hashtags
    if (hashtags[0] !== '') {
      for (let d = 0; d < hashtags.length; d++) {
        hashtagRecentMediaIDs.push(await recentHashtagMedia(hashtags[d]));
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

  async function addLikes() {
    /** ***************************** */
    /*       LOCATION LIKES         */
    /** ***************************** */
    // loop through location Media IDs and like posts
    if (latitude !== '' && longitude !== '') {
      if (locationMediaIDs.length > 0) {
        for (let y = 0; y < locationMediaIDs.length; y++) {
          if (locationMediaIDs[y].length > 0) {
            for (let yy = 0; yy < locationMediaIDs[y].length; yy += skip) {
              if (await addLike(locationMediaIDs[y][yy]) === 200) {
                likesPerHour++;
                if (likesPerHour >= likeLimitPerHour) abort = true;
                console.log('added location like');
              }
            }
          }
        }
      }
    }

    /** ***************************** */
    /*  USERS RECENT MEDIA LIKES    */
    /** ***************************** */
    // loop through given usernames recent media
    if (userRecentMediaIDs.length > 0) {
      for (let x = 0; x < userRecentMediaIDs.length; x++) {
        if (userRecentMediaIDs[x].length > 0) {
          for (let xx = 0; xx < userRecentMediaIDs[x].length; xx += skip) {
            if (await addLike(userRecentMediaIDs[x][xx]) === 200) {
              likesPerHour++;
              if (likesPerHour >= likeLimitPerHour) abort = true;
              console.log('added users recent media like');
            }
          }
        }
      }
    }

    /** ***************************** */
    /*  HASHTAG RECENT MEDIA LIKES  */
    /** ***************************** */
    // loop through given hashtag recent media and like some of the media
    if (hashtagRecentMediaIDs.length > 0) {
      for (let z = 0; z < hashtagRecentMediaIDs.length; z++) {
        if (hashtagRecentMediaIDs[z].length > 0) {
          for (let zz = 0; zz < hashtagRecentMediaIDs[z].length; zz += skip) {
            if (await addLike(hashtagRecentMediaIDs[z][zz]) === 200) {
              likesPerHour++;
              if (likesPerHour >= likeLimitPerHour) abort = true;
              console.log('added hashtag recent media like');
            }
          }
        }
      }
    }
  }

  async function addFollows() {
    /** ***************************** */
    /*       USERNAMES DATA         */
    /** ***************************** */
    // loop through user IDs who follow usernames given and request to follow
    if (userIDsWhoFollowUsernames.length > 0) {
      for (let z = 0; z < userIDsWhoFollowUsernames.length; z++) {
        if (userIDsWhoFollowUsernames[z].length > 0) {
          for (let zz = 0; zz < userIDsWhoFollowUsernames[z].length; zz++) {
            console.log(userIDsWhoFollowUsernames[z]);
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

  async function unFollows() {
    // Get list of users I follow
    if (unfollowMode) await getWhoIFollow();

    // Loop through that list and check if each user follows you back
    if (usersIFollow.length > 0) {
      for (let a = 0; a < usersIFollow.length; a++) {
        if (await getRelationship(usersIFollow[a], 'incoming_status') === 'none') {
          notFollowedBy.push(usersIFollow[a]);
        }
      }
    }

    // Now request to unfollow each user who doesnt follow you back
    if (notFollowedBy.length > 0) {
      for (let b = 0; b < notFollowedBy.length; b++) {
        requestToUnfollow(notFollowedBy[b]);
      }
    }
  }

  function finishAutomation() {
    const saveData = InstagramAccount.findOneAndUpdate(
      { email: userEmail },
      {
        $inc: {
          instagram_likes_since_lastLogin: likesPerHour,
          instagram_follows_requested_since_lastLogin: followsPerHour,
        },
      },
      { returnNewDocument: true, upsert: true },
    ).exec();

    saveData.then((params) => {
      console.log(`finish: ${likesPerHour}`);
      console.log(`finish: ${followsPerHour}`);
      console.log(params);
      if (likesPerHour < likeLimitPerHour || followsPerHour < followLimitPerHour) {
        // automate()
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  // [ '30984466', '1749343281', '5277147', '27343860' ]
  requestToFollow('1749343281');

  /** ***************************** */
  /*           HELPERS            */
  /** ***************************** */
  function doesntHaveBlacklistTags(arr) {
    if (blacklistHashtags[0] !== '') {
      return blacklistHashtags.every(blacklist => !arr.includes(blacklist));
    }

    return true;
  }

  function doesntHaveBlacklistUsernames(username) {
    if (blacklistUsernames[0] !== '') {
      return blacklistUsernames.every(blacklist => !username.includes(blacklist));
    }

    return true;
  }

  /** ***************************** */
  /*     LOCATIONS ENDPOINTS      */
  /** ***************************** */
  // get location IDs based off latitude and longitude coordinates
  function locationSearch() {
    return axios.get('https://api.instagram.com/v1/locations/search', {
      params: { lat: latitude, lng: longitude, access_token: accessToken },
    })
      .then((res) => {
        apiCallsPerHour++;
        return res.data.data.map(data => data.id);
      })
      .catch((err) => {
        if (err.response.data.error_type === 'OAuthRateLimitException') abort = true;
      });
  }

  // get recent media based off location IDs
  function locationRecentMedia(locationID) {
    return axios.get(`https://api.instagram.com/v1/locations/${locationID}/media/recent`, {
      params: { access_token: accessToken },
    })
      .then((res) => {
        apiCallsPerHour++;
        return res.data.data
          .filter(data => doesntHaveBlacklistTags(data.tags))
          .map(data => data.id);
      })
      .catch((err) => {
        if (err.response.data.error_type === 'OAuthRateLimitException') abort = true;
      });
  }

  /** ***************************** */
  /*     USER SELF ENDPOINTS      */
  /** ***************************** */
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

  /** ***************************** */
  /*        USER ENDPOINTS        */
  /** ***************************** */
  // get recent media IDs based off a username ID
  function userRecentMedia(userID) {
    return axios.get(`https://api.instagram.com/v1/users/${userID}/media/recent/`, {
      params: { access_token: accessToken },
    })
      .then((res) => {
        apiCallsPerHour++;
        return res.data.data
          .filter(data => doesntHaveBlacklistTags(data.tags))
          .map(data => data.id);
      })
      .catch((err) => {
        if (err.response.data.error_type === 'OAuthRateLimitException') abort = true;
      });
  }

  // get user IDs based from the usernames they want to follow
  function userSearch(username) {
    return axios.get('https://api.instagram.com/v1/users/search', {
      params: { q: username, access_token: accessToken },
    })
      .then((res) => {
        apiCallsPerHour++;
        return res.data.data[0].id;
      })
      .catch((err) => {
        console.log(`user search err: ${err}`);
        if (err.response.data.error_type === 'OAuthRateLimitException') abort = true;
      });
  }

  /** ***************************** */
  /*        MEDIA ENDPOINTS       */
  /** ***************************** */
  function getMediaObject(mediaID) {
    axios.get(`https://api.instagram.com/v1/media/${mediaID}`, {
      params: { access_token: accessToken },
    })
      .then((res) => {
        apiCallsPerHour++;
        // return res.data.data
        //   .filter(data => doesntHaveBlacklistTags(data.tags))
        //   .map(data => data.id)
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(`recent hashtags err: ${err}`);
        if (err.response.data.error_type === 'OAuthRateLimitException') abort = true;
      });
  }

  /** ***************************** */
  /*        LIKE ENDPOINTS        */
  /** ***************************** */
  function addLike(mediaID) {
    return axios.post(`https://api.instagram.com/v1/media/${mediaID}/likes?access_token=${accessToken}`)
      .then((res) => {
        apiCallsPerHour++;
        return res.data.meta.code;
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.error_type === 'OAuthRateLimitException') abort = true;
      });
  }

  function usersWhoLikedThisMedia(mediaID) {
    return axios.get(`https://api.instagram.com/v1/media/${mediaID}/likes`, {
      params: { access_token: accessToken },
    })
      .then((res) => {
        apiCallsPerHour++;
        return res.data.data
          .filter(data => doesntHaveBlacklistUsernames(data.username))
          .map(data => data.id);
      })
      .catch((err) => {
        console.log(`usersWhoLikedThisMedia err: ${err}`);
        if (err.response.data.error_type === 'OAuthRateLimitException') abort = true;
      });
  }

  /** ***************************** */
  /*   RELATIONSHIP ENDPOINTS     */
  /** ***************************** */
  function getWhoIFollow() {
    return axios.get('https://api.instagram.com/v1/users/self/follows', {
      params: { access_token: accessToken },
    })
      .then((res) => {
        apiCallsPerHour++;
        usersIFollow = res.data.data.map(user => user.id);
      })
      .catch((err) => {
        console.log(`get who I follow err: ${err}`);
        if (err.response.data.error_type === 'OAuthRateLimitException') abort = true;
      });
  }

  function getRelationship(usernameID, status) {
    return axios.get(`https://api.instagram.com/v1/users/${usernameID}/relationship`, {
      params: { access_token: accessToken },
    })
      .then((res) => {
        apiCallsPerHour++;
        if (status === 'incoming_status') {
          return res.data.data.incoming_status;
        }
        return res.data.data.outgoing_status;
      })
      .catch((err) => {
        console.log(`get relationship err: ${err}`);
        if (err.response.data.error_type === 'OAuthRateLimitException') abort = true;
      });
  }

  function requestToFollow(usernameID) {
    // axios.post(`https://api.instagram.com/v1/users/${usernameID}/relationship?access_token=${accessToken}`, {
    //   action: 'follow'
    // })
    // .then(res => {
    //   console.log(res.body.data)
    // })
    // .catch(err => {
    //   console.log(err.data)
    // })

    fetch(
      `https://api.instagram.com/v1/users/${usernameID}/relationship?access_token=${accessToken}`,
      { method: 'POST', body: JSON.stringify({ action: 'unfollow' }), headers: { contentType: 'application/json' } },
    )
      .then(res => res.json()).catch((err) => {
        console.log(`err: ${err}`);
      })
      .then((res) => {
        console.log(res);
      });
  }

  function requestToUnfollow(usernameID) {
    // axios.post(`https://api.instagram.com/v1/users/${usernameID}/relationship?access_token=${accessToken}`, {
    //   action: 'unfollow'
    // })
    // .then(res => {
    //   console.log(res.body.data)
    // })
    // .catch(err => {
    //   console.log(err.data)
    // })

    fetch(
      `https://api.instagram.com/v1/users/${usernameID}/relationship?access_token=${accessToken}`,
      { method: 'POST', body: JSON.stringify({ action: 'unfollow' }), headers: { contentType: 'application/json' } },
    )
      .then(res => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(`err: ${err}`);
      });
  }

  /** ***************************** */
  /*     HASHTAG ENDPOINTS        */
  /** ***************************** */
  function recentHashtagMedia(hashtag) {
    return axios.get(`https://api.instagram.com/v1/tags/${hashtag}/media/recent`, {
      params: { access_token: accessToken },
    })
      .then((res) => {
        apiCallsPerHour++;
        return res.data.data
          .filter(data => doesntHaveBlacklistTags(data.tags))
          .map(data => data.id);
      })
      .catch((err) => {
        console.log(`recent hashtags err: ${err}`);
        if (err.response.data.error_type === 'OAuthRateLimitException') abort = true;
      });
  }
};
