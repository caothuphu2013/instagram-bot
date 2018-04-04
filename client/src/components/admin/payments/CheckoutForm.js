import React, { Component } from 'react'
import { injectStripe, CardElement } from 'react-stripe-elements'
import axios from 'axios'
import { connect } from 'react-redux'

class CheckoutForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cardholder_name: '',
      error: false,
      error_type: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.setState({ cardholder_name: event.target.value })
  }

  handleSubmit (e) {
    e.preventDefault()
    const name = this.props.authenticatedUser.displayName

    if (this.state.cardholder_name === '') {
      this.setState({
        error: true,
        error_type: 'Please input the card holders name'
      })
      return
    }

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
        <label htmlFor='cardholder_name'>
          <input
            id='cardholder_name'
            name='cardholder_name'
            type='text'
            placeholder='Cardholder Name'
            value={this.state.cardholder_name}
            onChange={this.handleChange}
          />
        </label>
        <label htmlFor='card_details'>
          Card details
          <CardElement style={{base: {fontSize: '18px'}}} />
        </label>
        <button>Confirm order</button>
        {(this.state.error) && <p className='error'>{this.state.error_type}</p>}
        <p onClick={this.props.closeOverlay}>Close</p>
      </form>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default injectStripe(connect(mapStateToProps, null)(CheckoutForm))
