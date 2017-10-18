import React, { Component } from 'react'
import Autocomplete from 'react-google-autocomplete'
import TimezonePicker from 'react-timezone'
import axios from 'axios'

class ParamsForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      param_hashtags: '',
      param_usernames: '',
      param_blacklist_hashtags: null,
      param_blacklist_usernames: null,
      param_like_mode: false,
      param_follow_mode: false,
      param_longitude: '',
      param_latitude: '',
      param_timezone: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.saveParams = this.saveParams.bind(this)
  }

  componentDidMount () {
    axios.post('/api/current_params', { email: this.props.user.email })
    .then(res => {
      if (res.data !== '') {
        const data = res.data
        this.setState({
          param_hashtags: data.param_hashtags.toString(),
          param_usernames: data.param_usernames.toString(),
          param_blacklist_hashtags: data.param_blacklist_hashtags.toString(),
          param_blacklist_usernames: data.param_blacklist_usernames.toString(),
          param_like_mode: data.param_like_mode,
          param_follow_mode: data.param_follow_mode,
          param_longitude: data.param_longitude,
          param_latitude: data.param_latitude,
          param_timezone: data.param_timezone
        })
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleCheckbox (event) {
    this.setState({ [event.target.name]: event.target.checked })
  }

  saveParams (event) {
    event.preventDefault()
    this.props.spinnify()

    axios.post('/api/save_params', {
      param_hashtags: this.state.param_hashtags,
      param_usernames: this.state.param_usernames,
      param_blacklist_hashtags: this.state.param_blacklist_hashtags,
      param_blacklist_usernames: this.state.param_blacklist_usernames,
      param_like_mode: this.state.param_like_mode,
      param_follow_mode: this.state.param_follow_mode,
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
      this.props.toastify('Successfully saved!')
      console.log(response)
    })
    .catch(error => {
      console.log(error)
      this.props.spinnify()
      this.props.toastify('There was an error please try again')
    })
  }

  render () {
    return (
      <div>
        <TimezonePicker
          style={{width: '100%'}}
          value={this.state.param_timezone}
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
          onPlaceSelected={place => {
            this.setState({
              param_longitude: place.geometry.location.lng(),
              param_latitude: place.geometry.location.lat()
            })
          }}
          types={['(cities)']}
        />
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
          <label htmlFor='param_hashtags'>Enter hashtags:</label>
          <textarea
            id='param_hashtags'
            type='text'
            name='param_hashtags'
            placeholder='hashtags separated by a comma..'
            value={this.state.param_hashtags}
            onChange={this.handleChange}
          />
          <label htmlFor='param_usernames'>Enter usernames:</label>
          <textarea
            id='param_usernames'
            type='text'
            name='param_usernames'
            placeholder='usernames separated by a comma..'
            value={this.state.param_usernames}
            onChange={this.handleChange}
          />
        <label htmlFor='param_blacklist_hashtags'>Enter hashtags to blacklist:</label>
          <textarea
            id='param_blacklist_hashtags'
            type='text'
            name='param_blacklist_hashtags'
            placeholder='hashtags to blasklist separated by a comma..'
            value={this.state.param_blacklist_hashtags}
            onChange={this.handleChange}
          />
        <label htmlFor='param_blacklist_usernames'>Enter usernames to blacklist:</label>
          <textarea
            id='param_blacklist_usernames'
            type='text'
            name='param_blacklist_usernames'
            placeholder='usernames to blacklist separated by a comma..'
            value={this.state.param_blacklist_usernames}
            onChange={this.handleChange}
          />
          <input type='submit' value='Save' />
        </form>
      </div>
    )
  }
}

export default ParamsForm
