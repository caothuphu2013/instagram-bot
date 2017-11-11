import React, { Component } from 'react'
import { Elements } from 'react-stripe-elements'

import CheckoutForm from './CheckoutForm'

class Checkout extends Component {
  render () {
    return (
      <Elements>
        <CheckoutForm
          path={this.props.path}
          spinnify={this.props.spinnify}
          toastify={this.props.toastify}
          closeOverlay={this.props.closeOverlay}
          triggerThankyou={this.props.triggerThankyou}
        />
      </Elements>
    )
  }
}

export default Checkout
