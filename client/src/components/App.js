import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import * as actions from '../actions'
import AdminHeader from './admin/header/AdminHeader'
import Dashboard from './admin/dashboard/Dashboard'
import Landing from './client/landing/Landing'

class App extends Component {
  componentDidMount () {
    this.props.fetchUser()
    this.props.fetchUserAccessToken()
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
          <Route path='/' component={Landing} />
          <Redirect from='/*' to='/' />
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
