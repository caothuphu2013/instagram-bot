import React, { Component } from 'react'
import Modal from 'react-modal'
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
      <Modal className overlayClassName isOpen={this.props.isOpen}>
        <div className='spinner-wrapper'>
          <ScaleLoader
            size={50}
            loading={this.state.loading}
            color={'#26a69a'}
          />
        </div>
      </Modal>
    )
  }
}

export default Spinner
