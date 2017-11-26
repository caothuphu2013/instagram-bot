import React, { Component } from 'react'

class Help extends Component {
  constructor (props) {
    super(props)

    this.state = { spinner: false }
  }

  spinnify () {
    this.setState({ spinner: !this.state.spinner })
  }

  render () {
    return (
      <div id='help'>
        <div className='container help-container'>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            Help
          </div>
        </div>
      </div>
    )
  }
}

export default Help
