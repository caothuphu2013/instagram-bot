const passport = require('passport')

module.exports = (app) => {
  app.get('/', (req, res) => {})

// instagram routes
  app.get('/auth/instagram', passport.authenticate('instagram'), (req, res) => {})

  app.get('/auth/instagram/callback',
    passport.authenticate('instagram', { failureRedirect: '/' }),
    function (req, res) {
      res.redirect('/dashboard')
    })

// log out
  app.get(
    '/api/logout',
    (req, res) => {
      req.logout()
      res.redirect('/')
    }
  )

  app.get('/api/current_user', (req, res) => {
    res.send(req.user)
  })

  // Google routes
    // app.get('/auth/google', passport.authenticate('google', {
    //   scope: ['profile', 'email']
    // }))
    //
    // app.get(
    //   '/auth/google/callback',
    //   passport.authenticate('google'),
    //   (req, res) => {
    //     res.redirect('/dashboard')
    //   }
    // )
}
