import React, { Component } from 'react'
import { Elements } from 'react-stripe-elements'

import CheckoutForm from './CheckoutForm'

class Checkout extends Component {
  render () {
    return (
      <Elements>
        <CheckoutForm
          spinnify={this.props.spinnify}
          toastify={this.props.toastify}
        />
      </Elements>
    )
  }
}

export default Checkout
