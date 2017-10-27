import React, { Component } from 'react'
import { connect } from 'react-redux'

class StatsToolbar extends Component {
  render () {
    return (
      <div id='stats-toolbar' className='toolbar'>
        StatsToolbar
      </div>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps)(StatsToolbar)
