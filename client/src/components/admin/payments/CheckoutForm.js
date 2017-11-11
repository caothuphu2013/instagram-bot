import React, { Component } from 'react'
import { injectStripe, CardElement } from 'react-stripe-elements'
import axios from 'axios'
import { connect } from 'react-redux'

class CheckoutForm extends Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    const name = this.props.authenticatedUser.displayName
    this.props.spinnify()

    this.props.stripe.createToken({ type: 'card', name }).then(({token}) => {
      axios.post(this.props.path, { token })
      .then(response => {
        this.props.spinnify()
        this.props.triggerThankyou('Thank you', response.data)
      })
      .catch(error => {
        this.props.spinnify()
        this.props.triggerThankyou('Oops something went wrong!', error.data)
      })
    })
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Card details
          <CardElement style={{base: {fontSize: '18px'}}} />
        </label>
        <button>Confirm order</button>
        <p onClick={this.props.closeOverlay}>Close</p>
      </form>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default injectStripe(connect(mapStateToProps, null)(CheckoutForm))
