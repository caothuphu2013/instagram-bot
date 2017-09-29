import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class ClientHeader extends Component {
  render () {
    return (
      <nav>
        <div className='container nav-wrapper'>
          <Link to='/' className='brand-logo'>
            Hello
          </Link>
          <div>
            <ul id='nav-mobile' className='right hide-on-med-and-down'>
              <li><a href='/auth/instagram'>instagram</a></li>
              <li><p onClick={this.props.openLoginModal}>Login</p></li>
              <li><p onClick={this.props.openSignUpModal}>Sign Up</p></li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

// <li><a href='/'>Features</a></li>
// <li><a href='/'>Pricing</a></li>
// <li><a href='/auth/instagram'>Start Free Trial</a></li>

export default ClientHeader
