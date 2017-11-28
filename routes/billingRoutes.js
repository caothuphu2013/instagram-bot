const keys = require('../config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const requireLogin = require('../middlewares/requireLogin')
const User = require('../models/User')
const StripeAccount = require('../models/StripeAccount')

module.exports = (app) => {
  // SUBSCRIPTION

  app.post('/api/stripe/subscribe', requireLogin, (req, res) => {
    // SUBSCRIPTIONS
    // CHECK IF STRIPE CUSTOMER EXISTS INSTEAD
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) return res.status(400).send(err)

      if (user.stripe_customer_id !== '') {
        return res.status(200).send('This user is already subscribed')
      } else {
        stripe.customers.create({
          email: req.user.email,
          source: req.body.token.id
        }, (err, customer) => {
          if (err) {
            res.status(500).send(err)
          } else {
            subscribe(customer, user)
          }
        })
      }
    })

    function subscribe (customer, user) {
      if (user.stripe_subscription_id !== '') {
        return res.status(200).send('This user is already subscribed')
      } else {
        stripe.subscriptions.create({
          customer: customer.id,
          items: [{ plan: 'buzz-monthly-sub' }]
        }, (err, subscription) => {
          if (err) {
            res.status(500).send(err)
          } else {
            updateUserModel(customer, subscription)
          }
        })
      }
    }

    function updateUserModel (customer, subscription) {
      const user = req.user
      user.stripe_customer_id = customer.id
      user.stripe_email = customer.email
      user.stripe_subscription_id = subscription.id
      user.stripe_token = req.body.token.id

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
          stripe_token: req.body.token.id,
          stripe_current_period_end: subscription.current_period_end,
          stripe_current_period_start: subscription.current_period_start,
          strip_cancel_at_period_end: false
        }, (err, result) => {
          if (err) return res.status(500).send(err)

          user.save()
          res.status(200).send('You have successfully subscribed to BuzzLightYear!')
        })
    }
  })

  app.post('/api/stripe/cancel_sub', requireLogin, (req, res) => {
    const error = 'There was an error updating your subscription in the database, please try again.'

    stripe.subscriptions.del(req.user.stripe_subscription_id,
      { at_period_end: true },
      (err, confirmation) => {
        if (err) res.status(500).send(err)

        if (confirmation.cancel_at_period_end) {
          const updateUser = User.findOneAndUpdate(
            { email: req.user.email },
            { stripe_cancel_at_period_end: true },
            { new: true, upsert: true }).exec()

          updateUser.then(params => {
            updateStripe
          }).catch(err => {
            res.status(500).send(error)
          })

          const updateStripe = StripeAccount.findOneAndUpdate(
            { email: req.user.email },
            { stripe_cancel_at_period_end: true },
            { new: true, upsert: true }).exec()

          updateStripe.then(params => {
            res.status(200).send(`You have successfully unsubscribed from Project Buzz. You may continue using the app until ${new Date(confirmation.current_period_end).toLocaleString().split(',')[0]}`)
          }).catch(err => {
            res.status(500).send(error)
          })
        } else {
          res.status(200).send(error)
        }
      })
  })

  app.post('/api/stripe/reactivate_sub', requireLogin, (req, res) => {
    const error = 'There was an error reactivating your subscription, please try again.'
    stripe.subscriptions.retrieve(
      req.user.stripe_subscription_id,
      (err, subscription) => {
        if (err) res.status(500).send(error)
        const itemID = subscription.items.data[0].id
        const trialEnd = subscription.current_period_end
        updateSub(itemID, trialEnd)
      }
    )

    const updateSub = (itemID, trialEnd) => {
      stripe.subscriptions.update(
        req.user.stripe_subscription_id,
        {
          trial_end: trialEnd,
          items: [{
            id: itemID,
            plan: 'buzz-monthly-sub'
          }]
        },
      (err, subscription) => {
        if (err) res.status(500).send(error)

        if (subscription.cancel_at_period_end === false) {
          const updateUser = User.findOneAndUpdate(
            { email: req.user.email },
            { stripe_cancel_at_period_end: false },
            { new: true, upsert: true }).exec()

          updateUser.then(params => {
            updateStripe
          }).catch(err => {
            res.status(500).send(error)
          })

          const updateStripe = StripeAccount.findOneAndUpdate(
            { email: req.user.email },
            { stripe_cancel_at_period_end: true },
            { new: true, upsert: true }).exec()

          updateStripe.then(params => {
            res.status(200).send(`You have successfully resinstated your subscription, your billing will start again on ${new Date(subscription.trial_end).toLocaleString().split(',')[0]}`)
          }).catch(err => {
            res.status(500).send(error)
          })
        } else {
          res.status(200).send(error)
        }
      })
    }
  })

  // BILLING

  app.post('/api/stripe/update_card', requireLogin, (req, res) => {
    const errorMessage = 'The card was not deleted properly. Please try again.'

    stripe.customers.retrieve(
      req.user.stripe_customer_id,
      (err, customer) => {
        if (err) return res.status(500).send(err)
        customer.default_source === null
          ? newCard() : deleteStripeCard(customer.default_source)
      }
    )

    function deleteStripeCard (card) {
      stripe.customers.deleteCard(
        req.user.stripe_customer_id, card,
        (err, confirmation) => {
          if (err) return res.status(500).send(err)
          if (confirmation.deleted === true) {
            newCard()
          } else {
            return res.status(500).send(errorMessage)
          }
        }
      )
    }

    function newCard () {
      stripe.customers.createSource(
        req.user.stripe_customer_id,
        { source: req.body.token.id },
        (err, card) => {
          if (err) return res.status(500).send(err)
          if (card) {
            res.status(200).send('Your payment method has been updated.')
          } else {
            res.status(500).send(errorMessage)
          }
        }
      )
    }
  })

  // CUSTOMER

  app.post('/api/stripe/current', requireLogin, (req, res) => {
    stripe.customers.retrieve(req.body.customer_id, (err, customer) => {
      if (err) res.status(500).send('There was an error retrieving customer')
      if (customer) res.status(200).send(customer)
    })
  })
}
