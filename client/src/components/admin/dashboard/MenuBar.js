import React, { Component } from 'react'

class MenuBar extends Component {
  render () {
    return (
      <div id='menu-bar'>
        <ul>
          <li><p>Automation Settings</p></li>
          <li><p>Statistics</p></li>
          <li><p>Account & Billing</p></li>
        </ul>
      </div>
    )
  }
}

export default MenuBar
