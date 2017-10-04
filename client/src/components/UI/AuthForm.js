import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import Spinner from '../UI/Spinner'

class AuthForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      authenticated: this.props.authenticatedUser,
      spinner: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.login = this.login.bind(this)
    this.spinnify = this.spinnify.bind(this)
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  spinnify () {
    this.setState({ spinner: !this.state.spinner })
  }

  login (event) {
    event.preventDefault()
    this.spinnify()
    const signUp = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      createdAt: Date.now()
    }
    const login = {
      email: this.state.email,
      password: this.state.password,
      createdAt: Date.now()
    }
    const params = (this.props.signUp) ? signUp : login

    axios.post(this.props.path, params)
      .then(res => {
        console.log(res.data.success)
        this.props.fetchUser()
        this.spinnify()
      })
      .catch(error => {
        console.log(error)
      })
  }

  renderSignUp () {
    return (
      <textarea
        type='text'
        name='name'
        placeholder='Name'
        value={this.state.name}
        onChange={this.handleChange}
      />
    )
  }

  render () {
    return (
      <div className='container'>
        {(this.state.spinner) && <Spinner />}
        <form id='login-form' onSubmit={this.login}>
          <label htmlFor='hashtag'>{(this.props.signUp) ? 'Sign Up' : 'Login'}</label>
          {this.props.signUp && this.renderSignUp()}
          <textarea
            type='text'
            name='email'
            placeholder='Email'
            value={this.state.email}
            onChange={this.handleChange}
          />
          <textarea
            type='text'
            name='password'
            placeholder='password'
            value={this.state.password}
            onChange={this.handleChange}
          />
          <input type='submit' value='Save' />
        </form>
      </div>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps, actions)(AuthForm)
