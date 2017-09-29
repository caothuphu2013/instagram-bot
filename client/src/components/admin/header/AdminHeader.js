import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ifInTrial from '../../../utilities/ifInTrial'
import trialDaysRemaining from '../../../utilities/trialDaysRemaining'

class AdminHeader extends Component {
  renderContent () {
    const createdAt = this.props.authenticatedUser.createdAt
    const paid = this.props.authenticatedUser.paid
    if (ifInTrial(createdAt, paid)) {
      return (
        <ul id='nav-mobile' className='right hide-on-med-and-down'>
          <li>{trialDaysRemaining(createdAt)}</li>
          <li><a href='/api/logout'>Logout</a></li>
        </ul>
      )
    } else {
      return (
        <ul id='nav-mobile' className='right hide-on-med-and-down'>
          <li><a href='/api/logout'>Logout</a></li>
        </ul>
      )
    }
  }

  render () {
    return (
      <nav>
        <div className='container nav-wrapper'>
          <Link to='/dashboard' className='brand-logo'>
            Hello
          </Link>
          {this.renderContent()}
        </div>
      </nav>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps)(AdminHeader)
