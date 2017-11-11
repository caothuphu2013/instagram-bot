import React, { Component } from 'react'

class BillingToolbar extends Component {
  constructor (props) {
    super(props)

    this.renderContent = this.renderContent.bind(this)
  }

  renderContent () {
    if (this.props.user.stripe_customer_id) {
      return (
        <div>
        
          <h5>Account</h5>
          <ul>
            <li>
              Email: {this.props.user.email}
              <p onClick={() => this.props.updateEmail()}>Update Email</p>
            </li>
            <li><p onClick={() => this.props.updatePassword()}>Update password</p></li>
            <li>Account created: {new Date(this.props.user.created_at).toLocaleString()}</li>
            <li>Last login: {new Date(this.props.user.last_login).toLocaleString()}</li>
          </ul>
          <h5>Instagram Account</h5>
          <ul>
            <li>User: @{this.props.user.instagram_username}</li>
            <li><p onClick={() => this.props.deleteInstagram()}>Delete Instagram</p></li>
          </ul>
          <h5>Billing</h5>
          <ul>
            <li>
              <p onClick={() => this.props.triggerCheckout('api/stripe/update_card')}>
                Update card
              </p>
            </li>
            <li>
              <p onClick={() => this.props.triggerCancel()}>
                Cancel subscription
              </p>
            </li>
          </ul>
          <ul>
            <li><p onClick={() => this.props.deleteAccount()}>Delete Account</p></li>
          </ul>
        </div>
      )
    }

    return (
      <p className='btn' onClick={() => this.props.triggerCheckout('api/stripe/subscribe')}>
        Test
      </p>
    )
  }

  render () {
    return (
      <div id='billing-toolbar' className='toolbar'>
        {this.renderContent()}
      </div>
    )
  }
}

export default BillingToolbar
