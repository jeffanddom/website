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
  title,
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
      <img alt='Jeff and Dom Make a Game logo' alt={title} src={`${!!image.childImageSharp ? image.childImageSharp.fluid.src : image}`} />
    </header>
    <div>
      <HomeContent content={content} />

      <div className="twitch-online">
        <p>Jeff and Dom are
          <span className='live-label'>LIVE</span>
        </p>

        <TwitchPlayer channel='jeffanddom' onOffline={setOffline} onOnline={setOnline} />
      </div>

      <div className="twitch-offline">
        <p>
          Jeff and Dom are: <span className='offline-label'>OFFLINE</span>
        </p>

        <p>We broadcast:</p>

        <p>
          - Tuesdays at 7pm<br />
          - Fridays at 7pm
        </p>
      </div>



      <h3>Recent Broadcasts</h3>
      <BroadcastSquares />

      <h3>Devlog</h3>
      <DevlogList />
    </div>
  </div>
}

IndexPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
}

const IndexPage = ({ data }) => {
  const { html, frontmatter } = data.markdownRemark

  return (
    <Layout>
      <IndexPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
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
