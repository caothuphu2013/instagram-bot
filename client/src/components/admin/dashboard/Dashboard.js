import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import axios from 'axios'

import * as actions from '../../../actions'

import InstagramToolbar from './InstagramToolbar'
import SettingsToolbar from './settings/SettingsToolbar'
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

    this.state = {
      spinner: false,
      openOverlay: false,
      overlayDescription: 'Your trial has ended, please subscribe to continue service.'
    }

    this.returnOverlay = this.returnOverlay.bind(this)
  }

  componentDidMount () {
    axios.get('/stats/latest', { email: this.props.authenticatedUser.email })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
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
        <div className='toolbar-container'>
          <StatsToolbar
            user={this.props.authenticatedUser}
            toastify={this.toastify.bind(this)}
            spinnify={this.spinnify.bind(this)}
          />
          <SettingsToolbar
            user={this.props.authenticatedUser}
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
      </div>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps, actions)(Dashboard)
