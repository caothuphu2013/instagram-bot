import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Payments from './Payments'

class Header extends Component {
  renderContent () {
    console.log(this.props.auth)
    switch (this.props.auth) {
      case null:
        return
      case false:
        return (
          <ul id='nav-mobile' className='right hide-on-med-and-down'>
            <li><a href='/auth/instagram'>Login with Instagram</a></li>
          </ul>
        )
      default:
        return (
          <ul id='nav-mobile' className='right hide-on-med-and-down'>
            <li><Payments /></li>
            <li><a href='/api/logout'>Logout</a></li>
          </ul>
        )
    }
  }

  render () {
    return (
      <nav>
        <div className='container nav-wrapper'>
          <Link
            to={(this.props.auth) ? '/surveys' : '/'}
            className='brand-logo'
          >
            BuzzLightYear
          </Link>
          {this.renderContent()}
        </div>
      </nav>
    )
  }
}

function mapStateToProps ({ auth }) {
  return { auth }
}

export default connect(mapStateToProps)(Header)
