import React, { Component } from 'react'
import axios from 'axios'

class CancelSubscription extends Component {
  constructor (props) {
    super(props)

    this.cancel = this.cancel.bind(this)
  }

  cancel () {
    this.props.spinnify()
    axios.get('api/stripe/cancel_sub')
      .then(customer => {
        this.props.spinnify()
        console.log(customer);
      })
      .catch(err => {
        this.props.spinnify()
        console.log(err)
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
