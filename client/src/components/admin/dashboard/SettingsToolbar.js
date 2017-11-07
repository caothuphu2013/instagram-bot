import React, { Component } from 'react'
import axios from 'axios'

class SettingsToolbar extends Component {
  constructor (props) {
    super(props)
    const params = this.props.userParams
    this.state = {
      param_like_mode: params.param_like_mode,
      param_follow_mode: params.param_follow_mode,
      param_unfollow_mode: params.param_unfollow_mode
    }

    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.saveParams = this.saveParams.bind(this)
  }

  handleCheckbox (event) {
    this.setState({ [event.target.name]: event.target.checked })
  }

  saveParams (event) {
    event.preventDefault()
    this.props.spinnify()

    axios.post('/api/save_setting_params', {
      param_like_mode: this.state.param_like_mode,
      param_follow_mode: this.state.param_follow_mode,
      param_unfollow_mode: this.state.param_unfollow_mode,
      username: this.props.user.instagram_username,
      instagram_id: this.props.user.instagram_id,
      access_token: this.props.user.instagram_accessToken,
      email: this.props.user.email,
      user_id: this.props.user._id
    })
    .then(response => {
      this.props.spinnify()
      this.props.toastify(response.data)
    })
    .catch(error => {
      this.props.spinnify()
      this.props.toastify(error.data)
    })
  }

  render () {
    return (
      <div id='settings-toolbar' className='toolbar'>
        <form id='params-form' onSubmit={this.saveParams}>
          <label htmlFor='param_like_mode'>Like Mode: </label>
          <input
            id='param_like_mode'
            type='checkbox'
            name='param_like_mode'
            checked={this.state.param_like_mode}
            onClick={this.handleCheckbox}
          />
          <label htmlFor='param_follow_mode'>Follow Mode: </label>
          <input
            id='param_follow_mode'
            type='checkbox'
            name='param_follow_mode'
            checked={this.state.param_follow_mode}
            onClick={this.handleCheckbox}
          />
          <label htmlFor='param_unfollow_mode'>Unfollow Mode: </label>
          <input
            id='param_unfollow_mode'
            type='checkbox'
            name='param_unfollow_mode'
            checked={this.state.param_unfollow_mode}
            onClick={this.handleCheckbox}
          />
          <input type='submit' value='Save' />
        </form>
      </div>
    )
  }
}

export default SettingsToolbar
