import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import * as actions from '../actions'
import Header from './Header'
import SurveyNew from './SurveyNew'
import Dashboard from './Dashboard'
import Landing from './Landing'

class App extends Component {
  componentDidMount () {
    this.props.fetchUser()
  }

  render () {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <div className='container'>
            <Route path='/' exact component={Landing} />
            <Route path='/dashboard' exact component={Dashboard} />
            <Route path='/dashboard/new' component={SurveyNew} />
          </div>
        </div>
      </BrowserRouter>
    )
  }
}

export default connect(null, actions)(App)
