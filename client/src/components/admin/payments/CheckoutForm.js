import React, { Component } from 'react'
import { injectStripe, CardElement } from 'react-stripe-elements'
import axios from 'axios'

class CheckoutForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    // const { address, city, state, zipCode } = this.state
    this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'}).then(({token}) => {
      axios.post('api/stripe/subscribe', { token })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
    })
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
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

export default injectStripe(CheckoutForm)

// <label>
        //   Billing address
        //   <input
        //     type='text'
        //     name='address'
        //     placeholder='address'
        //     value={this.state.address}
        //     onChange={this.handleChange.bind(this)}
        //   />
        //   <input
        //     type='number'
        //     name='zipCode'
        //     pattern='\d{5}-?(\d{4})?'
        //     placeholder='zip'
        //     maxLength='10'
        //     value={this.state.zipCode}
        //     onChange={this.handleChange.bind(this)}
        //   />
        //   <input
        //     type='text'
        //     name='city'
        //     placeholder='city'
        //     value={this.state.city}
        //     onChange={this.handleChange.bind(this)}
        //   />
        //   <input
        //     type='text'
        //     name='state'
        //     pattern='[A-Z]{2}'
        //     placeholder='state'
        //     maxLength='2'
        //     value={this.state.state}
        //     onChange={this.handleChange.bind(this)}
        //   />
        // </label>}
