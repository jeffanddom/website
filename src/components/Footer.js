import React from 'react'
import { FaTwitch, FaTwitter, FaGithub, FaYoutube } from 'react-icons/fa'

const Footer = class extends React.Component {
  render() {
    return (
      <footer>
        <div className="container">
          <div className='social'>
            <p>
              Made by Jeff&nbsp;Lee and Dominic&nbsp;Dagradi
            </p>

            <div className="social-icons">
              <a title="twitch" href="https://www.twitch.tv/jeffanddom" target="_blank" rel="noreferrer">
                <FaTwitch />
              </a>
              {' '}
              <a title="twitter" href="https://twitter.com/jeffanddom" target="_blank" rel="noreferrer">
                <FaTwitter />
              </a>
              {' '}
              <a title="github" href="https://github.com/jeffanddom" target="_blank" rel="noreferrer">
                <FaGithub />
              </a>
              {' '}
              <a title="github" href="https://www.youtube.com/channel/UCPMLP_iuTLQWxCVYFNt40WA" target="_blank" rel="noreferrer">
                <FaYoutube />
              </a>
            </div>
          </div>

          <div className="cc">
            <a target="_blank" href=" http://creativecommons.org/licenses/by-sa/4.0/" rel="noreferrer">
              <img alt="Creative Commons License" style={{ borderWidth: 0 }} src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
            </a>
            <div>
              This work is licensed under a <a target="_blank" rel="noreferrer" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
            </div>
          </div>
        </div >
      </footer >
    )
  }
}

export default Footer
