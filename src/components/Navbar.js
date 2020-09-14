import React from 'react'
import { Link } from 'gatsby'

const Navbar = class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      navBarActiveClass: '',
    }
  }

  toggleHamburger = () => {
    // toggle the active boolean in the state
    this.setState(
      {
        active: !this.state.active,
      },
      // after state has been updated,
      () => {
        // set the class in state for the navbar accordingly
        this.state.active
          ? this.setState({
            navBarActiveClass: 'is-active',
          })
          : this.setState({
            navBarActiveClass: '',
          })
      }
    )
  }

  render() {
    return (
      <nav
        role="navigation"
        aria-label="main-navigation"
      >
        <div className="container">
          <Link className="navbar-item" to="/">
            Home
              </Link>
          <Link className="navbar-item" to="/devlog">
            Devlog
              </Link>
          <Link className="navbar-item" to="/broadcasts">
            Past Broadcasts
              </Link>
          <Link className="navbar-item" to="/contact">
            Find us
            </Link>
        </div>
      </nav>
    )
  }
}

export default Navbar
