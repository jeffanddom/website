import React from 'react'

import github from '../img/github.svg'
import twitch from '../img/twitch.svg'
import twitter from '../img/social/twitter.svg'

const Footer = class extends React.Component {
  render() {
    return (
      <footer>
        <div className="container">
          <div>
            <p>
              Made by Jeff&nbsp;Lee and Dominic&nbsp;Dagradi
            </p>

            <div className="social">
              <a title="twitch" href="https://www.twitch.tv/jeffanddom" target="_blank">
                <img
                  src={twitch}
                  alt="Twitch"
                  style={{ width: '1em', height: '1em' }}
                />
              </a>
              {' '}
              <a title="twitter" href="https://twitter.com/jeffanddom" target="_blank">
                <img
                  src={twitter}
                  alt="Twitter"
                  style={{ width: '1em', height: '1em' }}
                />
              </a>
              {' '}
              <a title="github" href="https://github.com/jeffanddom" target="_blank">
                <img
                  src={github}
                  alt="GitHub"
                  style={{ width: '1em', height: '1em' }}
                />
              </a>
            </div>
          </div>

          <div className="cc">
            <a rel="license" target="_blank" href=" http://creativecommons.org/licenses/by-sa/4.0/">
              <img alt="Creative Commons License" style={{ borderWidth: 0 }} src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
            </a>
            <div>
              This work is licensed under a <a target="_blank" rel=" license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
            </div>
          </div>
        </div >
      </footer >
    )
  }
}

export default Footer