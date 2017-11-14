import React, { Component } from 'react'
import axios from 'axios'

class CancelSubscription extends Component {
  constructor (props) {
    super(props)

    this.delete = this.delete.bind(this)
  }

  delete () {
    this.props.spinnify()
    axios.post('/auth/delete_instagram', { email: this.props.user.email })
      .then(response => {
        this.props.spinnify()
        this.props.triggerThankyou('Subscription cancelled', response.data)
      })
      .catch(error => {
        this.props.spinnify()
        this.props.triggerThankyou('Oops something went wrong!', error.data)
      })
  }

  render () {
    console.log(this.props.user)
    let backgroundImage = `url('${this.props.user.instagram_profile_picture}')`
    return (
      <div>
        <ul>
          <li><div className='profile-pic' style={{ backgroundImage }} /></li>
          <li><p>{this.props.user.instagram_username}</p></li>
        </ul>
        <p>Are you sure you would like to delete this Instagram account?</p>
        <button className='btn' onClick={this.delete}>Delete</button>
        <p onClick={this.props.closeOverlay}>Close</p>
      </div>
    )
  }
}

export default CancelSubscription
