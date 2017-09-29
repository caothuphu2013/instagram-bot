const ig = require('instagram-node').instagram()
const requireLogin = require('../middlewares/requireLogin')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const UserParameters = mongoose.model('user_parameters')

module.exports = app => {
  // Save user parameters to DB
  app.post('/api/save_params', requireLogin, (req, res) => {
    let { hashtags, username, instagram_id, access_token, user_id } = req.body
    hashtags = hashtags.replace(/[#]|\s/ig, '').split(',')
    const params = { hashtags, username, instagram_id, access_token, user_id }
    const saveParams = UserParameters.findOneAndUpdate({ instagram_id }, params, { upsert: true }).exec()

    saveParams.then(params => {
      res.status(200).send(params)
    }).catch(err => {
      res.status(500).send(err)
    })
  })

  app.post('/api/run_params', requireLogin, (req, res) => {
    const instagram_id = req.body.instagram_id
    const getParams = UserParameters.findOne({ instagram_id }).exec()

    getParams.then(params => {
      res.status(200).send(params)
    }).catch(err => {
      res.status(500).send(err)
    })
  })

  app.get('/api/stop_params', requireLogin, (req, res) => {
    console.log(req.body)
    // UserParameters
    // ig.user('user_id', function(err, result, remaining, limit) {});
  })
  // app.get('/api/ig/like', requireLogin, (req, res) => {
  //   ig.use({ access_token: req.user.accessToken })
  //
  //   ig.tag_media_recent('tohimfromher', (err, result, remaining, limit) => {
  //     console.log('err: ' + err)
  //     console.log('result: ' + result)
  //     res.send(JSON.stringify(result))
  //     // res.redirect('/')
  //   })
  // })

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
}
