import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import AdminHeader from './AdminHeader'
import ClientHeader from './ClientHeader'

class Header extends Component {
  renderContent () {
    switch (this.props.authenticatedUser) {
      case null:
        return
      case false:
        return <ClientHeader />
      default:
        return <AdminHeader />
    }
  }

  render () {
    return (
      <nav>
        <div className='container nav-wrapper'>
          <Link
            to={(this.props.auth) ? '/dashboard' : '/'}
            className='brand-logo'
          >
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

export default connect(mapStateToProps)(Header)
