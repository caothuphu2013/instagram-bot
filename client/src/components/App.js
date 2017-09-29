import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Modal from 'react-modal'

import * as actions from '../actions'
import AdminHeader from './admin/header/AdminHeader'
import Dashboard from './admin/dashboard/Dashboard'
import ClientHeader from './client/header/ClientHeader'
import Landing from './client/landing/Landing'
import LoginForm from './UI/LoginForm'
import SignUpForm from './UI/SignUpForm'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      signUpModalIsOpen: false,
      loginModalIsOpen: false
    }

    this.openSignUpModal = this.openSignUpModal.bind(this)
    this.openLoginModal = this.openLoginModal.bind(this)
  }

  componentDidMount () {
    this.props.fetchUser()
    this.props.fetchUserAccessToken()
  }

  openSignUpModal () {
    this.setState({ signUpModalIsOpen: !this.state.signUpModalIsOpen })
  }

  openLoginModal () {
    this.setState({ loginModalIsOpen: !this.state.loginModalIsOpen })
  }

  renderContent () {
    if (this.props.authenticatedUser) {
      return (
        <div>
          <AdminHeader />
          <div className='container'>
            <Route path='/dashboard' component={Dashboard} />
            <Redirect from='/' to='/dashboard' exact />
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <ClientHeader
            openSignUpModal={() => this.openSignUpModal()}
            openLoginModal={() => this.openLoginModal()}
          />

          <div className='container'>
            <Route path='/' component={Landing} />
            <Redirect from='/*' to='/' />
          </div>

          <Modal isOpen={this.state.signUpModalIsOpen} contentLabel='Sign Up Form'>
            <SignUpForm />
            <p onClick={this.openSignUpModal}>Close</p>
          </Modal>

          <Modal isOpen={this.state.loginModalIsOpen} contentLabel='Login Form'>
            <LoginForm />
            <p onClick={this.openLoginModal}>Close</p>
          </Modal>
        </div>
      )
    }
  }

  render () {
    return (
      <BrowserRouter>
        {this.renderContent()}
      </BrowserRouter>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps, actions)(App)
