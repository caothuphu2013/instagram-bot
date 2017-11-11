import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import AuthForm from '../../admin/authorization/AuthForm'

class ClientHeader extends Component {
  constructor (props) {
    super(props)

    this.state = {
      signUpModalIsOpen: false,
      loginModalIsOpen: false
    }

    this.openSignUpModal = this.openSignUpModal.bind(this)
    this.openLoginModal = this.openLoginModal.bind(this)
  }

  openSignUpModal () {
    this.setState({ signUpModalIsOpen: !this.state.signUpModalIsOpen })
  }

  openLoginModal () {
    this.setState({ loginModalIsOpen: !this.state.loginModalIsOpen })
  }

  render () {
    return (
      <nav>
        <div className='container nav-wrapper'>
          <Link to='/' className='brand-logo'>
          </Link>
          <div>
            <ul id='nav-mobile' className='right hide-on-med-and-down'>
              <li><p onClick={this.openLoginModal}>Login</p></li>
              <li><p onClick={this.openSignUpModal}>Sign Up</p></li>
            </ul>
          </div>
        </div>

        <Modal isOpen={this.state.signUpModalIsOpen} contentLabel='Sign Up Form'>
          <AuthForm
            signUp='true'
            path='/auth/signup'
            history={this.props.history}
            isOpen={this.openSignUpModal}
          />
          <p onClick={this.openSignUpModal}>Close</p>
        </Modal>

        <Modal isOpen={this.state.loginModalIsOpen} contentLabel='Login Form'>
          <AuthForm
            path='/auth/login'
            history={this.props.history}
            isOpen={this.openLoginModal}
          />
          <p onClick={this.openLoginModal}>Close</p>
        </Modal>
      </nav>
    )
  }
}

// <li><a href='/'>Features</a></li>
// <li><a href='/'>Pricing</a></li>
// <li><a href='/auth/instagram'>Start Free Trial</a></li>

export default ClientHeader
