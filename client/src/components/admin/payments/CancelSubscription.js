import React, { Component } from 'react'
import axios from 'axios'

class CancelSubscription extends Component {
  constructor (props) {
    super(props)

    this.cancel = this.cancel.bind(this)
  }

  cancel (e) {
    e.preventDefault()
    this.props.spinnify()
    axios.post('/api/stripe/cancel_sub')
      .then(res => {
        this.props.spinnify()
        this.props.fetchUser()
        this.props.triggerThankyou('Success', res.data)
      })
      .catch(err => {
        this.props.spinnify()
        console.log(err)
        this.props.triggerThankyou('Oops something went wrong!', err.data)
      })
  }

  render () {
    return (
      <div>
        <p>If you wish to cancel your subscription today, you will have continued
          service until the end of this current billing period.</p>
        <p>Feel free to start back up at anytime.</p>
        <form onSubmit={this.cancel}>
          <input type='submit' value='Cancel Subscription' />
        </form>
        <p onClick={this.props.closeOverlay}>Close</p>
      </div>
    )
  }
}

export default CancelSubscription
