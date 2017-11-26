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
        console.log('res')
        console.log(res)
        if (res.data === "A user with the given username is already registered") {
          this.setState({ error: true, name: '', email: '', password: '',
            description: 'A user with the given email is already registered'
          })
          this.spinnify()
        } else if (res.data === "Password or username is incorrect") {
          this.setState({ error: true, email: '', password: '',
            description: res.data
          })
          this.spinnify()
        } else {
          this.props.fetchUser()
          this.spinnify()
        }
      })
      .catch(err => {
        console.log('err')
        console.log(err)
        this.setState({
          error: true,
          desription: err.message
        })
        this.spinnify()
      })
  }

  renderSignUp () {
    return (
      <label htmlFor='name'>
        <input
          type='text'
          name='name'
          placeholder='First & Last Name'
          value={this.state.name}
          onChange={this.handleChange}
        />
      </label>
    )
  }

  render () {
    return (
      <div className='container'>
        {(this.state.spinner) && <Spinner />}
        {(this.state.error) ? <p className='error'>{this.state.description}</p> : null}
        <form id='login-form' onSubmit={this.login}>
          <p>{(this.props.signUp) ? 'Sign Up' : 'Login'}</p>
          {this.props.signUp && this.renderSignUp()}
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
          <input type='submit' value={(this.props.signUp) ? 'Start Trial' : 'Login'} />
        </form>
      </div>
    )
  }
}

function mapStateToProps ({ authenticatedUser }) {
  return { authenticatedUser }
}

export default connect(mapStateToProps, actions)(AuthForm)
