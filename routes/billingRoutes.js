const keys = require('../config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const requireLogin = require('../middlewares/requireLogin')
const User = require('../models/User')
const StripeAccount = require('../models/StripeAccount')

module.exports = (app) => {
  app.post('/api/stripe/subscribe', requireLogin, (req, res) => {
    // SUBSCRIPTIONS
    // CHECK IF STRIPE CUSTOMER EXISTS INSTEAD
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) return res.status(400).send(err)
      console.log(user)
      if (user.paid === true || user.stripe_email !== '') {
        return res.status(200).send('This user is already subscribed')
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

          StripeAccount.findOrCreate(
            { email: customer.email },
            {
              name: customer.name,
              email: customer.email,
              created_at: Date.now(),
              stripe_status: 'subscribed',
              stripe_customer_id: customer.id,
              stripe_email: customer.email,
              stripe_subscription_id: subscription.id,
              stripe_token: req.body.token.id
            }, (err, result) => {
              if (err) return res.status(500).send(err)

              user.save()
              console.log('billing done')
              res.status(200).send('You have successfully subscribed to BuzzLightYear!')
              console.log(result)
            })
        }
      }
    })
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

  // CUSTOMER

  app.post('/api/stripe/current', requireLogin, (req, res) => {
    stripe.customers.retrieve(
      "cus_BaXXq6kH07HDjv",
      function(err, customer) {
        // asynchronously called
      }
    )
  })

  // BILLING

  app.post('/api/stripe/update_card', requireLogin, (req, res) => {
    stripe.customers.updateCard(
      "cus_BaXXq6kH07HDjv",
      "card_1BDN4TBgmE30r29MKX2qknBB",
      { name: "Joshua Thompson" },
      function(err, card) {
        // asynchronously called
      }
    )
  })

  app.post('/api/stripe/delete_card', requireLogin, (req, res) => {
    stripe.customers.deleteCard(
      "cus_BaXXq6kH07HDjv",
      "card_1BDN4TBgmE30r29MKX2qknBB",
      function(err, confirmation) {
        // asynchronously called
      }
    )
  })

  // COUPONS & DISCOUNTS
  app.post('/api/stripe/create_coupon', requireLogin, (req, res) => {
    stripe.coupons.create({
      percent_off: 25,
      duration: 'repeating',
      duration_in_months: 3,
      id: '25OFF'
    }, function(err, coupon) {
      // asynchronously called
    })
  })

  app.post('/api/stripe/retrieve_coupon', requireLogin, (req, res) => {
    stripe.coupons.retrieve(
      "25OFF",
      function(err, coupon) {
        // asynchronously called
      }
    )
  })

  app.post('/api/stripe/delete_coupon', requireLogin, (req, res) => {
    stripe.coupons.del('25OFF')
  })
}
