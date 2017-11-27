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
import TargetingToolbar from './TargetingToolbar'
import BillingToolbar from './BillingToolbar'
import StatsToolbar from './StatsToolbar'
import MenuBar from './MenuBar'

// Auth
import UpdateEmail from '../authorization/UpdateEmail'
import UpdatePassword from '../authorization/UpdatePassword'
import DeleteAccount from '../authorization/DeleteAccount'
import DeleteInstagram from '../authorization/DeleteInstagram'

// Billing
import Checkout from '../payments/Checkout'
import CancelSubscription from '../payments/CancelSubscription'

// UI
import Spinner from '../../UI/Spinner'
import Overlay from '../../UI/Overlay'
import Thankyou from '../../UI/Thankyou'

// utilities
import isInTrial from '../../../utilities/isInTrial'

class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.props.fetchUserInstagramStats(this.props.authenticatedUser.email)
    this.props.fetchUserParams(this.props.authenticatedUser.email)

    this.state = {
      showOnBoarding: false,
      showDashboard: false,
      showSpinner: true,
      showOverlay: false,
      overlayComponent: ''
    }

    this.returnOverlay = this.returnOverlay.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    // Check if user has been authenticated
    if (nextProps.authenticatedUser) {
      // Check if user has been onboarded, if not show onboarding slider, if so
      // check if userparams and userstats has propogated then show dashboard
      if (!nextProps.authenticatedUser.onboarded) {
        this.setState({ showOnBoarding: true, showSpinner: false })
      } else if (nextProps.userParams && nextProps.userInstagramStats) {
        this.setState({ showDashboard: true, showSpinner: false })
      }
    }
  }

  componentDidMount () {
    // Check if user is still in trial, if not trigger overlay preventing them
    // from using app, and asking to subscribe
    const user = this.props.authenticatedUser
    if (user.onboarded) {
      if (user.stripe_subscription_id === '') {
        if (!isInTrial(user.created_at, user.stripe_subscription_id)) {
          const triggerCheckout = (path) => this.setState({
            showOverlay: true,
            overlayComponent:
              <Checkout
                path={path}
                user={this.props.authenticatedUser}
                triggerThankyou={(title, response) => this.setState({
                  overlayComponent:
                    <Thankyou
                      reload
                      closeOverlay={() => this.setState({ showOverlay: false })}>
                      {title}
                      {response}
                    </Thankyou>
                })}
                spinnify={this.spinnify.bind(this)}
                closeOverlay={() => this.setState({ showOverlay: false })}
              />
          })
          const trialEnded = (
            <Thankyou closeOverlay={() => this.setState({ showOverlay: false })}>
              <p>
                Your trial period has ended. Subscribe to our monthly plan to get
                unlimited access.
              </p>
              <button
                className='btn'
                onClick={() => triggerCheckout('/api/stripe/subscribe')}>
                Subscribe
              </button>
            </Thankyou>)
          this.setState({ showOverlay: true, overlayComponent: trialEnded })
        }
      }
    }
  }

  toastify (message) { toast(message) }

  spinnify () { this.setState({ showSpinner: !this.state.showSpinner }) }

  returnOverlay () {
    return (
      <Overlay isOpen={this.state.showOverlay}>
        {this.state.overlayComponent}
      </Overlay>
    )
  }

  renderDashboard () {
    return (
      <div className='dashboard-container'>
        <div className='toolbar-container'>
          <BillingToolbar
            user={this.props.authenticatedUser}
            toastify={this.toastify.bind(this)}
            spinnify={this.spinnify.bind(this)}
            overlay={this.state.showOverlay}
            deleteAccount={() => this.setState({
              showOverlay: true,
              overlayComponent:
                <DeleteAccount
                  spinnify={this.spinnify.bind(this)}
                  email={this.props.authenticatedUser.email}
                  closeOverlay={() => this.setState({ showOverlay: false })}
                />
            })}
            updatePassword={() => this.setState({
              showOverlay: true,
              overlayComponent:
                <UpdatePassword
                  triggerThankyou={(title, response) => this.setState({
                    overlayComponent:
                      <Thankyou
                        closeOverlay={() => this.setState({ showOverlay: false })}>
                        {title}
                        {response}
                      </Thankyou>
                  })}
                  spinnify={this.spinnify.bind(this)}
                  email={this.props.authenticatedUser.email}
                  closeOverlay={() => this.setState({ showOverlay: false })}
                />
            })}
            updateEmail={() => this.setState({
              showOverlay: true,
              overlayComponent:
                <UpdateEmail
                  triggerThankyou={(title, response) => this.setState({
                    overlayComponent:
                      <Thankyou
                        closeOverlay={() => this.setState({ showOverlay: false })}>
                        {title}
                        {response}
                      </Thankyou>
                  })}
                  spinnify={this.spinnify.bind(this)}
                  email={this.props.authenticatedUser.email}
                  closeOverlay={() => this.setState({ showOverlay: false })}
                />
            })}
            triggerCancel={() => this.setState({
              showOverlay: true,
              overlayComponent:
                <CancelSubscription
                  fetchUser={() => this.props.fetchUser()}
                  triggerThankyou={(title, response) => this.setState({
                    overlayComponent:
                      <Thankyou closeOverlay={() => this.setState({ showOverlay: false })}>
                        {title}
                        {response}
                      </Thankyou>
                  })}
                  spinnify={this.spinnify.bind(this)}
                  closeOverlay={() => this.setState({ showOverlay: false })}
                />
            })}
            triggerCheckout={(path) => this.setState({
              showOverlay: true,
              overlayComponent:
                <Checkout
                  path={path}
                  user={this.props.authenticatedUser}
                  triggerThankyou={(title, response) => this.setState({
                    overlayComponent:
                      <Thankyou
                        reload
                        closeOverlay={() => this.setState({ showOverlay: false })}
                      >
                        {title}
                        {response}
                      </Thankyou>
                  })}
                  spinnify={this.spinnify.bind(this)}
                  closeOverlay={() => this.setState({ showOverlay: false })}
                />
            })}
            deleteInstagram={() => this.setState({
              showOverlay: true,
              overlayComponent:
                <DeleteInstagram
                  triggerThankyou={(title, response) => this.setState({
                    overlayComponent:
                      <Thankyou
                        reload
                        closeOverlay={() => this.setState({ showOverlay: false })}>
                        {title}
                        {response}
                      </Thankyou>
                  })}
                  user={this.props.userInstagramStats}
                  spinnify={this.spinnify.bind(this)}
                  closeOverlay={() => this.setState({ showOverlay: false })}
                />
            })}
          />
        </div>
      </div>
    )
  }

  render () {
    return (
      <div id='dashboard'>
        <ToastContainer
          position='top-center'
          type='success'
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
        {(this.state.showOverlay) && this.returnOverlay()}
        {(this.state.showSpinner) && <Spinner />}
        {(this.state.showOnBoarding) && <OnBoardingSlider />}
        {(this.state.showDashboard) && this.renderDashboard()}
      </div>
    )
  }
}

