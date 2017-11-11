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

class UpdateEmail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      new_email: '',
      confirm_new_email: '',
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
    if (this.state.new_email !== this.state.confirm_new_email) {
      this.setState({ error: true })
    } else {
<<<<<<< Updated upstream
      
=======
>>>>>>> Stashed changes
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
        <Form id='update-email-form' className='form' onSubmit={this.update}>
          <div className='current_email'>Current Email: {this.props.email}</div>
          <label htmlFor='new_email'>
            <Input
              id='new_email'
              name='new_email'
              type='email'
              placeholder='New email'
              validations={[required, email]}
              value={this.state.new_email}
              onChange={this.handleChange}
            />
          </label>
          <label htmlFor='confirm_new_email'>
            <Input
              id='confirm_new_email'
              name='confirm_new_email'
              type='email'
              placeholder='Confirm new email'
              validations={[required, email]}
              value={this.state.confirm_new_email}
              onChange={this.handleChange}
            />
          </label>
          <input type='submit' value='Submit' />
        </Form>
        {(this.state.error) && <p className='error'>Please confirm your new email matches</p>}
        <p onClick={this.props.closeOverlay}>Close</p>
      </div>
    )
  }
}

export default UpdateEmail
