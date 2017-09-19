import React, { Component } from 'react'
import Stripe from 'react-stripe-checkout'
import { connect } from 'react-redux'
import * as actions from '../../actions'

class Payments extends Component {
  render () {
    return (
      <Stripe
        amount={500}
        token={token => this.props.handleToken(token)}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
        name='BuzzLightYear'
        description='Monthly subscription of $7.99'
      >
        <button className='btn'>Get Full Access</button>
      </Stripe>
    )
  }
}

export default connect(null, actions)(Payments)
