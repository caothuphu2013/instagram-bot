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

const email = (value) => {
  if (!validator.isEmail(value)) {
    return `${value} is not a valid email.`
  }
}

class DeleteAccount extends Component {
  constructor (props) {
    super(props)

    this.state = {
      input_email: '',
      error: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.delete = this.delete.bind(this)
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  delete (e) {
    e.preventDefault()
    if (this.props.email !== this.state.input_email) {
      this.setState({ error: true })
    } else {
      this.props.spinnify()
      axios.post('/auth/delete_account', { email: this.state.input_email })
        .then(response => {
          this.props.spinnify()
          window.location.reload()
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
        <p>Delete account</p>
        <p>This will erase all data saved with Project Buzz. Input your account
        email to confirm deletion of your account.</p>
        <Form id='delete-account-form' className='form' onSubmit={this.delete}>
          <label htmlFor='new_email'>
            <Input
              id='input_email'
              name='input_email'
              type='email'
              placeholder='Account email'
              validations={[required, email]}
              value={this.state.input_email}
              onChange={this.handleChange}
            />
          </label>
          <input type='submit' value='Delete Account' />
        </Form>
        {(this.state.error) && <p className='error'>
          Please confirm the input matches your account email.</p>}
        <p onClick={this.props.closeOverlay}>Close</p>
      </div>
    )
  }
}

export default DeleteAccount
