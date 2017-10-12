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
      axios.post('api/stripe/subscribe', { token })
      .then(response => {
        console.log(response)
        this.props.toastify(response.data)
        this.props.spinnify()
      })
      .catch(error => {
        console.log(error)
        this.props.toastify(error.data)
        this.props.spinnify()
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
      </form>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default injectStripe(connect(mapStateToProps, null)(CheckoutForm))
