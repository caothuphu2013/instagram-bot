import React, { Component } from 'react'
import axios from 'axios'

class LoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.saveLogin = this.saveLogin.bind(this)
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  saveLogin (event) {
    event.preventDefault()
    // this.props.spinnify()
    const { name, email, password } = this.state
    axios.post('/auth/login', {
      name, email, password
    })
    .then(response => {
      // this.props.toastify('Successfully saved!')
      // this.props.spinnify()

      console.log(response)
    })
    .catch(error => {
      console.log(error)
      // this.props.toastify('There was an error please try again')
    })
  }

  render () {
    return (
      <form id='login-form' onSubmit={this.saveLogin}>
        <label htmlFor='hashtag'>Login: </label>
        <textarea
          type='text'
          name='name'
          placeholder='Name'
          value={this.state.name}
          onChange={this.handleChange}
        />
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
    )
  }
}

export default LoginForm
