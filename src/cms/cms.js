import CMS from 'netlify-cms-app'

import BroadcastPreview from './preview-templates/BroadcastPreview'
import DevlogPreview from './preview-templates/DevlogPreview'
import IndexPagePreview from './preview-templates/IndexPagePreview'

CMS.registerPreviewTemplate('index', IndexPagePreview)
CMS.registerPreviewTemplate('devlog', DevlogPreview)
CMS.registerPreviewTemplate('broadcast', BroadcastPreview)
