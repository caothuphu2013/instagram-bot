import React, { Component } from 'react'
import axios from 'axios'
import { validateEmail } from '../../../utilities/validations'

class DeleteAccount extends Component {
  constructor (props) {
    super(props)

    this.state = {
      input_email: '',
      error: false,
      error_type: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.delete = this.delete.bind(this)
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  delete (e) {
    e.preventDefault()

    // validate email address
    if (!validateEmail(this.state.input_email)) {
      this.setState({
        error: true,
        error_type: 'Please provide a valid email address'
      })
      return
    }

    // validate email input matches account email
    if (this.props.email !== this.state.input_email) {
      this.setState({
        error: true,
        error_type: 'Please confirm the input matches your account email.'
      })
      return
    }

    this.props.spinnify()
    axios.post('/auth/delete_account', { email: this.state.input_email })
      .then(response => {
        this.props.spinnify()
        window.location.reload()
      })
      .catch(error => {
        this.props.spinnify()
        this.props.triggerThankyou('Oops something went wrong!', error.data)
      })
  }

  render () {
    return (
      <div>
        <p>Delete account</p>
        <p>This will erase all data saved with Project Buzz. Input your account
        email to confirm deletion of your account.</p>
        <form id='delete-account-form' className='form' onSubmit={this.delete}>
          <label htmlFor='new_email'>
            <input
              id='input_email'
              name='input_email'
              type='email'
              placeholder='Account email'
              value={this.state.input_email}
              onChange={this.handleChange}
            />
          </label>
          <input type='submit' value='Delete Account' />
        </form>
        {(this.state.error) && <p className='error'>{this.state.error_type}</p>}
        <p onClick={this.props.closeOverlay}>Close</p>
      </div>
    )
  }
}

export default DeleteAccount
