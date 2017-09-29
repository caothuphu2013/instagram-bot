const keys = require('../config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const requireLogin = require('../middlewares/requireLogin')

module.exports = (app) => {
  app.post('/api/stripe/subscribe', requireLogin, (req, res) => {
    stripe.customers.create({
      email: 'jenny.rosen@example.com'
    }, (err, customer) => {
      if (err) {
        console.log(err)
        res.status(500).send(err)
      } else {
        // res.status(200).send(customer)
        // subscribe(customer)
        updateUserModel(customer)
      }
    })

    function subscribe (customer) {
      stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan: 'buzz-monthly-sub' }]
      }, (err, subscription) => {
        if (err) {
          console.log(err)
          res.status(500).send(err)
        } else {
          console.log(subscription)
          // updateUserModel(customer)
        }
      })
    }

    function updateUserModel (customer) {
      const user = req.user
      user.stripe_customer_id = customer.id
      user.stripe_email = customer.email
      user.save()
      res.status(200).send(user)
    }
  })

  app.post('api/stripe/cancel', requireLogin, (req, res) => {
    stripe.subscriptions.del(req.user.stripe_subscription_id,
      { at_period_end: true },
      (err, confirmation) => {
        if (err) {
          console.log(err)
        } else {
          console.log(confirmation)
        }
      }
    )
  })
}
