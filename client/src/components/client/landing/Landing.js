import React, { Component } from 'react'

class Landing extends Component {
  constructor (props) {
    super(props)

    this.state = { spinner: false }
  }

  spinnify () {
    this.setState({ spinner: !this.state.spinner })
  }

  render () {
    return (
      <div id='landing'>
        <div className='container landing-container'>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            Landing
          </div>
        </div>
      </div>
    )
  }
}

export default Landing
