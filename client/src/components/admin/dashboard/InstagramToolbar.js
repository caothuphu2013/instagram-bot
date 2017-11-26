import React, { Component } from 'react'
import StartAutomator from './StartAutomator'
import isInTrial from '../../../utilities/isInTrial'
import trialDaysRemaining from '../../../utilities/trialDaysRemaining'

class InstagramToolbar extends Component {
  constructor (props) {
    super(props)

    this.renderContent = this.renderContent.bind(this)
  }

  renderContent () {
    const user = this.props.user
    if (user.instagram_accessToken === '') {
      return <a className='btn' href='/auth/instagram'>Connect</a>
    }

    const backgroundImage = `url('${this.props.profilePic}')`
    const isInTrialorNot = (isInTrial(user.created_at, user.stripe_subscription_id))
    const subscribe = (<p className='btn' onClick={() => this.props.triggerCheckout('api/stripe/subscribe')}>Subscribe</p>)

    return (
      <div style={{ display: 'flex' }}>
        <div>
          <ul>
            <li><div className='profile-pic' style={{ backgroundImage }} /></li>
            <li><p>{user.instagram_username}</p></li>
            <li><p>Following: {user.instagram_current_following}</p></li>
            <li><p>Followers: {user.instagram_current_followers}</p></li>
            {(isInTrialorNot) && <li><p>{trialDaysRemaining(user.created_at)}</p></li>}
          </ul>
        </div>
        <div>
          {(isInTrialorNot) && subscribe}
          <StartAutomator
            email={user.email}
            toastify={this.props.toastify}
            spinnify={this.props.spinnify}
          />
        </div>
      </div>
    )
  }

  render () {
    return (
      <div id='instagram-toolbar'>
        {this.renderContent()}
      </div>
    )
  }
}

export default InstagramToolbar

{/*
  <ul>
    <li><div className='profile-pic' style={{ backgroundImage }} /></li>
    <li><p>{user.instagram_username}</p></li>
    <li><p>Following: {user.instagram_current_following}</p></li>
    <li><p>Followers: {user.instagram_current_followers}</p></li>
  </ul>
  */}
