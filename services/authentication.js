const passport = require('passport')
const InstagramStrategy = require('passport-instagram').Strategy
// const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model('users')

passport.serializeUser((user, done) => {
  console.log('serializeUser: ' + user.id)
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      console.log(user)
      done(null, id)
    })
})

passport.use(
  new InstagramStrategy({
    clientID: keys.instagramClientID,
    clientSecret: keys.instagramClientSecret,
    callbackURL: '/auth/instagram/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ instagramID: profile.id })
    if (existingUser) {
      done(null, existingUser)

    } else {
      const user = await new User({
        accessToken: accessToken,
        instagramID: profile.id,
        displayName: profile.displayName,
        username: profile._json.data.username,
        profile_picture: profile._json.data.profile_picture,
        bio: profile._json.data.bio,
        media: profile._json.data.counts.media,
        follows: profile._json.data.counts.follows,
        followed_by: profile._json.data.counts.followed_by
      }).save()

      done(null, user)
    }
  })
)

// passport.use(
//   new GoogleStrategy({
//     clientID: keys.googleClientID,
//     clientSecret: keys.googleClientSecret,
//     callbackURL: '/auth/google/callback'
//   },
//   (accessToken, refreshToken, profile, done) => {
//     // const existingUser = await User.findOne({ instaID: profile.id })
//     // if (existingUser) {
//     //   done(null, existingUser)
//     // } else {
//     //   const user = await new User({ instaID: profile.id }).save()
//       done(null, profile)
//     // }
//   })
// )

// const obj = {
//     provider: 'instagram',
//     id: '20516057',
//     displayName: 'Colin Johnson',
//     name: {
//         familyName: undefined,
//         givenName: undefined
//     },
//     username: 'sir.colin.johnson',
//     _raw: '{"data": {"id": "20516057", "username": "sir.colin.johnson", "profile_picture": "https://scontent.cdninstagram.com/t51.2885-19/s150x150/13658704_224313097964649_980447858_a.jpg", "full_name": "Colin Johnson", "bio": "My wife and life @berrberrxo. Web developer, music maker, puppy owner, and life enthusiast", "website": "http://goo.gl/CNrjLO", "is_business": false, "counts": {"media": 345, "follows": 466, "followed_by": 469}}, "meta": {"code": 200}}',
//     _json: {
//         data: {
//             id: '20516057',
//             username: 'sir.colin.johnson',
//             profile_picture: 'https://scontent.cdninstagram.com/t51.2885-19/s150x150/13658704_224313097964649_980447858_a.jpg',
//             full_name: 'Colin Johnson',
//             bio: 'My wife and life @berrberrxo. Web developer, music maker, puppy owner, and life enthusiast',
//             website: 'http://goo.gl/CNrjLO',
//             is_business: false,
//             counts: {
//                 media: 345,
//                 follows: 466,
//                 followed_by: 469
//             }
//         },
//         meta: {
//             code: 200
//         }
//     }
// }
