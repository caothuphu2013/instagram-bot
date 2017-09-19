import React, { Component } from 'react'
import { connect } from 'react-redux'
import Payments from '../payments/Payments'
import ifInTrial from '../../utilities/ifInTrial'

class AdminHeader extends Component {
  renderContent () {
    if (ifInTrial(this.props.authenticatedUser.createdAt, this.props.authenticatedUser.paid)) {
      return (
        <ul id='nav-mobile' className='right hide-on-med-and-down'>
          <li>Still in trial</li>
          <li><Payments /></li>
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
      <div>
        {this.renderContent()}
      </div>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps)(AdminHeader)
