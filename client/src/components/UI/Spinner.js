import React, { Component } from 'react'
import { ScaleLoader } from 'react-spinners'

class Spinner extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  render () {
    return (
      <div className='spinner-wrapper'>
        <ScaleLoader
          size={50}
          loading={this.state.loading}
          color={'#26a69a'}
        />
      </div>
    )
  }
}

export default Spinner
