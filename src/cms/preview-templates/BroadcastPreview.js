import React from 'react'
import PropTypes from 'prop-types'
import { BroadcastTemplate } from '../../templates/broadcast'

const BroadcastPreview = ({ entry, widgetFor }) => {
  return (
    <BroadcastTemplate
      content={widgetFor('body')}
      counter={entry.getIn(['data', 'counter'])}
      videoId={entry.getIn(['data', 'videoId'])}
      title={entry.getIn(['data', 'title'])}
    />
  )
}

BroadcastPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default BroadcastPreview
