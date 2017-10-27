import React, { Component } from 'react'
import { connect } from 'react-redux'
import StartParams from './settings/StartParams'

class InstagramToolbar extends Component {
  renderContent () {
    if (this.props.authenticatedUser.instagram_id === '') {
      return (
        <a className='btn' href='/auth/instagram'>Connect</a>
      )
    } else {
      let backgroundImage = `url(${this.props.authenticatedUser.instagram_profile_picture})`

      return (
        <div style={{ display: 'flex' }}>
          <div>
            <ul>
              <li><div className='profile-pic' style={{ backgroundImage }} /></li>
              <li><p>{this.props.authenticatedUser.instagram_username}</p></li>
              <li><p>Following: {this.props.authenticatedUser.instagram_current_following}</p></li>
              <li><p>Followers: {this.props.authenticatedUser.instagram_current_followers}</p></li>
            </ul>
          </div>
          <div>
            <StartParams
              user={this.props.user}
              toastify={this.props.toastify}
              spinnify={this.props.spinnify}
            />
          </div>
        </div>
      )
    }
  }

  render () {
    return (
      <div id='instagram-toolbar'>
        {this.renderContent()}
      </div>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps)(InstagramToolbar)
