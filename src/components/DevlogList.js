import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'
import { HTMLContent } from './Content'

class DevlogList extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <div>
        {posts &&
          posts.map(({ node: post }) => (
            <article key={post.id} className='preview-list-item'>
              <div className="thumbnail">
                <img src={post.frontmatter.featuredimage}
                  alt={`featured image thumbnail for post ${post.frontmatter.title}`}
                />
              </div>
              <div className='post-title'>
                <h3>
                  <Link to={post.fields.slug}>
                    {post.frontmatter.title}
                  </Link>
                </h3>
                <p>
                  <span className="post-date">
                    {post.frontmatter.date}
                  </span>
                </p>
                <p>
                  <HTMLContent content={post.frontmatter.excerpt} />
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

DevlogList.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query BlogRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "devlog-post" } } }
        ) {
          edges {
            node {
              id
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                date(formatString: "MMMM DD, YYYY")
                description
                excerpt
                featuredimage
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <DevlogList data={data} count={count} />}
  />
)
