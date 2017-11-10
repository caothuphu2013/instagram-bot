import React, { Component } from 'react'
import { connect } from 'react-redux'
import StartAutomator from './StartAutomator'

class InstagramToolbar extends Component {
  render () {
    return (
      <div id='instagram-toolbar'>
        <div style={{ display: 'flex' }}>
          <div>
          </div>
          <div>
            <StartAutomator
              user={this.props.user}
              toastify={this.props.toastify}
              spinnify={this.props.spinnify}
            />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps)(InstagramToolbar)

{/*
  <ul>
    <li><div className='profile-pic' style={{ backgroundImage }} /></li>
    <li><p>{this.props.authenticatedUser.instagram_username}</p></li>
    <li><p>Following: {this.props.authenticatedUser.instagram_current_following}</p></li>
    <li><p>Followers: {this.props.authenticatedUser.instagram_current_followers}</p></li>
  </ul>
   */}
