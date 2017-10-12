const ig = require('instagram-node').instagram()
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const UserParameters = mongoose.model('user_parameters')
const keys = require('../config/keys')

exports.automate = (params) => {
  // user and user parameters
  const automatorRunning = params.param_automator_running
  const instagramID = params.instagram_id
  const accessToken = params.access_token
  const instagramUsername = params.username
  const likeMode = params.param_like_mode
  const followMode = params.param_follow_mode
  const hashtags = params.param_hashtags
  const usernames = params.param_usernames

  // intervals
  const perHour = (process.env.NODE_ENV === 'production') ? 60 : 30
  const oneHour = 3600000
  const globalRateLimit = keys.globalRateLimit // 500 sandbox / 5000 prod

  return setInterval(() => {
    console.log('params running')
  }, 1000)
}
// instagram media object
  // { id: '1614793834360996998_1749343281',
  //    user:
  //     { id: '1749343281',
  //       full_name: 'To Him, From Her ©',
  //       profile_picture: 'https://scontent.cdninstagram.com/t51.2885-19/s150x150/10549840_947957501943619_2008003711_a.jpg',
  //       username: 'tohimfromher' },
  //    images:
  //     { thumbnail:
  //        { width: 150,
  //          height: 150,
  //          url: 'https://scontent.cdninstagram.com/t51.2885-15/s150x150/e35/22069747_508438829509237_7901288774234013696_n.jpg' },
  //       low_resolution:
  //        { width: 320,
  //          height: 320,
  //          url: 'https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/22069747_508438829509237_7901288774234013696_n.jpg' },
  //       standard_resolution:
  //        { width: 640,
  //          height: 640,
  //          url: 'https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/22069747_508438829509237_7901288774234013696_n.jpg' } },
  //    created_time: '1506718447',
  //    caption:
  //     { id: '17900160550024286',
  //       text: '✧NEW PRODUCT✧ New Women’s Triangle Geometric Ring! Available now ✨ [Swipe for more photos!] Head on over to our shop, to see what else we have in store! ▫️Link in Bio▫️',
  //       created_time: '1506718447',
  //       from:
  //        { id: '1749343281',
  //          full_name: 'To Him, From Her ©',
  //          profile_picture: 'https://scontent.cdninstagram.com/t51.2885-19/s150x150/10549840_947957501943619_2008003711_a.jpg',
  //          username: 'tohimfromher' } },
  //    user_has_liked: true,
  //    likes: { count: 46 },
  //    tags:
  //     [ 'instagood',
  //       'etsyshop',
  //       'pnw',
  //       'etsyseller',
  //       'etsyfinds',
  //       'trendy',
  //       'jewelrygram',
  //       'entrepreneur',
  //       'etsy',
  //       'womens',
  //       'fashionable',
  //       'tohimfromher',
  //       'boho',
  //       'necklace',
  //       'accessories',
  //       'rings',
  //       'jewelry',
  //       'modern',
  //       'shop',
  //       'crystals',
  //       'pendants',
  //       'smallbusiness',
  //       'chokers',
  //       'shopping',
  //       'handmade',
  //       'mens',
  //       'handcrafted',
  //       'insta',
  //       'fashion' ],
  //    filter: 'Normal',
  //    comments: { count: 1 },
  //    type: 'carousel',
  //    link: 'https://www.instagram.com/p/BZo5m_SlASG/',
  //    location:
  //     { latitude: 45.52,
  //       longitude: -122.682,
  //       name: 'Portland, Oregon',
  //       id: 107711604 },
  //    attribution: null,
  //    users_in_photo: [],
  //    carousel_media:
  //     [ { images: [Object], users_in_photo: [], type: 'image' },
  //       { images: [Object], users_in_photo: [], type: 'image' },
  //       { images: [Object], users_in_photo: [], type: 'image' } ] }

  /********************************/
