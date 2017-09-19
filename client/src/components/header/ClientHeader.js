import React, { Component } from 'react'

class ClientHeader extends Component {
  render () {
    return (
      <div>
        <ul id='nav-mobile' className='right hide-on-med-and-down'>
          <li><a href='/auth/instagram'>Login/Signup</a></li>
        </ul>
      </div>
    )
  }
}

// <li><a href='/'>Features</a></li>
// <li><a href='/'>Pricing</a></li>
// <li><a href='/auth/instagram'>Start Free Trial</a></li>

export default ClientHeader
