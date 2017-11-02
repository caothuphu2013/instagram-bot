import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import * as actions from '../../../actions'

// showOnBoardingSlider
import OnBoardingSlider from '../onboarding/OnBoardingSlider'

// showDashboard
import InstagramToolbar from './InstagramToolbar'
import SettingsToolbar from './SettingsToolbar'
import StripeToolbar from './StripeToolbar'
import StatsToolbar from './StatsToolbar'
import MenuBar from './MenuBar'

import Checkout from '../payments/Checkout'
import Spinner from '../../UI/Spinner'
import Overlay from '../../UI/Overlay'
import ifInTrial from '../../../utilities/ifInTrial'

class showDashboard extends Component {
  constructor (props) {
    super(props)

    this.props.fetchUserInstagramStats(this.props.authenticatedUser.email)
    this.props.fetchUserParams(this.props.authenticatedUser.email)

    this.state = {
      showOnBoarding: false,
      showDashboard: false,
      showSpinner: true,
      showOverlay: false,
      overlayDescription: 'Your trial has ended, please subscribe to continue service.'
    }

    this.returnOverlay = this.returnOverlay.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.authenticatedUser) {
      if (nextProps.authenticatedUser.created_at === nextProps.authenticatedUser.current_login) {
        this.setState({ showOnBoarding: true, showSpinner: false })
      } else {
        this.setState({ showDashboard: true, showSpinner: false })
      }
    }
  }

  toastify (message) { toast(message) }

  spinnify () { this.setState({ showSpinner: !this.state.showSpinner }) }

  returnOverlay () {
    const { createdAt, paid } = this.props.authenticatedUser
    if ((!ifInTrial(createdAt, paid) && !paid) || this.state.showOverlay === true) {
      return (
        <Overlay>
          <div>{this.state.overlayDescription}</div>
          <Checkout
            user={this.props.authenticatedUser}
            toastify={this.toastify.bind(this)}
            spinnify={this.spinnify.bind(this)}
            closeOverlay={() => this.setState({ showOverlay: false })}
          />
          <p onClick={() => this.setState({ showOverlay: false })}>Close</p>
        </Overlay>
      )
    }
  }

  renderContent () {
    if (this.props.authenticatedUser.instagram_accessToken) {
      return (
        <div>
          <InstagramToolbar
            user={this.props.authenticatedUser}
            toastify={this.toastify.bind(this)}
            spinnify={this.spinnify.bind(this)}
          />
          <MenuBar />
            <div className='toolbar-container'>
              <StatsToolbar
                userInstagramStats={this.props.userInstagramStats}
                toastify={this.toastify.bind(this)}
                spinnify={this.spinnify.bind(this)}
              />
              <StripeToolbar
                user={this.props.authenticatedUser}
                toastify={this.toastify.bind(this)}
                spinnify={this.spinnify.bind(this)}
                triggerCheckout={() => this.setState({
                  showOverlay: true,
                  overlayDescription: 'Subscribe'
                })}
              />
            </div>
        </div>
      )
    } else if (this.state.showOnBoarding) {
      return <OnBoardingSlider />
    }
  }

  render () {
    console.log(this.props)
    return (
      <div id='showDashboard'>
        {this.returnOverlay()}
        {(this.state.showSpinner) && <Spinner />}
        <ToastContainer
          position='top-center'
          type='success'
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />

        {this.renderContent()}
      </div>
    )
  }
}

function mapStateToProps ({ authenticatedUser, userInstagramStats, userParams }) {
  return { authenticatedUser, userInstagramStats, userParams }
}

export default connect(mapStateToProps, actions)(showDashboard)

{ /*
  <div className='toolbar-container'>
    <StatsToolbar
      userInstagramStats={this.props.userInstagramStats}
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
        showOverlay: true,
        overlayDescription: 'Subscribe'
      })}
    />
  </div>
*/ }
