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
          <ul>
            <li>Email: {this.props.user.email}</li>
            <li>Update password</li>
            <li>Account created: {this.props.user.created_at}</li>
            <li>Last login: {this.props.user.last_login}</li>
            <li>Delete account</li>
          </ul>
          <ul>
            <li>User: {this.props.user.instagram_username}</li>
            <li>Remove account</li>
          </ul>
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
        </div>
      )
    } else {
      return (
        <p className='btn' onClick={() => this.props.triggerCheckout('api/stripe/subscribe')}>
          Test
        </p>
      )
    }
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
