import React, { Component } from 'react'
import axios from 'axios'

class CancelSubscription extends Component {
  constructor (props) {
    super(props)

    this.cancel = this.cancel.bind(this)
  }

  cancel () {
    this.props.spinnify()
    axios.post('api/stripe/cancel', { cancel: true })
      .then(response => {
        this.props.spinnify()
        this.props.triggerThankyou('Subscription cancelled', response.data)
      })
      .catch(error => {
        this.props.spinnify()
        console.log(error)
        this.props.triggerThankyou('Oops something went wrong!', error.data)
      })
  }

  render () {
    return (
      <div>
        <p>If you wish to cancel your subscription today, you will have continued
          service until the end of this current billing period.</p>
        <p>Feel free to start back up at anytime.</p>
        <button className='btn' onClick={this.cancel}>Cancel</button>
        <p onClick={this.props.closeOverlay}>Close</p>
      </div>
    )
  }
}

export default CancelSubscription
