import React, { Component } from 'react'
import { CircleLoader } from 'react-spinners'

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
        <CircleLoader
          size={50}
          loading={this.state.loading}
          color={'#26a69a'}
        />
      </div>
    )
  }
}

export default Spinner
