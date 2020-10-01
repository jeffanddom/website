import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { TwitchPlayer } from 'react-twitch-embed'

import Layout from '../components/Layout'
import BroadcastSquares from '../components/BroadcastSquares'
import DevlogList from '../components/DevlogList'
import Content, { HTMLContent } from '../components/Content'

export const IndexPageTemplate = ({
  image,
  twitchEmbed,
  content,
  contentComponent
}) => {
  const HomeContent = contentComponent || Content

  const setOnline = () => {
    document.querySelectorAll('.twitch-online')[0].classList.add('visible')
  }

  const setOffline = () => {
    document.querySelectorAll('.twitch-offline')[0].classList.add('visible')
  }

  return <div id="index" className="container">

    <header>
      <img alt='Jeff and Dom Make a Game' src={`${!!image.childImageSharp ? image.childImageSharp.fluid.src : image}`} />
    </header>
    <div>
      <HomeContent content={content} />

      <div className="twitch-online">
        <h4>Jeff and Dom are
          <span className='live-label'>LIVE</span>
        </h4>

        {twitchEmbed && <TwitchPlayer channel='jeffanddom' onOffline={setOffline} onOnline={setOnline} />}
      </div>

      <div className="twitch-offline">
        <h4>
          Jeff and Dom are <span className='offline-label'>OFFLINE</span>
        </h4>

        <span>Watch our <a href='https://www.twitch.tv/jeffanddom'>Twitch stream</a> on:</span>

        <ul>
          <li>Mondays at <span>7pm</span></li>
          <li>Thursdays at <span>7pm</span></li>
        </ul>

        <span>All times Pacific.</span>
      </div>

      <h3>Recent Broadcasts</h3>
      <BroadcastSquares />

      <p>See the <a href='/broadcasts'>full archive</a>.</p>

      <h3 className="devlog-header">Devlog</h3>
      <DevlogList />
    </div>
  </div>
}

IndexPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
}

const IndexPage = ({ data }) => {
  const { html, frontmatter } = data.markdownRemark

  return (
    <Layout>
      <IndexPageTemplate
        image={frontmatter.image}
        twitchEmbed={true}
        content={html}
        contentComponent={HTMLContent}
      />
    </Layout>
  )
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default IndexPage

export const pageQuery = graphql`
  query IndexPageTemplate {
      markdownRemark(frontmatter: {templateKey: {eq: "index-page" } }) {
      html
      frontmatter {
      title
        image {
      childImageSharp {
      fluid(maxWidth: 2048, quality: 100) {
      ...GatsbyImageSharpFluid
    }
          }
        }
      }
    }
  }
`
