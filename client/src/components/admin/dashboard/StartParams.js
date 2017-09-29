import React, { Component } from 'react'
import axios from 'axios'

class StartParams extends Component {
  constructor (props) {
    super(props)

    this.state = {
      running: false
    }
  }

  startParams () {
    this.props.spinnify()
    axios.post('/api/run_params', {
      instagram_id: this.props.user.instagramID
    })
    .then(response => {
      this.setState({ running: true })
      this.props.spinnify()
      this.props.toastify('Successfully started!')
    })
    .catch(error => {
      console.log(error)
      this.props.toastify('There was an error please try again')
    })
  }

  renderContent () {
    if (this.state.running) {
      return (
        <button id='stop-button' onClick={() => this.setState({ running: false })}>Stop</button>
      )
    } else {
      return (
        <button id='start-button' onClick={() => this.startParams()}>Start</button>
      )
    }
  }

  render () {
    return (
      <div>
        {this.renderContent()}
      </div>
    )
  }
}

export default StartParams
