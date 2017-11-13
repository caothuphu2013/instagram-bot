import React, { Component } from 'react'
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import validator from 'validator'
import axios from 'axios'

const required = (value) => {
  if (!value.toString().trim().length) {
    return 'require';
  }
};

const password = (value) => {
  if (!validator.ispassword(value)) {
    return `${value} is not a valid password.`
  }
}

class UpdatePassword extends Component {
  constructor (props) {
    super(props)

    this.state = {
      current_password: '',
      new_password: '',
      confirm_new_password: '',
      error: false
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

    if (state.new_password !== state.confirm_new_password) {
      this.setState({ error: true })
    } else {
      this.props.spinnify()
      axios.post('/auth/update_password', {
        current_password: state.current_password,
        new_password: state.new_password
      })
        .then(response => {
          this.props.spinnify()
          this.props.triggerThankyou('password Updated', response.data)
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
        <p>Update your account password</p>
        <Form id='update-password-form' className='form' onSubmit={this.update}>
          <label htmlFor='current_password'>
            <Input
              id='current_password'
              name='current_password'
              type='password'
              placeholder='Current password'
              validations={[required, password]}
              value={this.state.current_password}
              onChange={this.handleChange}
            />
          </label>
          <label htmlFor='new_password'>
            <Input
              id='new_password'
              name='new_password'
              type='password'
              placeholder='New password'
              validations={[required, password]}
              value={this.state.new_password}
              onChange={this.handleChange}
            />
          </label>
          <label htmlFor='confirm_new_password'>
            <Input
              id='confirm_new_password'
              name='confirm_new_password'
              type='password'
              placeholder='Confirm new password'
              validations={[required, password]}
              value={this.state.confirm_new_password}
              onChange={this.handleChange}
            />
          </label>
          <input type='submit' value='Submit' />
        </Form>
        {(this.state.error) && <p className='error'>Please confirm your new password matches</p>}
        <p onClick={this.props.closeOverlay}>Close</p>
      </div>
    )
  }
}

export default UpdatePassword
