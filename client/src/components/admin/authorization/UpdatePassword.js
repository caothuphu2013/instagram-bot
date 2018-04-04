import React, { Component } from 'react'
import axios from 'axios'
import {
  minimumFiveChars,
  containsNumber,
  containsUppercase
} from '../../../utilities/validations'

class UpdatePassword extends Component {
  constructor (props) {
    super(props)

    this.state = {
      current_password: '',
      new_password: '',
      confirm_new_password: '',
      error: false,
      error_type: ''
    }

    this.update = this.update.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  update (e) {
    e.preventDefault()
    const state = this.state

    if (!minimumFiveChars(state.new_password)) {
      this.setState({
        error: true,
        error_type: 'Your password must be a minimum of 5 characters'
      })
      return
    }

    if (!containsNumber(state.new_password)) {
      this.setState({
        error: true,
        error_type: 'Your password must contain a number'
      })
      return
    }

    if (!containsUppercase(state.new_password)) {
      this.setState({
        error: true,
        error_type: 'Your password must contain an uppercase letter'
      })
      return
    }

    if (state.new_password !== state.confirm_new_password) {
      this.setState({
        error: true,
        error_type: 'Please confirm both new passwords match'
      })
      return
    }

    this.props.spinnify()
    axios.post('/auth/update_password', {
      current_password: state.current_password,
      new_password: state.new_password
    })
    .then(response => {
      this.props.spinnify()
      this.props.triggerThankyou(response.data.title, response.data.message)
    })
    .catch(error => {
      this.props.spinnify()
      this.props.triggerThankyou('Oops something went wrong!', error.data)
    })
  }

  render () {
    return (
      <div>
        <p>Update your account password</p>
        <form id='update-password-form' className='form' onSubmit={this.update}>
          <label htmlFor='current_password'>
            <input
              id='current_password'
              name='current_password'
              type='password'
              placeholder='Current password'
              value={this.state.current_password}
              onChange={this.handleChange}
              required
            />
          </label>
          <label htmlFor='new_password'>
            <input
              id='new_password'
              name='new_password'
              type='password'
              placeholder='New password'
              value={this.state.new_password}
              onChange={this.handleChange}
              required
            />
          </label>
          <label htmlFor='confirm_new_password'>
            <input
              id='confirm_new_password'
              name='confirm_new_password'
              type='password'
              placeholder='Confirm new password'
              value={this.state.confirm_new_password}
              onChange={this.handleChange}
              required
            />
          </label>
          <input type='submit' value='Submit' />
        </form>
        {(this.state.error) && <p className='error'>{this.state.error_type}</p>}
        <p onClick={this.props.closeOverlay}>Close</p>
      </div>
    )
  }
}

export default UpdatePassword
