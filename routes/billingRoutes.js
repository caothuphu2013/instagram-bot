const keys = require('../config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const requireLogin = require('../middlewares/requireLogin')
const User = require('../models/User')

module.exports = (app) => {
  app.post('/api/stripe/subscribe', requireLogin, (req, res) => {
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) return res.status(400).send(err)

      if (user.paid || user.stripe_email !== '') {
        res.status(200).send('This user is already subscribed')
      } else {
        stripe.customers.create({
          email: req.user.email,
          source: req.body.token.id
        }, (err, customer) => {
          if (err) {
            console.log('customer error: ' + err)
            res.status(500).send(err)
          } else {
            console.log('customer: ' + customer)
            subscribe(customer)
          }
        })

        function subscribe (customer) {
          stripe.subscriptions.create({
            customer: customer.id,
            items: [{ plan: 'buzz-monthly-sub' }]
          }, (err, subscription) => {
            if (err) {
              console.log('subscription error: ' + err)
              res.status(500).send(err)
            } else {
              console.log('subscription: ' + subscription)
              console.log(customer)
              updateUserModel(customer, subscription)
            }
          })
        }

        function updateUserModel (customer, subscription) {
          const user = req.user
          user.stripe_customer_id = customer.id
          user.stripe_email = customer.email
          user.stripe_subscription_id = subscription.id
          user.stripe_token = req.body.token.id
          user.paid = true
          user.save()
          console.log('billing done')
          res.status(200).send('You have successfully subscribed to BuzzLightYear!')
        }
      }
    })
  })

  app.post('/api/stripe/current', requireLogin, (req, res) => {

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