/*            USERS             */
/********************************/

  /* OPTIONS: { [count], [min_id], [max_id] }; */
  // ig.user_self_feed([options,] function(err, medias, pagination, remaining, limit) {});
  //
  // /* OPTIONS: { [count], [min_timestamp], [max_timestamp], [min_id], [max_id] }; */
  // ig.user_media_recent('user_id', [options,] function(err, medias, pagination, remaining, limit) {});
  //
  // /* OPTIONS: { [count], [min_timestamp], [max_timestamp], [min_id], [max_id] }; */
  // ig.user_self_media_recent([options,] function(err, medias, pagination, remaining, limit) {});
  //
  // /* OPTIONS: { [count], [max_like_id] }; */
  // ig.user_self_liked([options,] function(err, medias, pagination, remaining, limit) {});
  //
  // /* OPTIONS: { [count] }; */
  // ig.user_search('username', [options,] function(err, users, remaining, limit) {});
  //
  // /********************************/
  // /*         RELATIONSHIP         */
  // /********************************/
  // /* OPTIONS: { [count], [cursor] }; */
  // ig.user_follows('user_id', function(err, users, pagination, remaining, limit) {});
  //
  // /* OPTIONS: { [count], [cursor] }; */
  // ig.user_followers('user_id', function(err, users, pagination, remaining, limit) {});
  //
  // ig.user_self_requested_by(function(err, users, remaining, limit) {});
  //
  // ig.user_relationship('user_id', function(err, result, remaining, limit) {});
  //
  // ig.set_user_relationship('user_id', 'follow', function(err, result, remaining, limit) {});
  //
  // /********************************/
  // /*           MEDIAS             */
  // /********************************/
  // ig.media('media_id', function(err, media, remaining, limit) {});
  //
  // /* OPTIONS: { [min_timestamp], [max_timestamp], [distance] }; */
  // ig.media_search(48.4335645654, 2.345645645, [options,] function(err, medias, remaining, limit) {});
  //
  // ig.media_popular(function(err, medias, remaining, limit) {});
  //
  // /********************************/
  // /*           COMMENTS           */
  // /********************************/
  // ig.comments('media_id', function(err, result, remaining, limit) {});
  //
  // ig.add_comment('media_id', 'your comment', function(err, result, remaining, limit) {});
  //
  // ig.del_comment('media_id', 'comment_id', function(err, remaining, limit) {});
  //
  // /********************************/
  // /*            LIKES             */
  // /********************************/
  // ig.likes('media_id', function(err, result, remaining, limit) {});
  //
  // ig.add_like('media_id', function(err, remaining, limit) {});
  //
  // ig.del_like('media_id', function(err, remaining, limit) {});
  //
  // /********************************/
  // /*             TAGS             */
  // /********************************/
  // ig.tag('tag', function(err, result, remaining, limit) {});
  //
  // /* OPTIONS: { [min_tag_id], [max_tag_id] }; */
  // ig.tag_media_recent('tag', [options,] function(err, medias, pagination, remaining, limit) {});
  //
  // ig.tag_search('query', function(err, result, remaining, limit) {});
  //
  // /********************************/
  // /*           LOCATIONS          */
  // /********************************/
  // ig.location('location_id', function(err, result, remaining, limit) {});
  //
  // /* OPTIONS: { [min_id], [max_id], [min_timestamp], [max_timestamp] }; */
  // ig.location_media_recent('location_id', [options,] function(err, result, pagination, remaining, limit) {});
  //
  // /* SPECS: { lat, lng, [foursquare_v2_id], [foursquare_id] }; */
  // /* OPTIONS: { [distance] }; */
  // ig.location_search({ lat: 48.565464564, lng: 2.34656589 }, [options,] function(err, result, remaining, limit) {});
  //
  // /********************************/
  // /*          GEOGRAPHIES         */
  // /********************************/
  // /* OPTIONS: { [min_id], [count] } */
  // ig.geography_media_recent(geography_id, [options,] function(err, result, pagination, remaining, limit) {});
  //
  // /********************************/
  // /*         SUBSCRIPTIONS        */
  // /********************************/
  // ig.subscriptions(function(err, result, remaining, limit){});
  //
  // ig.del_subscription({id:1}, function(err,subscriptions,limit){})
  //
  // /* OPTIONS: { [verify_token] } */
  // ig.add_tag_subscription('funny', 'http://MYHOST/tag/funny', [options,] function(err, result, remaining, limit){});
  //
  // /* OPTIONS: { [verify_token] } */
  // ig.add_geography_subscription(48.565464564, 2.34656589, 100, 'http://MYHOST/geography', [options,] function(err, result, remaining, limit){});
  //
  // /* OPTIONS: { [verify_token] } */
  // ig.add_user_subscription('http://MYHOST/user', [options,] function(err, result, remaining, limit){});
  //
  // /* OPTIONS: { [verify_token] } */
  // ig.add_location_subscription(1257285, 'http://MYHOST/location/1257285', [options,] function(err, result, remaining, limit){});
