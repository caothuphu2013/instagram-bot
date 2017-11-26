import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AuthForm from '../../admin/authorization/AuthForm'
import Overlay from '../../UI/Overlay'

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
    this.setState({
      signUpModalIsOpen: !this.state.signUpModalIsOpen,
      loginModalIsOpen: false
    })
  }

  openLoginModal () {
    this.setState({
      loginModalIsOpen: !this.state.loginModalIsOpen,
      signUpModalIsOpen: false
    })
  }

  render () {
    return (
      <nav>
        <div className='container nav-wrapper'>
          <Link to='/' className='brand-logo'>
            Strolio
          </Link>
          <div>
            <ul id='nav-mobile' className='right'>
              <li><Link to='/pricing'>Pricing</Link></li>
              <li><Link to='/guide'>Guide</Link></li>
              <li><Link to='/faq'>FAQ</Link></li>
              <li><a onClick={this.openLoginModal}>Login</a></li>
              <li><a onClick={this.openSignUpModal}>Start Free Trial</a></li>
            </ul>
          </div>
        </div>

        <Overlay isOpen={this.state.signUpModalIsOpen} contentLabel='Sign Up Form'>
          <AuthForm
            signUp='true'
            path='/auth/signup'
            history={this.props.history}
            isOpen={this.openSignUpModal}
          />
          <p onClick={this.openSignUpModal}>Close</p>
        </Overlay>

        <Overlay isOpen={this.state.loginModalIsOpen} contentLabel='Login Form'>
          <AuthForm
            path='/auth/login'
            history={this.props.history}
            isOpen={this.openLoginModal}
          />
          <p onClick={this.openLoginModal}>Close</p>
        </Overlay>
      </nav>
    )
  }
}

// <li><a href='/'>Features</a></li>
// <li><a href='/'>Pricing</a></li>
// <li><a href='/auth/instagram'>Start Free Trial</a></li>

export default ClientHeader
