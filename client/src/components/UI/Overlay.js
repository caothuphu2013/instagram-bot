import React, { Component } from 'react'

class Overlay extends Component {
  render () {
    return (
      <div className='overlay-wrapper'>
        <div className='overlay-container'>
          <div className='overlay-content'>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default Overlay
