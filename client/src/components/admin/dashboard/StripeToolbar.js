import React, { Component } from 'react'
import { connect } from 'react-redux'

class StripeToolbar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      openOverlay: false
    }

    this.renderContent = this.renderContent.bind(this)
  }

  renderContent () {
    if (this.props.authenticatedUser.paid) {
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

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps)(StripeToolbar)
