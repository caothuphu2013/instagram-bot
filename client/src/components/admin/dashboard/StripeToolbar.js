import React, { Component } from 'react'

class StripeToolbar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      openOverlay: false
    }

    this.renderContent = this.renderContent.bind(this)
  }

  renderContent () {
    console.log(this.props.user)
    if (this.props.user.paid) {
      return (
        <div>Paid</div>
      )
    } else {
      return (
        <p
          className='btn'
          onClick={this.props.triggerCheckout}>
          Subscribe
        </p>
      )
    }
  }

  render () {
    return (
      <div id='stripe-toolbar' className='toolbar'>
        {this.renderContent()}
      </div>
    )
  }
}

export default StripeToolbar
