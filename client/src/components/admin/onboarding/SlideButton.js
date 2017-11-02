import React, { Component } from 'react'

class SlideButton extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return <button {...this.props}>{this.props.children}</button>
  }
}

export default SlideButton
