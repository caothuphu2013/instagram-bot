import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class AdminHeader extends Component {
  render () {
    return (
      <nav>
        <div className='container nav-wrapper'>
          <Link to='/dashboard' className='brand-logo'></Link>
          <ul id='nav-mobile' className='right hide-on-med-and-down'>
            {/*<li><Link to='/dashboard'>Dashboard</Link></li>
            <li><Link to='/pricing'>Pricing</Link></li>
            <li><Link to='/guide'>Guide</Link></li>
            <li><Link to='/faq'>FAQ</Link></li>*/}
            <li><a href='/auth/logout'>Logout</a></li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default AdminHeader
