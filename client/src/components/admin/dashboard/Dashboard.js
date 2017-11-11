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

// Billing
import Checkout from '../payments/Checkout'
import CancelSubscription from '../payments/CancelSubscription'

// UI
import Spinner from '../../UI/Spinner'
import Overlay from '../../UI/Overlay'
import Thankyou from '../../UI/Thankyou'

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
    if (nextProps.authenticatedUser) {
      if (!nextProps.userInstagramStats && !nextProps.userParams) {
        this.setState({ showOnBoarding: true, showSpinner: false })
      } else if (nextProps.userInstagramStats && nextProps.userParams) {
        this.setState({ showDashboard: true, showSpinner: false })
      }
    }
  }

  toastify (message) { toast(message) }

  spinnify () { this.setState({ showSpinner: !this.state.showSpinner }) }

  returnOverlay () {
    return <Overlay>{this.state.overlayComponent}</Overlay>
  }

  renderDashboard () {
    return (
      <div>
        <InstagramToolbar
          user={this.props.authenticatedUser}
          toastify={this.toastify.bind(this)}
          spinnify={this.spinnify.bind(this)}
        />
        <div className='toolbar-container'>

          <BillingToolbar
            user={this.props.authenticatedUser}
            toastify={this.toastify.bind(this)}
            spinnify={this.spinnify.bind(this)}
            overlay={this.state.showOverlay}
            updateEmail={() => this.setState({
              showOverlay: true,
              overlayComponent: <UpdateEmail
                triggerThankyou={(title, response) => this.setState({
                  overlayComponent: <Thankyou
                    closeOverlay={() => this.setState({ showOverlay: false })}>
                    {title}
                    {response}
                  </Thankyou>
                })}
                spinnify={this.spinnify.bind(this)}
                email={this.props.authenticatedUser.email}
                closeOverlay={() => this.setState({ showOverlay: false })}
                />,
            })}
            triggerCancel={() => this.setState({
              showOverlay: true,
              overlayComponent: <CancelSubscription
                triggerThankyou={(title, response) => this.setState({
                  overlayComponent: <Thankyou
                    closeOverlay={() => this.setState({ showOverlay: false })}>
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
              overlayComponent: <Checkout
                path={path}
                user={this.props.authenticatedUser}
                triggerThankyou={(title, response) => this.setState({
                  overlayComponent: <Thankyou
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
  <MenuBar />

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

  <TargetingToolbar
    user={this.props.authenticatedUser}
    userParams={this.props.userParams}
    toastify={this.toastify.bind(this)}
    spinnify={this.spinnify.bind(this)}
  />
   */}
