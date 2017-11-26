import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import * as actions from '../actions'
import AdminHeader from './admin/header/AdminHeader'
import ClientHeader from './client/header/ClientHeader'
import Dashboard from './admin/dashboard/Dashboard'
import Landing from './client/landing/Landing'
import Pricing from './client/pricing/Pricing'
import Guide from './client/guide/Guide'
import Help from './client/help/Help'

class App extends Component {
  componentDidMount () {
    this.props.fetchUser()
  }

  renderContent () {
    if (this.props.authenticatedUser) {
      return (
        <div>
          <AdminHeader />
          <div className='home'>
            <Redirect from='/' to='/dashboard' exact />
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/guide' component={Guide} />
            <Route path='/pricing' component={Pricing} />
            <Route path='/faq' component={Help} />
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <ClientHeader />
          <div className='home'>
            <Redirect from='/dashboard' to='/' exact />
            <Route path='/' component={Landing} exact />
            <Route path='/guide' component={Guide} />
            <Route path='/pricing' component={Pricing} />
            <Route path='/faq' component={Help} />
          </div>
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