function mapStateToProps ({ authenticatedUser, userInstagramStats, userParams }) {
  return { authenticatedUser, userInstagramStats, userParams }
}

export default connect(mapStateToProps, actions)(Dashboard)

{/*
  <InstagramToolbar
    user={this.props.authenticatedUser}
    profilePic={this.props.userInstagramStats.instagram_profile_picture}
    toastify={this.toastify.bind(this)}
    spinnify={this.spinnify.bind(this)}
    triggerCheckout={(path) => this.setState({
      showOverlay: true,
      overlayComponent:
        <Checkout
          path={path}
          user={this.props.authenticatedUser}
          triggerThankyou={(title, response) => this.setState({
            overlayComponent:
              <Thankyou
                reload
                closeOverlay={() => this.setState({ showOverlay: false })}>
                {title}
                {response}
              </Thankyou>
          })}
          spinnify={this.spinnify.bind(this)}
          closeOverlay={() => this.setState({ showOverlay: false })}
        />
    })}
  />
  <MenuBar />
  <SettingsToolbar
    user={this.props.authenticatedUser}
    userParams={this.props.userParams}
    toastify={this.toastify.bind(this)}
    spinnify={this.spinnify.bind(this)}
  />
  <TargetingToolbar
    user={this.props.authenticatedUser}
    userParams={this.props.userParams}
    toastify={this.toastify.bind(this)}
    spinnify={this.spinnify.bind(this)}
    fetchParams={() => this.props.fetchUserParams(this.props.authenticatedUser.email)}
  />
  <StatsToolbar
    userInstagramStats={this.props.userInstagramStats}
    toastify={this.toastify.bind(this)}
    spinnify={this.spinnify.bind(this)}
  />
  <BillingToolbar
    user={this.props.authenticatedUser}
    toastify={this.toastify.bind(this)}
    spinnify={this.spinnify.bind(this)}
    overlay={this.state.showOverlay}
    deleteAccount={() => this.setState({
      showOverlay: true,
      overlayComponent:
        <DeleteAccount
          spinnify={this.spinnify.bind(this)}
          email={this.props.authenticatedUser.email}
          closeOverlay={() => this.setState({ showOverlay: false })}
        />
    })}
    updatePassword={() => this.setState({
      showOverlay: true,
      overlayComponent:
        <UpdatePassword
          triggerThankyou={(title, response) => this.setState({
            overlayComponent:
              <Thankyou
                closeOverlay={() => this.setState({ showOverlay: false })}>
                {title}
                {response}
              </Thankyou>
          })}
          spinnify={this.spinnify.bind(this)}
          email={this.props.authenticatedUser.email}
          closeOverlay={() => this.setState({ showOverlay: false })}
        />
    })}
    updateEmail={() => this.setState({
      showOverlay: true,
      overlayComponent:
        <UpdateEmail
          triggerThankyou={(title, response) => this.setState({
            overlayComponent:
              <Thankyou
                closeOverlay={() => this.setState({ showOverlay: false })}>
                {title}
                {response}
              </Thankyou>
          })}
          spinnify={this.spinnify.bind(this)}
          email={this.props.authenticatedUser.email}
          closeOverlay={() => this.setState({ showOverlay: false })}
        />
    })}
    triggerCancel={() => this.setState({
      showOverlay: true,
      overlayComponent:
        <CancelSubscription
          triggerThankyou={(title, response) => this.setState({
            overlayComponent:
              <Thankyou closeOverlay={() => this.setState({ showOverlay: false })}>
                {title}
                {response}
              </Thankyou>
          })}
          spinnify={this.spinnify.bind(this)}
          closeOverlay={() => this.setState({ showOverlay: false })}
        />
    })}
    triggerCheckout={(path) => this.setState({
      showOverlay: true,
      overlayComponent:
        <Checkout
          path={path}
          user={this.props.authenticatedUser}
          triggerThankyou={(title, response) => this.setState({
            overlayComponent:
              <Thankyou
                reload
                closeOverlay={() => this.setState({ showOverlay: false })}
              >
                {title}
                {response}
              </Thankyou>
          })}
          spinnify={this.spinnify.bind(this)}
          closeOverlay={() => this.setState({ showOverlay: false })}
        />
    })}
    deleteInstagram={() => this.setState({
      showOverlay: true,
      overlayComponent:
        <DeleteInstagram
          triggerThankyou={(title, response) => this.setState({
            overlayComponent:
              <Thankyou
                reload
                closeOverlay={() => this.setState({ showOverlay: false })}>
                {title}
                {response}
              </Thankyou>
          })}
          user={this.props.userInstagramStats}
          spinnify={this.spinnify.bind(this)}
          closeOverlay={() => this.setState({ showOverlay: false })}
        />
    })}
   */}
