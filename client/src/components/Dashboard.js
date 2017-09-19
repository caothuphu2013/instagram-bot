import React, { Component } from 'react'
import { connect } from 'react-redux'

class Dashboard extends Component {
  renderContent () {
    switch (this.props.authenticatedUser) {
      case null:
        return <p>Spinner</p>
      case false:
        return <p>Failed</p>
      default:
        const user = this.props.authenticatedUser
        return <p>Username: {user.username}</p>
    }
  }

  render () {
    return (
      <div>
        {this.renderContent()}
      </div>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps)(Dashboard)
