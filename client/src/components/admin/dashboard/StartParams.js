import React, { Component } from 'react'
import axios from 'axios'

class runParams extends Component {
  constructor (props) {
    super(props)

    this.state = {
      running: false
    }
  }

  runParams (path) {
    this.props.spinnify()
    axios.post(path)
    .then(response => {
      console.log(response)
      this.setState({ running: !this.state.running })
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
        <button
          id='stop-button'
          onClick={() => this.runParams('/api/stop_params')}
        >
          Stop
        </button>
      )
    } else {
      return (
        <button
          id='start-button'
          onClick={() => this.runParams('/api/run_params')}
        >
          Start
        </button>
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

export default runParams
