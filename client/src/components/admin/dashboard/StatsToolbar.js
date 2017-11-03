import React, { Component } from 'react'

class StatsToolbar extends Component {
  constructor (props) {
    super(props)

    this.state = { firstLogin: false }
  }

  componentWillMount () {
    if (this.props.userInstagramStats.last_login == null) {
      this.setState({ firstLogin: true })
    }
  }

  render () {
    const stats = this.props.userInstagramStats
    return (
      <div id='stats-toolbar' className='toolbar'>
        <div>
          <h4>Current</h4>
          <table>
            <tr>
              <th>Posts</th>
              <th>Followers</th>
              <th>Following</th>
            </tr>
            <tr>
              <td>{stats.instagram_current_media}</td>
              <td>{stats.instagram_current_followers}</td>
              <td>{stats.instagram_current_following}</td>
            </tr>
          </table>
          <h4>Last Login</h4>
          <table>
            <tr>
              <th>Posts</th>
              <th>Followers</th>
              <th>Following</th>
            </tr>
            <tr>
              <td>{(stats.instagram_lastLogin_media == null) ? '-' : stats.instagram_lastLogin_media}</td>
              <td>{(this.state.firstLogin) ? '-' : stats.instagram_lastLogin_followers}</td>
              <td>{(this.state.firstLogin) ? '-' : stats.instagram_lastLogin_following}</td>
            </tr>
          </table>
          <h4>Since Last Login</h4>
          <table>
            <tr>
              <th>Likes Given</th>
              <th>Follows Requested</th>
              <th>New Followers</th>
              <th>New Following</th>
              <th>Posts Made</th>
            </tr>
            <tr>
              <td>
                {(stats.instagram_likes_since_lastLogin === null) ? '-' : stats.instagram_likes_since_lastLogin}
              </td>
              <td>
                {(stats.instagram_follows_requested_since_lastLogin === null) ? '-' : stats.instagram_follows_requested_since_lastLogin}
              </td>
              <td>
                {(stats.instagram_lastLogin_followers === null) ? '-' : (stats.instagram_current_followers - stats.instagram_lastLogin_followers)}
              </td>
              <td>
                {(stats.instagram_lastLogin_following === null) ? '-' : (stats.instagram_current_following - stats.instagram_lastLogin_following)}
              </td>
              <td>
                {(stats.instagram_lastLogin_media === null) ? '-' : (stats.instagram_current_media - stats.instagram_lastLogin_media)}
              </td>
            </tr>
          </table>
        </div>
      </div>
    )
  }
}

export default StatsToolbar
