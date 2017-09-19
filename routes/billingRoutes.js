const keys = require('../config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const requireLogin = require('../middlewares/requireLogin')

module.exports = (app) => {
  app.post('/api/stripe', requireLogin, (req, res) => {
    console.log(req.user)
    stripe.charges.create({
      amount: 799,
      currency: 'usd',
      description: 'BuzzLightYear monthly subscription',
      source: req.body.id
    }, (err, charge) => {
      if (err) {
        console.log(err)
      }

      if (charge) {
        const user = req.user
        user.paid = true
        user.chargeToken = req.body.id
        user.save()
        res.send(user)
      }
    })
  })
}
