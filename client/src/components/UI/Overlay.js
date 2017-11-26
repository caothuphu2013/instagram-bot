import React, { Component } from 'react'
import Modal from 'react-modal'

class Overlay extends Component {
  render () {
    return (
      <Modal className overlayClassName isOpen={this.props.isOpen}>
        <div className='overlay-wrapper'>
          <div className='overlay-container'>
            <div className='overlay-content'>
              {this.props.children}
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default Overlay
