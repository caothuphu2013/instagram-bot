import React, { Component } from 'react'
import { connect } from 'react-redux'

class InstagramToolbar extends Component {
  renderContent () {
    if (this.props.authenticatedUser.instagram_id === '') {
      return (
        <a className='btn' href='/auth/instagram'>Connect</a>
      )
    } else {
      let backgroundImage = `url(${this.props.authenticatedUser.instagram_profile_picture})`
      return (
        <ul>
          <li><div className='profile-pic' style={{ backgroundImage }} /></li>
          <li><p>{this.props.authenticatedUser.instagram_username}</p></li>
          <li><p>Following: {this.props.authenticatedUser.instagram_current_following}</p></li>
          <li><p>Followers: {this.props.authenticatedUser.instagram_current_followers}</p></li>
        </ul>
      )
    }
  }

  render () {
    return (
      <div id='instagram-toolbar' className='toolbar'>
        {this.renderContent()}
      </div>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps)(InstagramToolbar)

{ /*
  let backgroundImage = `url(${this.props.authenticatedUser.instagram_profile_picture})`
  <li><div className='profile-pic' style={{ backgroundImage }} /></li>
*/ }
