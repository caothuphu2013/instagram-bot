import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import * as actions from '../../../actions'
import Spinner from '../../UI/Spinner'
import {
  minimumFiveChars,
  containsNumber,
  containsUppercase,
  validateEmail
} from '../../../utilities/validations'

class AuthForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      authenticated: this.props.authenticatedUser,
      error_type: '',
      spinner: false,
      error: false
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

  login (e) {
    e.preventDefault()
    const state = this.state
    // validate sign up form
    if (this.props.signUp) {
      if (this.state.name === '') {
        this.setState({
          error: true,
          error_type: 'Please input your name to get started'
        })
        return
      }

      if (!validateEmail(state.email)) {
        this.setState({
          error: true,
          error_type: 'Please provide a valid email address'
        })
        return
      }

      if (state.password === '') {
        this.setState({
          error: true,
          error_type: 'Please input a password to get started'
        })
        return
      }

      if (!minimumFiveChars(state.password)) {
        this.setState({
          error: true,
          error_type: 'Your password must be a minimum of 5 characters'
        })
        return
      }

      if (!containsNumber(state.password)) {
        this.setState({
          error: true,
          error_type: 'Your password must contain a number'
        })
        return
      }

      if (!containsUppercase(state.password)) {
        this.setState({
          error: true,
          error_type: 'Your password must contain an uppercase letter'
        })
        return
      }

      if (state.password !== state.confirmPassword) {
        this.setState({
          error: true,
          error_type: 'Please confirm both passwords match'
        })
        return
      }
    }

    // validate login form
    if (!this.props.signUp) {
      if (state.email === '') {
        this.setState({
          error: true,
          error_type: 'Please input your email'
        })
        return
      }

      if (!validateEmail(state.email)) {
        this.setState({
          error: true,
          error_type: 'Please provide a valid email address'
        })
        return
      }

      if (state.password === '') {
        this.setState({
          error: true,
          error_type: 'Please input your password'
        })
        return
      }
    }

    this.spinnify()
    const signUp = {
      name: this.state.name.toLowerCase().trim(),
      email: this.state.email.toLowerCase().trim(),
      password: this.state.password,
      createdAt: Date.now()
    }

    const login = {
      email: this.state.email.toLowerCase().trim(),
      password: this.state.password.toLowerCase().trim(),
      createdAt: Date.now()
    }

    const params = (this.props.signUp) ? signUp : login

    axios.post(this.props.path, params)
      .then(res => {
        if (res.data === 'A user with the given username is already registered') {
          this.setState({
            error: true,
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            error_type: 'A user with the given email is already registered'
          })
          this.spinnify()
        } else if (res.data === 'Password or username is incorrect') {
          this.setState({
            error: true,
            email: '',
            password: '',
            error_type: res.data
          })
          this.spinnify()
        } else {
          this.props.fetchUser()
          this.spinnify()
        }
      })
      .catch(err => {
        this.setState({
          error: true,
          desription: err.message
        })
        this.spinnify()
      })
  }

  renderSignUp () {
    return (
      <form id='login-form' onSubmit={this.login}>
        <p>Sign Up</p>
        <label htmlFor='name'>
          <input
            type='text'
            name='name'
            placeholder='First & Last Name'
            value={this.state.name}
            onChange={this.handleChange}
          />
        </label>
        <label htmlFor='email'>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={this.state.email}
            onChange={this.handleChange}
          />
        </label>
        <label htmlFor='password'>
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={this.state.password}
            onChange={this.handleChange}
          />
        </label>
        <label htmlFor='confirmPassword'>
          <input
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
            value={this.state.confirmPassword}
            onChange={this.handleChange}
          />
        </label>
        <input type='submit' value='Start Trial' />
      </form>
    )
  }

  renderLogin () {
    return (
      <form id='login-form' onSubmit={this.login}>
        <p>Login</p>
        <label htmlFor='email'>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={this.state.email}
            onChange={this.handleChange}

          />
        </label>
        <label htmlFor='password'>
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={this.state.password}
            onChange={this.handleChange}

          />
        </label>
        <input type='submit' value='Login' />
      </form>
    )
  }

  render () {
    return (
      <div className='container'>
        {(this.state.spinner) && <Spinner />}
        {(this.props.signUp) ? this.renderSignUp() : this.renderLogin()}
        {(this.state.error) && <p className='error'>{this.state.error_type}</p>}
      </div>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps, actions)(AuthForm)
