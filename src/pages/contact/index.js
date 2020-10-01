import React from 'react'
import { FaTwitch, FaTwitter, FaGithub, FaYoutube } from 'react-icons/fa'

import Layout from '../../components/Layout'

const Index = () => {

  return (
    <Layout>
      <div id="find-us" className="container">
        <div className="content">
          <h1>We're everywhere</h1>

          <p>Say hello on your favorite platform, and follow us for the latest updates!</p>

          <ul className="social">
            <li>
              <a title="twitch" href="https://www.twitch.tv/jeffanddom" target="_blank">
                <FaTwitch /> Twitch
              </a>
            </li>
            <li>
              <a title="twitter" href="https://twitter.com/jeffanddom" target="_blank">
                <FaTwitter /> @jeffanddom
              </a>
            </li>
            <li>
              <a title="github" href="https://github.com/jeffanddom" target="_blank">
                <FaGithub /> jeffanddom
              </a>
            </li>
            <li>
              <a title="youtube" href="https://www.youtube.com/channel/UCPMLP_iuTLQWxCVYFNt40WA" target="_blank">
                <FaYoutube /> YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default Index