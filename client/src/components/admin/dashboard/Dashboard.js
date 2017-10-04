import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import ParamsForm from './ParamsForm'
import StartParams from './StartParams'
import Checkout from '../payments/Checkout'
import Spinner from '../../UI/Spinner'
import Overlay from '../../UI/Overlay'
import ifInTrial from '../../../utilities/ifInTrial'

class Dashboard extends Component {
  constructor (props) {
    super(props)

    this.state = { spinner: false }
  }

  toastify (message) {
    toast(message)
  }

  spinnify () {
    this.setState({ spinner: !this.state.spinner })
  }

  returnOverlay () {
    return (
      <Overlay>
        <div>Your trial has ended, please subscribe to continue service.</div>
      </Overlay>
    )
  }

  render () {
    const { createdAt, paid } = this.props.authenticatedUser

    return (
      <div>
        {(!ifInTrial(createdAt, paid) && !paid) && this.returnOverlay()}
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
        <ParamsForm
          user={this.props.authenticatedUser}
          toastify={this.toastify.bind(this)}
          spinnify={this.spinnify.bind(this)}
        />
        <StartParams
          user={this.props.authenticatedUser}
          toastify={this.toastify.bind(this)}
          spinnify={this.spinnify.bind(this)}
        />
        <Checkout />
        <a href='/auth/instagram'>Instagram Sign Up</a>
        <a href='/auth/verify'>Send Email</a>
      </div>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps)(Dashboard)
