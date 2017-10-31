import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import * as actions from '../../../actions'

import InstagramToolbar from './InstagramToolbar'
import SettingsToolbar from './SettingsToolbar'
import StripeToolbar from './StripeToolbar'
import StatsToolbar from './StatsToolbar'
import MenuBar from './MenuBar'

import Checkout from '../payments/Checkout'
import Spinner from '../../UI/Spinner'
import Overlay from '../../UI/Overlay'
import ifInTrial from '../../../utilities/ifInTrial'

class Dashboard extends Component {
  constructor (props) {
    super(props)

    this.props.fetchUserStats(this.props.authenticatedUser.email)
    this.props.fetchUserParams(this.props.authenticatedUser.email)

    this.state = {
      spinner: true,
      openOverlay: false,
      overlayDescription: 'Your trial has ended, please subscribe to continue service.'
    }

    this.returnOverlay = this.returnOverlay.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.authenticatedUser && nextProps.userStats && nextProps.userParams) this.spinnify()
  }

  toastify (message) { toast(message) }

  spinnify () { this.setState({ spinner: !this.state.spinner }) }

  returnOverlay () {
    const { createdAt, paid } = this.props.authenticatedUser
    if ((!ifInTrial(createdAt, paid) && !paid) || this.state.openOverlay === true) {
      return (
        <Overlay>
          <div>{this.state.overlayDescription}</div>
          <Checkout
            user={this.props.authenticatedUser}
            toastify={this.toastify.bind(this)}
            spinnify={this.spinnify.bind(this)}
            closeOverlay={() => this.setState({ openOverlay: false })}
          />
          <p onClick={() => this.setState({ openOverlay: false })}>Close</p>
        </Overlay>
      )
    }
  }

  renderContent () {
    if (this.props.userStats && this.props.userParams) {
      return (
        <div className='toolbar-container'>
          <StatsToolbar
            userStats={this.props.userStats}
            toastify={this.toastify.bind(this)}
            spinnify={this.spinnify.bind(this)}
          />
          <SettingsToolbar
            user={this.props.authenticatedUser}
            userParams={this.props.userParams}
            toastify={this.toastify.bind(this)}
            spinnify={this.spinnify.bind(this)}
          />
          <StripeToolbar
            user={this.props.authenticatedUser}
            toastify={this.toastify.bind(this)}
            spinnify={this.spinnify.bind(this)}
            triggerCheckout={() => this.setState({
              openOverlay: true,
              overlayDescription: 'Subscribe'
            })}
          />
        </div>
      )
    }
  }

  render () {
    return (
      <div id='dashboard'>
        {this.returnOverlay()}
        {(this.state.spinner) && <Spinner />}
        <ToastContainer
          position='top-center'
          type='success'
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />

        <InstagramToolbar
          user={this.props.authenticatedUser}
          toastify={this.toastify.bind(this)}
          spinnify={this.spinnify.bind(this)}
        />
        <MenuBar />
        {this.renderContent()}
      </div>
    )
  }
}

function mapStateToProps ({ authenticatedUser, userStats, userParams }) {
  return { authenticatedUser, userStats, userParams }
}

export default connect(mapStateToProps, actions)(Dashboard)
