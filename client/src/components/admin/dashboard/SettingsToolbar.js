import React, { Component } from 'react'
import axios from 'axios'
import hasParamsSaved from '../../../utilities/hasParamsSaved'
import isInTrial from '../../../utilities/isInTrial'

class SettingsToolbar extends Component {
  constructor (props) {
    super(props)
    const params = this.props.userParams
    this.state = {
      param_like_mode: params.param_like_mode,
      param_follow_mode: params.param_follow_mode,
      param_unfollow_mode: params.param_unfollow_mode,
      param_boost_mode: params.param_boost_mode
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
      param_boost_mode: this.state.param_boost_mode,
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
    const params = this.props.userParams
    const noInstagram = (this.props.user.instagram_accessToken === '')
    const isInTrialorNot = (isInTrial(this.props.user.created_at, this.props.user.stripe_subscription_id))

    return (
      <div id='settings-toolbar' className='toolbar'>
        {(noInstagram) && <p>Please connect an Instagram account</p>}
        {(!hasParamsSaved(params)) && <p>Please select at least one active targeting attribute under
          Targeting Options to get started</p>}
        <form id='params-form' onSubmit={this.saveParams}>
          <div className='switch'>
            <label htmlFor='param_like_mode'>Like Mode:
              <input
                id='param_like_mode'
                type='checkbox'
                name='param_like_mode'
                checked={this.state.param_like_mode}
                onClick={this.handleCheckbox}
                disabled={noInstagram || (!hasParamsSaved(params))}
              />
              <span className='lever' />
            </label>
          </div>

          <div className='switch'>
            <label htmlFor='param_follow_mode'>Follow Mode:
              <input
                id='param_follow_mode'
                type='checkbox'
                name='param_follow_mode'
                checked={this.state.param_follow_mode}
                onClick={this.handleCheckbox}
                disabled={noInstagram || (!hasParamsSaved(params))}
              />
              <span className='lever' />
            </label>
          </div>
          {(isInTrialorNot) && <p>Get full access by subscribing</p>}
          <div className='switch'>
            <label htmlFor='param_unfollow_mode'>Unfollow Mode:
              <input
                id='param_unfollow_mode'
                type='checkbox'
                name='param_unfollow_mode'
                checked={this.state.param_unfollow_mode}
                onClick={this.handleCheckbox}
                disabled={noInstagram || (!hasParamsSaved(params) || isInTrialorNot)}
              />
              <span className='lever' />
            </label>
          </div>

          <div className='switch'>
            <label htmlFor='param_boost_mode'>Accelerated Mode:
              <input
                id='param_boost_mode'
                type='checkbox'
                name='param_boost_mode'
                checked={this.state.param_boost_mode}
                onClick={this.handleCheckbox}
                disabled={noInstagram || (!hasParamsSaved(params) || isInTrialorNot)}
              />
              <span className='lever' />
            </label>
          </div>

          <button
            type='submit'
            name='action'
            disabled={noInstagram || (!hasParamsSaved(params))}>
            Save
          </button>
        </form>
      </div>
    )
  }
}

export default SettingsToolbar
