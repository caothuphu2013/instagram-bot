import React, { Component } from 'react'
import axios from 'axios'

class ReactivateSubscription extends Component {
  constructor (props) {
    super(props)

    this.reactivate = this.reactivate.bind(this)
  }

  reactivate (e) {
    e.preventDefault()
    this.props.spinnify()
    axios.post('/api/stripe/reactivate_sub')
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
        <p>Reinstate your subscription to Project Buzz.</p>
        <form onSubmit={this.reactivate}>
          <input type='submit' value='Reactivate' />
        </form>
        <p onClick={this.props.closeOverlay}>Close</p>
      </div>
    )
  }
}

export default ReactivateSubscription
