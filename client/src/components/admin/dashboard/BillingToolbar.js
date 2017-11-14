import React, { Component } from 'react'
import axios from 'axios'

class BillingToolbar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      has_data: false,
      card_brand: '',
      card_last4: '',
      sub_current_period_start: '',
      sub_current_period_end: '',
      sub_name: ''
    }

    this.renderContent = this.renderContent.bind(this)
    this.renderInstagramAccount = this.renderInstagramAccount.bind(this)
  }

  componentDidMount () {
    if (this.props.user.stripe_customer_id && !this.state.has_data) {
      axios.post('/api/stripe/current',
      { customer_id: this.props.user.stripe_customer_id })
        .then(customer => {
          const card = customer.data.sources.data[0]
          const sub = customer.data.subscriptions.data[0]
          this.setState({
            has_data: true,
            card_brand: card.brand,
            card_last4: card.last4,
            sub_current_period_start: sub.current_period_start,
            sub_current_period_end: sub.current_period_end,
            sub_name: sub.plan.name
          })
        })
        .catch(err => {
          this.props.spinnify()
          console.log(err)
        })
    }
  }

  renderInstagramAccount () {
    if (this.props.user.instagram_accessToken === '') {
      return (
        <div><a className='btn' href='/auth/instagram'>Connect</a></div>
      )
    }

    return (
      <ul>
        <li><p>User: @{this.props.user.instagram_username}</p></li>
        <li><p onClick={() => this.props.deleteInstagram()}>Delete Instagram</p></li>
      </ul>
    )
  }

  renderContent () {
    const created = new Date(this.props.user.created_at).toLocaleString().split(',')[0]
    const lastLogin = new Date(this.props.user.last_login).toLocaleString().split(',')[0]
    const subName = (this.state.has_data) ? this.state.sub_name : '-'
    const periodStarts = (this.state.has_data)
    ? new Date(this.state.sub_current_period_end).toLocaleString().split(',')[0] : '-'
    const periodEnds = (this.state.has_data)
    ? new Date(this.state.sub_current_period_end).toLocaleString().split(',')[0] : '-'

    if (this.props.user.stripe_customer_id) {
      return (
        <div>
          <ul>
            <li>
              <p>Email: {this.props.user.email}</p>
              <p onClick={() => this.props.updateEmail()}>Update Email</p>
            </li>
            <li><p onClick={() => this.props.updatePassword()}>Update password</p></li>
            <li><p>Account created: {created}</p></li>
            <li><p>Last login: {lastLogin}</p></li>
          </ul>

          <hr />

          {this.renderInstagramAccount()}

          <hr />
          <ul>
            <li><p>Subscription: {subName}</p></li>
            <li><p>Current period started: {periodStarts}</p></li>
            <li><p>Current period ends: {periodEnds}</p></li>
            <li><p onClick={() => this.props.triggerCancel()}>Cancel subscription</p></li>
          </ul>

          <hr />
          <ul>
            <li>
              <p>{this.state.card_brand} {this.state.card_last4}</p>
              <p onClick={() => this.props.triggerCheckout('api/stripe/update_card')}>Update card</p>
            </li>
          </ul>

          <hr />
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
