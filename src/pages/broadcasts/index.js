import React from 'react'

import Layout from '../../components/Layout'
import BroadcastList from '../../components/BroadcastList'

export default class BroadcastIndexPage extends React.Component {
  render() {
    return (
      <Layout>
        <div className="container">
          <h1>
            Past Broadcasts
          </h1>
          <div className="content">
            <BroadcastList />
          </div>
        </div>
      </Layout>
    )
  }
}
