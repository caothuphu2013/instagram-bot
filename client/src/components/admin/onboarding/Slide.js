import React, { Component } from 'react'

class Slide extends Component {
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='slide'>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default Slide
