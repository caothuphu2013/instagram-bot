import React, { Component } from 'react'
import axios from 'axios'

class StartAutomator extends Component {
  constructor (props) {
    super(props)

    this.state = {
      running: false
    }
  }

  componentDidMount () {
    axios.get('/api/current_params', { email: this.props.email })
      .then(res => {
        if (res.data !== '') this.setState({ running: res.data.param_automator_running })
      })
      .catch(error => {
        console.log(error)
      })
  }

  runParams (path) {
    this.props.spinnify()
    axios.post(path)
      .then(res => {
        this.setState({ running: !this.state.running })
        this.props.spinnify()
        this.props.toastify(res.data)
      })
      .catch(error => {
        this.props.spinnify()
        this.props.toastify(error.data)
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

export default StartAutomator
