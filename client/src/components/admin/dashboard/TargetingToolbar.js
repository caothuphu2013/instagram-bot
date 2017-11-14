import React, { Component } from 'react'
import Autocomplete from 'react-google-autocomplete'
import TimezonePicker from 'react-timezone'
import axios from 'axios'

class TargetingToolbar extends Component {
  constructor (props) {
    super(props)
    const params = this.props.userParams
    this.state = {
      param_hashtags: params.param_hashtags.toString(),
      param_usernames: params.param_usernames.toString(),
      param_blacklist_hashtags: params.param_blacklist_hashtags.toString(),
      param_blacklist_usernames: params.param_blacklist_usernames.toString(),
      param_timezone: params.param_timezone,
      param_longitude: '',
      param_latitude: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.saveParams = this.saveParams.bind(this)
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  saveParams (event) {
    event.preventDefault()
    this.props.spinnify()

    axios.post('/api/save_targeting_params', {
      param_hashtags: this.state.param_hashtags,
      param_usernames: this.state.param_usernames,
      param_blacklist_hashtags: this.state.param_blacklist_hashtags,
      param_blacklist_usernames: this.state.param_blacklist_usernames,
      param_longitude: this.state.param_longitude,
      param_latitude: this.state.param_latitude,
      param_timezone: this.state.param_timezone,
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
    const noInstagram = (this.props.user.instagram_accessToken === '')
    return (
      <div id='targeting-toolbar' className='toolbar'>
        <TimezonePicker
          style={{width: '100%'}}
          value={this.state.param_timezone}
          disabled={noInstagram}
          onChange={timezone => {
            this.setState({ param_timezone: timezone })
          }}
          inputProps={{
            placeholder: 'Select Timezone',
            name: 'timezone'
          }}
        />

        <Autocomplete
          style={{width: '100%'}}
          disabled={noInstagram}
          onPlaceSelected={place => {
            this.setState({
              param_longitude: place.geometry.location.lng(),
              param_latitude: place.geometry.location.lat()
            })
          }}
          types={['(cities)']}
        />

        <form id='params-form' onSubmit={this.saveParams}>
          <label htmlFor='param_hashtags'>Enter hashtags:</label>
          <textarea
            id='param_hashtags'
            type='text'
            name='param_hashtags'
            placeholder='hashtags separated by a comma..'
            value={this.state.param_hashtags}
            onChange={this.handleChange}
            disabled={noInstagram}
          />
          <label htmlFor='param_usernames'>Enter usernames:</label>
          <textarea
            id='param_usernames'
            type='text'
            name='param_usernames'
            placeholder='usernames separated by a comma..'
            value={this.state.param_usernames}
            onChange={this.handleChange}
            disabled={noInstagram}
          />
        <label htmlFor='param_blacklist_hashtags'>Enter hashtags to blacklist:</label>
          <textarea
            id='param_blacklist_hashtags'
            type='text'
            name='param_blacklist_hashtags'
            placeholder='hashtags to blasklist separated by a comma..'
            value={this.state.param_blacklist_hashtags}
            onChange={this.handleChange}
            disabled={noInstagram}
          />
        <label htmlFor='param_blacklist_usernames'>Enter usernames to blacklist:</label>
          <textarea
            id='param_blacklist_usernames'
            type='text'
            name='param_blacklist_usernames'
            placeholder='usernames to blacklist separated by a comma..'
            value={this.state.param_blacklist_usernames}
            onChange={this.handleChange}
            disabled={noInstagram}
          />
          <input type='submit' disabled={noInstagram} value='Save' />
        </form>

      </div>
    )
  }
}

export default TargetingToolbar
