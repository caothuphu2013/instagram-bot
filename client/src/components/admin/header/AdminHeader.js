import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import isInTrial from '../../../utilities/isInTrial'
import trialDaysRemaining from '../../../utilities/trialDaysRemaining'

class AdminHeader extends Component {
  renderContent () {
    const createdAt = this.props.authenticatedUser.created_at
    const paid = this.props.authenticatedUser.stripe_subscription_id

    if (isInTrial(createdAt, paid)) {
      return (
        <ul id='nav-mobile' className='right hide-on-med-and-down'>
          <li>{trialDaysRemaining(createdAt)}</li>
          <li><a href='/auth/logout'>Logout</a></li>
        </ul>
      )
    } else {
      return (
        <ul id='nav-mobile' className='right hide-on-med-and-down'>
          <li><a href='/auth/logout'>Logout</a></li>
        </ul>
      )
    }
  }

  render () {
    return (
      <nav>
        <div className='container nav-wrapper'>
          <Link to='/dashboard' className='brand-logo'>Strolio</Link>
          <ul id='nav-mobile' className='right hide-on-med-and-down'>
            <li><Link to='/pricing'>Pricing</Link></li>
            <li><Link to='/guide'>Guide</Link></li>
            <li><Link to='/faq'>FAQ</Link></li>
            <li><a href='/auth/logout'>Logout</a></li>
          </ul>
        </div>
      </nav>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps)(AdminHeader)
