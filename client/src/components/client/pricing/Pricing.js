import React, { Component } from 'react'
import Spinner from '../../UI/Spinner'

class Pricing extends Component {
  constructor (props) {
    super(props)

    this.state = { spinner: false }
  }

  spinnify () {
    this.setState({ spinner: !this.state.spinner })
  }

  render () {
    return (
      <div id='pricing'>
        <div className='container pricing-container'>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            Pricing
          </div>
        </div>
      </div>
    )
  }
}

export default Pricing
