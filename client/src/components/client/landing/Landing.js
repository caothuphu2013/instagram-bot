import React, { Component } from 'react'
import ClientHeader from '../header/ClientHeader'
import Spinner from '../../UI/Spinner'

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
      <div>
        {(this.state.spinner) && <Spinner />}
        <ClientHeader history={this.props.history} />
        <div className='container'>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            To infinity and beyond!
          </div>
        </div>
      </div>
    )
  }
}

export default Landing
