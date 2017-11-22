import React, { Component } from 'react'
import axios from 'axios'

class UpdateEmail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      new_email: '',
      confirm_new_email: '',
      error: false
    }

    this.update = this.update.bind(this, this.state.context)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  update (e) {
    e.preventDefault()
    if (this.state.new_email !== this.state.confirm_new_email) {
      this.setState({ error: true })
    } else {
      this.props.spinnify()
      axios.post('/auth/update_email', { new_email: this.state.new_email })
        .then(response => {
          this.props.spinnify()
          this.props.triggerThankyou('Email Updated', response.data)
        })
        .catch(error => {
          this.props.spinnify()
          console.log(error)
          this.props.triggerThankyou('Oops something went wrong!', error.data)
        })
    }
  }

  render () {
    return (
      <div>
        <p>Update your account email</p>
        <form
          id='update-email-form'
          className='form'
          onSubmit={this.update}
        >
          <div className='current_email'>Current Email: {this.props.email}</div>
          <label htmlFor='new_email'>
            <input
              id='new_email'
              name='new_email'
              type='email'
              placeholder='New email'
              value={this.state.new_email}
              onChange={this.handleChange}
              required
            />
            <div className='error' id='email-error' />
          </label>
          <label htmlFor='confirm_new_email'>
            <input
              id='confirm_new_email'
              name='confirm_new_email'
              type='email'
              placeholder='Confirm new email'
              value={this.state.confirm_new_email}
              onChange={this.handleChange}
              required
            />
          </label>
          <input type='submit' value='Submit' />
        </form>
        {(this.state.error) && <p className='error'>Please confirm your new email matches</p>}
        <p onClick={this.props.closeOverlay}>Close</p>
      </div>
    )
  }
}

export default UpdateEmail
