import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'

export const BroadcastTemplate = ({
  content,
  contentComponent,
  title,
  helmet,
  counter,
  videoId
}) => {
  const PostContent = contentComponent || Content

  return (
    <>
      {helmet || ''}
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {title}
            </h1>

            {counter}
            {videoId}

            <PostContent content={content} />
          </div>
        </div>
      </div>
    </>
  )
}

BroadcastTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
}

const Broadcast = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <BroadcastTemplate
        content={post.html}
        contentComponent={HTMLContent}
        helmet={
          <Helmet titleTemplate="%s | Devlog">
            <title>{`${post.frontmatter.title}`}</title>
          </Helmet>
        }
        title={post.frontmatter.title}
        counter={post.frontmatter.counter}
        videoId={post.frontmatter.videoId}
      />
    </Layout>
  )
}

Broadcast.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default Broadcast

export const pageQuery = graphql`
  query BroadcastByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        counter
        videoId
      }
    }
  }
`
