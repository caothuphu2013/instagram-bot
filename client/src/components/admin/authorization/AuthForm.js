import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import * as actions from '../../../actions'
import Spinner from '../../UI/Spinner'

class AuthForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      authenticated: this.props.authenticatedUser,
      description: '',
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

  login (event) {
    event.preventDefault()
    this.spinnify()
    const signUp = {
      name: this.state.name.toLowerCase(),
      email: this.state.email.toLowerCase(),
      password: this.state.password,
      createdAt: Date.now()
    }
    const login = {
      email: this.state.email.toLowerCase(),
      password: this.state.password.toLowerCase(),
      createdAt: Date.now()
    }
    const params = (this.props.signUp) ? signUp : login

    axios.post(this.props.path, params)
      .then(res => {
        if (res.data.success === undefined) {
          this.setState({
            error: true,
            desription: 'This user already exists, please login instead'
          })
        }
        this.props.fetchUser()
        this.spinnify()
      })
      .catch(error => {
        this.setState({
          error: true,
          desription: 'There was an error signing up, please try again'
        })
        this.spinnify()
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
        {(this.state.error) && <p>{this.state.description}</p>}
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
