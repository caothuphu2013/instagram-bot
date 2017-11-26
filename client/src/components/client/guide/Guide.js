import React, { Component } from 'react'

class Guide extends Component {
  constructor (props) {
    super(props)

    this.state = { spinner: false }
  }

  spinnify () {
    this.setState({ spinner: !this.state.spinner })
  }

  render () {
    return (
      <div id='guide'>
        <div className='container guide-container'>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            Guide
          </div>
        </div>
      </div>
    )
  }
}

export default Guide
