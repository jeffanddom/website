import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'

export const BroadcastTemplate = ({
  content,
  contentComponent,
  date,
  title,
  helmet,
  counter,
  videoId
}) => {
  const PostContent = contentComponent || Content

  return (
    <>
      {helmet || ''}
      <div className="broadcast broadcast-full container">
        <div className="post-title">
          Session {counter}<br />
          <h1>
            {title}
          </h1>
        </div>

        <div className="youtube-wrapper">
          <iframe title={title} className="youtube-embed" src={`https://www.youtube.com/embed/${videoId}`} frameorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>

        <p>
          <span className="post-date">
            {date}
          </span>
        </p>

        <PostContent content={content} className='post-content' />
      </div>
    </>
  )
}

BroadcastTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  date: PropTypes.string,
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
          <Helmet titleTemplate="%s | Jeff and Dom Make a Game">
            <title>{post.frontmatter.counter}: {post.frontmatter.title}</title>
            <meta property="og:title" content={`Session ${post.frontmatter.counter}: ${post.frontmatter.title}`} />
            <meta property="og:description" content={post.excerpt} />
            <meta property="og:image" content={`https://img.youtube.com/vi/${post.frontmatter.videoId}/maxresdefault.jpg`} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:image" content={`https://img.youtube.com/vi/${post.frontmatter.videoId}/maxresdefault.jpg`} />
          </Helmet>
        }
        date={post.frontmatter.date}
        title={post.frontmatter.title}
        counter={post.frontmatter.counter}
        videoId={post.frontmatter.videoId}
      />
    </Layout >
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
      excerpt(pruneLength: 100)
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        counter
        videoId
      }
    }
  }
`
