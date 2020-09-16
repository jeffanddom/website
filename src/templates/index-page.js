import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'

import Layout from '../components/Layout'
import BlogRoll from '../components/BlogRoll'

export const IndexPageTemplate = ({
  image,
  title,
  description,
}) => (
    <div id="index" className="container">
      <header>
        <img alt='Jeff and Dom Make a Game logo' src={`${!!image.childImageSharp ? image.childImageSharp.fluid.src : image}`} />
      </header>
      <div>
        <p>{description}</p>

        <div className="column is-12">
          <h3 className="has-text-weight-semibold is-size-2">
            Devlog
          </h3>

          <BlogRoll />

          <div className="column is-12 has-text-centered">
            <Link className="btn" to="/broadcasts">
              View all
                  </Link>

          </div>
        </div>
      </div>
    </div>
  )

IndexPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  description: PropTypes.string,
}

const IndexPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark

  return (
    <Layout>
      <IndexPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        description={frontmatter.description}
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
          frontmatter {
          title
        image {
          childImageSharp {
          fluid(maxWidth: 2048, quality: 100) {
          ...GatsbyImageSharpFluid
        }
          }
        }
        description
      }
    }
  }
`
