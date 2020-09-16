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
      <div className="broadcast container">
        <h1>
          {title}
        </h1>
        <h3>
          Session {counter}
        </h3>


        <div className="youtube-wrapper">
          <iframe className="youtube-embed" src={`https://www.youtube.com/embed/${videoId}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>

        <PostContent content={content} />
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
