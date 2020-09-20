import React from 'react'

import Layout from '../../components/Layout'
import DevlogList from '../../components/DevlogList'

export default class BlogIndexPage extends React.Component {
  render() {
    return (
      <Layout>
        <div className="container">
          <h1>
            Our Devlog
          </h1>
          <div className="content">
            <DevlogList />
          </div>
        </div>
      </Layout>
    )
  }
}
