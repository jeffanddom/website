import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'
import PreviewCompatibleImage from './PreviewCompatibleImage'

class BroadcastList extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <div className="columns is-multiline">
        {posts &&
          posts.map(({ node: post }) => (
            <article className="broadcast-preview" key={post.id}>
              <div className="thumbnail">
                <img src={`https://img.youtube.com/vi/${post.frontmatter.videoId}/maxresdefault.jpg`} />
              </div>
              <div>
                <p className="post-title">
                  Session {post.frontmatter.counter}<br />
                  <h3>
                    <Link
                      to={post.fields.slug}
                    >
                      {post.frontmatter.title}
                    </Link>
                  </h3>
                </p>
                <p class="post-date">
                  {post.frontmatter.date}
                </p>
                <p>
                  {post.excerpt}
                  <br />
                  <br />
                  <Link className="button" to={post.fields.slug}>
                    Keep Reading →
                  </Link>
                </p>
              </div>

            </article>
          ))}
      </div>
    )
  }
}

BroadcastList.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query BroadcastQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "broadcast" } } }
        ) {
          edges {
            node {
              excerpt(pruneLength: 200)
              id
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                date(formatString: "MMMM DD, YYYY")
                videoId
                counter
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BroadcastList data={data} count={count} />}
  />
)
