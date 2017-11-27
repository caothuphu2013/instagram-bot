import React, { Component } from 'react'

class Thankyou extends Component {
  constructor (props) {
    super(props)

    if (this.props.reload) {
      setTimeout(() => {
        this.props.closeOverlay()
        window.location.reload()
      }, 3000)
    }

    this.close = this.close.bind(this)
  }

  close () {
    this.props.closeOverlay()
    if (this.props.reload) window.location.reload()
  }

  render () {
    return (
      <div className='container'>
        {this.props.children}
        <p onClick={this.close}>Close</p>
      </div>
    )
  }
}

export default Thankyou
