import React, { Component } from 'react'

class MenuBar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      active: ''
    }
  }

  render () {
    return (
      <div id='menu-bar'>
        <ul>
          <li>Automation Settings</li>
          <li>Statistics</li>
          <li>Add New Account</li>
          <li>Account & Billing</li>
        </ul>
      </div>
    )
  }
}

export default MenuBar
