import React, { Component } from 'react'
import axios from 'axios'

class runParams extends Component {
  constructor (props) {
    super(props)

    this.state = {
      running: false
    }
  }

  componentDidMount () {
    axios.post('/api/current_params', { email: this.props.user.email })
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
        console.log(res)
        this.setState({ running: !this.state.running })
        this.props.spinnify()
        this.props.toastify(res.data)
      })
      .catch(error => {
        console.log(error)
        this.props.spinnify()
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
