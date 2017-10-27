import React, { Component } from 'react'

import ParamsForm from './ParamsForm'

class SettingsToolbar extends Component {
  render () {
    return (
      <div id='settings-toolbar' className='toolbar'>
        <ParamsForm
          user={this.props.user}
          toastify={this.props.toastify}
          spinnify={this.props.spinnify}
        />
      </div>
    )
  }
}

export default SettingsToolbar
