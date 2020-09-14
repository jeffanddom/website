import React from 'react'

import twitter from '../img/social/twitter.svg'

const Footer = class extends React.Component {
  render() {
    return (
      <footer>
        <div className="container">
          <div className="column is-4">
            Jeff and Dom Make a Game
              </div>

          <div className="social">
            <a title="twitter" href="https://twitter.com/jeffanddom">
              <img
                src={twitter}
                alt="Twitter"
                style={{ width: '1em', height: '1em' }}
              />
            </a>
          </div>
          <div>
            <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style={{ borderWidth: 0 }} src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
              </div>
        </div>
      </footer >
    )
  }
}

export default Footer
