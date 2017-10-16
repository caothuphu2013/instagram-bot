import React, { Component } from 'react'
import Autocomplete from 'react-google-autocomplete'
import axios from 'axios'

class ParamsForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      param_hashtags: '',
      param_usernames: '',
      param_like_mode: false,
      param_follow_mode: false,
      param_longitude: '',
      param_latitude: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.saveParams = this.saveParams.bind(this)
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
      param_like_mode: this.state.param_like_mode,
      param_follow_mode: this.state.param_follow_mode,
      param_longitude: this.state.param_longitude,
      param_latitude: this.state.param_latitude,
      username: this.props.user.username,
      instagram_id: this.props.user.instagramID,
      access_token: this.props.user.accessToken,
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
        <Autocomplete
          style={{width: '100%'}}
          onPlaceSelected={(place) => {
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
          <label htmlFor='param_hashtags'>Enter hashtags: </label>
          <textarea
            id='param_hashtags'
            type='text'
            name='param_hashtags'
            placeholder='stuff'
            value={this.state.param_hashtags}
            onChange={this.handleChange}
          />
          <label htmlFor='param_usernames'>Enter usernames: </label>
          <textarea
            id='param_usernames'
            type='text'
            name='param_usernames'
            placeholder='stuff'
            value={this.state.param_usernames}
            onChange={this.handleChange}
          />
          <input type='submit' value='Save' />
        </form>
      </div>
    )
  }
}

export default ParamsForm
