import React, { Component } from 'react'
import { connect } from 'react-redux'

class InstagramToolbar extends Component {
  renderContent () {
    if (this.props.authenticatedUser.instagramID === '') {
      return (
        <a className='btn' href='/auth/instagram'>Connect</a>
      )
    } else {
      return (
        <ul>
          <li><p>{this.props.authenticatedUser.username}</p></li>
          <li><p>Following: {this.props.authenticatedUser.follows}</p></li>
          <li><p>Followers: {this.props.authenticatedUser.followed_by}</p></li>
          <li><p>Posts: {this.props.authenticatedUser.media}</p></li>
        </ul>
      )
    }
  }

  render () {
    console.log(this.props.authenticatedUser)

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
