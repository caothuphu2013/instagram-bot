import React, { Component } from 'react'
import axios from 'axios'

class ParamsForm extends Component {
  constructor (props) {
    super(props)
    this.state = { hashtags: '' }

    this.handleChange = this.handleChange.bind(this)
    this.saveParams = this.saveParams.bind(this)
  }

  handleChange (event) {
    this.setState({ hashtags: event.target.value })
  }

  saveParams (event) {
    event.preventDefault()
    this.props.spinnify()

    axios.post('/api/save_params', {
      hashtags: this.state.hashtags,
      username: this.props.user.username,
      instagram_id: this.props.user.instagramID,
      access_token: this.props.user.accessToken,
      email: this.props.user.email,
      user_id: this.props.user._id
    })
    .then(response => {
      this.props.toastify('Successfully saved!')
      this.props.spinnify()
      console.log(response)
    })
    .catch(error => {
      console.log(error)
      this.props.toastify('There was an error please try again')
    })
  }

  render () {
    return (
      <form id='params-form' onSubmit={this.saveParams}>
        <label htmlFor='hashtag'>Enter test: </label>
        <textarea
          id='hashtag'
          type='text'
          name='hashtags'
          placeholder='stuff'
          value={this.state.hashtags}
          onChange={this.handleChange}
        />
        <input type='submit' value='Save' />
      </form>
    )
  }
}

export default ParamsForm
