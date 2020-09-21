import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'

class BroadcastSquares extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <div className="broadcast-square-wrapper">
        {posts &&
          posts.map(({ node: post }) => (
            <article className="broadcast-square" key={post.id}>
              <Link
                to={post.fields.slug}
              >

                <div className='thumbnail' style={{ backgroundImage: `url(https://img.youtube.com/vi/${post.frontmatter.videoId}/maxresdefault.jpg)` }} />
                <div className='content'>
                  <h3>
                    {post.frontmatter.title}
                  </h3>

                  <div className='metadata'>
                    <span>{post.frontmatter.date}</span>
                    <span>Session {post.frontmatter.counter}</span>
                  </div>
                </div>
              </Link>

            </article>
          ))
        }
      </div>
    )
  }
}

BroadcastSquares.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query BroadcastSquaresQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          limit: 3
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
                date(formatString: "M/D/YY")
                videoId
                counter
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BroadcastSquares data={data} count={count} />}
  />
)
