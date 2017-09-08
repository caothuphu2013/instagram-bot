import React, { Component } from 'react'

class Dashboard extends Component {
  login () {
    this.props.auth.login()
  }
  render () {
    console.log(localStorage.access_token)

    const { isAuthenticated } = this.props.auth
    return (
      <div className='container'>
        {
          isAuthenticated() && (
          <h4>
                You are logged in to dashboard!
              </h4>
            )
        }
        {
          !isAuthenticated() && (
          <h4>
                You are not logged in! Please{' '}
            <a
              style={{ cursor: 'pointer' }}
              onClick={this.login.bind(this)}
                >
                  Log In
                </a>
            {' '}to continue.
              </h4>
            )
        }
      </div>
    )
  }
}

export default Dashboard
